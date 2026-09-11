"use client";

import Link from "next/link";
import { css } from "../../../styled-system/css";
import type { Session } from "@/lib/auth-shared";
import { useXRay } from "./store";

export default function XRayToggle({ session }: { session: Session }) {
  const { mode, toggle, env, setEnv, staged, explode, collapse } = useXRay();
  const on = mode !== "off";
  const stagedCount = staged.length;

  return (
    <div
      className={css({
        position: "fixed",
        left: "1rem",
        bottom: "140px",
        zIndex: 70,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      })}
      data-xray-ui="toggle"
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        title={on ? "Exit X-ray (Esc)" : "Enter X-ray mode"}
        className={css({
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontFamily: "mono",
          fontSize: "xs",
          fontWeight: "700",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "0.6rem 0.9rem",
          borderRadius: "999px",
          border: "2px solid",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
          transition: "all 0.2s ease-out",
          bg: on ? "#1D4ED8" : "accent.primary",
          color: "#fff",
          borderColor: on ? "#93C5FD" : "accent.secondary",
          _hover: { transform: "translateY(-1px)" },
          _focusVisible: { outline: "3px solid #93C5FD", outlineOffset: "2px" },
        })}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18" />
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
        X-ray {on ? "on" : "off"}
      </button>
      {on && (
        <button
          type="button"
          onClick={mode === "exploded" ? collapse : explode}
          disabled={mode === "collapsing"}
          aria-pressed={mode === "exploded"}
          title={mode === "exploded" ? "Collapse back into the page (Esc)" : "Explode the page into its governed objects"}
          className={css({
            fontFamily: "mono",
            fontSize: "xs",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0.55rem 0.85rem",
            borderRadius: "999px",
            border: "2px solid",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
            bg: mode === "exploded" ? "#F9E8D4" : "bg.primary",
            color: "accent.primary",
            borderColor: mode === "exploded" ? "#93C5FD" : "border.medium",
            _hover: { borderColor: "accent.secondary" },
            _disabled: { opacity: 0.6, cursor: "wait" },
            _focusVisible: { outline: "3px solid #93C5FD", outlineOffset: "2px" },
          })}
        >
          {mode === "exploded" ? "Collapse" : mode === "collapsing" ? "…" : "Explode"}
        </button>
      )}
      {stagedCount > 0 && (
        <div
          role="group"
          aria-label="Content environment"
          className={css({
            display: "inline-flex",
            borderRadius: "999px",
            border: "1px solid",
            borderColor: "border.medium",
            bg: "bg.primary",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          })}
        >
          {(["production", "staging"] as const).map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={env === e}
              onClick={() => setEnv(e)}
              className={css({
                fontFamily: "mono",
                fontSize: "xs",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "0.45rem 0.7rem",
                border: "none",
                cursor: "pointer",
                bg: env === e ? (e === "staging" ? "#6D28D9" : "accent.primary") : "transparent",
                color: env === e ? "#fff" : "text.secondary",
              })}
            >
              {e === "staging" ? `Staging ${stagedCount}` : "Prod"}
            </button>
          ))}
        </div>
      )}
      <Link
        href="/admin"
        className={css({
          fontFamily: "mono",
          fontSize: "xs",
          color: "accent.primary",
          bg: "bg.primary",
          padding: "0.45rem 0.7rem",
          borderRadius: "999px",
          border: "1px solid",
          borderColor: "border.medium",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          _hover: { borderColor: "accent.secondary" },
        })}
        title={`${session.email ?? session.userId} · ${session.role}`}
      >
        Console
      </Link>
    </div>
  );
}
