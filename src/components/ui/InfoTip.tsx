"use client";

import { useEffect, useId, useRef, useState } from "react";
import { css } from "../../../styled-system/css";

interface InfoTipProps {
  /** Accessible name for the trigger, e.g. "What is X-ray mode?" */
  label: string;
  children: React.ReactNode;
}

const trigger = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.05em",
  height: "1.05em",
  marginLeft: "0.35em",
  verticalAlign: "text-top",
  borderRadius: "50%",
  border: "1.5px solid",
  borderColor: "accent.secondary",
  color: "accent.secondary",
  bg: "transparent",
  fontFamily: "body",
  fontSize: "0.72em",
  fontWeight: "700",
  lineHeight: "1",
  cursor: "help",
  padding: 0,
  flexShrink: 0,
  _hover: { bg: "accent.secondary", color: "bg.primary" },
  _focusVisible: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "2px" },
});

const bubble = css({
  position: "absolute",
  zIndex: 40,
  bottom: "calc(100% + 0.5rem)",
  left: 0,
  width: "min(320px, 78vw)",
  padding: "0.75rem 0.9rem",
  bg: "accent.primary",
  color: "bg.primary",
  borderRadius: "8px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
  fontFamily: "body",
  fontSize: "sm",
  fontWeight: "400",
  lineHeight: "1.5",
  textAlign: "left",
  textTransform: "none",
  letterSpacing: "normal",
  _after: {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "0.75rem",
    borderWidth: "6px",
    borderStyle: "solid",
    borderColor: "var(--colors-accent-primary) transparent transparent transparent",
  },
});

/**
 * A small "i" that explains a term on hover, focus or tap. Opens on hover and
 * keyboard focus, closes on Escape or an outside click, so it works for mouse,
 * keyboard and touch alike.
 */
export default function InfoTip({ label, children }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <span
      ref={wrap}
      className={css({ position: "relative", display: "inline-block" })}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={trigger}
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        i
      </button>
      {open && (
        <span id={id} role="tooltip" className={bubble}>
          {children}
        </span>
      )}
    </span>
  );
}
