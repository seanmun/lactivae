"use client";

import { useCallback, useEffect, useState } from "react";
import { css } from "../../../styled-system/css";
import { createClient } from "@/lib/supabase/client";

type Phase = "checking" | "ready" | "challenge" | "enroll" | "error";

interface Props {
  /** Shown as the meaning of the signature, e.g. the claim label */
  what: string;
  onVerified: (factorType: string) => void;
  onCancel: () => void;
}

const panel = css({
  padding: "1.25rem 1.5rem",
  bg: "bg.secondary",
  border: "2px solid",
  borderColor: "accent.secondary",
  borderRadius: "8px",
  marginTop: "0.75rem",
});
const h = css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", color: "accent.secondary", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" });
const body = css({ fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.6" });
const codeInput = css({
  fontFamily: "mono",
  fontSize: "xl",
  letterSpacing: "0.35em",
  textAlign: "center",
  padding: "0.7rem 1rem",
  width: "12ch",
  border: "1px solid",
  borderColor: "border.medium",
  borderRadius: "6px",
  bg: "#fff",
  color: "text.primary",
  _focus: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "1px" },
});
const btn = (primary = false) =>
  css({
    fontFamily: "body",
    fontSize: "sm",
    fontWeight: "600",
    padding: "0.6rem 1.1rem",
    borderRadius: "6px",
    border: "1px solid",
    cursor: "pointer",
    bg: primary ? "accent.primary" : "transparent",
    color: primary ? "bg.primary" : "accent.primary",
    borderColor: primary ? "accent.primary" : "border.medium",
    _hover: { bg: primary ? "accent.secondary" : "bg.tertiary" },
    _disabled: { opacity: 0.5, cursor: "wait" },
  });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted", wordBreak: "break-all" });

/**
 * Step-up authentication before an approval is signed.
 *
 * Being signed in is not enough to approve: this asks the person to prove they
 * are present right now, which is the "signature manifestation" a regulated
 * approval needs. The database enforces the same requirement independently, so
 * this panel is the usable face of a rule that does not depend on it.
 *
 * Uses an authenticator code. On a phone, a password manager fills that code
 * with Face ID or Touch ID, so the practical experience is biometric.
 */
export default function SignatureGate({ what, onVerified, onCancel }: Props) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [factorType, setFactorType] = useState<string>("totp");
  const [enrollQr, setEnrollQr] = useState<string | null>(null);
  const [enrollSecret, setEnrollSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { data: aal, error: aalErr } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalErr) throw new Error(aalErr.message);
      if (aal?.currentLevel === "aal2") {
        setPhase("ready");
        onVerified("existing");
        return;
      }
      const { data: factors, error: fErr } = await supabase.auth.mfa.listFactors();
      if (fErr) throw new Error(fErr.message);
      const verified = (factors?.all ?? []).filter((f) => f.status === "verified");
      if (verified.length > 0) {
        setFactorId(verified[0].id);
        setFactorType(verified[0].factor_type);
        setPhase("challenge");
      } else {
        setPhase("enroll");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check your security settings");
      setPhase("error");
    }
  }, [onVerified]);

  useEffect(() => {
    check();
  }, [check]);

  async function startEnroll() {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `LACTIVAE ${new Date().toISOString().slice(0, 10)}`,
      });
      if (err) throw new Error(err.message);
      setFactorId(data.id);
      setFactorType("totp");
      setEnrollQr(data.totp?.qr_code ?? null);
      setEnrollSecret(data.totp?.secret ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start enrolment");
    } finally {
      setBusy(false);
    }
  }

  async function submitCode() {
    if (!factorId) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.replace(/\s/g, "") });
      if (err) throw new Error(err.message);
      setPhase("ready");
      onVerified(factorType);
    } catch (e) {
      setError(e instanceof Error ? e.message : "That code was not accepted");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={panel} role="group" aria-label="Confirm your identity to sign">
      <div className={h}>Sign this approval</div>
      <p className={body}>
        You are about to approve <strong>{what}</strong> for publication. Confirm your identity so the signature records that you
        were present.
      </p>

      {phase === "checking" && <p className={mono}>Checking your security settings…</p>}

      {phase === "enroll" && (
        <div className={css({ marginTop: "0.75rem" })}>
          {!enrollQr ? (
            <>
              <p className={body}>
                You have no second factor yet. Set one up once, then approvals take a six-digit code. Any authenticator works:
                Apple Passwords, 1Password, Google Authenticator.
              </p>
              <p className={css({ marginTop: "0.75rem" })}>
                <button type="button" className={btn(true)} disabled={busy} onClick={startEnroll}>
                  {busy ? "Preparing…" : "Set up my second factor"}
                </button>{" "}
                <button type="button" className={btn()} onClick={onCancel}>
                  Cancel
                </button>
              </p>
            </>
          ) : (
            <>
              <p className={body}>Scan this with your authenticator, then enter the code it shows.</p>
              {/* Supabase returns the QR as an SVG data URI */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={enrollQr}
                alt="QR code for enrolling your authenticator"
                className={css({ display: "block", width: "180px", height: "180px", margin: "0.75rem 0", bg: "#fff", padding: "0.5rem", borderRadius: "6px" })}
              />
              {enrollSecret && (
                <p className={mono}>
                  Can&rsquo;t scan? Enter this key manually: {enrollSecret}
                </p>
              )}
              <div className={css({ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.75rem" })}>
                <input
                  className={codeInput}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitCode()}
                  aria-label="Authenticator code"
                />
                <button type="button" className={btn(true)} disabled={busy || code.replace(/\s/g, "").length < 6} onClick={submitCode}>
                  {busy ? "Verifying…" : "Verify and sign"}
                </button>
                <button type="button" className={btn()} onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {phase === "challenge" && (
        <div className={css({ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.75rem" })}>
          <input
            className={codeInput}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={code}
            autoFocus
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitCode()}
            aria-label="Authenticator code"
          />
          <button type="button" className={btn(true)} disabled={busy || code.replace(/\s/g, "").length < 6} onClick={submitCode}>
            {busy ? "Verifying…" : "Verify and sign"}
          </button>
          <button type="button" className={btn()} onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}

      {phase === "ready" && <p className={body}>Identity confirmed. Signing…</p>}

      {phase === "error" && (
        <p className={css({ marginTop: "0.75rem" })}>
          <button type="button" className={btn()} onClick={check}>
            Try again
          </button>
        </p>
      )}

      {error && (
        <p role="alert" className={css({ fontFamily: "body", fontSize: "sm", color: "#B42318", marginTop: "0.6rem", lineHeight: "1.5" })}>
          {error}
        </p>
      )}
    </div>
  );
}
