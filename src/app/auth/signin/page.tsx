"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { css } from "../../../../styled-system/css";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, devBypassSession } from "@/lib/auth-shared";

const REASONS: Record<string, string> = {
  forbidden: "Your account does not have reviewer or admin access. Ask an administrator to update your role.",
  error: "That sign-in link is invalid or has expired. Request a new one below.",
  unconfigured: "Supabase is not configured in this environment, so sign-in is unavailable.",
};

function SignInForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const reason = params.get("reason");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const bypass = devBypassSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setStatus("error");
      setMessage(REASONS.unconfigured);
      return;
    }
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div
      className={css({
        maxWidth: "440px",
        margin: "0 auto",
        padding: { base: "3rem 1.25rem", md: "5rem 2rem" },
      })}
    >
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
        Rx Web · Reviewer access
      </p>
      <h1 className={css({ fontFamily: "heading", fontSize: "3xl", fontWeight: "700", color: "accent.primary", marginBottom: "0.75rem" })}>
        Sign in
      </h1>
      <p className={css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.6", marginBottom: "1.5rem" })}>
        We&rsquo;ll email you a one-time sign-in link. Reviewer and admin roles unlock X-ray mode and the console.
      </p>

      {reason && REASONS[reason] && (
        <p
          role="alert"
          className={css({
            fontFamily: "body",
            fontSize: "sm",
            color: "#B42318",
            bg: "rgba(180, 35, 24, 0.06)",
            border: "1px solid rgba(180, 35, 24, 0.25)",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            lineHeight: "1.5",
          })}
        >
          {REASONS[reason]}
        </p>
      )}

      {bypass && (
        <p
          className={css({
            fontFamily: "mono",
            fontSize: "xs",
            color: "text.muted",
            bg: "bg.tertiary",
            border: "1px dashed",
            borderColor: "border.medium",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            lineHeight: "1.5",
          })}
        >
          Development bypass is on (NEXT_PUBLIC_XRAY_DEV_BYPASS). You already have admin access locally.{" "}
          <Link href={next} className={css({ color: "accent.secondary", textDecoration: "underline" })}>
            Continue →
          </Link>
        </p>
      )}

      {status === "sent" ? (
        <div
          className={css({
            fontFamily: "body",
            fontSize: "base",
            color: "text.primary",
            bg: "bg.secondary",
            border: "1px solid",
            borderColor: "border.light",
            borderRadius: "8px",
            padding: "1.5rem",
            lineHeight: "1.6",
          })}
        >
          <strong>Check your email.</strong> We sent a sign-in link to {email}. It expires in one hour.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={css({ display: "flex", flexDirection: "column", gap: "1rem" })}>
          <label className={css({ fontFamily: "body", fontSize: "sm", fontWeight: "600", color: "accent.primary" })}>
            Email address
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={css({
                display: "block",
                width: "100%",
                marginTop: "0.4rem",
                fontFamily: "body",
                fontSize: "base",
                padding: "0.75rem 1rem",
                border: "1px solid",
                borderColor: "border.medium",
                borderRadius: "6px",
                bg: "#ffffff",
                color: "text.primary",
                _focus: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "1px" },
              })}
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className={css({
              fontFamily: "body",
              fontSize: "base",
              fontWeight: "600",
              padding: "0.9rem 1.5rem",
              bg: "accent.primary",
              color: "bg.primary",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              _hover: { bg: "accent.secondary" },
              _disabled: { opacity: 0.6, cursor: "wait" },
            })}
          >
            {status === "sending" ? "Sending…" : "Email me a sign-in link"}
          </button>
          {status === "error" && (
            <p role="alert" className={css({ fontFamily: "body", fontSize: "sm", color: "#B42318", lineHeight: "1.5" })}>
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
