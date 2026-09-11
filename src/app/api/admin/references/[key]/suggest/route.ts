import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { requireApiRole, READ_ROLES } from "@/lib/api-auth";
import { getReference } from "@/data/references";
import { claims } from "@/data/claims";
import { search, chunksFor, isIndexed } from "@/lib/retrieval";

export const dynamic = "force-dynamic";

const CandidateSchema = z.object({
  candidates: z.array(
    z.object({
      text: z.string(),
      type: z.enum(["efficacy", "composition", "epidemiology", "regulatory", "factual"]),
      label: z.string(),
      page: z.string(),
      quote: z.string(),
      rationale: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
    })
  ),
});

const SYSTEM = `You are a medical-legal-regulatory (MLR) copy assistant for LACTIVAE™, a pharmaceutical-style educational website about raw milk. You read passages from ONE approved source and propose candidate marketing claims that the passages can responsibly support. A human reviewer decides; nothing you write is approved.

Rules:
1. Every candidate must be fully supported by a verbatim quote from the passages. Copy the quote exactly; name the page exactly as given.
2. Use association language ("associated with", "lower odds of"). Never "cures", "treats", "prevents", "safe", "proven". Keep populations and comparators exactly as studied (infants stay infants; grass-fed stays grass-fed; nematodes stay nematodes).
3. Prefer specific, checkable statements with the number and confidence interval when the source gives them.
4. Skip anything the site already states: existing claims are listed; do not duplicate them.
5. Return 3 to 8 candidates, best first. "label" is a short reviewer-facing title. "type": efficacy (health outcome), composition (nutrient/bioactive), epidemiology (surveillance), regulatory, factual (study design or framing).`;

/**
 * POST /api/admin/references/:key/suggest  { topic?, count? }
 * The Rx Web inversion of Claimsref: start from the evidence, surface the
 * claims it can support. Candidates are proposals only.
 */
export async function POST(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const auth = await requireApiRole(READ_ROLES);
  if (auth.error) return auth.error;

  const { key } = await params;
  let ref;
  try {
    ref = getReference(key);
  } catch {
    return NextResponse.json({ error: `Unknown reference "${key}"` }, { status: 404 });
  }
  let body: { topic?: string };
  try {
    body = (await request.json()) as { topic?: string };
  } catch {
    body = {};
  }

  if (!isIndexed(key)) {
    return NextResponse.json({ error: `No indexed text for ${key}. Run npm run index after adding a PDF or abstract.` }, { status: 409 });
  }
  const topic = body.topic?.trim();
  const chunks = topic ? search(topic, { refs: [key], k: 14 }) : chunksFor(key).slice(0, 36);
  const preview = chunks.slice(0, 6).map((c) => ({ page: String(c.page), text: c.text.slice(0, 400) }));
  const existing = claims.filter((c) => c.refs.some((r) => r.key === key)).map((c) => c.text.replace(/\*/g, ""));

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ref: key, aiConfigured: false, candidates: [], preview, existing, chunks: chunks.length });
  }

  const passages = chunks.map((c, i) => `[${i + 1}] page=${c.page}\n${c.text}`).join("\n\n");
  const client = new Anthropic();
  try {
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 16000,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            `Source: ${ref.authors}. ${ref.title}. ${ref.source} ${ref.year}. Access: ${ref.access}.`,
            `Reference key: ${key}`,
            topic ? `Reviewer focus: ${topic}` : "Reviewer focus: none (survey the source)",
            "",
            "Claims the site already makes from this source (do not duplicate):",
            existing.length ? existing.map((t) => `- ${t}`).join("\n") : "- none",
            "",
            "Passages:",
            passages,
          ].join("\n"),
        },
      ],
      output_config: { format: zodOutputFormat(CandidateSchema) },
    });
    if (response.stop_reason === "refusal") return NextResponse.json({ ref: key, error: "The model declined this request." }, { status: 422 });
    const out = response.parsed_output;
    if (!out) return NextResponse.json({ ref: key, error: "Unparseable suggestions" }, { status: 502 });
    return NextResponse.json({ ref: key, aiConfigured: true, candidates: out.candidates, preview, existing, chunks: chunks.length, model: response.model, usage: { input: response.usage.input_tokens, output: response.usage.output_tokens } });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return NextResponse.json({ ref: key, error: "Rate limited by the Anthropic API." }, { status: 429 });
    if (error instanceof Anthropic.APIError) return NextResponse.json({ ref: key, error: `Anthropic API error ${error.status}: ${error.message}` }, { status: 502 });
    return NextResponse.json({ ref: key, error: error instanceof Error ? error.message : "Suggestion failed" }, { status: 500 });
  }
}
