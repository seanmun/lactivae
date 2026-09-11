import Link from "next/link";
import { css } from "../../../styled-system/css";
import { graph, checksPassed } from "@/lib/graph";
import { getProposalStore } from "@/lib/proposals";

const card = css({
  padding: "1.25rem 1.5rem",
  bg: "bg.secondary",
  border: "1px solid",
  borderColor: "border.light",
  borderRadius: "8px",
});

const stat = css({ fontFamily: "mono", fontSize: "3xl", fontWeight: "700", color: "accent.secondary", lineHeight: "1.1" });
const label = css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", marginTop: "0.25rem" });
const h2 = css({ fontFamily: "heading", fontSize: "2xl", fontWeight: "700", color: "accent.primary", marginBottom: "1rem" });
const p = css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6" });

export default async function AdminOverview() {
  const c = graph.counts;
  const store = await getProposalStore();
  const proposals = await store.list();
  const byStatus = (st: string) => proposals.filter((p) => p.status === st).length;
  const ok = checksPassed();
  const checks = graph.checks;
  const pages = Object.entries(checks.looseRefsByPage).sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary", marginBottom: "0.5rem" })}>
        Regulatory graph
      </h1>
      <p className={css({ ...{}, fontFamily: "body", fontSize: "base", color: "text.secondary", marginBottom: "2rem" })}>
        Generated {new Date(graph.generatedAt).toLocaleString()} from the registries in <code>src/data</code> and the page source.
        Open any public page and toggle <strong>X-ray</strong> (bottom-left) to see it in place.
      </p>

      <div className={css({ display: "grid", gridTemplateColumns: { base: "1fr 1fr", md: "repeat(6, 1fr)" }, gap: "1rem", marginBottom: "2.5rem" })}>
        {[
          ["claims", "Claims"],
          ["safety", "Safety objects"],
          ["references", "References"],
          ["pages", "Pages"],
          ["components", "Components"],
          ["edges", "Edges"],
        ].map(([key, name]) => (
          <div key={key} className={card}>
            <div className={stat}>{c[key]}</div>
            <div className={label}>{name}</div>
          </div>
        ))}
      </div>

      <section className={css({ display: "grid", gridTemplateColumns: { base: "1fr", md: "1fr 1fr" }, gap: "1.5rem", marginBottom: "2.5rem" })}>
        <div className={card}>
          <h2 className={h2}>Build gate</h2>
          <p
            className={css({
              fontFamily: "mono",
              fontSize: "sm",
              fontWeight: "600",
              display: "inline-block",
              padding: "0.3rem 0.7rem",
              borderRadius: "999px",
              marginBottom: "0.75rem",
              bg: ok ? "rgba(34, 139, 34, 0.1)" : "rgba(180, 35, 24, 0.1)",
              color: ok ? "#1F6B2E" : "#B42318",
            })}
          >
            {ok ? "PASS — production contains only approved, supported content" : "FAIL — see below"}
          </p>
          <ul className={css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.8", paddingLeft: "1.25rem", listStyleType: "disc" })}>
            <li>Unapproved objects in use: {checks.unapprovedInUse.length}</li>
            <li>Unknown objects in use: {checks.unknownObjectsInUse.length}</li>
            <li>Dangling reference keys: {checks.danglingRefs.length}</li>
            <li>Evidence claims without references: {checks.claimsWithoutEvidence.length}</li>
            <li>Unused claims / safety: {checks.unusedClaims.length} / {checks.unusedSafety.length}</li>
          </ul>
        </div>

        <div className={card}>
          <h2 className={h2}>Conversion progress</h2>
          <p className={css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", marginBottom: "0.75rem" })}>
            Loose reference markers are claims not yet modeled as governed objects.
          </p>
          <table className={css({ width: "100%", borderCollapse: "collapse", fontFamily: "body", fontSize: "sm", "& td, & th": { padding: "0.4rem 0.5rem", borderBottom: "1px solid", borderColor: "border.light", textAlign: "left" }, "& th": { color: "accent.primary", fontWeight: "600" } })}>
            <thead>
              <tr>
                <th>Page</th>
                <th>Loose markers</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(([route, loose]) => (
                <tr key={route}>
                  <td className={css({ fontFamily: "mono" })}>{route === "*" ? "layout (ISI)" : route}</td>
                  <td className={css({ fontFamily: "mono" })}>{loose}</td>
                  <td>{checks.pagesConverted.includes(route) ? "✓ governed" : "pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={css({ ...{}, display: "grid", gridTemplateColumns: { base: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: "1rem", marginBottom: "2.5rem" })}>
        {(["draft", "staged", "approved", "rejected"] as const).map((st) => (
          <Link key={st} href={`/admin/proposals?status=${st}`} className={css({ textDecoration: "none" })}>
            <div className={card}>
              <div className={stat}>{byStatus(st)}</div>
              <div className={label}>{st} change sets</div>
            </div>
          </Link>
        ))}
      </section>

      <section className={card}>
        <h2 className={h2}>Start here</h2>
        <p className={p}>
          <Link href="/admin/graph" className={css({ color: "accent.secondary", textDecoration: "underline" })}>
            Browse the graph
          </Link>{" "}
          as tables, or open the{" "}
          <Link href="/" className={css({ color: "accent.secondary", textDecoration: "underline" })}>
            home page
          </Link>{" "}
          and press the X-ray toggle to inspect claims in place. Select a claim to trace its references and safety
          language; select a reference to see every claim that depends on it.
        </p>
      </section>
    </>
  );
}
