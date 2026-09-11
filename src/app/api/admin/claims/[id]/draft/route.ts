import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { requireApiRole, WRITE_ROLES } from "@/lib/api-auth";
import { getClaim } from "@/data/claims";
import { getSafety } from "@/data/safety";
import { getReference, referenceNumber, shortCitation } from "@/data/references";

export const dynamic = "force-dynamic";

const DraftSchema = z.object({
  proposedText: z.string(),
  rationale: z.string(),
  evidenceCheck: z.enum(["supported", "partially", "unsupported"]),
  concerns: z.array(z.string()),
});

const SYSTEM = `You are a medical-legal-regulatory (MLR) copy assistant for LACTIVAE™, a pharmaceutical-style educational website about raw milk. You draft PROPOSED revisions to governed claims. A human reviewer decides; you never approve anything.

Rules:
1. Every statement must be supported by the supplied reference quotes. Never introduce a figure, population, outcome, or comparison that is not in a quote. If the instruction asks for something the evidence does not support, say so in "concerns" and propose the closest supportable wording instead.
2. Use association language: "associated with", "lower odds of", "fewer". Never "cures", "treats", "prevents", "safe", "proven", "guaranteed".
3. Keep the claim's scope. Do not generalize from infants to everyone, from grass-fed to raw, or from a nematode model to humans.
4. Plain text only. Use *italic* for organism names (e.g. *C. elegans*, *Listeria*). No markdown headings, no lists.
5. Claims with a headline number are short stat-card labels: keep proposedText under about 90 characters and do not repeat the headline number in the text.
6. The rationale is one or two sentences for the reviewer explaining what changed and why it is still supported.
7. evidenceCheck: "supported" if every element of proposedText is backed by a quote; "partially" if some is; "unsupported" if the requested change cannot be supported.`;

/**
 * POST /api/admin/claims/:id/draft  { instruction, currentText? }
 * Returns an AI-drafted proposal. This is a suggestion only; the caller decides
 * whether to save it as a draft proposal.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(WRITE_ROLES);
  if (auth.error) return auth.error;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI drafting is not configured (ANTHROPIC_API_KEY is unset)." }, { status: 503 });
  }

  const { id } = await params;
  let claim;
  try {
    claim = getClaim(id);
  } catch {
    return NextResponse.json({ error: `Unknown claim "${id}"` }, { status: 404 });
  }

  let body: { instruction?: string; currentText?: string };
  try {
    body = (await request.json()) as { instruction?: string; currentText?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const instruction = body.instruction?.trim();
  if (!instruction) return NextResponse.json({ error: "instruction is required" }, { status: 400 });

  const evidence = claim.refs.map((r) => {
    const ref = getReference(r.key);
    return {
      number: referenceNumber(r.key),
      citation: `${shortCitation(ref)} — ${ref.title}. ${ref.source} ${ref.year}.`,
      locator: r.locator ?? null,
      quote: r.quote ?? null,
      citedFor: ref.supports,
      reviewerNote: ref.note ?? null,
    };
  });
  const safety = claim.safety.map((sid) => {
    const s = getSafety(sid);
    return { id: s.id, kind: s.kind, text: s.text };
  });

  const userMessage = [
    `Claim id: ${claim.id}`,
    `Type: ${claim.type}`,
    claim.headline ? `Headline (fixed, do not repeat in text): ${claim.headline}` : null,
    `Current approved text: ${body.currentText?.trim() || claim.text}`,
    claim.note ? `Reviewer note on this claim: ${claim.note}` : null,
    "",
    "Supporting evidence (the ONLY facts you may rely on):",
    JSON.stringify(evidence, null, 2),
    "",
    "Fair-balance safety statements that accompany this claim:",
    JSON.stringify(safety, null, 2),
    "",
    `Reviewer instruction: ${instruction}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const client = new Anthropic();
  try {
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 16000,
      system: SYSTEM,
      messages: [{ role: "user", content: userMessage }],
      output_config: { format: zodOutputFormat(DraftSchema) },
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "The model declined this request.", detail: response.stop_details?.explanation ?? null }, { status: 422 });
    }
    const draft = response.parsed_output;
    if (!draft) return NextResponse.json({ error: "The model returned an unparseable draft." }, { status: 502 });

    return NextResponse.json({
      draft,
      model: response.model,
      usage: { input: response.usage.input_tokens, output: response.usage.output_tokens },
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "Anthropic API key was rejected." }, { status: 503 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Rate limited by the Anthropic API. Try again shortly." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Anthropic API error ${error.status}: ${error.message}` }, { status: 502 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Draft failed" }, { status: 500 });
  }
}
