"use client";

import { useState, useEffect } from "react";
import { css } from "../../../styled-system/css";

type FontSize = "small" | "default" | "large" | "xlarge";
type LineSpacing = "default" | "relaxed" | "loose";
type Theme = "light" | "dark" | "system";

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("default");
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>("default");
  const [theme, setTheme] = useState<Theme>("light");
  const [reduceMotion, setReduceMotion] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize") as FontSize;
    const savedLineSpacing = localStorage.getItem("lineSpacing") as LineSpacing;
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedReduceMotion = localStorage.getItem("reduceMotion") === "true";

    if (savedFontSize) setFontSize(savedFontSize);
    if (savedLineSpacing) setLineSpacing(savedLineSpacing);
    if (savedTheme) setTheme(savedTheme);
    setReduceMotion(savedReduceMotion);
  }, []);

  // Apply font size changes
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes = {
      small: "90%",
      default: "100%",
      large: "115%",
      xlarge: "130%",
    };

    root.style.fontSize = fontSizes[fontSize];
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // Apply line spacing changes
  useEffect(() => {
    const root = document.documentElement;
    const lineSpacings = {
      default: "1.6",
      relaxed: "1.8",
      loose: "2.0",
    };

    root.style.setProperty("--line-height", lineSpacings[lineSpacing]);
    localStorage.setItem("lineSpacing", lineSpacing);
  }, [lineSpacing]);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.setAttribute("data-theme", systemPreference);
    } else {
      root.setAttribute("data-theme", theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Apply reduce motion changes
  useEffect(() => {
    const root = document.documentElement;

    if (reduceMotion) {
      root.setAttribute("data-reduce-motion", "true");
      // Disable all animations and transitions
      root.style.setProperty("--animation-duration", "0.01ms");
      root.style.setProperty("--transition-duration", "0.01ms");
    } else {
      root.removeAttribute("data-reduce-motion");
      root.style.removeProperty("--animation-duration");
      root.style.removeProperty("--transition-duration");
    }

    localStorage.setItem("reduceMotion", reduceMotion.toString());
  }, [reduceMotion]);

  const resetAll = () => {
    setFontSize("default");
    setLineSpacing("default");
    setTheme("light");
    setReduceMotion(false);
    localStorage.removeItem("fontSize");
    localStorage.removeItem("lineSpacing");
    localStorage.removeItem("theme");
    localStorage.removeItem("reduceMotion");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={css({
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 60,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          bg: "accent.primary",
          color: "bg.primary",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s ease-out",
          _hover: {
            transform: "scale(1.05)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        })}
        aria-label="Accessibility Settings"
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
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m6.36 6.36l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m6.36-6.36l4.24-4.24" />
        </svg>
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className={css({
              position: "fixed",
              inset: 0,
              bg: "rgba(0, 0, 0, 0.3)",
              zIndex: 59,
            })}
          />

          {/* Panel */}
          <div
            className={css({
              position: "fixed",
              top: "80px",
              right: "20px",
              zIndex: 60,
              bg: "bg.primary",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              padding: "1.5rem",
              width: "320px",
              maxHeight: "80vh",
              overflowY: "auto",
              border: "1px solid",
              borderColor: "border.medium",
            })}
          >
            {/* Header */}
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              })}
            >
              <h3
                className={css({
                  fontFamily: "body",
                  fontSize: "lg",
                  fontWeight: "600",
                  color: "accent.primary",
                })}
              >
                Accessibility
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className={css({
                  bg: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "text.muted",
                  padding: "0.25rem",
                  _hover: {
                    color: "text.primary",
                  },
                })}
                aria-label="Close accessibility settings"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Theme Section */}
            <section
              className={css({
                marginBottom: "1.5rem",
              })}
            >
              <label
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  fontWeight: "600",
                  color: "text.primary",
                  marginBottom: "0.5rem",
                  display: "block",
                })}
              >
                Theme
              </label>
              <div
                className={css({
                  display: "flex",
                  gap: "0.5rem",
                })}
              >
                {(["light", "dark", "system"] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={css({
                      flex: "1",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: theme === t ? "accent.primary" : "border.light",
                      bg: theme === t ? "accent.primary" : "transparent",
                      color: theme === t ? "bg.primary" : "text.secondary",
                      cursor: "pointer",
                      fontFamily: "body",
                      fontSize: "xs",
                      textTransform: "capitalize",
                      transition: "all 0.2s ease-out",
                      _hover: {
                        borderColor: "accent.primary",
                      },
                    })}
                  >
                    {t === "light" && "☀️"}
                    {t === "dark" && "🌙"}
                    {t === "system" && "💻"}
                    <br />
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {/* Font Size Section */}
            <section
              className={css({
                marginBottom: "1.5rem",
              })}
            >
              <label
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  fontWeight: "600",
                  color: "text.primary",
                  marginBottom: "0.5rem",
                  display: "block",
                })}
              >
                Font Size
              </label>
              <div
                className={css({
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.5rem",
                })}
              >
                {(["small", "default", "large", "xlarge"] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={css({
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: fontSize === size ? "accent.primary" : "border.light",
                      bg: fontSize === size ? "accent.primary" : "transparent",
                      color: fontSize === size ? "bg.primary" : "text.secondary",
                      cursor: "pointer",
                      fontFamily: "body",
                      fontSize: size === "small" ? "xs" : size === "xlarge" ? "lg" : "sm",
                      fontWeight: "600",
                      transition: "all 0.2s ease-out",
                      _hover: {
                        borderColor: "accent.primary",
                      },
                    })}
                  >
                    A
                  </button>
                ))}
              </div>
            </section>

            {/* Line Spacing Section */}
            <section
              className={css({
                marginBottom: "1.5rem",
              })}
            >
              <label
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  fontWeight: "600",
                  color: "text.primary",
                  marginBottom: "0.5rem",
                  display: "block",
                })}
              >
                Line Spacing
              </label>
              <div
                className={css({
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.5rem",
                })}
              >
                {(["default", "relaxed", "loose"] as LineSpacing[]).map((spacing) => (
                  <button
                    key={spacing}
                    onClick={() => setLineSpacing(spacing)}
                    className={css({
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: lineSpacing === spacing ? "accent.primary" : "border.light",
                      bg: lineSpacing === spacing ? "accent.primary" : "transparent",
                      color: lineSpacing === spacing ? "bg.primary" : "text.secondary",
                      cursor: "pointer",
                      fontFamily: "body",
                      fontSize: "xs",
                      textTransform: "capitalize",
                      transition: "all 0.2s ease-out",
                      _hover: {
                        borderColor: "accent.primary",
                      },
                    })}
                  >
                    {spacing === "default" && "1x"}
                    {spacing === "relaxed" && "1.25x"}
                    {spacing === "loose" && "1.5x"}
                  </button>
                ))}
              </div>
            </section>

            {/* Reduce Motion Section */}
            <section
              className={css({
                marginBottom: "1.5rem",
              })}
            >
              <label
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  fontWeight: "600",
                  color: "text.primary",
                  marginBottom: "0.5rem",
                  display: "block",
                })}
              >
                Reduce Motion
              </label>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={css({
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: reduceMotion ? "accent.primary" : "border.light",
                  bg: reduceMotion ? "accent.primary" : "transparent",
                  color: reduceMotion ? "bg.primary" : "text.secondary",
                  cursor: "pointer",
                  fontFamily: "body",
                  fontSize: "sm",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s ease-out",
                  _hover: {
                    borderColor: "accent.primary",
                  },
                })}
              >
                {reduceMotion ? "✓ " : ""}
                {reduceMotion ? "Motion Reduced" : "Enable Reduced Motion"}
              </button>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "xs",
                  color: "text.muted",
                  marginTop: "0.5rem",
                  lineHeight: "1.4",
                })}
              >
                Disables animations and auto-playing videos
              </p>
            </section>

            {/* Reset Button */}
            <button
              onClick={resetAll}
              className={css({
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: "border.medium",
                bg: "transparent",
                color: "text.primary",
                cursor: "pointer",
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "500",
                transition: "all 0.2s ease-out",
                _hover: {
                  bg: "bg.tertiary",
                  borderColor: "accent.primary",
                },
              })}
            >
              Reset to Defaults
            </button>
          </div>
        </>
      )}
    </>
  );
}
