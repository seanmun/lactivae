"use client";

import { useState } from "react";
import { css } from "../../../styled-system/css";

interface Hit {
  ref: string;
  number: number;
  citation: string;
  page: string;
  text: string;
  score: number;
}
interface Evidence {
  ref: string;
  page: string;
  quote: string;
  note: string;
}
interface VerifyResult {
  aiConfigured: boolean;
  verdict: "supported" | "partially" | "unsupported" | null;
  evidence: Evidence[];
  concerns: string[];
  hits: Hit[];
  unindexed: { key: string; number: number; reason: string }[];
  error?: string;
}

interface Props {
  /** claim id, or "new" for a claim that does not exist yet */
  claimId: string;
  text: string;
  refs: string[];
  /** called when the reviewer picks a passage as the locator/quote for a reference */
  onUseQuote?: (ref: string, page: string, quote: string) => void;
}

const box = css({ padding: "1rem 1.25rem", bg: "bg.secondary", border: "1px solid", borderColor: "border.light", borderRadius: "8px", marginTop: "0.75rem" });
const h = css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", color: "text.muted", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" });
const small = css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.55" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const quote = css({ fontFamily: "body", fontSize: "sm", color: "text.primary", fontStyle: "italic", borderLeft: "3px solid", borderColor: "accent.warm", paddingLeft: "0.6rem", lineHeight: "1.55", marginTop: "0.3rem" });
const btn = css({ fontFamily: "body", fontSize: "sm", fontWeight: "600", padding: "0.55rem 1rem", borderRadius: "6px", border: "1px solid", borderColor: "border.medium", bg: "transparent", color: "accent.primary", cursor: "pointer", _hover: { bg: "bg.secondary" }, _disabled: { opacity: 0.5, cursor: "not-allowed" } });
const tiny = css({ fontFamily: "body", fontSize: "xs", fontWeight: "600", padding: "0.2rem 0.5rem", borderRadius: "4px", border: "1px solid", borderColor: "border.medium", bg: "bg.primary", color: "accent.primary", cursor: "pointer", marginTop: "0.35rem", _hover: { borderColor: "accent.secondary" } });

const verdictStyle: Record<string, string> = {
  supported: css({ display: "inline-block", fontFamily: "mono", fontSize: "xs", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.6rem", borderRadius: "999px", bg: "rgba(34,139,34,0.12)", color: "#14532D" }),
  partially: css({ display: "inline-block", fontFamily: "mono", fontSize: "xs", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.6rem", borderRadius: "999px", bg: "rgba(198,120,48,0.14)", color: "#7C3E0B" }),
  unsupported: css({ display: "inline-block", fontFamily: "mono", fontSize: "xs", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.6rem", borderRadius: "999px", bg: "rgba(180,35,24,0.12)", color: "#7F1D1D" }),
};

/**
 * "Verify against sources": retrieves passages from the cited references and,
 * when AI is configured, shows a verdict with verbatim quotes. The retrieved
 * passages are useful on their own, so the panel works without a key.
 */
export default function VerifyPanel({ claimId, text, refs, onUseQuote }: Props) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHits, setShowHits] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/claims/${encodeURIComponent(claimId)}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, refs }),
      });
      const data = (await res.json()) as VerifyResult;
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
      setShowHits(!data.aiConfigured);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className={css({ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" })}>
        <button type="button" className={btn} disabled={busy || refs.length === 0} onClick={run} title={refs.length === 0 ? "Add a reference first" : undefined}>
          {busy ? "Checking sources…" : "Verify against sources"}
        </button>
        {result?.verdict && <span className={verdictStyle[result.verdict]}>{result.verdict}</span>}
        {result && !result.aiConfigured && <span className={mono}>AI not configured — showing retrieved passages only</span>}
      </div>
      {error && (
        <p role="alert" className={css({ fontFamily: "body", fontSize: "sm", color: "#B42318", marginTop: "0.5rem" })}>
          {error}
        </p>
      )}

      {result && (
        <div className={box}>
          {result.evidence.length > 0 && (
            <>
              <div className={h}>Evidence found</div>
              {result.evidence.map((e, i) => (
                <div key={i} className={css({ marginBottom: "0.75rem" })}>
                  <div className={mono}>
                    {e.ref} · page {e.page}
                  </div>
                  <p className={quote}>&ldquo;{e.quote}&rdquo;</p>
                  <div className={small}>{e.note}</div>
                  {onUseQuote && (
                    <button type="button" className={tiny} onClick={() => onUseQuote(e.ref, e.page, e.quote)}>
                      Use as locator + quote
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
          {result.concerns.length > 0 && (
            <>
              <div className={h}>Concerns</div>
              <ul className={css({ paddingLeft: "1.1rem", listStyleType: "disc", marginBottom: "0.75rem" })}>
                {result.concerns.map((c, i) => (
                  <li key={i} className={css({ fontFamily: "body", fontSize: "sm", color: "#7C3E0B", lineHeight: "1.5" })}>
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}
          {result.unindexed.length > 0 && (
            <p className={mono}>
              Not searchable: {result.unindexed.map((u) => `[${u.number}] ${u.reason}`).join("; ")}
            </p>
          )}
          <button type="button" className={tiny} onClick={() => setShowHits((v) => !v)}>
            {showHits ? "Hide" : "Show"} retrieved passages ({result.hits.length})
          </button>
          {showHits &&
            result.hits.map((hit, i) => (
              <div key={i} className={css({ marginTop: "0.6rem", paddingTop: "0.6rem", borderTop: "1px solid", borderColor: "border.light" })}>
                <div className={mono}>
                  [{hit.number}] {hit.citation} · page {hit.page} · score {hit.score}
                </div>
                <p className={small}>{hit.text}</p>
                {onUseQuote && (
                  <button type="button" className={tiny} onClick={() => onUseQuote(hit.ref, hit.page, hit.text)}>
                    Use as locator + quote
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
