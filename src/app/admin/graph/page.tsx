import Link from "next/link";
import { css } from "../../../../styled-system/css";
import { claims } from "@/data/claims";
import { safetyObjects } from "@/data/safety";
import { references } from "@/data/references";
import { edgesFrom, edgesTo, usagesOf } from "@/lib/graph";

const table = css({
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "body",
  fontSize: "sm",
  marginBottom: "3rem",
  "& th": { textAlign: "left", padding: "0.6rem 0.6rem", bg: "accent.primary", color: "bg.primary", fontWeight: "600", position: "sticky", top: 0 },
  "& td": { padding: "0.6rem 0.6rem", borderBottom: "1px solid", borderColor: "border.light", verticalAlign: "top", lineHeight: "1.5" },
  "& tr:hover td": { bg: "bg.secondary" },
});
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const h2 = css({ fontFamily: "heading", fontSize: "2xl", fontWeight: "700", color: "accent.primary", marginBottom: "0.75rem" });
const link = css({ color: "accent.secondary", textDecoration: "underline", _hover: { color: "accent.warm" } });
const chip = css({ display: "inline-block", fontFamily: "mono", fontSize: "xs", padding: "0.1rem 0.45rem", borderRadius: "999px", bg: "bg.tertiary", border: "1px solid", borderColor: "border.light", marginRight: "0.3rem", marginBottom: "0.2rem" });

const refNumber = new Map(references.map((r, i) => [r.key, i + 1]));

function Usages({ id }: { id: string }) {
  const usages = usagesOf(id);
  if (usages.length === 0) return <span className={mono}>not used</span>;
  return (
    <>
      {usages.map((u, i) => (
        <span key={i} className={chip}>
          {u.page.route === "*" ? "layout" : u.page.route} · {u.component.label}
          {u.rel === "cites" ? " (loose)" : ""}
        </span>
      ))}
    </>
  );
}

export default function GraphPage() {
  return (
    <>
      <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary", marginBottom: "0.5rem" })}>Graph</h1>
      <p className={css({ fontFamily: "body", fontSize: "base", color: "text.secondary", marginBottom: "2rem" })}>
        The same regulatory graph X-ray mode draws, as plain tables. Everything here is reachable by keyboard.
      </p>

      <h2 className={h2} id="claims">
        Claims ({claims.length})
      </h2>
      <div className={css({ overflowX: "auto" })}>
        <table className={table}>
          <thead>
            <tr>
              <th>Claim</th>
              <th>Type</th>
              <th>Status</th>
              <th>References</th>
              <th>Balanced by</th>
              <th>Used in</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/admin/claims/${c.id}`} className={link}>
                    {c.label}
                  </Link>
                  <div className={mono}>{c.id}</div>
                </td>
                <td>{c.type}</td>
                <td>
                  <span className={mono}>
                    {c.status} v{c.version}
                  </span>
                </td>
                <td>
                  {edgesFrom(`claim:${c.id}`, "supported_by").map((e) => (
                    <a key={e.to} href={`/references#ref-${refNumber.get(e.to.slice(4))}`} className={chip}>
                      [{refNumber.get(e.to.slice(4))}] {e.locator ?? ""}
                    </a>
                  ))}
                </td>
                <td>
                  {c.safety.length === 0 ? <span className={mono}>—</span> : c.safety.map((s) => <span key={s} className={chip}>{s}</span>)}
                </td>
                <td>
                  <Usages id={`claim:${c.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={h2} id="safety">
        Safety objects ({safetyObjects.length})
      </h2>
      <div className={css({ overflowX: "auto" })}>
        <table className={table}>
          <thead>
            <tr>
              <th>Safety statement</th>
              <th>Kind · group</th>
              <th>References</th>
              <th>Balances</th>
              <th>Used in</th>
            </tr>
          </thead>
          <tbody>
            {safetyObjects.map((s) => (
              <tr key={s.id}>
                <td>
                  {s.label}
                  <div className={mono}>{s.id}</div>
                </td>
                <td>
                  {s.kind} · {s.group}
                </td>
                <td>
                  {s.refs.length === 0 ? <span className={mono}>—</span> : s.refs.map((r) => (
                    <a key={r.key} href={`/references#ref-${refNumber.get(r.key)}`} className={chip}>
                      [{refNumber.get(r.key)}]
                    </a>
                  ))}
                </td>
                <td>
                  {edgesTo(`safety:${s.id}`, "balanced_by").map((e) => (
                    <Link key={e.from} href={`/admin/claims/${e.from.slice(6)}`} className={chip}>
                      {e.from.slice(6)}
                    </Link>
                  ))}
                </td>
                <td>
                  <Usages id={`safety:${s.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={h2} id="references">
        References ({references.length})
      </h2>
      <div className={css({ overflowX: "auto" })}>
        <table className={table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Source</th>
              <th>Access</th>
              <th>Supports</th>
              <th>Cited in</th>
            </tr>
          </thead>
          <tbody>
            {references.map((r, i) => {
              const supports = edgesTo(`ref:${r.key}`, "supported_by");
              return (
                <tr key={r.key}>
                  <td className={mono}>{i + 1}</td>
                  <td>
                    <a href={`/references#ref-${i + 1}`} className={link}>
                      {r.authors.split(",")[0]} {r.year}
                    </a>
                    <div className={css({ fontSize: "xs", color: "text.secondary" })}>{r.title}</div>
                  </td>
                  <td className={mono}>{r.access}</td>
                  <td>
                    {supports.length === 0 ? <span className={mono}>—</span> : supports.map((e) => (
                      <span key={e.from} className={chip}>
                        {e.from}
                      </span>
                    ))}
                  </td>
                  <td>
                    <Usages id={`ref:${r.key}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
