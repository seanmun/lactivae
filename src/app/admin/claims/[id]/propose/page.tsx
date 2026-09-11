import Link from "next/link";
import { notFound } from "next/navigation";
import { css } from "../../../../../../styled-system/css";
import { claims } from "@/data/claims";
import ProposeForm from "@/components/admin/ProposeForm";

const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });
const link = css({ color: "accent.secondary", textDecoration: "underline", _hover: { color: "accent.warm" } });

export default async function ProposePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = claims.find((c) => c.id === id);
  if (!claim) notFound();

  return (
    <>
      <p className={mono}>
        <Link href="/admin/graph#claims" className={link}>
          Claims
        </Link>{" "}
        /{" "}
        <Link href={`/admin/claims/${claim.id}`} className={link}>
          {claim.id}
        </Link>{" "}
        / propose
      </p>
      <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary", margin: "0.5rem 0 0.5rem" })}>Propose a change</h1>
      <p className={css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6", marginBottom: "1.5rem" })}>
        Edit the approved copy, adjust its evidence and fair-balance links, and watch the diff and blast radius update as you type.
        Saving creates a <strong>draft</strong>; nothing reaches the site until it is staged, approved, and committed.
      </p>
      <ProposeForm claimId={claim.id} aiAvailable={Boolean(process.env.ANTHROPIC_API_KEY)} />
    </>
  );
}
