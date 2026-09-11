import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "../../../../../styled-system/css";
import { references, referenceNumber, shortCitation, ACCESS_LABELS } from "@/data/references";
import { getClaim } from "@/data/claims";
import { getSafety } from "@/data/safety";
import { edgesTo, usagesOf, kindOf, bareId } from "@/lib/graph";
import { index } from "@/lib/retrieval";
import { getProposalStore } from "@/lib/proposals";
import SuggestPanel from "@/components/admin/SuggestPanel";
import StatusPill from "@/components/admin/StatusPill";

const h2 = css({ fontFamily: "heading", fontSize: "xl", fontWeight: "700", color: "accent.primary", marginTop: "2rem", marginBottom: "0.75rem" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const link = css({ color: "accent.secondary", textDecoration: "underline", _hover: { color: "accent.warm" } });
const body = css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6" });
const card = css({ padding: "1rem 1.25rem", bg: "bg.secondary", border: "1px solid", borderColor: "border.light", borderRadius: "8px", marginBottom: "0.6rem" });
const chip = css({ display: "inline-block", fontFamily: "mono", fontSize: "xs", padding: "0.15rem 0.5rem", borderRadius: "999px", bg: "bg.tertiary", border: "1px solid", borderColor: "border.light", marginRight: "0.4rem" });

export default async function ReferencePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const ref = references.find((r) => r.key === key);
  if (!ref) notFound();
  const n = referenceNumber(key);
  const nodeId = `ref:${key}`;
  const supports = edgesTo(nodeId, "supported_by");
  const usages = usagesOf(nodeId);
  const indexed = index.sources[key];
  const store = await getProposalStore();
  const proposals = (await store.list()).filter((p) => p.sourceRef === key || p.proposedRefs.some((r) => r.key === key));

  return (
    <>
      <p className={mono}>
        <Link href="/admin/graph#references" className={link}>
          References
        </Link>{" "}
        / [{n}] {key}
      </p>
      <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary", margin: "0.5rem 0 0.25rem" })}>
        [{n}] {shortCitation(ref)}
      </h1>
      <p className={body}>{ref.title}</p>
      <p className={mono}>
        {ref.source} {ref.year}
        {ref.citation ? `;${ref.citation}` : ""} · {ACCESS_LABELS[ref.access]}
        {ref.doi ? ` · DOI ${ref.doi}` : ""}
      </p>
      <div className={css({ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" })}>
        <a href={`/references#ref-${n}`} className={chip}>
          Public entry
        </a>
        {ref.pdf && (
          <a href={ref.pdf} className={chip} target="_blank" rel="noopener noreferrer">
            Full text PDF
          </a>
        )}
        <span className={chip}>{indexed ? `indexed · ${indexed.kind} · ${indexed.chunks} passages${indexed.pages ? ` · ${indexed.pages} pages` : ""}` : "not indexed"}</span>
      </div>

      <h2 className={h2}>Cited for</h2>
      <p className={body}>{ref.supports}</p>
      {ref.note && (
        <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "#B42318", lineHeight: "1.5", marginTop: "0.5rem" })}>
          <strong>Reviewer note:</strong> {ref.note}
        </p>
      )}

      <h2 className={h2}>Create claims from this source</h2>
      <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.6", marginBottom: "0.75rem" })}>
        Starts from the evidence instead of the copy: the indexed text of this source is read and candidate claims it can support are
        proposed with page and verbatim quote. Each becomes a <strong>draft</strong> proposal for a new claim; nothing is approved here.
      </p>
      {indexed ? (
        <SuggestPanel refKey={key} refNumber={n} />
      ) : (
        <p className={body}>
          This source has no indexed text (paywalled without an abstract on file, a website, or a book). Add a PDF or abstract and run{" "}
          <code>npm run index</code>.
        </p>
      )}

      <h2 className={h2}>Supports ({supports.length})</h2>
      {supports.length === 0 && <p className={body}>No governed object cites this reference yet.</p>}
      {supports.map((e) => {
        const k = kindOf(e.from);
        const id = bareId(e.from);
        const label = k === "claim" ? getClaim(id).label : getSafety(id).label;
        return (
          <div key={e.from} className={card}>
            <div className={mono}>
              {k}
              {e.locator ? ` · ${e.locator}` : ""}
            </div>
            {k === "claim" ? (
              <Link href={`/admin/claims/${id}`} className={link}>
                {label}
              </Link>
            ) : (
              <span className={css({ fontFamily: "body", fontSize: "base", color: "text.primary" })}>{label}</span>
            )}
          </div>
        );
      })}

      <h2 className={h2}>Cited on ({usages.length})</h2>
      {usages.length === 0 ? (
        <p className={body}>Not cited on any page.</p>
      ) : (
        <p className={body}>
          {usages.map((u, i) => (
            <span key={i} className={chip}>
              {u.page.route === "*" ? "layout" : u.page.route} · {u.component.label}
            </span>
          ))}
        </p>
      )}

      <h2 className={h2}>Change sets touching this source ({proposals.length})</h2>
      {proposals.length === 0 && <p className={body}>None yet.</p>}
      {proposals.map((p) => (
        <div key={p.id} className={card}>
          <div className={css({ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" })}>
            <StatusPill status={p.status} />
            <Link href={`/admin/proposals/${p.id}`} className={link}>
              {p.isNew ? `${p.proposedLabel ?? p.objectId} (new)` : p.objectId}
            </Link>
            <span className={mono}>{new Date(p.updatedAt).toLocaleString()}</span>
          </div>
          <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "text.secondary", marginTop: "0.3rem" })}>{p.proposedText}</p>
        </div>
      ))}
    </>
  );
}
