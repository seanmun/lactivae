"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { css } from "../../../styled-system/css";
import { getClaim, type ClaimRef } from "@/data/claims";
import { safetyObjects, getSafety } from "@/data/safety";
import { references, referenceNumber, shortCitation, getReference } from "@/data/references";
import { blastRadius } from "@/lib/blast";
import TextDiff from "./TextDiff";
import BlastPanel from "./BlastPanel";
import VerifyPanel from "./VerifyPanel";

const label = css({ display: "block", fontFamily: "body", fontSize: "sm", fontWeight: "600", color: "accent.primary", marginBottom: "0.4rem" });
const input = css({
  width: "100%",
  fontFamily: "body",
  fontSize: "base",
  lineHeight: "1.6",
  padding: "0.75rem 1rem",
  border: "1px solid",
  borderColor: "border.medium",
  borderRadius: "6px",
  bg: "#ffffff",
  color: "text.primary",
  _focus: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "1px" },
});
const small = css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.5" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const section = css({ marginBottom: "1.5rem" });
const h = css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", color: "text.muted", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" });
const row = css({ display: "flex", alignItems: "flex-start", gap: "0.6rem", padding: "0.5rem 0", borderBottom: "1px solid", borderColor: "border.light" });
const btnPrimary = css({ fontFamily: "body", fontSize: "sm", fontWeight: "600", padding: "0.7rem 1.2rem", borderRadius: "6px", border: "1px solid", borderColor: "accent.primary", bg: "accent.primary", color: "bg.primary", cursor: "pointer", _hover: { bg: "accent.secondary" }, _disabled: { opacity: 0.5, cursor: "not-allowed" } });
const btnGhost = css({ fontFamily: "body", fontSize: "sm", fontWeight: "600", padding: "0.6rem 1rem", borderRadius: "6px", border: "1px solid", borderColor: "border.medium", bg: "transparent", color: "accent.primary", cursor: "pointer", _hover: { bg: "bg.secondary" }, _disabled: { opacity: 0.5, cursor: "not-allowed" } });

interface DraftResult {
  proposedText: string;
  rationale: string;
  evidenceCheck: "supported" | "partially" | "unsupported";
  concerns: string[];
}

export default function ProposeForm({ claimId, aiAvailable }: { claimId: string; aiAvailable: boolean }) {
  const router = useRouter();
  const claim = getClaim(claimId);

  const [text, setText] = useState(claim.text);
  const [refs, setRefs] = useState<ClaimRef[]>(claim.refs.map((r) => ({ ...r })));
  const [safety, setSafety] = useState<string[]>([...claim.safety]);
  const [rationale, setRationale] = useState("");
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiResult, setAiResult] = useState<DraftResult | null>(null);
  const [aiAssisted, setAiAssisted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const radius = useMemo(() => blastRadius(claimId, { text, refs, safety }), [claimId, text, refs, safety]);
  const blocking = radius.flags.some((f) => f.level === "error");
  const unchanged = text.trim() === claim.text.trim() && refs.length === claim.refs.length && refs.every((r) => claim.refs.some((c) => c.key === r.key)) && safety.length === claim.safety.length && safety.every((s) => claim.safety.includes(s));

  const availableRefs = references.filter((r) => !refs.some((x) => x.key === r.key));
  const availableSafety = safetyObjects.filter((s) => !safety.includes(s.id));

  async function draftWithAI() {
    setAiBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/claims/${claimId}/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction: aiInstruction, currentText: text }),
      });
      const data = (await res.json()) as { draft?: DraftResult; error?: string };
      if (!res.ok || !data.draft) throw new Error(data.error ?? `HTTP ${res.status}`);
      setAiResult(data.draft);
      setText(data.draft.proposedText);
      setRationale((r) => (r ? `${r}\n\n${data.draft!.rationale}` : data.draft!.rationale));
      setAiAssisted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Draft failed");
    } finally {
      setAiBusy(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectKind: "claim", objectId: claimId, proposedText: text, proposedRefs: refs, proposedSafety: safety, rationale: rationale || null, aiAssisted }),
      });
      const data = (await res.json()) as { proposal?: { id: string }; error?: string };
      if (!res.ok || !data.proposal) throw new Error(data.error ?? `HTTP ${res.status}`);
      router.push(`/admin/proposals/${data.proposal.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <div className={css({ display: "grid", gridTemplateColumns: { base: "1fr", lg: "minmax(0, 5fr) minmax(0, 6fr)" }, gap: "2rem", alignItems: "start" })}>
      {/* ------------------------------------------------------------ editor */}
      <div>
        <div className={section}>
          <label className={label} htmlFor="proposed-text">
            Proposed text {claim.headline && <span className={mono}>· headline {claim.headline} stays fixed</span>}
          </label>
          <textarea id="proposed-text" className={input} rows={4} value={text} onChange={(e) => setText(e.target.value)} />
          <p className={css({ ...{}, fontFamily: "mono", fontSize: "xs", color: "text.muted", marginTop: "0.3rem" })}>
            {text.length} characters · *italic* and **bold** are the only formatting
          </p>
        </div>

        <div className={section}>
          <div className={h}>Evidence</div>
          {refs.map((r, i) => {
            const ref = getReference(r.key);
            return (
              <div key={r.key} className={row}>
                <input
                  type="checkbox"
                  checked
                  aria-label={`Keep reference ${referenceNumber(r.key)}`}
                  onChange={() => setRefs(refs.filter((x) => x.key !== r.key))}
                  className={css({ marginTop: "0.3rem" })}
                />
                <div className={css({ flex: 1 })}>
                  <div className={small}>
                    <strong>[{referenceNumber(r.key)}]</strong> {shortCitation(ref)} — {ref.title}
                  </div>
                  <input
                    type="text"
                    value={r.locator ?? ""}
                    placeholder="Locator (e.g. Abstract, Table 3)"
                    aria-label="Locator"
                    onChange={(e) => setRefs(refs.map((x, j) => (j === i ? { ...x, locator: e.target.value } : x)))}
                    className={css({ ...{}, fontFamily: "mono", fontSize: "xs", padding: "0.3rem 0.5rem", marginTop: "0.3rem", border: "1px solid", borderColor: "border.light", borderRadius: "4px", width: "100%", bg: "bg.primary" })}
                  />
                  {r.quote && <p className={css({ ...{}, fontFamily: "body", fontSize: "xs", color: "text.muted", fontStyle: "italic", marginTop: "0.3rem" })}>&ldquo;{r.quote}&rdquo;</p>}
                </div>
              </div>
            );
          })}
          {availableRefs.length > 0 && (
            <select
              aria-label="Add a reference"
              value=""
              onChange={(e) => e.target.value && setRefs([...refs, { key: e.target.value }])}
              className={css({ ...{}, fontFamily: "body", fontSize: "sm", padding: "0.5rem", marginTop: "0.6rem", border: "1px solid", borderColor: "border.medium", borderRadius: "6px", bg: "#fff", width: "100%" })}
            >
              <option value="">+ Add a reference…</option>
              {availableRefs.map((r) => (
                <option key={r.key} value={r.key}>
                  [{referenceNumber(r.key)}] {shortCitation(r)} — {r.title.slice(0, 70)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={section}>
          <div className={h}>Fair balance</div>
          {safety.map((sid) => {
            const s = getSafety(sid);
            return (
              <div key={sid} className={row}>
                <input type="checkbox" checked aria-label={`Keep ${s.label}`} onChange={() => setSafety(safety.filter((x) => x !== sid))} className={css({ marginTop: "0.3rem" })} />
                <div className={small}>
                  <strong>{s.label}</strong> <span className={mono}>· {s.kind}</span>
                  <div>{s.text.replace(/\*/g, "")}</div>
                </div>
              </div>
            );
          })}
          {availableSafety.length > 0 && (
            <select
              aria-label="Add a safety statement"
              value=""
              onChange={(e) => e.target.value && setSafety([...safety, e.target.value])}
              className={css({ ...{}, fontFamily: "body", fontSize: "sm", padding: "0.5rem", marginTop: "0.6rem", border: "1px solid", borderColor: "border.medium", borderRadius: "6px", bg: "#fff", width: "100%" })}
            >
              <option value="">+ Link a safety statement…</option>
              {availableSafety.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.kind})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={section}>
          <label className={label} htmlFor="rationale">
            Rationale for reviewers
          </label>
          <textarea id="rationale" className={input} rows={3} value={rationale} onChange={(e) => setRationale(e.target.value)} placeholder="Why this wording, and why it is still supported" />
        </div>

        <div className={section}>
          <div className={h}>Evidence check</div>
          <VerifyPanel
            claimId={claimId}
            text={text}
            refs={refs.map((r) => r.key)}
            onUseQuote={(ref, page, q) =>
              setRefs(refs.map((x) => (x.key === ref ? { ...x, locator: /^\d+$/.test(page) ? `p. ${page}` : page, quote: q } : x)))
            }
          />
        </div>

        <div className={css({ ...{}, padding: "1rem 1.25rem", bg: "bg.tertiary", border: "1px dashed", borderColor: "border.medium", borderRadius: "8px", marginBottom: "1.5rem" })}>
          <div className={h}>Draft with AI (proposal only, never approval)</div>
          <div className={css({ display: "flex", gap: "0.5rem", flexWrap: "wrap" })}>
            <input
              type="text"
              className={input}
              style={{ flex: 1, minWidth: 220 }}
              value={aiInstruction}
              onChange={(e) => setAiInstruction(e.target.value)}
              placeholder={aiAvailable ? "e.g. Make it clearer this is an observational finding" : "Set ANTHROPIC_API_KEY to enable"}
              disabled={!aiAvailable || aiBusy}
            />
            <button type="button" className={btnGhost} disabled={!aiAvailable || aiBusy || !aiInstruction.trim()} onClick={draftWithAI}>
              {aiBusy ? "Drafting…" : "Draft"}
            </button>
          </div>
          {aiResult && (
            <div className={css({ marginTop: "0.75rem" })}>
              <div className={mono}>
                Evidence check: <strong>{aiResult.evidenceCheck}</strong>
              </div>
              {aiResult.concerns.length > 0 && (
                <ul className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "#7C3E0B", paddingLeft: "1.1rem", listStyleType: "disc", marginTop: "0.3rem", lineHeight: "1.5" })}>
                  {aiResult.concerns.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className={css({ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" })}>
          <button type="button" className={btnPrimary} disabled={saving || unchanged || blocking} onClick={save} title={blocking ? "Resolve blocking flags first" : unchanged ? "Nothing changed" : undefined}>
            {saving ? "Saving…" : "Save as draft proposal"}
          </button>
          {blocking && <span className={css({ fontFamily: "body", fontSize: "sm", color: "#B42318" })}>Blocking review flags must be resolved.</span>}
          {unchanged && !blocking && <span className={small}>Make a change to enable saving.</span>}
        </div>
        {error && (
          <p role="alert" className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "#B42318", marginTop: "0.75rem" })}>
            {error}
          </p>
        )}
      </div>

      {/* ---------------------------------------------------------- preview */}
      <div className={css({ position: { lg: "sticky" }, top: { lg: "1.5rem" } })}>
        <div className={h}>Live diff</div>
        <TextDiff before={claim.text} after={text} mode="inline" />
        <div className={css({ marginTop: "1.5rem" })}>
          <div className={h}>Live blast radius</div>
          <BlastPanel radius={radius} />
        </div>
      </div>
    </div>
  );
}
