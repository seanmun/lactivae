import Link from "next/link";
import { css } from "../../../styled-system/css";

export default function Footer() {
  return (
    <footer
      className={css({
        bg: "bg.tertiary",
        borderTop: "1px solid",
        borderColor: "border.medium",
        marginTop: "auto",
      })}
    >
      {/* Main Footer Content */}
      <div
        className={css({
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 2rem",
        })}
      >
        {/* Brand Section */}
        <div
          className={css({
            marginBottom: "3rem",
          })}
        >
          <h3
            className={css({
              fontFamily: "heading",
              fontSize: "2xl",
              fontWeight: "700",
              color: "accent.primary",
              marginBottom: "0.25rem",
            })}
          >
            LACTIVAE™
          </h3>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "sm",
              color: "text.muted",
              marginBottom: "0.5rem",
              fontWeight: "300",
              letterSpacing: "-0.01em",
            })}
          >
            (raw milk, oral solution)
          </p>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              maxWidth: "400px",
            })}
          >
            Traditional nutrition backed by modern research.
          </p>
        </div>

        {/* Links Grid */}
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: "2rem",
            marginBottom: "3rem",
          })}
        >
          {/* LACTIVAE Column */}
          <div>
            <h4
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "accent.primary",
                textTransform: "uppercase",
                letterSpacing: "wider",
                marginBottom: "1rem",
              })}
            >
              LACTIVAE™
            </h4>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              })}
            >
              <Link
                href="/about"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                About
              </Link>
              <Link
                href="/about#mechanism"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                How It Works
              </Link>
              <Link
                href="/studies"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Clinical Data
              </Link>
              <Link
                href="/references"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                References
              </Link>
            </div>
          </div>

          {/* For Patients Column */}
          <div>
            <h4
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "accent.primary",
                textTransform: "uppercase",
                letterSpacing: "wider",
                marginBottom: "1rem",
              })}
            >
              For Patients
            </h4>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              })}
            >
              <Link
                href="/patients"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Getting Started
              </Link>
              <Link
                href="/find"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Find LACTIVAE™
              </Link>
              <Link
                href="/faqs"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                FAQs
              </Link>
            </div>
          </div>

          {/* For Providers Column */}
          <div>
            <h4
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "accent.primary",
                textTransform: "uppercase",
                letterSpacing: "wider",
                marginBottom: "1rem",
              })}
            >
              For Providers
            </h4>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              })}
            >
              <Link
                href="/prescribing-information"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Prescribing Info
              </Link>
              <Link
                href="/medical-guide"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Medical Guide
              </Link>
              <Link
                href="/resources"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Resources
              </Link>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <h4
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "accent.primary",
                textTransform: "uppercase",
                letterSpacing: "wider",
                marginBottom: "1rem",
              })}
            >
              Legal
            </h4>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              })}
            >
              <Link
                href="/terms"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  textDecoration: "none",
                  _hover: { color: "accent.secondary" },
                })}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={css({
            borderTop: "1px solid",
            borderColor: "border.light",
            paddingTop: "2rem",
          })}
        >
          <p
            className={css({
              fontFamily: "body",
              fontSize: "xs",
              color: "text.muted",
              marginBottom: "1rem",
            })}
          >
            © 2026 LACTIVAE™. All rights reserved. This is a portfolio project.
          </p>
          <div
            className={css({
              bg: "bg.secondary",
              border: "1px solid",
              borderColor: "border.medium",
              padding: "1rem",
              borderRadius: "4px",
            })}
          >
            <p
              className={css({
                fontFamily: "body",
                fontSize: "xs",
                color: "text.secondary",
                lineHeight: "1.6",
              })}
            >
              <strong>IMPORTANT:</strong> LACTIVAE™ is not FDA approved. This
              website is for educational and portfolio purposes only. Raw milk
              carries inherent food safety risks. Consult a healthcare provider
              before making dietary changes. This site presents research data
              and does not constitute medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
