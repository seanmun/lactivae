"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { css } from "../../../styled-system/css";

export default function ISI() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  // Prevent body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  return (
    <>
      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className={css({
            position: "fixed",
            inset: 0,
            bg: "rgba(0, 0, 0, 0.3)",
            zIndex: 49,
            cursor: "pointer",
          })}
        />
      )}

      {/* ISI Container */}
      <div
        className={css({
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          bg: "accent.primary",
          color: "bg.primary",
          boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease-out",
          maxHeight: isExpanded ? "80vh" : "120px",
          overflow: "hidden",
        })}
      >
        {/* Header - Always visible */}
        <div
          className={css({
            maxWidth: "900px",
            margin: "0 auto",
            width: "100%",
          })}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={css({
              width: "100%",
              padding: "1rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              bg: "transparent",
              border: "none",
              color: "inherit",
              _hover: {
                bg: "rgba(255, 255, 255, 0.05)",
              },
            })}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse Important Safety Information" : "Expand Important Safety Information"}
          >
            <div
              className={css({
                display: "flex",
                alignItems: "center",
              })}
            >
              <span
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  fontWeight: "600",
                })}
              >
                Important Safety Information
              </span>
            </div>

            {/* Expand/Collapse Icon */}
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={css({
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease-out",
              })}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          {/* Preview Text - Always visible in collapsed state */}
          <div
            className={css({
              padding: "0 2rem 1rem",
              opacity: isExpanded ? 0 : 1,
              transition: "opacity 0.2s ease-out",
              pointerEvents: isExpanded ? "none" : "auto",
            })}
          >
            <p
              className={css({
                fontFamily: "body",
                fontSize: "xs",
                lineHeight: "1.5",
                color: "bg.primary",
              })}
            >
            LACTIVAE™ (raw milk, oral solution) is not FDA approved. Raw milk may contain harmful bacteria.
            Not recommended for children under 5, adults over 65, pregnant women,
            or immunocompromised individuals.{" "}
            <span
              className={css({
                textDecoration: "underline",
                cursor: "pointer",
              })}
              onClick={() => setIsExpanded(true)}
            >
              Click to read more
            </span>
          </p>
        </div>
      </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div
            className={css({
              overflowY: "auto",
              maxHeight: "calc(80vh - 64px)",
              padding: "0 2rem 2rem",
            })}
          >
            <div
              className={css({
                maxWidth: "900px",
                margin: "0 auto",
              })}
            >
              {/* Who Should NOT Consume */}
              <section
                className={css({
                  marginBottom: "1.5rem",
                })}
              >
                <h3
                  className={css({
                    fontFamily: "body",
                    fontSize: "lg",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                    color: "accent.warm",
                  })}
                >
                  WHO SHOULD NOT CONSUME LACTIVAE™
                </h3>
                <ul
                  className={css({
                    fontFamily: "body",
                    fontSize: "sm",
                    lineHeight: "1.6",
                    paddingLeft: "1.5rem",
                    listStyleType: "disc",
                    listStylePosition: "outside",
                    "& li": {
                      marginBottom: "0.5rem",
                      paddingLeft: "0.25rem",
                    },
                  })}
                >
                  <li>Children under age 5</li>
                  <li>Adults over age 65</li>
                  <li>Pregnant women</li>
                  <li>
                    People with weakened immune systems (HIV/AIDS, cancer
                    treatment, transplant recipients, immunosuppressive
                    medications)
                  </li>
                </ul>
              </section>

              {/* Potential Risks */}
              <section
                className={css({
                  marginBottom: "1.5rem",
                })}
              >
                <h3
                  className={css({
                    fontFamily: "body",
                    fontSize: "lg",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                    color: "accent.warm",
                  })}
                >
                  POTENTIAL RISKS
                </h3>
                <p
                  className={css({
                    fontFamily: "body",
                    fontSize: "sm",
                    lineHeight: "1.6",
                    marginBottom: "0.75rem",
                  })}
                >
                  Raw milk can contain harmful bacteria including{" "}
                  <em>Campylobacter</em>, <em>Salmonella</em>,{" "}
                  <em>E. coli O157:H7</em>, <em>Listeria monocytogenes</em>,
                  and others. Symptoms may include diarrhea, stomach cramping,
                  nausea, vomiting, and fever.
                </p>
                <p
                  className={css({
                    fontFamily: "body",
                    fontSize: "sm",
                    lineHeight: "1.6",
                  })}
                >
                  Serious complications, while rare, may include Hemolytic
                  Uremic Syndrome (HUS), Guillain-Barré Syndrome (GBS),
                  reactive arthritis, or miscarriage in pregnant women.
                </p>
              </section>

              {/* Risk Mitigation */}
              <section
                className={css({
                  marginBottom: "1.5rem",
                })}
              >
                <h3
                  className={css({
                    fontFamily: "body",
                    fontSize: "lg",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                    color: "accent.warm",
                  })}
                >
                  RISK MITIGATION
                </h3>
                <ul
                  className={css({
                    fontFamily: "body",
                    fontSize: "sm",
                    lineHeight: "1.6",
                    paddingLeft: "1.5rem",
                    listStyleType: "disc",
                    listStylePosition: "outside",
                    "& li": {
                      marginBottom: "0.5rem",
                      paddingLeft: "0.25rem",
                    },
                  })}
                >
                  <li>
                    Purchase only from licensed, inspected producers who test
                    regularly
                  </li>
                  <li>Keep refrigerated at 38-40°F (3-4°C) at all times</li>
                  <li>Consume within 7-10 days of production</li>
                  <li>Discard if off-odor or unusual taste</li>
                  <li>Visit the farm and understand their practices</li>
                </ul>
              </section>

              {/* Regulatory Status */}
              <section
                className={css({
                  marginBottom: "1.5rem",
                })}
              >
                <h3
                  className={css({
                    fontFamily: "body",
                    fontSize: "lg",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                    color: "accent.warm",
                  })}
                >
                  REGULATORY STATUS
                </h3>
                <p
                  className={css({
                    fontFamily: "body",
                    fontSize: "sm",
                    lineHeight: "1.6",
                  })}
                >
                  <strong>Federal:</strong> Sale of raw milk across state lines
                  is prohibited by the FDA.
                  <br />
                  <strong>State:</strong> Laws vary—legal retail sale in some
                  states, farm sales only in others, completely illegal in some.
                  <br />
                  <strong>International:</strong> Most developed countries
                  recommend against raw milk consumption.
                </p>
              </section>

              {/* Full Prescribing Information Link */}
              <div
                className={css({
                  marginTop: "2rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                })}
              >
                <Link
                  href="/prescribing-information"
                  className={css({
                    fontFamily: "body",
                    fontSize: "sm",
                    color: "accent.warm",
                    textDecoration: "underline",
                    _hover: {
                      color: "bg.primary",
                    },
                  })}
                >
                  See Full Prescribing Information →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
