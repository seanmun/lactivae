import { getReference, referenceNumber } from "@/data/references";
import Ref from "@/components/ui/Ref";

interface CiteProps {
  /** Key in src/data/references.ts */
  k: string;
  /** Omit the title: "Loss G, et al. J Allergy Clin Immunol. 2011;128(4):766-773.e4." */
  short?: boolean;
  className?: string;
}

/** "Loss G, Apprich S, …, et al." → "Loss G, et al."; two-author papers keep both names */
function shortAuthors(authors: string): string {
  const parts = authors.split(",").map((a) => a.trim()).filter(Boolean);
  const truncated = parts[parts.length - 1]?.toLowerCase() === "et al.";
  const names = truncated ? parts.slice(0, -1) : parts;
  if (truncated || names.length > 2) return `${names[0]}, et al.`;
  return names.join(", ");
}

function endsWithPeriod(s: string): boolean {
  return /\.$/.test(s.trim());
}

/**
 * A bibliographic citation rendered from the reference registry, so citation
 * lines on pages can never drift from the verified entry. Governed, but not a
 * claim: the graph records it as a component citing a reference.
 */
export default function Cite({ k, short = false, className }: CiteProps) {
  const ref = getReference(k);
  const where = `${ref.source}. ${ref.year}${ref.citation ? `;${ref.citation}` : ""}.`;
  const authors = short ? shortAuthors(ref.authors) : ref.authors;
  const authorsPart = endsWithPeriod(authors) ? authors : `${authors}.`;
  const titlePart = short ? "" : ` ${ref.title}${endsWithPeriod(ref.title) ? "" : "."}`;
  const text = `${authorsPart}${titlePart} ${where}`;
  return (
    <span data-governed="cite" data-cite={k} data-ref-number={referenceNumber(k)} className={className}>
      {text}
      <Ref k={k} />
    </span>
  );
}
