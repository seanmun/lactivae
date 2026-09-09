import Link from "next/link";
import { css } from "../../../styled-system/css";
import { getReference, referenceNumber, shortCitation } from "@/data/references";

interface RefProps {
  /** One reference key, or several for a claim supported by multiple sources */
  k: string | string[];
}

/**
 * Superscript reference marker, pharma-style: renders "3" or "18,19" linking to
 * the matching entry on /references. Keys resolve through src/data/references.ts,
 * so numbering is never hand-maintained on a page.
 */
export default function Ref({ k }: RefProps) {
  const keys = Array.isArray(k) ? k : [k];

  return (
    <sup
      className={css({
        fontFamily: "mono",
        fontSize: "0.62em",
        fontWeight: "600",
        lineHeight: "0",
        verticalAlign: "super",
        marginLeft: "0.15em",
        whiteSpace: "nowrap",
        letterSpacing: "0.02em",
      })}
    >
      {keys.map((key, i) => {
        const n = referenceNumber(key);
        const ref = getReference(key);
        const label = `${shortCitation(ref)} — ${ref.title}`;
        return (
          <span key={key}>
            {i > 0 ? "," : null}
            <Link
              href={`/references#ref-${n}`}
              title={label}
              aria-label={`Reference ${n}: ${label}`}
              className={css({
                color: "accent.secondary",
                textDecoration: "none",
                _hover: { textDecoration: "underline", color: "accent.warm" },
                _focusVisible: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "2px", borderRadius: "2px" },
              })}
            >
              {n}
            </Link>
          </span>
        );
      })}
    </sup>
  );
}
