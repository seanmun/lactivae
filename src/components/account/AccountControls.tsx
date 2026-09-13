"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { css } from "../../../styled-system/css";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth-client";
import type { Role } from "@/lib/auth-shared";
import InfoTip from "@/components/ui/InfoTip";

const body = css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6" });
const panel = css({
  padding: "1.25rem 1.5rem",
  bg: "bg.secondary",
  border: "1px solid",
  borderColor: "border.light",
  borderRadius: "8px",
  marginTop: "0.75rem",
});
const btn = css({
  fontFamily: "body",
  fontSize: "sm",
  fontWeight: "600",
  padding: "0.6rem 1.1rem",
  borderRadius: "6px",
  border: "1px solid",
  borderColor: "border.medium",
  bg: "transparent",
  color: "accent.primary",
  cursor: "pointer",
  _hover: { bg: "bg.tertiary" },
  _disabled: { opacity: 0.5, cursor: "wait" },
});

/**
 * Self-service X-ray opt-in. The database permits a visitor to move their own
 * role between consumer and reviewer and nothing else (migration 0004), so
 * this writes directly through the client rather than needing an endpoint.
 */
export default function AccountControls({ role }: { role: Role }) {
  const router = useRouter();
  const [current, setCurrent] = useState<Role>(role);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = current === "admin";
  const enabled = current === "reviewer" || isAdmin;

  async function toggle(next: boolean) {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session expired. Sign in again.");
      const { error: err } = await supabase
        .from("profiles")
        .update({ role: next ? "reviewer" : "consumer" })
        .eq("id", user.id);
      if (err) throw new Error(err.message);
      setCurrent(next ? "reviewer" : "consumer");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update your access");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className={panel}>
        {isAdmin ? (
          <p className={body}>
            X-ray is always on for admins.
            <InfoTip label="What is X-ray mode?">
              <strong>X-ray</strong> reveals the regulatory machinery behind this site: every claim, safety statement and reference
              is a governed object you can outline on the page, explode onto a zoomable board, and trace back to the exact passage
              that supports it.
            </InfoTip>
          </p>
        ) : (
          <>
            <label className={css({ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" })}>
              <input
                type="checkbox"
                checked={enabled}
                disabled={busy}
                onChange={(e) => toggle(e.target.checked)}
                className={css({ marginTop: "0.3rem", width: "1rem", height: "1rem", flexShrink: 0, cursor: "pointer" })}
              />
              <span>
                <span className={css({ display: "block", fontFamily: "body", fontSize: "base", fontWeight: "600", color: "accent.primary" })}>
                  X-ray access
                  <InfoTip label="What is X-ray mode?">
                    <strong>X-ray</strong> reveals the regulatory machinery behind this site. Every claim, safety statement and
                    reference is a governed object, and X-ray lets you outline them on the page, explode the whole page onto a
                    zoomable board, and trace any statistic back to the exact passage in the study that supports it.
                    <br />
                    <br />
                    It is read-only and changes nothing for other visitors.
                  </InfoTip>
                </span>
                <span className={css({ display: "block", fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.6", marginTop: "0.25rem" })}>
                  {enabled
                    ? "On. Look for the X-ray pill at the bottom-left of any page."
                    : "Off. Turn this on to inspect the claims, evidence and safety language behind every page."}
                </span>
              </span>
            </label>
            {busy && <p className={css({ fontFamily: "mono", fontSize: "xs", color: "text.muted", marginTop: "0.6rem" })}>Saving…</p>}
            {error && (
              <p role="alert" className={css({ fontFamily: "body", fontSize: "sm", color: "#B42318", marginTop: "0.6rem" })}>
                {error}
              </p>
            )}
          </>
        )}
      </div>

      <p className={css({ marginTop: "1.5rem" })}>
        <button
          type="button"
          className={btn}
          onClick={async () => {
            await signOut();
            router.push("/");
            router.refresh();
          }}
        >
          Sign out
        </button>
      </p>
    </>
  );
}
