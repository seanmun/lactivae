import Link from "next/link";
import { css } from "../../../styled-system/css";
import type { BlastRadius } from "@/lib/blast";

const wrap = css({ display: "grid", gridTemplateColumns: { base: "1fr", md: "1fr 1fr" }, gap: "1rem" });
const box = css({ padding: "1rem 1.25rem", bg: "bg.secondary", border: "1px solid", borderColor: "border.light", borderRadius: "8px" });
const h = css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", color: "text.muted", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" });
const li = css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.6", marginBottom: "0.35rem" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const link = css({ color: "accent.secondary", textDecoration: "underline" });

const stateChip: Record<"kept" | "removed" | "added", string> = {
  kept: css({ fontFamily: "mono", fontSize: "xs", padding: "0.05rem 0.4rem", borderRadius: "999px", bg: "bg.tertiary", color: "text.muted", marginRight: "0.4rem" }),
  removed: css({ fontFamily: "mono", fontSize: "xs", padding: "0.05rem 0.4rem", borderRadius: "999px", bg: "rgba(180,35,24,0.12)", color: "#7F1D1D", marginRight: "0.4rem" }),
  added: css({ fontFamily: "mono", fontSize: "xs", padding: "0.05rem 0.4rem", borderRadius: "999px", bg: "rgba(34,139,34,0.14)", color: "#14532D", marginRight: "0.4rem" }),
};

const flagStyle: Record<"error" | "warn" | "info", string> = {
  error: css({ borderLeft: "4px solid #B42318", bg: "rgba(180,35,24,0.06)", padding: "0.6rem 0.8rem", borderRadius: "4px", fontFamily: "body", fontSize: "sm", color: "#7F1D1D", lineHeight: "1.5", marginBottom: "0.5rem" }),
  warn: css({ borderLeft: "4px solid #C67830", bg: "rgba(198,120,48,0.08)", padding: "0.6rem 0.8rem", borderRadius: "4px", fontFamily: "body", fontSize: "sm", color: "#7C3E0B", lineHeight: "1.5", marginBottom: "0.5rem" }),
  info: css({ borderLeft: "4px solid rgba(61,45,34,0.3)", bg: "bg.tertiary", padding: "0.6rem 0.8rem", borderRadius: "4px", fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.5", marginBottom: "0.5rem" }),
};

/**
 * Everything a proposed change touches, plus review flags. Server-safe; also
 * used live inside the proposal editor.
 */
export default function BlastPanel({ radius }: { radius: BlastRadius }) {
  const errors = radius.flags.filter((f) => f.level === "error").length;
  const warns = radius.flags.filter((f) => f.level === "warn").length;

  return (
    <div>
      <div className={css({ marginBottom: "1rem" })}>
        <div className={h}>
          Review flags · {errors} blocking · {warns} warning{warns === 1 ? "" : "s"}
        </div>
        {radius.flags.map((f, i) => (
          <div key={i} className={flagStyle[f.level]} role={f.level === "error" ? "alert" : undefined}>
            <strong className={css({ textTransform: "uppercase", fontFamily: "mono", fontSize: "xs", marginRight: "0.4rem" })}>{f.level}</strong>
            {f.message}
          </div>
        ))}
      </div>

      <div className={wrap}>
        <div className={box}>
          <div className={h}>Renders in ({radius.usages.length})</div>
          {radius.usages.length === 0 && <div className={li}>Not rendered on any page.</div>}
          {radius.usages.map((u, i) => (
            <div key={i} className={li}>
              <Link href={u.page.route === "*" ? "/" : u.page.route!} className={link}>
                {u.page.label}
              </Link>{" "}
              · <span className={mono}>{u.component.label}</span>
            </div>
          ))}
        </div>

        <div className={box}>
          <div className={h}>Evidence ({radius.refs.length})</div>
          {radius.refs.map((r) => (
            <div key={r.key} className={li}>
              <span className={stateChip[r.state]}>{r.state}</span>
              <a href={`/references#ref-${r.number}`} className={link}>
                [{r.number}]
              </a>{" "}
              {r.citation.split(" — ")[0]}
              {r.locator && <span className={mono}> · {r.locator}</span>}
            </div>
          ))}
        </div>

        <div className={box}>
          <div className={h}>Fair balance ({radius.safety.length})</div>
          {radius.safety.length === 0 && <div className={li}>No safety statements linked.</div>}
          {radius.safety.map((s) => (
            <div key={s.id} className={li}>
              <span className={stateChip[s.state]}>{s.state}</span>
              {s.label}
            </div>
          ))}
        </div>

        <div className={box}>
          <div className={h}>Shares evidence with ({radius.siblings.length})</div>
          {radius.siblings.length === 0 && <div className={li}>No other claim cites the same sources.</div>}
          {radius.siblings.map((s) => (
            <div key={s.id} className={li}>
              <Link href={`/admin/claims/${s.id}`} className={link}>
                {s.label}
              </Link>
              <span className={mono}> · {s.sharedRefs.join(", ")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
