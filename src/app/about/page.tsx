import { css } from "../../../styled-system/css";
import Link from "next/link";

export const metadata = {
  title: "About LACTIVAE™ - Our Mission & Story",
  description: "Learn about LACTIVAE™ and our commitment to providing accurate, research-based information about raw milk consumption.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className={css({
          bg: "bg.secondary",
          padding: "4rem 2rem",
          borderBottom: "1px solid",
          borderColor: "border.light",
        })}
      >
        <div
          className={css({
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          })}
        >
          <h1
            className={css({
              fontFamily: "heading",
              fontSize: "4xl",
              fontWeight: "700",
              color: "accent.primary",
              marginBottom: "1rem",
            })}
          >
            About LACTIVAE™
          </h1>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "xl",
              color: "text.secondary",
              lineHeight: "1.6",
            })}
          >
            Providing comprehensive, research-based information about raw milk consumption
          </p>
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
        {/* Mission Section */}
        <section
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
              marginBottom: "1.5rem",
            })}
          >
            Our Mission
          </h2>
          <div
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              lineHeight: "1.8",
              "& p": {
                marginBottom: "1rem",
              },
            })}
          >
            <p>
              LACTIVAE™ exists to provide comprehensive, scientifically-grounded information about raw milk consumption.
              We believe that consumers deserve access to accurate research data to make informed decisions about their
              dietary choices.
            </p>
            <p>
              While we present research findings that suggest potential benefits of raw milk consumption, we acknowledge
              the serious health risks associated with unpasteurized dairy products. Our mission is to present balanced,
              evidence-based information that includes both benefits and risks.
            </p>
          </div>
        </section>

        {/* Our Approach Section */}
        <section
          className={css({
            marginBottom: "4rem",
            bg: "bg.tertiary",
            padding: "3rem",
            borderRadius: "8px",
          })}
        >
          <h2
            className={css({
              fontFamily: "heading",
              fontSize: "3xl",
              fontWeight: "700",
              color: "accent.primary",
              marginBottom: "2rem",
            })}
          >
            Our Approach
          </h2>
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
              gap: "2rem",
            })}
          >
            <div>
              <h3
                className={css({
                  fontFamily: "body",
                  fontSize: "xl",
                  fontWeight: "600",
                  color: "accent.secondary",
                  marginBottom: "1rem",
                })}
              >
                Research-Based
              </h3>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  lineHeight: "1.6",
                })}
              >
                All information presented on this site is backed by peer-reviewed scientific research.
                We cite our sources and provide links to original studies.
              </p>
            </div>

            <div>
              <h3
                className={css({
                  fontFamily: "body",
                  fontSize: "xl",
                  fontWeight: "600",
                  color: "accent.secondary",
                  marginBottom: "1rem",
                })}
              >
                Transparent
              </h3>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  lineHeight: "1.6",
                })}
              >
                We clearly communicate both the potential benefits and significant risks of raw milk consumption.
                We do not minimize or dismiss legitimate safety concerns.
              </p>
            </div>

            <div>
              <h3
                className={css({
                  fontFamily: "body",
                  fontSize: "xl",
                  fontWeight: "600",
                  color: "accent.secondary",
                  marginBottom: "1rem",
                })}
              >
                Unbiased
              </h3>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  lineHeight: "1.6",
                })}
              >
                LACTIVAE™ is a demonstration project and not affiliated with any raw milk producers,
                dairy organizations, or regulatory agencies.
              </p>
            </div>

            <div>
              <h3
                className={css({
                  fontFamily: "body",
                  fontSize: "xl",
                  fontWeight: "600",
                  color: "accent.secondary",
                  marginBottom: "1rem",
                })}
              >
                Educational
              </h3>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  lineHeight: "1.6",
                })}
              >
                Our goal is education, not promotion. We provide information to help consumers and healthcare
                providers have informed discussions about dairy choices.
              </p>
            </div>
          </div>
        </section>

        {/* Important Disclaimer Section */}
        <section
          className={css({
            marginBottom: "4rem",
            padding: "2rem",
            bg: "accent.primary",
            color: "bg.primary",
            borderRadius: "8px",
          })}
        >
          <h2
            className={css({
              fontFamily: "heading",
              fontSize: "2xl",
              fontWeight: "700",
              marginBottom: "1rem",
              color: "accent.warm",
            })}
          >
            Important Note
          </h2>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              lineHeight: "1.6",
              marginBottom: "1rem",
            })}
          >
            <strong>This is a satirical demonstration project.</strong> LACTIVAE™ is not a real pharmaceutical product.
            This website demonstrates how pharmaceutical marketing techniques could be applied to present raw milk as
            a prescription medication.
          </p>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              lineHeight: "1.6",
            })}
          >
            While the research data presented is real and cited from actual studies, raw milk is NOT FDA approved
            and carries significant health risks. Always consult with qualified healthcare providers before making
            dietary changes.
          </p>
        </section>

        {/* Learn More CTA */}
        <section
          className={css({
            textAlign: "center",
            padding: "3rem 0",
          })}
        >
          <h2
            className={css({
              fontFamily: "heading",
              fontSize: "2xl",
              fontWeight: "700",
              color: "accent.primary",
              marginBottom: "1.5rem",
            })}
          >
            Explore Our Resources
          </h2>
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
                },
              })}
            >
              View Research
            </Link>
            <Link
              href="/safety"
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
              Safety Information
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
