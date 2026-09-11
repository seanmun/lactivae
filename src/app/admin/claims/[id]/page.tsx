import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "../../../../../styled-system/css";
import { claims } from "@/data/claims";
import { getSafety } from "@/data/safety";
import { getReference, referenceNumber, shortCitation } from "@/data/references";
import { trace } from "@/lib/graph";
import { renderInline } from "@/components/governed/inline";
import { getProposalStore } from "@/lib/proposals";
import StatusPill from "@/components/admin/StatusPill";

const h2 = css({ fontFamily: "heading", fontSize: "xl", fontWeight: "700", color: "accent.primary", marginBottom: "0.75rem", marginTop: "2rem" });
const card = css({ padding: "1.25rem 1.5rem", bg: "bg.secondary", border: "1px solid", borderColor: "border.light", borderRadius: "8px", marginBottom: "1rem" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const body = css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6" });
const link = css({ color: "accent.secondary", textDecoration: "underline", _hover: { color: "accent.warm" } });
const dl = css({ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "0.4rem 1.25rem", fontFamily: "body", fontSize: "sm", "& dt": { color: "text.muted" }, "& dd": { color: "text.primary" } });

export default async function ClaimInspectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = claims.find((c) => c.id === id);
  if (!claim) notFound();

  const t = trace(`claim:${claim.id}`);
  const store = await getProposalStore();
  const proposals = await store.list({ objectId: claim.id });

  return (
    <>
      <p className={mono}>
        <Link href="/admin/graph#claims" className={link}>
          Claims
        </Link>{" "}
        / {claim.id}
      </p>
      <div className={css({ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", margin: "0.5rem 0 1.25rem" })}>
        <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary" })}>{claim.label}</h1>
        <Link
          href={`/admin/claims/${claim.id}/propose`}
          className={css({ fontFamily: "body", fontSize: "sm", fontWeight: "600", padding: "0.7rem 1.2rem", borderRadius: "6px", bg: "accent.primary", color: "bg.primary", textDecoration: "none", _hover: { bg: "accent.secondary" } })}
        >
          Propose change
        </Link>
      </div>

      <div className={card}>
        <p className={css({ fontFamily: "mono", fontSize: "xs", color: "accent.secondary", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" })}>
          Approved text · v{claim.version} · {claim.status}
        </p>
        {claim.headline && <div className={css({ fontFamily: "mono", fontSize: "3xl", fontWeight: "700", color: "accent.secondary" })}>{claim.headline}</div>}
        <p className={css({ fontFamily: "body", fontSize: "lg", color: "text.primary", lineHeight: "1.6" })}>{renderInline(claim.text)}</p>
      </div>

      <dl className={dl}>
        <dt>Type</dt>
        <dd>{claim.type}</dd>
        <dt>Topics</dt>
        <dd>{claim.topic.join(", ")}</dd>
        <dt>Effective</dt>
        <dd>{claim.effectiveFrom}</dd>
        {claim.rationale && (
          <>
            <dt>Rationale</dt>
            <dd>{claim.rationale}</dd>
          </>
        )}
        {claim.note && (
          <>
            <dt>Reviewer note</dt>
            <dd className={css({ color: "#B42318" })}>{claim.note}</dd>
          </>
        )}
      </dl>

      <h2 className={h2}>Supported by</h2>
      {claim.refs.map((r, i) => {
        const ref = getReference(r.key);
        const n = referenceNumber(r.key);
        return (
          <div key={i} className={card}>
            <p className={css({ fontFamily: "body", fontSize: "base", fontWeight: "600", color: "accent.primary" })}>
              [{n}] {shortCitation(ref)} —{" "}
              <a href={`/references#ref-${n}`} className={link}>
                {ref.title}
              </a>
            </p>
            {r.locator && <p className={mono}>Location: {r.locator}</p>}
            {r.quote && (
              <blockquote className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "text.secondary", fontStyle: "italic", borderLeft: "3px solid", borderColor: "accent.warm", paddingLeft: "0.75rem", marginTop: "0.5rem", lineHeight: "1.6" })}>
                &ldquo;{r.quote}&rdquo;
              </blockquote>
            )}
            <p className={css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", marginTop: "0.5rem" })}>
              <strong>Cited for:</strong> {ref.supports}
            </p>
          </div>
        );
      })}

      <h2 className={h2}>Balanced by</h2>
      {claim.safety.length === 0 ? (
        <p className={body}>No safety statement is linked to this claim.</p>
      ) : (
        claim.safety.map((sid) => {
          const s = getSafety(sid);
          return (
            <div key={sid} className={card}>
              <p className={mono}>
                {s.kind} · {s.id}
              </p>
              <p className={css({ fontFamily: "body", fontSize: "base", color: "text.primary", lineHeight: "1.6" })}>{renderInline(s.text)}</p>
            </div>
          );
        })
      )}

      <h2 className={h2}>Used in</h2>
      {t.usages.length === 0 ? (
        <p className={body}>Not rendered on any page.</p>
      ) : (
        <ul className={css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.8", paddingLeft: "1.25rem", listStyleType: "disc" })}>
          {t.usages.map((u, i) => (
            <li key={i}>
              <Link href={u.page.route === "*" ? "/" : u.page.route!} className={link}>
                {u.page.label}
              </Link>{" "}
              · component <span className={mono}>{u.component.label}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className={h2}>Change sets ({proposals.length})</h2>
      {proposals.length === 0 ? (
        <p className={body}>No proposals yet.</p>
      ) : (
        <ul className={css({ listStyle: "none", padding: 0, margin: 0 })}>
          {proposals.map((p) => (
            <li key={p.id} className={css({ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", padding: "0.5rem 0", borderBottom: "1px solid", borderColor: "border.light", fontFamily: "body", fontSize: "sm", color: "text.secondary" })}>
              <StatusPill status={p.status} />
              <Link href={`/admin/proposals/${p.id}`} className={link}>
                {p.proposedText}
              </Link>
              <span className={mono}>{new Date(p.updatedAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className={h2}>Trace</h2>
      <p className={body}>
        Selecting this claim in X-ray mode lights up {t.connected.size} connected objects: {t.references.length} reference
        {t.references.length === 1 ? "" : "s"}, {t.safety.length} safety statement{t.safety.length === 1 ? "" : "s"}, and{" "}
        {t.usages.length} usage{t.usages.length === 1 ? "" : "s"}.
      </p>
    </>
  );
}
