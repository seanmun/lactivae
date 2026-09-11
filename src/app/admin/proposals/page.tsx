import Link from "next/link";
import { css } from "../../../../styled-system/css";
import { getProposalStore, type ProposalStatus } from "@/lib/proposals";
import { getClaim } from "@/data/claims";
import StatusPill from "@/components/admin/StatusPill";

const table = css({
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "body",
  fontSize: "sm",
  "& th": { textAlign: "left", padding: "0.6rem", bg: "accent.primary", color: "bg.primary", fontWeight: "600" },
  "& td": { padding: "0.6rem", borderBottom: "1px solid", borderColor: "border.light", verticalAlign: "top", lineHeight: "1.5" },
  "& tr:hover td": { bg: "bg.secondary" },
});
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const link = css({ color: "accent.secondary", textDecoration: "underline", _hover: { color: "accent.warm" } });
const filterChip = (active: boolean) =>
  css({
    fontFamily: "body",
    fontSize: "sm",
    fontWeight: "600",
    padding: "0.35rem 0.8rem",
    borderRadius: "999px",
    border: "1px solid",
    borderColor: active ? "accent.primary" : "border.medium",
    bg: active ? "accent.primary" : "transparent",
    color: active ? "bg.primary" : "accent.primary",
    textDecoration: "none",
  });

const STATUSES: ProposalStatus[] = ["draft", "staged", "approved", "rejected"];

export default async function ProposalsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = STATUSES.includes(status as ProposalStatus) ? (status as ProposalStatus) : undefined;
  const store = await getProposalStore();
  const proposals = await store.list(filter ? { status: filter } : undefined);

  return (
    <>
      <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary", marginBottom: "0.5rem" })}>Change sets</h1>
      <p className={css({ fontFamily: "body", fontSize: "base", color: "text.secondary", marginBottom: "1.5rem" })}>
        Proposed versions of governed objects. Store: <span className={mono}>{store.name}</span>
        {store.name === "file" ? " (development bypass — local JSON, not Supabase)" : ""}.
      </p>

      <div className={css({ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" })}>
        <Link href="/admin/proposals" className={filterChip(!filter)}>
          All
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/proposals?status=${s}`} className={filterChip(filter === s)}>
            {s}
          </Link>
        ))}
      </div>

      {proposals.length === 0 ? (
        <p className={css({ fontFamily: "body", fontSize: "base", color: "text.secondary" })}>
          No proposals{filter ? ` with status "${filter}"` : ""}. Open any claim in{" "}
          <Link href="/admin/graph" className={link}>
            the graph
          </Link>{" "}
          and choose <strong>Propose change</strong>.
        </p>
      ) : (
        <div className={css({ overflowX: "auto" })}>
          <table className={table}>
            <thead>
              <tr>
                <th>Object</th>
                <th>Proposed text</th>
                <th>Status</th>
                <th>Author</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => {
                const label = p.isNew ? `${p.proposedLabel ?? p.objectId} (new claim)` : p.objectKind === "claim" ? getClaim(p.objectId).label : p.objectId;
                return (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/proposals/${p.id}`} className={link}>
                        {label}
                      </Link>
                      <div className={mono}>
                        {p.objectKind}:{p.objectId} · base v{p.baseVersion}
                        {p.aiAssisted ? " · AI-assisted" : ""}
                      </div>
                    </td>
                    <td className={css({ maxWidth: "420px" })}>{p.proposedText}</td>
                    <td>
                      <StatusPill status={p.status} />
                    </td>
                    <td className={mono}>{p.authorEmail ?? p.author}</td>
                    <td className={mono}>{new Date(p.updatedAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
