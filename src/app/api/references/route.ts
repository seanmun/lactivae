import { NextResponse } from "next/server";
import { references, CATEGORY_LABELS, ACCESS_LABELS } from "@/data/references";

export const dynamic = "force-static";

/**
 * Machine-readable reference library: GET /api/references
 * Numbering matches the superscript markers on the site and /references.
 * Intended for claims-review tooling that needs to ingest the bibliography.
 */
export function GET() {
  const body = references.map((ref, i) => ({
    number: i + 1,
    ...ref,
    categoryLabel: CATEGORY_LABELS[ref.category],
    accessLabel: ACCESS_LABELS[ref.access],
    doiUrl: ref.doi ? `https://doi.org/${ref.doi}` : undefined,
    pubmedUrl: ref.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/` : undefined,
    pmcUrl: ref.pmcid ? `https://pmc.ncbi.nlm.nih.gov/articles/${ref.pmcid}/` : undefined,
  }));

  return NextResponse.json(
    { generated: "2026-09-08", count: body.length, references: body },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
