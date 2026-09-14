import Link from "next/link";
import { css } from "../../../../styled-system/css";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface SignatureRow {
  seq: number;
  proposal_id: string;
  object_kind: string;
  object_id: string;
  version: number;
  content_hash: string;
  prev_hash: string | null;
  record_hash: string;
  signer_email: string;
  meaning: string;
  aal: string;
  factor_type: string | null;
  signed_at: string;
}

const h2 = css({ fontFamily: "heading", fontSize: "xl", fontWeight: "700", color: "accent.primary", marginTop: "2rem", marginBottom: "0.75rem" });
const body = css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted", wordBreak: "break-all" });
const link = css({ color: "accent.secondary", textDecoration: "underline", _hover: { color: "accent.warm" } });
const card = css({ padding: "1rem 1.25rem", bg: "bg.secondary", border: "1px solid", borderColor: "border.light", borderRadius: "8px", marginBottom: "0.6rem" });

export default async function ApprovalsPage() {
  await requireRole(["admin", "reviewer"], "/admin/approvals");
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("approval_signatures")
    .select("*")
    .order("seq", { ascending: false })
    .limit(200);
  const { data: breaks } = await supabase.rpc("verify_approval_chain");

  const signatures = (rows ?? []) as SignatureRow[];
  const problems = (breaks ?? []) as { seq: number; object_id: string; problem: string }[];
  const intact = problems.length === 0;

  return (
    <>
      <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary", marginBottom: "0.5rem" })}>
        Approval log
      </h1>
      <p className={css({ ...{}, fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6", marginBottom: "1.5rem", maxWidth: "760px" })}>
        Every publication is signed by a named person from a multi-factor session, and each signature carries a fingerprint of the
        one before it. Altering any past entry breaks every fingerprint after it, so tampering is detectable by anyone who checks.
        The log is append-only: no policy exists that permits an update or a delete, including for admins.
      </p>

      {error ? (
        <p className={css({ ...{}, fontFamily: "body", fontSize: "base", color: "#B42318" })}>
          Could not read the log: {error.message}. Has migration 0005 been run?
        </p>
      ) : (
        <>
          <div
            className={css({
              padding: "1rem 1.25rem",
              borderRadius: "8px",
              border: "1px solid",
              marginBottom: "1.5rem",
              bg: intact ? "rgba(34,139,34,0.07)" : "rgba(180,35,24,0.07)",
              borderColor: intact ? "rgba(34,139,34,0.35)" : "rgba(180,35,24,0.4)",
            })}
          >
            <p
              className={css({
                fontFamily: "mono",
                fontSize: "sm",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: intact ? "#14532D" : "#7F1D1D",
              })}
            >
              {intact ? `✔ chain intact · ${signatures.length} signature${signatures.length === 1 ? "" : "s"}` : `✖ chain broken at ${problems.length} point(s)`}
            </p>
            {!intact && (
              <ul className={css({ paddingLeft: "1.2rem", listStyleType: "disc", marginTop: "0.5rem" })}>
                {problems.map((p) => (
                  <li key={p.seq} className={css({ fontFamily: "body", fontSize: "sm", color: "#7F1D1D" })}>
                    #{p.seq} ({p.object_id}): {p.problem}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {signatures.length === 0 ? (
            <p className={body}>
              Nothing signed yet. Stage a change set and choose <strong>Sign &amp; publish</strong> to create the first entry.
            </p>
          ) : (
            signatures.map((s) => (
              <div key={s.seq} className={card}>
                <div className={css({ display: "flex", gap: "0.75rem", alignItems: "baseline", flexWrap: "wrap" })}>
                  <span className={css({ fontFamily: "mono", fontSize: "sm", fontWeight: "700", color: "accent.secondary" })}>#{s.seq}</span>
                  <Link href={`/admin/claims/${s.object_id}`} className={link}>
                    {s.object_id}
                  </Link>
                  <span className={mono}>
                    v{s.version} · {s.signer_email} · {new Date(s.signed_at).toLocaleString()} · {s.aal}
                    {s.factor_type ? ` (${s.factor_type})` : ""}
                  </span>
                </div>
                <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "text.primary", marginTop: "0.3rem" })}>{s.meaning}</p>
                <p className={mono}>
                  content {s.content_hash.slice(0, 16)}… · record {s.record_hash.slice(0, 16)}… · prev{" "}
                  {s.prev_hash ? `${s.prev_hash.slice(0, 16)}…` : "(first entry)"}
                </p>
                <p className={css({ marginTop: "0.35rem" })}>
                  <Link href={`/admin/proposals/${s.proposal_id}`} className={link}>
                    View the change set
                  </Link>
                </p>
              </div>
            ))
          )}
        </>
      )}

      <h2 className={h2}>How to check this yourself</h2>
      <p className={body}>
        The verification runs in the database, not in this page, so it cannot be faked by the app. Run{" "}
        <code className={mono}>select * from verify_approval_chain();</code> in the SQL editor: no rows means every signature still
        matches its contents and its place in the chain.
      </p>
    </>
  );
}
