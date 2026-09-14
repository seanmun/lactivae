"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { css } from "../../../styled-system/css";
import type { ProposalStatus } from "@/lib/proposals/types";
import SignatureGate from "./SignatureGate";

interface Props {
  proposalId: string;
  status: ProposalStatus;
  allowed: ProposalStatus[];
  /** blast radius has an error-level flag */
  blocking: boolean;
  /** approved object has moved past this proposal's base version */
  stale: boolean;
  hasPatch: boolean;
  /** admins move proposals through the lifecycle; reviewers only read */
  canWrite: boolean;
  /** shown in the signing prompt so the signer sees what they are approving */
  objectLabel: string;
}

const LABELS: Record<ProposalStatus, string> = {
  draft: "Back to draft",
  staged: "Stage for review",
  approved: "Sign & publish",
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

export default function ProposalActions({ proposalId, status, allowed, blocking, stale, hasPatch, canWrite, objectLabel }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<ProposalStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  /** Approving is a signature, not a status change: step up, then publish. */
  async function publish(factorType: string) {
    setSigning(false);
    setBusy("approved");
    setError(null);
    try {
      const res = await fetch(`/api/admin/proposals/${proposalId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factorType, meaning: "Approved for publication" }),
      });
      const data = (await res.json()) as { error?: string; needsMfa?: boolean; deploy?: string; version?: number; signature?: { seq: number } };
      if (!res.ok) {
        if (data.needsMfa) setSigning(true);
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setResult(`Signed as signature #${data.signature?.seq} and published as v${data.version}. ${data.deploy ?? ""}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publishing failed");
    } finally {
      setBusy(null);
    }
  }

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
        {!canWrite && (
          <span className={css({ fontFamily: "body", fontSize: "sm", color: "text.secondary" })}>
            You have reviewer access: read-only. An admin moves change sets through the lifecycle.
          </span>
        )}
        {canWrite && allowed.map((to) => {
          const reason = guard(to);
          const tone = to === "approved" || to === "staged" ? "primary" : to === "rejected" ? "danger" : "neutral";
          return (
            <button
              key={to}
              type="button"
              className={btn(tone)}
              disabled={busy !== null || reason !== null}
              title={reason ?? undefined}
              onClick={() => (to === "approved" ? setSigning(true) : move(to))}
            >
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
      {canWrite && allowed.some((to) => guard(to)) && (
        <p className={css({ fontFamily: "body", fontSize: "sm", color: "text.muted", marginTop: "0.5rem" })}>
          {allowed.map((to) => guard(to)).filter(Boolean).join(" ")}
        </p>
      )}
      {signing && canWrite && (
        <SignatureGate what={objectLabel} onVerified={publish} onCancel={() => setSigning(false)} />
      )}
      {result && (
        <p className={css({ fontFamily: "body", fontSize: "sm", color: "#14532D", bg: "rgba(34,139,34,0.08)", border: "1px solid rgba(34,139,34,0.3)", borderRadius: "6px", padding: "0.75rem 1rem", marginTop: "0.75rem", lineHeight: "1.5" })}>
          {result}
        </p>
      )}
      {error && (
        <p role="alert" className={css({ fontFamily: "body", fontSize: "sm", color: "#B42318", marginTop: "0.5rem" })}>
          {error}
        </p>
      )}
      <p className={css({ fontFamily: "body", fontSize: "sm", color: "text.muted", marginTop: "0.75rem", lineHeight: "1.6" })}>
        Draft → Staged → Signed &amp; published. Staged text is visible to admins on the live site through the X-ray staging switch.
        Approving records a signature that is chained to every previous approval, so any later tampering is detectable, and then
        publishes the wording and rebuilds the site. No terminal, no patch file.
      </p>
    </div>
  );
}
