import type { ElementType } from "react";
import { getClaim, type Claim as ClaimObject } from "@/data/claims";
import Ref from "@/components/ui/Ref";
import { renderInline } from "./inline";

/**
 * Data attributes every governed element carries. X-ray mode reads these from
 * the DOM; they are inert for public visitors.
 */
export function governedAttrs(claim: ClaimObject) {
  return {
    "data-governed": "claim",
    "data-claim": claim.id,
    "data-status": claim.status,
    "data-version": String(claim.version),
  } as const;
}

interface ClaimProps {
  id: string;
  /**
   * inline — text + markers inside a span (default)
   * block  — same, as a block element (pass `as`)
   * stat   — headline number over the text, for stat cards
   */
  variant?: "inline" | "block" | "stat";
  as?: ElementType;
  className?: string;
  /** stat variant only */
  headlineClassName?: string;
  textClassName?: string;
  /** stat variant: element for the headline number (e.g. "h3" when the page uses headings) */
  headlineAs?: ElementType;
  showRefs?: boolean;
}

/**
 * Renders a governed claim from src/data/claims.ts. The page never retypes the
 * sentence; it only decides where the claim appears and how it is styled.
 */
export default function Claim({
  id,
  variant = "inline",
  as,
  className,
  headlineClassName,
  textClassName,
  headlineAs,
  showRefs = true,
}: ClaimProps) {
  const claim = getClaim(id);
  const refKeys = claim.refs.map((r) => r.key);
  const uniqueRefKeys = Array.from(new Set(refKeys));
  const markers = showRefs && uniqueRefKeys.length > 0 ? <Ref k={uniqueRefKeys} /> : null;

  // data-claim-text marks the swappable copy so the admin-only staging overlay
  // can preview a proposed version in place without touching the markers.
  if (variant === "stat") {
    const Headline: ElementType = headlineAs ?? "div";
    return (
      <div {...governedAttrs(claim)} className={className}>
        {claim.headline && <Headline className={headlineClassName}>{claim.headline}</Headline>}
        <div className={textClassName}>
          <span data-claim-text>{renderInline(claim.text)}</span>
          {markers}
        </div>
      </div>
    );
  }

  const Tag: ElementType = as ?? (variant === "block" ? "p" : "span");
  return (
    <Tag {...governedAttrs(claim)} className={className}>
      <span data-claim-text>{renderInline(claim.text)}</span>
      {markers}
    </Tag>
  );
}
