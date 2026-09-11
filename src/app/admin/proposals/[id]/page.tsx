import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "../../../../../styled-system/css";
import { getProposalStore, TRANSITIONS } from "@/lib/proposals";
import { getClaim } from "@/data/claims";
import { blastRadius } from "@/lib/blast";
import { buildClaimPatch } from "@/lib/patch";
import TextDiff from "@/components/admin/TextDiff";
import BlastPanel from "@/components/admin/BlastPanel";
import StatusPill from "@/components/admin/StatusPill";
import ProposalActions from "@/components/admin/ProposalActions";

const h2 = css({ fontFamily: "heading", fontSize: "xl", fontWeight: "700", color: "accent.primary", marginTop: "2rem", marginBottom: "0.75rem" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const link = css({ color: "accent.secondary", textDecoration: "underline", _hover: { color: "accent.warm" } });
const body = css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6" });
const pre = css({ fontFamily: "mono", fontSize: "xs", lineHeight: "1.5", bg: "#1A1310", color: "#F9E8D4", padding: "1rem 1.25rem", borderRadius: "8px", overflowX: "auto", whiteSpace: "pre" });

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await getProposalStore();
  const proposal = await store.get(id);
  if (!proposal || proposal.objectKind !== "claim") notFound();

  const claim = getClaim(proposal.objectId);
  const radius = blastRadius(claim.id, { text: proposal.proposedText, refs: proposal.proposedRefs, safety: proposal.proposedSafety });
  const audit = await store.listAudit({ proposalId: id });
  const blocking = radius.flags.some((f) => f.level === "error");
  const stale = claim.version !== proposal.baseVersion;

  let patch: string | null = null;
  if (proposal.status === "approved" || proposal.status === "staged") {
    try {
      patch = (await buildClaimPatch(proposal)).patch;
    } catch {
      patch = null;
    }
  }

  return (
    <>
      <p className={mono}>
        <Link href="/admin/proposals" className={link}>
          Change sets
        </Link>{" "}
        / {proposal.id.slice(0, 8)}
      </p>
      <div className={css({ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", margin: "0.5rem 0 0.25rem" })}>
        <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary" })}>{claim.label}</h1>
        <StatusPill status={proposal.status} />
      </div>
      <p className={mono}>
        claim:{claim.id} · proposed against v{proposal.baseVersion}
        {stale ? ` · STALE: approved object is now v${claim.version}` : ""} · by {proposal.authorEmail ?? proposal.author} ·{" "}
        {new Date(proposal.createdAt).toLocaleString()}
        {proposal.aiAssisted ? " · AI-assisted draft" : ""}
      </p>

      <h2 className={h2}>Diff</h2>
      <TextDiff before={claim.text} after={proposal.proposedText} mode="split" />
      {proposal.rationale && (
        <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.6", marginTop: "0.75rem" })}>
          <strong>Rationale:</strong> {proposal.rationale}
        </p>
      )}

      <h2 className={h2}>Blast radius</h2>
      <BlastPanel radius={radius} />

      <h2 className={h2}>Lifecycle</h2>
      <ProposalActions proposalId={proposal.id} status={proposal.status} allowed={TRANSITIONS[proposal.status]} blocking={blocking} stale={stale} hasPatch={patch !== null} />

      {patch && (
        <>
          <h2 className={h2}>{proposal.status === "approved" ? "Promotion patch" : "Patch preview"}</h2>
          <p className={body}>
            {proposal.status === "approved"
              ? "Approved. Promotion to production is a commit of this patch to the registry on main:"
              : "What promotion will change in src/data/claims.ts once approved:"}
          </p>
          {proposal.status === "approved" && (
            <pre className={css({ ...{}, fontFamily: "mono", fontSize: "xs", bg: "bg.tertiary", padding: "0.75rem 1rem", borderRadius: "6px", margin: "0.75rem 0", overflowX: "auto" })}>
              {`curl -s "${"$"}{ORIGIN}/api/admin/proposals/${proposal.id}/patch" -o claim.patch && git apply claim.patch && npm run graph && git commit -am "Promote ${claim.id} v${proposal.baseVersion + 1}"`}
            </pre>
          )}
          <pre className={pre}>{patch}</pre>
        </>
      )}

      <h2 className={h2}>Audit trail</h2>
      {audit.length === 0 ? (
        <p className={body}>No events recorded.</p>
      ) : (
        <ul className={css({ listStyle: "none", padding: 0, margin: 0 })}>
          {audit.map((e) => (
            <li key={e.id} className={css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", padding: "0.5rem 0", borderBottom: "1px solid", borderColor: "border.light", display: "flex", gap: "1rem", flexWrap: "wrap" })}>
              <span className={mono}>{new Date(e.createdAt).toLocaleString()}</span>
              <span className={css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", color: "accent.primary" })}>{e.action}</span>
              <span className={mono}>{e.actorEmail ?? e.actor}</span>
              {Object.keys(e.details).length > 0 && <span className={mono}>{JSON.stringify(e.details)}</span>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
