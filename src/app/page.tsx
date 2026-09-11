import Link from "next/link";
import { css } from "../../styled-system/css";
import Claim, { governedAttrs } from "@/components/governed/Claim";
import Safety from "@/components/governed/Safety";
import Ref from "@/components/ui/Ref";
import { getClaim } from "@/data/claims";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section
        data-component="hero"
        className={css({
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          overflow: "hidden",
          bg: "bg.secondary",
        })}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className={css({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          })}
        >
          <source src="/milk-bg.mp4" type="video/mp4" />
        </video>

        {/* Hero Content */}
        <div
          className={css({
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "900px",
            padding: "4rem 2rem",
          })}
        >
          <div
            className={css({
              lineHeight: "1",
              marginBottom: "1.5rem",
            })}
          >
            <h1
              className={css({
                fontFamily: "heading",
                fontSize: "5xl",
                fontWeight: "700",
                color: "accent.primary",
                lineHeight: "1",
                marginBottom: "0.25rem",
              })}
            >
              LACTIVAE™
            </h1>

            <p
              className={css({
                fontFamily: "body",
                fontSize: "lg",
                color: "text.muted",
                lineHeight: "1.2",
                marginTop: "0.25rem",
                fontWeight: "300",
                letterSpacing: "-0.01em",
              })}
            >
              (raw milk, oral solution)
            </p>
          </div>

          <p
            className={css({
              fontFamily: "body",
              fontSize: "2xl",
              color: "text.primary",
              marginBottom: "3rem",
              lineHeight: "1.4",
            })}
          >
            Traditional nutrition backed by modern research
          </p>

          {/* Key Benefits Cards */}
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
              gap: "1.5rem",
              marginBottom: "3rem",
              maxWidth: "900px",
            })}
          >
            <div
              className={css({
                padding: "1.5rem",
                bg: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "border.light",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              })}
            >
              <Claim
                id="hero-asthma-42"
                variant="stat"
                headlineClassName={css({
                  fontFamily: "mono",
                  fontSize: "3xl",
                  fontWeight: "700",
                  color: "accent.secondary",
                  marginBottom: "0.5rem",
                })}
                textClassName={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.secondary",
                })}
              />
            </div>

            <div
              className={css({
                padding: "1.5rem",
                bg: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "border.light",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              })}
            >
              <Claim
                id="hero-omega3-147"
                variant="stat"
                headlineClassName={css({
                  fontFamily: "mono",
                  fontSize: "3xl",
                  fontWeight: "700",
                  color: "accent.secondary",
                  marginBottom: "0.5rem",
                })}
                textClassName={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.secondary",
                })}
              />
            </div>

            <div
              className={css({
                padding: "1.5rem",
                bg: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "border.light",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              })}
            >
              <Claim
                id="hero-respiratory-30"
                variant="stat"
                headlineClassName={css({
                  fontFamily: "mono",
                  fontSize: "3xl",
                  fontWeight: "700",
                  color: "accent.secondary",
                  marginBottom: "0.5rem",
                })}
                textClassName={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.secondary",
                })}
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className={css({
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            })}
          >
            <Link
              href="/studies"
              className={css({
                fontFamily: "body",
                fontSize: "base",
                fontWeight: "600",
                padding: "1rem 2rem",
                bg: "accent.primary",
                color: "bg.primary",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "all 0.2s ease-out",
                _hover: {
                  bg: "accent.secondary",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              })}
            >
              View Clinical Studies
            </Link>
            <Link
              href="/about"
              className={css({
                fontFamily: "body",
                fontSize: "base",
                fontWeight: "600",
                padding: "1rem 2rem",
                bg: "transparent",
                color: "accent.primary",
                border: "2px solid",
                borderColor: "accent.primary",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "all 0.2s ease-out",
                _hover: {
                  bg: "accent.primary",
                  color: "bg.primary",
                  transform: "translateY(-2px)",
                },
              })}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div
        className={css({
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 2rem",
        })}
      >
        {/* Key Statistics Section */}
        <section
          data-component="benefits"
          className={css({
            marginBottom: "4rem",
          })}
        >
          <h2
            className={css({
              fontFamily: "heading",
              fontSize: "3xl",
              fontWeight: "700",
              color: "accent.primary",
              textAlign: "center",
              marginBottom: "3rem",
            })}
          >
            Research-Backed Benefits
          </h2>

          <div
            className={css({
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
              gap: "2rem",
            })}
          >
            <div
              className={css({
                padding: "2rem",
                bg: "bg.secondary",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "border.light",
                textAlign: "center",
                transition: "all 0.2s ease-out",
                _hover: {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              })}
            >
              <Claim
                id="benefit-asthma-meta-or"
                variant="stat"
                headlineClassName={css({
                  fontFamily: "mono",
                  fontSize: "4xl",
                  fontWeight: "700",
                  color: "accent.secondary",
                  marginBottom: "0.5rem",
                })}
                textClassName={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                })}
              />
            </div>

            <div
              className={css({
                padding: "2rem",
                bg: "bg.secondary",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "border.light",
                textAlign: "center",
                transition: "all 0.2s ease-out",
                _hover: {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              })}
            >
              <Claim
                id="benefit-omega3-vs-conventional"
                variant="stat"
                headlineClassName={css({
                  fontFamily: "mono",
                  fontSize: "4xl",
                  fontWeight: "700",
                  color: "accent.secondary",
                  marginBottom: "0.5rem",
                })}
                textClassName={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                })}
              />
            </div>

            <div
              className={css({
                padding: "2rem",
                bg: "bg.secondary",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "border.light",
                textAlign: "center",
                transition: "all 0.2s ease-out",
                _hover: {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              })}
            >
              <Claim
                id="benefit-lifespan-celegans-63"
                variant="stat"
                headlineClassName={css({
                  fontFamily: "mono",
                  fontSize: "4xl",
                  fontWeight: "700",
                  color: "accent.secondary",
                  marginBottom: "0.5rem",
                })}
                textClassName={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                })}
              />
            </div>
          </div>
        </section>

        {/* Nutritional Comparison Section */}
        <section
          data-component="comparison"
          className={css({
            marginBottom: "4rem",
          })}
        >
          <h2
            className={css({
              fontFamily: "heading",
              fontSize: "3xl",
              fontWeight: "700",
              color: "accent.primary",
              textAlign: "center",
              marginBottom: "1rem",
            })}
          >
            LACTIVAE™ vs Pasteurized Milk
          </h2>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              textAlign: "center",
              marginBottom: "3rem",
              maxWidth: "800px",
              margin: "0 auto 3rem",
            })}
          >
            Selected nutrients, LACTIVAE™ versus conventional store milk.{" "}
            <Claim id="cmp-framing-fatty-acids" />{" "}
            <Claim id="cmp-framing-heat" />
          </p>

          <div
            className={css({
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0",
              marginBottom: "2rem",
              border: "2px solid",
              borderColor: "border.medium",
              borderRadius: "8px",
              overflow: "hidden",
            })}
          >
            {/* Headers */}
            <div
              className={css({
                padding: { base: "1rem", md: "1.5rem" },
                bg: "#ffffff",
                textAlign: "center",
                borderBottom: "2px solid",
                borderColor: "border.medium",
                borderRight: "2px solid",
                borderRightColor: "border.medium",
              })}
            >
              <h3
                className={css({
                  fontFamily: "heading",
                  fontSize: { base: "lg", md: "2xl" },
                  fontWeight: "700",
                  color: "accent.primary",
                })}
              >
                LACTIVAE™ (grass-fed, raw)
              </h3>
            </div>
            <div
              className={css({
                padding: { base: "1rem", md: "1.5rem" },
                bg: "bg.secondary",
                textAlign: "center",
                borderBottom: "2px solid",
                borderColor: "border.medium",
              })}
            >
              <h3
                className={css({
                  fontFamily: "heading",
                  fontSize: { base: "lg", md: "2xl" },
                  fontWeight: "700",
                  color: "text.muted",
                })}
              >
                Conventional pasteurized milk
              </h3>
            </div>

            {/* Comparison Rows — one governed claim per row */}
            <ComparisonRow claimId="cmp-omega3" index={0} />
            <ComparisonRow claimId="cmp-cla" index={1} />
            <ComparisonRow claimId="cmp-vitamin-c" index={2} />
            <ComparisonRow claimId="cmp-folate" index={3} />
            <ComparisonRow claimId="cmp-b12" index={4} />
            <ComparisonRow claimId="cmp-alp" index={5} />
            <ComparisonRow claimId="cmp-lactoferrin" index={6} />
            <ComparisonRow claimId="cmp-lab" index={7} />
          </div>

          <div
            className={css({
              textAlign: "center",
              marginTop: "2rem",
            })}
          >
            <Link
              href="/nutritional-data"
              className={css({
                fontFamily: "body",
                fontSize: "base",
                fontWeight: "600",
                color: "accent.secondary",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                _hover: {
                  textDecoration: "underline",
                },
              })}
            >
              View Complete Nutritional Data
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Savings Card Section */}
        <section
          data-component="savings"
          className={css({
            marginBottom: "4rem",
          })}
        >
          <h2
            className={css({
              fontFamily: "heading",
              fontSize: "3xl",
              fontWeight: "700",
              color: "accent.primary",
              textAlign: "center",
              marginBottom: "1rem",
            })}
          >
            LACTIVAE™ Savings Card
          </h2>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              textAlign: "center",
              marginBottom: "3rem",
              maxWidth: "700px",
              margin: "0 auto 3rem",
            })}
          >
            Save on premium raw milk from our partner distributors
          </p>

          <div
            className={css({
              maxWidth: "600px",
              margin: "0 auto",
              aspectRatio: "1.586 / 1",
              bg: "linear-gradient(135deg, #8B6F47 0%, #A8896D 100%)",
              borderRadius: "16px",
              padding: { base: "1.75rem", md: "2.5rem" },
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
            })}
          >
            {/* Decorative Pattern */}
            <div
              className={css({
                position: "absolute",
                top: 0,
                right: 0,
                width: "250px",
                height: "250px",
                opacity: 0.08,
                background: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              })}
            />

            <div
              className={css({
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              })}
            >
              {/* Card Header */}
              <div
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "auto",
                })}
              >
                <div>
                  <div
                    className={css({
                      fontFamily: "heading",
                      fontSize: { base: "xl", md: "2xl" },
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: "0.25rem",
                    })}
                  >
                    LACTIVAE™
                  </div>
                  <div
                    className={css({
                      fontFamily: "body",
                      fontSize: { base: "xs", md: "sm" },
                      color: "rgba(255, 255, 255, 0.9)",
                    })}
                  >
                    Premium Raw Milk Savings
                  </div>
                </div>
                <div
                  className={css({
                    bg: "#ffffff",
                    color: "accent.primary",
                    padding: { base: "0.5rem 1rem", md: "0.75rem 1.25rem" },
                    borderRadius: "6px",
                    fontFamily: "heading",
                    fontSize: { base: "lg", md: "xl" },
                    fontWeight: "700",
                  })}
                >
                  10% OFF
                </div>
              </div>

              {/* Promo Code - Middle */}
              <div
                className={css({
                  marginTop: "auto",
                  marginBottom: "1.5rem",
                })}
              >
                <div
                  className={css({
                    fontFamily: "body",
                    fontSize: { base: "xs", md: "sm" },
                    color: "rgba(255, 255, 255, 0.8)",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  })}
                >
                  Promo Code
                </div>
                <div
                  className={css({
                    fontFamily: "mono",
                    fontSize: { base: "xl", md: "2xl" },
                    fontWeight: "700",
                    color: "#ffffff",
                    textAlign: "center",
                    letterSpacing: "0.15em",
                    padding: "1rem",
                    bg: "rgba(0, 0, 0, 0.15)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  })}
                >
                  LACTIVAE2026
                </div>
              </div>

              {/* Bottom CTA */}
              <div
                className={css({
                  textAlign: "center",
                })}
              >
                <Link
                  href="/register"
                  className={css({
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontFamily: "body",
                    fontSize: { base: "sm", md: "base" },
                    fontWeight: "600",
                    padding: { base: "0.65rem 1.25rem", md: "0.75rem 1.5rem" },
                    bg: "#ffffff",
                    color: "accent.primary",
                    borderRadius: "6px",
                    textDecoration: "none",
                    transition: "all 0.2s ease-out",
                    width: "100%",
                    _hover: {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                  })}
                >
                  Activate Savings Card
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
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <p
                  className={css({
                    fontFamily: "body",
                    fontSize: "xs",
                    color: "rgba(255, 255, 255, 0.6)",
                    marginTop: "1rem",
                    lineHeight: "1.3",
                  })}
                >
                  Valid at participating farms only
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Inline ISI Section */}
        <section
          data-component="isi-inline"
          className={css({
            bg: "bg.tertiary",
            border: "1px solid",
            borderColor: "border.medium",
            borderRadius: "8px",
            padding: "2rem",
            marginBottom: "4rem",
          })}
        >
          <h3
            className={css({
              fontFamily: "heading",
              fontSize: "xl",
              fontWeight: "600",
              color: "accent.primary",
              marginBottom: "1rem",
            })}
          >
            Important Safety Information
          </h3>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "sm",
              color: "text.secondary",
              lineHeight: "1.6",
              marginBottom: "1rem",
            })}
          >
            <Safety id="reg-not-fda-approved" showRefs={false} />{" "}
            <Safety id="risk-pathogens-named" />
          </p>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "sm",
              color: "text.secondary",
              lineHeight: "1.6",
              marginBottom: "1rem",
            })}
          >
            <Safety id="contra-summary" />
          </p>
          <Link
            href="#isi"
            className={css({
              fontFamily: "body",
              fontSize: "sm",
              color: "accent.secondary",
              textDecoration: "underline",
              _hover: {
                color: "accent.warm",
              },
            })}
          >
            See complete safety information below →
          </Link>
        </section>

        {/* CTA Section */}
        <section
          data-component="cta"
          className={css({
            textAlign: "center",
            padding: "3rem 0",
          })}
        >
          <h2
            className={css({
              fontFamily: "heading",
              fontSize: "3xl",
              fontWeight: "700",
              color: "accent.primary",
              marginBottom: "1.5rem",
            })}
          >
            Ready to Learn More?
          </h2>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "lg",
              color: "text.secondary",
              marginBottom: "2rem",
              maxWidth: "600px",
              margin: "0 auto 2rem",
            })}
          >
            Explore our comprehensive research database and clinical studies
          </p>
          <div
            className={css({
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            })}
          >
            <Link
              href="/patients"
              className={css({
                fontFamily: "body",
                fontSize: "base",
                fontWeight: "600",
                padding: "1rem 2rem",
                bg: "accent.primary",
                color: "bg.primary",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "all 0.2s ease-out",
                _hover: {
                  bg: "accent.secondary",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
                fontWeight: "600",
                padding: "1rem 2rem",
                bg: "transparent",
                color: "accent.primary",
                border: "2px solid",
                borderColor: "accent.primary",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "all 0.2s ease-out",
                _hover: {
                  bg: "accent.primary",
                  color: "bg.primary",
                  transform: "translateY(-2px)",
                },
              })}
            >
              For Healthcare Providers
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

/**
 * One row of the LACTIVAE™ vs conventional milk table. Every value comes from the
 * governed claim's structured data, so the table can never drift from approved copy.
 */
function ComparisonRow({ claimId, index }: { claimId: string; index: number }) {
  const claim = getClaim(claimId);
  const d = claim.data ?? {};
  const refKeys = Array.from(new Set(claim.refs.map((r) => r.key)));
  return (
    <>
      {/* Raw Milk Side */}
      <div
        {...governedAttrs(claim)}
        className={css({
          padding: { base: "0.75rem", md: "1rem 1.5rem" },
          bg: "#ffffff",
          borderBottom: index < 7 ? "1px solid" : "none",
          borderBottomColor: "border.light",
          borderRight: "2px solid",
          borderRightColor: "border.medium",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          minHeight: { base: "70px", md: "80px" },
          justifyContent: "center",
        })}
      >
        <div
          className={css({
            fontFamily: "body",
            fontSize: { base: "xs", md: "sm" },
            fontWeight: "600",
            color: "accent.primary",
          })}
        >
          {d.nutrient}
          {d.qualifier ? ` (${d.qualifier})` : ""}
          <Ref k={refKeys} />
        </div>
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "0.5rem",
          })}
        >
          <span
            className={css({
              fontFamily: "mono",
              fontSize: { base: "sm", md: "base" },
              fontWeight: "700",
              color: "text.primary",
            })}
          >
            {d.rawValue}
          </span>
          <span
            className={css({
              fontFamily: "mono",
              fontSize: { base: "xs", md: "sm" },
              fontWeight: "600",
              color: "accent.secondary",
            })}
          >
            {d.advantage}
          </span>
        </div>
      </div>

      {/* Pasteurized Side */}
      <div
        className={css({
          padding: { base: "0.75rem", md: "1rem 1.5rem" },
          bg: "bg.secondary",
          borderBottom: index < 7 ? "1px solid" : "none",
          borderBottomColor: "border.light",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          minHeight: { base: "70px", md: "80px" },
          justifyContent: "center",
        })}
      >
        <div
          className={css({
            fontFamily: "body",
            fontSize: { base: "xs", md: "sm" },
            fontWeight: "600",
            color: "text.muted",
          })}
        >
          {d.nutrient}
          {d.qualifier ? ` (${d.qualifier})` : ""}
        </div>
        <span
          className={css({
            fontFamily: "mono",
            fontSize: { base: "sm", md: "base" },
            fontWeight: "600",
            color: "text.secondary",
          })}
        >
          {d.pastValue}
        </span>
      </div>
    </>
  );
}
