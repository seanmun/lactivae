"use client";

import Link from "next/link";
import Image from "next/image";
import { css } from "../../../styled-system/css";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

/**
 * Two audiences get a top-level link — patients and providers, the two doors
 * a pharma site is expected to have. Everything else lives behind one menu.
 *
 * The nav previously listed five destinations plus auth, which wrapped every
 * label onto two lines and pushed the wordmark into the first link. Labels are
 * nowrap now and the logo cannot shrink, so that cannot come back by adding a
 * page.
 */
const MORE_LINKS: { href: string; label: string; hint: string }[] = [
  { href: "/assessment", label: "Is It Right For You?", hint: "Four questions, a printable guide" },
  { href: "/studies", label: "Clinical Studies", hint: "The trials and meta-analyses" },
  { href: "/nutritional-data", label: "Nutritional Data", hint: "Composition, side by side" },
  { href: "/safety", label: "Safety Information", hint: "Risks and who should not drink it" },
  { href: "/references", label: "References", hint: "Every source, numbered" },
  { href: "/about", label: "About", hint: "What this project is" },
];

const navLink = css({
  fontFamily: "body",
  fontSize: "base",
  color: "text.secondary",
  textDecoration: "none",
  whiteSpace: "nowrap",
  _hover: { color: "accent.secondary" },
  _focusVisible: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "3px", borderRadius: "3px" },
});

const menuItem = css({
  display: "block",
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  textDecoration: "none",
  _hover: { bg: "bg.secondary" },
  _focusVisible: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "-2px" },
});

const menuItemActive = css({
  display: "block",
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  textDecoration: "none",
  bg: "bg.secondary",
  _focusVisible: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "-2px" },
});

const menuLabel = css({
  fontFamily: "body",
  fontSize: "base",
  fontWeight: "500",
  color: "text.primary",
  display: "block",
  whiteSpace: "nowrap",
});

const menuHint = css({
  fontFamily: "body",
  fontSize: "xs",
  color: "text.muted",
  display: "block",
  marginTop: "0.1rem",
  whiteSpace: "nowrap",
});

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={css({ transition: "transform 0.18s ease-out", flexShrink: 0 })}
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** The catch-all menu. Opens on click or hover, closes on Escape, outside click, or navigation. */
function MoreMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holds = MORE_LINKS.some((l) => l.href === pathname);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        wrap.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Hover is a convenience for mice; the click target is what actually matters,
  // so a small delay keeps the menu from vanishing when the pointer cuts a corner.
  const hoverOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={wrap}
      onMouseEnter={hoverOpen}
      onMouseLeave={hoverClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      className={css({ position: "relative", display: "flex", alignItems: "center" })}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={css({
          fontFamily: "body",
          fontSize: "base",
          color: "text.secondary",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          whiteSpace: "nowrap",
          _hover: { color: "accent.secondary" },
          _focusVisible: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "3px", borderRadius: "3px" },
        })}
        style={holds ? { color: "var(--colors-accent-secondary)" } : undefined}
      >
        More
        <Chevron open={open} />
      </button>

      {open && (
        <div
          role="menu"
          className={css({
            position: "absolute",
            top: "calc(100% + 0.85rem)",
            right: 0,
            minWidth: "16rem",
            bg: "bg.primary",
            border: "1px solid",
            borderColor: "border.light",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
            padding: "0.4rem",
            zIndex: 60,
          })}
        >
          {MORE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              aria-current={pathname === l.href ? "page" : undefined}
              className={pathname === l.href ? menuItemActive : menuItem}
            >
              <span className={menuLabel}>{l.label}</span>
              <span className={menuHint}>{l.hint}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session } = useSession();
  const pathname = usePathname() ?? "/";
  const signedIn = Boolean(session);
  // Signed-in visitors see who they are: the local part of their email, kept
  // short so a long address cannot push the nav around.
  const accountName = (() => {
    const local = session?.email?.split("@")[0] ?? "";
    if (!local) return "Account";
    return local.length > 14 ? `${local.slice(0, 13)}…` : local;
  })();

  return (
    <header
      className={css({
        position: "sticky",
        top: 0,
        bg: "bg.primary",
        borderBottom: "1px solid",
        borderColor: "border.light",
        zIndex: 50,
        backdropFilter: "blur(8px)",
      })}
    >
      <nav
        className={css({
          maxWidth: "1200px",
          margin: "0 auto",
          // The speed dial is fixed to the top-right corner of the viewport and
          // sat on top of the Register button below 1280px, where the nav runs
          // to the edge. Reserve the corner until there is slack again.
          padding: "1rem 2rem",
          paddingRight: { base: "2rem", lg: "4.75rem", xl: "2rem" },
          display: "flex",
          alignItems: "center",
          justifyContent: { base: "center", lg: "space-between" },
          gap: "1rem",
          position: "relative",
        })}
      >
        {/* Mobile Menu Button - Left */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={css({
            display: { base: "block", lg: "none" },
            position: "absolute",
            left: "1rem",
            padding: "0.5rem",
            color: "accent.primary",
            cursor: "pointer",
            bg: "transparent",
            border: "none",
          })}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* Logo - Center on mobile, Left on desktop.
            The mark is artwork; the name stays live text so it is selectable,
            scales with the accessibility font-size control, and stays sharp. */}
        <Link
          href="/"
          className={css({
            display: "flex",
            alignItems: "center",
            gap: { base: "0.55rem", lg: "0.7rem" },
            textDecoration: "none",
            flexShrink: 0,
            _hover: { "& [data-wordmark]": { color: "accent.secondary" } },
            _focusVisible: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "4px", borderRadius: "4px" },
          })}
        >
          <Image
            src="/logos/lactivae-mark.png"
            alt=""
            aria-hidden="true"
            width={505}
            height={393}
            priority
            className={css({
              display: "block",
              width: "auto",
              height: { base: "34px", lg: "42px" },
              flexShrink: 0,
            })}
          />
          <div className={css({ lineHeight: "1" })}>
            <span
              data-wordmark
              className={css({
                fontFamily: "heading",
                fontSize: "2xl",
                fontWeight: "700",
                color: "accent.primary",
                display: "block",
                whiteSpace: "nowrap",
                transition: "color 0.2s ease-out",
              })}
            >
              LACTIVAE™
            </span>
            <span
              className={css({
                display: "block",
                fontSize: "xs",
                fontFamily: "body",
                fontWeight: "300",
                color: "text.muted",
                marginTop: "0.125rem",
                lineHeight: "1",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              })}
            >
              (raw milk, oral solution)
            </span>
          </div>
        </Link>

        {/* Desktop Navigation: the two audiences, then everything else */}
        <div
          className={css({
            display: { base: "none", lg: "flex" },
            gap: { lg: "1.5rem", xl: "1.75rem" },
            alignItems: "center",
            flexShrink: 0,
          })}
        >
          <Link href="/patients" aria-current={pathname === "/patients" ? "page" : undefined} className={navLink}>
            For Patients
          </Link>
          <Link href="/providers" aria-current={pathname === "/providers" ? "page" : undefined} className={navLink}>
            For Providers
          </Link>

          <MoreMenu pathname={pathname} />

          {!signedIn && (
            <Link href="/auth/signin" className={navLink}>
              Sign in
            </Link>
          )}
          <Link
            href={signedIn ? "/account" : "/register"}
            aria-label={signedIn ? "Your account" : "Register"}
            className={css({
              fontFamily: "body",
              fontSize: "base",
              fontWeight: "600",
              padding: "0.5rem 1.25rem",
              bg: "accent.primary",
              color: "bg.primary",
              borderRadius: "6px",
              textDecoration: "none",
              transition: "all 0.2s ease-out",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
              _hover: {
                bg: "accent.secondary",
                transform: "translateY(-1px)",
              },
              _focusVisible: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "3px" },
            })}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {signedIn ? (
                <>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </>
              ) : (
                <>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                </>
              )}
            </svg>
            {signedIn ? accountName : "Register"}
          </Link>
        </div>
      </nav>

      {/* Mobile Menu — no dropdown, there is room to list everything */}
      {isMenuOpen && (
        <div
          className={css({
            display: { base: "block", lg: "none" },
            bg: "bg.secondary",
            borderTop: "1px solid",
            borderColor: "border.light",
            padding: "1rem",
          })}
        >
          <div className={css({ display: "flex", flexDirection: "column", gap: "0.25rem" })}>
            <Link
              href="/patients"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === "/patients" ? "page" : undefined}
              className={css({
                fontFamily: "body",
                fontSize: "base",
                fontWeight: "500",
                color: "text.primary",
                textDecoration: "none",
                padding: "0.6rem 0.5rem",
                borderRadius: "6px",
                _hover: { color: "accent.secondary" },
              })}
            >
              For Patients
            </Link>
            <Link
              href="/providers"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === "/providers" ? "page" : undefined}
              className={css({
                fontFamily: "body",
                fontSize: "base",
                fontWeight: "500",
                color: "text.primary",
                textDecoration: "none",
                padding: "0.6rem 0.5rem",
                borderRadius: "6px",
                _hover: { color: "accent.secondary" },
              })}
            >
              For Providers
            </Link>

            <p
              className={css({
                fontFamily: "body",
                fontSize: "xs",
                fontWeight: "600",
                color: "text.muted",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "0.9rem 0.5rem 0.35rem",
                borderTop: "1px solid",
                borderColor: "border.light",
                marginTop: "0.5rem",
              })}
            >
              More
            </p>

            {MORE_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsMenuOpen(false)}
                aria-current={pathname === l.href ? "page" : undefined}
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  textDecoration: "none",
                  padding: "0.6rem 0.5rem",
                  borderRadius: "6px",
                  _hover: { color: "accent.secondary" },
                })}
              >
                {l.label}
              </Link>
            ))}

            {!signedIn && (
              <Link
                href="/auth/signin"
                onClick={() => setIsMenuOpen(false)}
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  textDecoration: "none",
                  padding: "0.6rem 0.5rem",
                  borderRadius: "6px",
                  borderTop: "1px solid",
                  borderColor: "border.light",
                  marginTop: "0.5rem",
                  paddingTop: "0.9rem",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Sign in
              </Link>
            )}
            <Link
              href={signedIn ? "/account" : "/register"}
              aria-label={signedIn ? "Your account" : "Register"}
              onClick={() => setIsMenuOpen(false)}
              className={css({
                fontFamily: "body",
                fontSize: "base",
                fontWeight: "600",
                padding: "0.75rem 1.25rem",
                bg: "accent.primary",
                color: "bg.primary",
                borderRadius: "6px",
                textDecoration: "none",
                marginTop: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                _hover: { bg: "accent.secondary" },
              })}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {signedIn ? (
                  <>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </>
                ) : (
                  <>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 7 10-7" />
                  </>
                )}
              </svg>
              {signedIn ? accountName : "Register"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
