"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { css } from "../../../styled-system/css";
import type { ProposalStatus } from "@/lib/proposals/types";

interface Props {
  proposalId: string;
  status: ProposalStatus;
  allowed: ProposalStatus[];
  /** blast radius has an error-level flag */
  blocking: boolean;
  /** approved object has moved past this proposal's base version */
  stale: boolean;
  hasPatch: boolean;
}

const LABELS: Record<ProposalStatus, string> = {
  draft: "Back to draft",
  staged: "Stage for review",
  approved: "Approve",
  rejected: "Reject",
};

const btn = (tone: "primary" | "neutral" | "danger") =>
  css({
    fontFamily: "body",
    fontSize: "sm",
    fontWeight: "600",
    padding: "0.6rem 1.1rem",
    borderRadius: "6px",
    border: "1px solid",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    bg: tone === "primary" ? "accent.primary" : "transparent",
    color: tone === "primary" ? "bg.primary" : tone === "danger" ? "#7F1D1D" : "accent.primary",
    borderColor: tone === "primary" ? "accent.primary" : tone === "danger" ? "rgba(180,35,24,0.4)" : "border.medium",
    _hover: { bg: tone === "primary" ? "accent.secondary" : "bg.secondary" },
    _disabled: { opacity: 0.5, cursor: "not-allowed" },
  });

export default function ProposalActions({ proposalId, status, allowed, blocking, stale, hasPatch }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<ProposalStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function move(to: ProposalStatus) {
    setBusy(to);
    setError(null);
    try {
      const res = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: to }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(null);
    }
  }

  const guard = (to: ProposalStatus): string | null => {
    if (to === "staged" && blocking) return "Resolve blocking flags before staging.";
    if (to === "approved" && blocking) return "Resolve blocking flags before approving.";
    if (to === "approved" && stale) return "Approved object has changed; re-propose against the current version.";
    return null;
  };

  return (
    <div>
      <div className={css({ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" })}>
        {allowed.map((to) => {
          const reason = guard(to);
          const tone = to === "approved" || to === "staged" ? "primary" : to === "rejected" ? "danger" : "neutral";
          return (
            <button key={to} type="button" className={btn(tone)} disabled={busy !== null || reason !== null} title={reason ?? undefined} onClick={() => move(to)}>
              {busy === to ? "…" : LABELS[to]}
            </button>
          );
        })}
        {hasPatch && (
          <a href={`/api/admin/proposals/${proposalId}/patch?download=1`} className={btn("neutral")}>
            ↓ Download .patch
          </a>
        )}
        {status === "approved" && (
          <span className={css({ fontFamily: "mono", fontSize: "xs", color: "#14532D" })}>Approved · apply the patch and push to promote</span>
        )}
      </div>
      {allowed.some((to) => guard(to)) && (
        <p className={css({ fontFamily: "body", fontSize: "sm", color: "text.muted", marginTop: "0.5rem" })}>
          {allowed.map((to) => guard(to)).filter(Boolean).join(" ")}
        </p>
      )}
      {error && (
        <p role="alert" className={css({ fontFamily: "body", fontSize: "sm", color: "#B42318", marginTop: "0.5rem" })}>
          {error}
        </p>
      )}
      <p className={css({ fontFamily: "body", fontSize: "sm", color: "text.muted", marginTop: "0.75rem", lineHeight: "1.6" })}>
        Draft → Staged → Approved. Staged text is visible to admins on the live site through the X-ray staging switch; production never
        changes until the approved patch is committed.
      </p>
    </div>
  );
}
