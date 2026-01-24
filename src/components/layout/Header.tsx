"use client";

import Link from "next/link";
import { css } from "../../../styled-system/css";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: { base: "center", md: "space-between" },
          position: "relative",
        })}
      >
        {/* Mobile Menu Button - Left */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={css({
            display: { base: "block", md: "none" },
            position: "absolute",
            left: "1rem",
            padding: "0.5rem",
            color: "accent.primary",
            cursor: "pointer",
            bg: "transparent",
            border: "none",
          })}
          aria-label="Toggle menu"
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

        {/* Logo - Center on mobile, Left on desktop */}
        <Link
          href="/"
          className={css({
            textDecoration: "none",
            _hover: {
              "& > div > span:first-of-type": {
                color: "accent.secondary",
              },
            },
          })}
        >
          <div
            className={css({
              lineHeight: "1",
            })}
          >
            <span
              className={css({
                fontFamily: "heading",
                fontSize: "2xl",
                fontWeight: "700",
                color: "accent.primary",
                display: "block",
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
                letterSpacing: "-0.01em",
              })}
            >
              (raw milk, oral solution)
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          className={css({
            display: { base: "none", md: "flex" },
            gap: "2rem",
            alignItems: "center",
          })}
        >
          <Link
            href="/studies"
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              textDecoration: "none",
              _hover: {
                color: "accent.secondary",
              },
            })}
          >
            Clinical Studies
          </Link>
          <Link
            href="/nutritional-data"
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              textDecoration: "none",
              _hover: {
                color: "accent.secondary",
              },
            })}
          >
            Nutritional Data
          </Link>
          <Link
            href="/patients"
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              textDecoration: "none",
              _hover: {
                color: "accent.secondary",
              },
            })}
          >
            For Patients
          </Link>
          <Link
            href="/providers"
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              textDecoration: "none",
              _hover: {
                color: "accent.secondary",
              },
            })}
          >
            For Providers
          </Link>
          <Link
            href="/register"
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
              _hover: {
                bg: "accent.secondary",
                transform: "translateY(-1px)",
              },
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
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 7 10-7" />
            </svg>
            Register
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={css({
            display: { base: "block", md: "none" },
            bg: "bg.secondary",
            borderTop: "1px solid",
            borderColor: "border.light",
            padding: "1rem",
          })}
        >
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            })}
          >
            <Link
              href="/studies"
              onClick={() => setIsMenuOpen(false)}
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                textDecoration: "none",
                padding: "0.5rem",
                _hover: {
                  color: "accent.secondary",
                },
              })}
            >
              Clinical Studies
            </Link>
            <Link
              href="/nutritional-data"
              onClick={() => setIsMenuOpen(false)}
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                textDecoration: "none",
                padding: "0.5rem",
                _hover: {
                  color: "accent.secondary",
                },
              })}
            >
              Nutritional Data
            </Link>
            <Link
              href="/patients"
              onClick={() => setIsMenuOpen(false)}
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                textDecoration: "none",
                padding: "0.5rem",
                _hover: {
                  color: "accent.secondary",
                },
              })}
            >
              For Patients
            </Link>
            <Link
              href="/providers"
              onClick={() => setIsMenuOpen(false)}
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                textDecoration: "none",
                padding: "0.5rem",
                _hover: {
                  color: "accent.secondary",
                },
              })}
            >
              For Providers
            </Link>
            <Link
              href="/register"
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
                marginTop: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                _hover: {
                  bg: "accent.secondary",
                },
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
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7 10-7" />
              </svg>
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
