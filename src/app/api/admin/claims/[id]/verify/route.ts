import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { requireApiRole, READ_ROLES } from "@/lib/api-auth";
import { getClaim } from "@/data/claims";
import { getReference, referenceNumber, shortCitation } from "@/data/references";
import { search, isIndexed } from "@/lib/retrieval";

export const dynamic = "force-dynamic";

const VerdictSchema = z.object({
  verdict: z.enum(["supported", "partially", "unsupported"]),
  evidence: z.array(
    z.object({
      ref: z.string(),
      page: z.string(),
      quote: z.string(),
      note: z.string(),
    })
  ),
  concerns: z.array(z.string()),
});

const SYSTEM = `You are a medical-legal-regulatory (MLR) evidence checker for LACTIVAE™, a pharmaceutical-style educational website about raw milk. You decide whether a marketing claim is supported by passages retrieved from the cited sources. You never approve anything; a human reviewer decides.

Rules:
1. Judge only from the passages provided. If they do not contain the fact, the claim is "unsupported" even if you believe it is true.
2. "supported": every element of the claim (population, direction, magnitude, comparator, qualifier) appears in the passages. "partially": some elements are supported but at least one is missing, overstated, or generalized (e.g. infants → children, grass-fed → raw, nematode → human). "unsupported": the central assertion is not in the passages or contradicts them.
3. Quote verbatim from the passages. Every evidence item must name the source key and page exactly as given. Do not paraphrase inside "quote".
4. In "concerns", list any mismatch precisely: numbers that differ, populations that differ, causal language where the source is observational, or absolute terms (cure, treat, prevent, safe).`;

/**
 * POST /api/admin/claims/:id/verify  { text?, refs? }
 * Retrieves passages from the claim's cited sources (BM25 over the local
 * index) and, when an Anthropic key is configured, asks Claude for a verdict
 * with verbatim quotes. Without a key the retrieved passages are still returned
 * so a reviewer can read them. Use id "new" for a claim that does not exist yet.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(READ_ROLES);
  if (auth.error) return auth.error;

  const { id } = await params;
  let body: { text?: string; refs?: string[] };
  try {
    body = (await request.json()) as { text?: string; refs?: string[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let text = body.text?.trim() ?? "";
  let refKeys = body.refs ?? [];
  if (id !== "new") {
    let claim;
    try {
      claim = getClaim(id);
    } catch {
      return NextResponse.json({ error: `Unknown claim "${id}"` }, { status: 404 });
    }
    if (!text) text = claim.text;
    if (refKeys.length === 0) refKeys = Array.from(new Set(claim.refs.map((r) => r.key)));
  }
  if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });
  if (refKeys.length === 0) return NextResponse.json({ error: "No references to verify against" }, { status: 400 });
  try {
    for (const k of refKeys) getReference(k);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown reference" }, { status: 400 });
  }

  const indexed = refKeys.filter(isIndexed);
  const unindexed = refKeys.filter((k) => !isIndexed(k));
  const hits = search(text.replace(/\*/g, ""), { refs: indexed, k: 10 }).map((h) => ({
    ref: h.ref,
    number: referenceNumber(h.ref),
    citation: shortCitation(getReference(h.ref)),
    page: String(h.page),
    text: h.text,
    score: Number(h.score.toFixed(2)),
  }));

  const base = {
    claimId: id,
    text,
    refs: refKeys,
    unindexed: unindexed.map((k) => ({ key: k, number: referenceNumber(k), reason: getReference(k).access === "abstract" ? "abstract not yet indexed" : "no local text" })),
    hits,
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ...base, aiConfigured: false, verdict: null, evidence: [], concerns: [] });
  }
  if (hits.length === 0) {
    return NextResponse.json({ ...base, aiConfigured: true, verdict: "unsupported", evidence: [], concerns: ["No passage in the indexed sources matches the claim's terms."] });
  }

  const passages = hits.map((h, i) => `[${i + 1}] source=${h.ref} page=${h.page}\n${h.text}`).join("\n\n");
  const client = new Anthropic();
  try {
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 16000,
      system: SYSTEM,
      messages: [{ role: "user", content: `Claim under review:\n${text}\n\nRetrieved passages:\n${passages}` }],
      output_config: { format: zodOutputFormat(VerdictSchema) },
    });
    if (response.stop_reason === "refusal") {
      return NextResponse.json({ ...base, aiConfigured: true, error: "The model declined this request." }, { status: 422 });
    }
    const out = response.parsed_output;
    if (!out) return NextResponse.json({ ...base, aiConfigured: true, error: "Unparseable verdict" }, { status: 502 });
    return NextResponse.json({ ...base, aiConfigured: true, ...out, model: response.model, usage: { input: response.usage.input_tokens, output: response.usage.output_tokens } });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return NextResponse.json({ ...base, error: "Rate limited by the Anthropic API." }, { status: 429 });
    if (error instanceof Anthropic.APIError) return NextResponse.json({ ...base, error: `Anthropic API error ${error.status}: ${error.message}` }, { status: 502 });
    return NextResponse.json({ ...base, error: error instanceof Error ? error.message : "Verification failed" }, { status: 500 });
  }
}
