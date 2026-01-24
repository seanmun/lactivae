"use client";

import { css } from "../../../styled-system/css";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={css({
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
          animation: "fadeIn 0.2s ease-out",
        })}
      />

      {/* Chat Widget */}
      <div
        className={css({
          position: "fixed",
          bottom: { base: "1rem", md: "2rem" },
          right: { base: "1rem", md: "2rem" },
          width: { base: "calc(100% - 2rem)", sm: "400px" },
          maxWidth: "400px",
          bg: "bg.primary",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          zIndex: 1001,
          overflow: "hidden",
          animation: "slideInFromBottom 0.3s ease-out",
        })}
      >
        {/* Header */}
        <div
          className={css({
            padding: "1rem 1.5rem",
            bg: "accent.primary",
            color: "bg.primary",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          })}
        >
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            })}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div>
              <h3
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  fontWeight: "600",
                })}
              >
                LACTIVAE™ Chat
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className={css({
              padding: "0.25rem",
              bg: "transparent",
              border: "none",
              color: "bg.primary",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              _hover: {
                opacity: 0.8,
              },
            })}
            aria-label="Close chat"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
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

        {/* Body - Coming Soon */}
        <div
          className={css({
            padding: "2rem 1.5rem",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          })}
        >
          <div
            className={css({
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              bg: "bg.tertiary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            })}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={css({
                color: "accent.primary",
              })}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          <h4
            className={css({
              fontFamily: "heading",
              fontSize: "xl",
              fontWeight: "700",
              color: "accent.primary",
              marginBottom: "0.75rem",
            })}
          >
            Live Chat Coming Soon!
          </h4>

          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              lineHeight: "1.6",
              marginBottom: "1.5rem",
            })}
          >
            We're working on bringing you live support to answer your questions about LACTIVAE™, raw milk research,
            and more.
          </p>

          <div
            className={css({
              width: "100%",
              padding: "1rem",
              bg: "bg.secondary",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "border.light",
            })}
          >
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.secondary",
                lineHeight: "1.6",
              })}
            >
              <strong>In the meantime:</strong>
              <br />
              • Check out our <a href="/patients" className={css({ color: "accent.primary", textDecoration: "underline" })}>FAQ page</a>
              <br />
              • Email us at{" "}
              <a href="mailto:support@lactivae.com" className={css({ color: "accent.primary", textDecoration: "underline" })}>
                support@lactivae.com
              </a>
              <br />• Explore our <a href="/studies" className={css({ color: "accent.primary", textDecoration: "underline" })}>research</a> section
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
