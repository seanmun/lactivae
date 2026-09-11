import Link from "next/link";
import { css } from "../../../styled-system/css";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rx Web Console - LACTIVAE™",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/graph", label: "Graph" },
  { href: "/admin/proposals", label: "Change sets" },
  { href: "/references", label: "References" },
  { href: "/", label: "View site ↗" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["admin", "reviewer"], "/admin");

  return (
    <div className={css({ minHeight: "60vh" })}>
      <div
        className={css({
          bg: "accent.primary",
          color: "bg.primary",
          borderBottom: "3px solid",
          borderColor: "accent.secondary",
        })}
      >
        <div
          className={css({
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0.75rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          })}
        >
          <div className={css({ display: "flex", alignItems: "baseline", gap: "0.75rem" })}>
            <span className={css({ fontFamily: "heading", fontSize: "lg", fontWeight: "700" })}>Rx Web</span>
            <span className={css({ fontFamily: "mono", fontSize: "xs", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.8 })}>
              X-ray console
            </span>
          </div>
          <nav aria-label="Console" className={css({ display: "flex", gap: "1.25rem", flexWrap: "wrap" })}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  fontWeight: "600",
                  color: "bg.primary",
                  textDecoration: "none",
                  opacity: 0.9,
                  _hover: { opacity: 1, textDecoration: "underline" },
                })}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span className={css({ fontFamily: "mono", fontSize: "xs", opacity: 0.85 })}>
            {session.email ?? session.userId} · {session.role}
            {session.devBypass ? " · dev bypass" : ""}
          </span>
        </div>
      </div>
      <div className={css({ maxWidth: "1200px", margin: "0 auto", padding: { base: "1.5rem 1.25rem", md: "2.5rem 2rem" } })}>{children}</div>
    </div>
  );
}
