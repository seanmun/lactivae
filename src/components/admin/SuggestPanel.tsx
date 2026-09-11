"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { css } from "../../../styled-system/css";

interface Candidate {
  text: string;
  type: "efficacy" | "composition" | "epidemiology" | "regulatory" | "factual";
  label: string;
  page: string;
  quote: string;
  rationale: string;
  confidence: "high" | "medium" | "low";
}
interface SuggestResult {
  aiConfigured: boolean;
  candidates: Candidate[];
  preview: { page: string; text: string }[];
  existing: string[];
  chunks: number;
  error?: string;
}

const input = css({ fontFamily: "body", fontSize: "sm", padding: "0.6rem 0.8rem", border: "1px solid", borderColor: "border.medium", borderRadius: "6px", bg: "#fff", color: "text.primary", flex: 1, minWidth: "240px" });
const btn = css({ fontFamily: "body", fontSize: "sm", fontWeight: "600", padding: "0.6rem 1rem", borderRadius: "6px", border: "1px solid", borderColor: "accent.primary", bg: "accent.primary", color: "bg.primary", cursor: "pointer", _hover: { bg: "accent.secondary" }, _disabled: { opacity: 0.5, cursor: "not-allowed" } });
const ghost = css({ fontFamily: "body", fontSize: "sm", fontWeight: "600", padding: "0.45rem 0.8rem", borderRadius: "6px", border: "1px solid", borderColor: "border.medium", bg: "transparent", color: "accent.primary", cursor: "pointer", _hover: { bg: "bg.secondary" }, _disabled: { opacity: 0.5 } });
const card = css({ padding: "1rem 1.25rem", bg: "bg.secondary", border: "1px solid", borderColor: "border.light", borderRadius: "8px", marginBottom: "0.75rem" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const small = css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.55" });
const quote = css({ fontFamily: "body", fontSize: "sm", color: "text.primary", fontStyle: "italic", borderLeft: "3px solid", borderColor: "accent.warm", paddingLeft: "0.6rem", lineHeight: "1.55", margin: "0.4rem 0" });

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
}

/**
 * "Create claims from this source": the evidence-first inversion of the usual
 * workflow. Candidates come with page, verbatim quote and rationale; each can
 * be saved as a draft proposal for a NEW claim in one click.
 */
export default function SuggestPanel({ refKey, refNumber }: { refKey: string; refNumber: number }) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SuggestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/references/${encodeURIComponent(refKey)}/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic || undefined }),
      });
      const data = (await res.json()) as SuggestResult;
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Suggestion failed");
    } finally {
      setBusy(false);
    }
  }

  async function draft(c: Candidate, i: number) {
    setSaving(i);
    setError(null);
    try {
      const res = await fetch("/api/admin/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectKind: "claim",
          isNew: true,
          objectId: `${refKey}-${slugify(c.label)}`.slice(0, 60),
          proposedType: c.type,
          proposedLabel: c.label,
          proposedText: c.text,
          proposedRefs: [{ key: refKey, locator: /^\d+$/.test(c.page) ? `p. ${c.page}` : c.page, quote: c.quote }],
          proposedSafety: c.type === "efficacy" ? ["reg-not-fda-approved"] : [],
          rationale: `${c.rationale} (AI-suggested from [${refNumber}], confidence ${c.confidence}.)`,
          aiAssisted: true,
          sourceRef: refKey,
        }),
      });
      const data = (await res.json()) as { proposal?: { id: string }; error?: string };
      if (!res.ok || !data.proposal) throw new Error(data.error ?? `HTTP ${res.status}`);
      router.push(`/admin/proposals/${data.proposal.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create draft");
      setSaving(null);
    }
  }

  return (
    <div>
      <div className={css({ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" })}>
        <input type="text" className={input} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Optional focus, e.g. hay fever, omega-3 ratio, hospitalizations" />
        <button type="button" className={btn} disabled={busy} onClick={run}>
          {busy ? "Reading source…" : "Suggest claims from this source"}
        </button>
      </div>
      {error && (
        <p role="alert" className={css({ fontFamily: "body", fontSize: "sm", color: "#B42318", marginTop: "0.5rem" })}>
          {error}
        </p>
      )}

      {result && (
        <div className={css({ marginTop: "1rem" })}>
          {!result.aiConfigured && (
            <p className={small}>
              AI drafting is not configured (ANTHROPIC_API_KEY). The source is indexed ({result.chunks} passages); a preview of what would be
              sent to the model is shown below.
            </p>
          )}
          {result.candidates.map((c, i) => (
            <div key={i} className={card}>
              <div className={css({ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "flex-start", flexWrap: "wrap" })}>
                <div>
                  <div className={mono}>
                    {c.type} · confidence {c.confidence} · page {c.page}
                  </div>
                  <div className={css({ fontFamily: "body", fontSize: "base", fontWeight: "600", color: "accent.primary", marginTop: "0.2rem" })}>{c.label}</div>
                </div>
                <button type="button" className={ghost} disabled={saving !== null} onClick={() => draft(c, i)}>
                  {saving === i ? "Creating…" : "Draft as new claim"}
                </button>
              </div>
              <p className={css({ fontFamily: "body", fontSize: "base", color: "text.primary", lineHeight: "1.55", marginTop: "0.5rem" })}>{c.text}</p>
              <p className={quote}>&ldquo;{c.quote}&rdquo;</p>
              <p className={small}>{c.rationale}</p>
            </div>
          ))}
          {result.candidates.length === 0 && result.preview.length > 0 && (
            <div className={card}>
              <div className={mono}>Index preview</div>
              {result.preview.map((p, i) => (
                <p key={i} className={small}>
                  <span className={mono}>p. {p.page} · </span>
                  {p.text}…
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
