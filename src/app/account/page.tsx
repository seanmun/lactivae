import Link from "next/link";
import { redirect } from "next/navigation";
import { css } from "../../../styled-system/css";
import { getSession } from "@/lib/auth";
import { signInPath } from "@/lib/auth-shared";
import AccountControls from "@/components/account/AccountControls";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

const h2 = css({ fontFamily: "heading", fontSize: "xl", fontWeight: "700", color: "accent.primary", marginTop: "2rem", marginBottom: "0.5rem" });
const body = css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const link = css({ color: "accent.secondary", textDecoration: "underline", _hover: { color: "accent.warm" } });

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect(signInPath("/account"));

  return (
    <div className={css({ maxWidth: "720px", margin: "0 auto", padding: { base: "2.5rem 1.25rem 4rem", md: "4rem 2rem 6rem" } })}>
      <p
        className={css({
          fontFamily: "mono",
          fontSize: "xs",
          fontWeight: "600",
          color: "accent.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: "0.75rem",
        })}
      >
        Your account
      </p>
      <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary", marginBottom: "0.5rem" })}>
        {session.email ?? "Signed in"}
      </h1>
      <p className={mono}>
        access level: {session.role}
        {session.role === "admin" ? " · full write access" : session.role === "reviewer" ? " · X-ray enabled" : ""}
      </p>

      <h2 className={h2}>X-ray access</h2>
      <AccountControls role={session.role} />

      {session.role === "admin" && (
        <>
          <h2 className={h2}>Console</h2>
          <p className={body}>
            You have admin access:{" "}
            <Link href="/admin" className={link}>
              open the Rx Web console
            </Link>{" "}
            to propose, stage and approve changes to governed content.
          </p>
        </>
      )}

      <h2 className={h2}>Email</h2>
      <p className={body}>
        You receive LACTIVAE™ updates at {session.email}. Email preferences are not editable yet; reply to any message to
        unsubscribe.
      </p>
    </div>
  );
}
