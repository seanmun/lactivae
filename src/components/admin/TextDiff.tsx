import { diffWords } from "diff";
import { css } from "../../../styled-system/css";

interface TextDiffProps {
  before: string;
  after: string;
  mode?: "inline" | "split";
}

const ins = css({ bg: "rgba(34, 139, 34, 0.18)", color: "#14532D", borderRadius: "2px", padding: "0 0.1em", textDecoration: "none" });
const del = css({ bg: "rgba(180, 35, 24, 0.16)", color: "#7F1D1D", borderRadius: "2px", padding: "0 0.1em", textDecoration: "line-through" });
const pane = css({ fontFamily: "body", fontSize: "base", lineHeight: "1.7", color: "text.primary", padding: "1rem 1.25rem", bg: "bg.secondary", border: "1px solid", borderColor: "border.light", borderRadius: "8px", whiteSpace: "pre-wrap" });
const paneLabel = css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "text.muted", marginBottom: "0.4rem" });

/**
 * Word-level diff of approved vs proposed text. Server-safe (no hooks), so the
 * same component renders in the console and inside the live proposal editor.
 */
export default function TextDiff({ before, after, mode = "inline" }: TextDiffProps) {
  const parts = diffWords(before, after);
  const changed = parts.some((p) => p.added || p.removed);

  if (mode === "split") {
    return (
      <div className={css({ display: "grid", gridTemplateColumns: { base: "1fr", md: "1fr 1fr" }, gap: "1rem" })}>
        <div>
          <div className={paneLabel}>Approved</div>
          <div className={pane}>
            {parts.filter((p) => !p.added).map((p, i) => (p.removed ? <del key={i} className={del}>{p.value}</del> : <span key={i}>{p.value}</span>))}
          </div>
        </div>
        <div>
          <div className={paneLabel}>Proposed</div>
          <div className={pane}>
            {parts.filter((p) => !p.removed).map((p, i) => (p.added ? <ins key={i} className={ins}>{p.value}</ins> : <span key={i}>{p.value}</span>))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pane} aria-label={changed ? "Inline diff" : "No changes"}>
      {parts.map((p, i) =>
        p.added ? (
          <ins key={i} className={ins}>{p.value}</ins>
        ) : p.removed ? (
          <del key={i} className={del}>{p.value}</del>
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
      {!changed && <span className={css({ color: "text.muted", fontStyle: "italic" })}> (no change)</span>}
    </div>
  );
}
