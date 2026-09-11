"use client";

import Link from "next/link";
import { css } from "../../../styled-system/css";
import { getClaim } from "@/data/claims";
import { getSafety } from "@/data/safety";
import { getReference, referenceNumber, shortCitation, ACCESS_LABELS } from "@/data/references";
import { getNode, trace, bareId, kindOf } from "@/lib/graph";
import { renderInline } from "@/components/governed/inline";
import { useXRay } from "./store";
import TextDiff from "@/components/admin/TextDiff";
import { KIND_COLORS, governedKindOfNode } from "./dom";

const panel = css({
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  width: { base: "100%", md: "400px" },
  zIndex: 65,
  bg: "bg.primary",
  color: "text.primary",
  borderLeft: "1px solid",
  borderColor: "border.medium",
  boxShadow: "-8px 0 24px rgba(0,0,0,0.12)",
  overflowY: "auto",
  padding: "1.25rem 1.25rem 8rem",
  fontFamily: "body",
});
const eyebrow = css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" });
const title = css({ fontFamily: "heading", fontSize: "xl", fontWeight: "700", color: "accent.primary", lineHeight: "1.3", marginBottom: "0.75rem" });
const h = css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", color: "text.muted", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "1.25rem", marginBottom: "0.5rem" });
const text = css({ fontSize: "sm", color: "text.secondary", lineHeight: "1.6" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const item = css({ padding: "0.6rem 0.75rem", bg: "bg.secondary", border: "1px solid", borderColor: "border.light", borderRadius: "6px", marginBottom: "0.5rem", cursor: "pointer", _hover: { borderColor: "accent.secondary" } });
const link = css({ color: "accent.secondary", textDecoration: "underline", _hover: { color: "accent.warm" } });
const btn = css({ fontFamily: "body", fontSize: "sm", fontWeight: "600", padding: "0.45rem 0.8rem", borderRadius: "6px", border: "1px solid", borderColor: "border.medium", bg: "transparent", color: "accent.primary", cursor: "pointer", _hover: { bg: "bg.secondary" } });
const quote = css({ fontSize: "sm", color: "text.secondary", fontStyle: "italic", borderLeft: "3px solid", borderColor: "accent.warm", paddingLeft: "0.6rem", marginTop: "0.35rem", lineHeight: "1.5" });

function Pill({ nodeId }: { nodeId: string }) {
  const k = governedKindOfNode(nodeId);
  return (
    <span className={eyebrow} style={{ color: KIND_COLORS[k] }}>
      {kindOf(nodeId)} · {bareId(nodeId)}
    </span>
  );
}

export default function Inspector() {
  const { selectedId, select, staged } = useXRay();

  if (!selectedId) {
    return (
      <aside data-xray-ui="inspector" className={panel} aria-label="X-ray inspector">
        <p className={eyebrow} style={{ color: "#1D4ED8" }}>
          X-ray · Inspect
        </p>
        <h2 className={title}>Nothing selected</h2>
        <p className={text}>
          Click any outlined object on the page. Claims trace to their references and safety language; a reference traces
          back to every claim that relies on it.
        </p>
        <p className={css({ ...{}, fontSize: "sm", color: "text.secondary", lineHeight: "1.6", marginTop: "1rem" })}>
          Prefer a list?{" "}
          <Link href="/admin/graph" className={link}>
            Open the graph tables
          </Link>
          .
        </p>
      </aside>
    );
  }

  const node = getNode(selectedId);
  const kind = kindOf(selectedId);
  const id = bareId(selectedId);
  const t = trace(selectedId);

  return (
    <aside data-xray-ui="inspector" className={panel} aria-label="X-ray inspector">
      <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" })}>
        <Pill nodeId={selectedId} />
        <button type="button" className={btn} onClick={() => select(null)} aria-label="Clear selection">
          Clear
        </button>
      </div>

      {kind === "claim" && (() => {
        const c = getClaim(id);
        const stagedProposal = staged.find((p) => p.objectKind === "claim" && p.objectId === id);
        return (
          <>
            <h2 className={title}>{c.label}</h2>
            {stagedProposal && (
              <div className={css({ padding: "0.75rem", bg: "rgba(109, 40, 217, 0.08)", border: "1px solid rgba(109, 40, 217, 0.35)", borderRadius: "6px", marginBottom: "0.75rem" })}>
                <p className={eyebrow} style={{ color: "#6D28D9" }}>
                  Staged version
                </p>
                <TextDiff before={c.text} after={stagedProposal.proposedText} mode="inline" />
                <p className={css({ marginTop: "0.5rem" })}>
                  <Link href={`/admin/proposals/${stagedProposal.id}`} className={link}>
                    Review change set →
                  </Link>
                </p>
              </div>
            )}
            <p className={mono}>
              {c.type} · {c.status} · v{c.version} · effective {c.effectiveFrom}
            </p>
            <p className={h}>Approved text</p>
            {c.headline && <div className={css({ fontFamily: "mono", fontSize: "2xl", fontWeight: "700", color: "accent.secondary" })}>{c.headline}</div>}
            <p className={css({ fontSize: "base", color: "text.primary", lineHeight: "1.6" })}>{renderInline(c.text)}</p>
            {c.note && (
              <p className={css({ fontSize: "sm", color: "#B42318", lineHeight: "1.5", marginTop: "0.5rem" })}>
                <strong>Reviewer note:</strong> {c.note}
              </p>
            )}

            <p className={h}>Supported by ({c.refs.length})</p>
            {c.refs.map((r, i) => {
              const ref = getReference(r.key);
              const n = referenceNumber(r.key);
              return (
                <div key={i} className={item} onClick={() => select(`ref:${r.key}`)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && select(`ref:${r.key}`)}>
                  <div className={css({ fontSize: "sm", fontWeight: "600", color: "accent.primary" })}>
                    [{n}] {shortCitation(ref)}
                  </div>
                  <div className={mono}>{r.locator ?? "no locator"} · {ACCESS_LABELS[ref.access]}</div>
                  {r.quote && <p className={quote}>&ldquo;{r.quote}&rdquo;</p>}
                </div>
              );
            })}

            <p className={h}>Balanced by ({c.safety.length})</p>
            {c.safety.length === 0 && <p className={text}>No safety statement linked.</p>}
            {c.safety.map((sid) => {
              const s = getSafety(sid);
              return (
                <div key={sid} className={item} onClick={() => select(`safety:${sid}`)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && select(`safety:${sid}`)}>
                  <div className={mono}>{s.kind}</div>
                  <div className={text}>{renderInline(s.text)}</div>
                </div>
              );
            })}
          </>
        );
      })()}

      {kind === "safety" && (() => {
        const s = getSafety(id);
        return (
          <>
            <h2 className={title}>{s.label}</h2>
            <p className={mono}>
              {s.kind} · {s.group} · {s.status} · v{s.version}
            </p>
            <p className={h}>Approved text</p>
            <p className={css({ fontSize: "base", color: "text.primary", lineHeight: "1.6" })}>{renderInline(s.text)}</p>
            <p className={h}>Supported by ({s.refs.length})</p>
            {s.refs.length === 0 && <p className={text}>No reference attached.</p>}
            {s.refs.map((r, i) => {
              const ref = getReference(r.key);
              return (
                <div key={i} className={item} onClick={() => select(`ref:${r.key}`)} role="button" tabIndex={0}>
                  <div className={css({ fontSize: "sm", fontWeight: "600", color: "accent.primary" })}>
                    [{referenceNumber(r.key)}] {shortCitation(ref)}
                  </div>
                  {r.locator && <div className={mono}>{r.locator}</div>}
                </div>
              );
            })}
            <p className={h}>Balances ({t.balances.length})</p>
            {t.balances.length === 0 && <p className={text}>No claim is linked to this statement.</p>}
            {t.balances.map((e) => (
              <div key={e.from} className={item} onClick={() => select(e.from)} role="button" tabIndex={0}>
                <div className={css({ fontSize: "sm", fontWeight: "600", color: "accent.primary" })}>{getClaim(bareId(e.from)).label}</div>
              </div>
            ))}
          </>
        );
      })()}

      {kind === "reference" && (() => {
        const ref = getReference(id);
        const n = referenceNumber(id);
        return (
          <>
            <h2 className={title}>
              [{n}] {shortCitation(ref)}
            </h2>
            <p className={text}>{ref.title}</p>
            <p className={mono}>
              {ref.source} {ref.year}
              {ref.citation ? `;${ref.citation}` : ""} · {ACCESS_LABELS[ref.access]}
            </p>
            <p className={h}>Cited for</p>
            <p className={text}>{ref.supports}</p>
            {ref.note && (
              <p className={css({ fontSize: "sm", color: "#B42318", lineHeight: "1.5", marginTop: "0.5rem" })}>
                <strong>Reviewer note:</strong> {ref.note}
              </p>
            )}
            <p className={h}>Supports ({t.supports.length})</p>
            {t.supports.length === 0 && <p className={text}>No governed object cites this reference yet.</p>}
            {t.supports.map((e) => {
              const k = kindOf(e.from);
              const label = k === "claim" ? getClaim(bareId(e.from)).label : getSafety(bareId(e.from)).label;
              return (
                <div key={e.from} className={item} onClick={() => select(e.from)} role="button" tabIndex={0}>
                  <div className={mono}>{k}{e.locator ? ` · ${e.locator}` : ""}</div>
                  <div className={css({ fontSize: "sm", fontWeight: "600", color: "accent.primary" })}>{label}</div>
                </div>
              );
            })}
            <div className={css({ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" })}>
              <a href={`/references#ref-${n}`} className={btn} target="_blank" rel="noopener noreferrer">
                Reference entry ↗
              </a>
              {ref.pdf && (
                <a href={ref.pdf} className={btn} target="_blank" rel="noopener noreferrer">
                  Full text PDF ↗
                </a>
              )}
            </div>
          </>
        );
      })()}

      {(kind === "component" || kind === "page") && (
        <>
          <h2 className={title}>{node?.label ?? id}</h2>
          <p className={mono}>{node?.file ?? ""}</p>
          <p className={h}>Contains ({t.contains.length})</p>
          {t.contains.map((n) => (
            <div key={n.id} className={item} onClick={() => select(n.id)} role="button" tabIndex={0}>
              <div className={mono}>{n.kind}</div>
              <div className={css({ fontSize: "sm", fontWeight: "600", color: "accent.primary" })}>{n.label}</div>
            </div>
          ))}
        </>
      )}

      {(kind === "claim" || kind === "safety" || kind === "reference") && (
        <>
          <p className={h}>Used in ({t.usages.length})</p>
          {t.usages.length === 0 && <p className={text}>Not rendered on any page.</p>}
          <ul className={css({ paddingLeft: "1.1rem", listStyleType: "disc", fontSize: "sm", color: "text.secondary", lineHeight: "1.7" })}>
            {t.usages.map((u, i) => (
              <li key={i}>
                <Link href={u.page.route === "*" ? "/" : u.page.route!} className={link}>
                  {u.page.label}
                </Link>{" "}
                · <span className={mono}>{u.component.label}</span>
                {u.rel === "cites" ? <span className={mono}> (loose marker)</span> : null}
              </li>
            ))}
          </ul>
          {kind === "claim" && (
            <p className={css({ marginTop: "1.25rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" })}>
              <Link href={`/admin/claims/${id}`} className={btn}>
                Open in console ↗
              </Link>
              <Link href={`/admin/claims/${id}/propose`} className={btn}>
                Propose change ↗
              </Link>
            </p>
          )}
        </>
      )}
    </aside>
  );
}
