import { css } from "../../../styled-system/css";
import Link from "next/link";
import Claim from "@/components/governed/Claim";
import Cite from "@/components/governed/Cite";

export const metadata = {
  title: "Clinical Studies - LACTIVAE™ Research Data",
  description: "Peer-reviewed research and clinical studies on raw milk consumption, nutritional benefits, and health outcomes.",
};

export default function StudiesPage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className={css({
          position: "relative",
          padding: "4rem 2rem",
          borderBottom: "1px solid",
          borderColor: "border.light",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        })}
      >
        {/* Background Image */}
        <div
          className={css({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/lab-milk.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
            zIndex: 0,
          })}
        />

        <div
          className={css({
            position: "relative",
            zIndex: 1,
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
            Clinical Research & Studies
          </h1>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "xl",
              color: "text.secondary",
              lineHeight: "1.6",
            })}
          >
            Peer-reviewed research on raw milk consumption and health outcomes
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
        {/* Key Findings Overview */}
        <section
          data-component="key-findings"
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
              marginBottom: "2rem",
            })}
          >
            Key Research Findings
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
                bg: "bg.tertiary",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "border.light",
              })}
            >
              <Claim
                id="studies-kf-asthma-42"
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
                  lineHeight: "1.6",
                })}
              />
            </div>

            <div
              className={css({
                padding: "2rem",
                bg: "bg.tertiary",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "border.light",
              })}
            >
              <Claim
                id="studies-kf-omega3-147"
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
                  lineHeight: "1.6",
                })}
              />
            </div>

            <div
              className={css({
                padding: "2rem",
                bg: "bg.tertiary",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "border.light",
              })}
            >
              <Claim
                id="studies-kf-lifespan-63"
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
                  lineHeight: "1.6",
                })}
              />
            </div>
          </div>
        </section>

        {/* Respiratory Health */}
        <section
          data-component="respiratory"
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
              marginBottom: "2rem",
            })}
          >
            Respiratory Health & Allergies
          </h2>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
              marginBottom: "2rem",
            })}
          >
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              GABRIELA Study (2011)
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              <Claim id="gabriela-design" />
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                marginBottom: "1rem",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <Claim id="gabriela-asthma-41" as="li" />
              <Claim id="gabriela-hayfever-49" as="li" />
              <Claim id="gabriela-independent" as="li" />
              <Claim id="gabriela-whey" as="li" />
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              <Cite k="loss-2011" />
            </p>
          </div>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
            })}
          >
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              PARSIFAL Study
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              <Claim id="parsifal-design" />
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                marginBottom: "1rem",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <Claim id="parsifal-asthma-26" as="li" />
              <Claim id="parsifal-rhino-44" as="li" />
              <Claim id="parsifal-independent" as="li" />
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              <Cite k="waser-2007" />
            </p>
          </div>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
              marginTop: "2rem",
            })}
          >
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              PASTURE Birth Cohort (2015)
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              <Claim id="pasture-design" />
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                marginBottom: "1rem",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <Claim id="pasture-infections-or" as="li" />
              <Claim id="pasture-30" as="li" />
              <Claim id="pasture-crp" as="li" />
              <Claim id="pasture-boiled" as="li" />
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              <Cite k="loss-2015" />
            </p>
          </div>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
              marginTop: "2rem",
            })}
          >
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              Meta-Analysis of Farm Milk Studies (2020)
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              <Claim id="meta-design" />
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                marginBottom: "1rem",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <Claim id="meta-asthma-42" as="li" />
              <Claim id="meta-other-outcomes" as="li" />
              <Claim id="meta-rural-independent" as="li" />
              <Claim id="meta-discouraged" as="li" />
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              <Cite k="brick-2020" />
            </p>
          </div>
        </section>

        {/* Nutritional Composition */}
        <section
          data-component="composition"
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
              marginBottom: "2rem",
            })}
          >
            Nutritional Composition
          </h2>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
              marginBottom: "2rem",
            })}
          >
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              Omega-3 Fatty Acids
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              <Claim id="benbrook-design" />
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                marginBottom: "1rem",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <Claim id="benbrook-omega3-147" as="li" />
              <Claim id="benbrook-ratio" as="li" />
              <Claim id="benbrook-cla-126" as="li" />
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              <Cite k="benbrook-2018" />
            </p>
          </div>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
            })}
          >
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              Heat-Sensitive Nutrients
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              What systematic reviews and controlled studies show pasteurization does and does not change:
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                marginBottom: "1rem",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <Claim id="heat-vitamins" as="li" />
              <Claim id="heat-minerals" as="li" />
              <Claim id="heat-enzymes" as="li" />
              <Claim id="heat-immunoglobulins" as="li" />
              <Claim id="heat-lactoferrin" as="li" />
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              <Cite k="claeys-2013" /> <Cite k="macdonald-2011" short /> <Cite k="peila-2016" short /> <Cite k="haas-2025" short />
            </p>
          </div>
        </section>

        {/* Longevity Research */}
        <section
          data-component="longevity"
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
              marginBottom: "2rem",
            })}
          >
            Longevity & Aging Research
          </h2>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
            })}
          >
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              C. elegans Model Studies
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              <Claim id="celegans-design" />
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                marginBottom: "1rem",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <Claim id="celegans-63" as="li" />
              <Claim id="celegans-daf16" as="li" />
              <Claim id="celegans-oxidative" as="li" />
              <Claim id="celegans-ros" as="li" />
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              <strong>Note:</strong> These findings are from basic research models and have not been validated in human studies.
              C. elegans has a lifespan of approximately 2-3 weeks, and results may not translate to mammals.
            </p>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              <Cite k="cardin-2021" />
            </p>
          </div>
        </section>

        {/* Important Disclaimer */}
        <section
          className={css({
            padding: "2rem",
            bg: "accent.primary",
            color: "bg.primary",
            borderRadius: "8px",
            marginBottom: "4rem",
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
            Research Limitations & Disclaimer
          </h2>
          <div
            className={css({
              fontFamily: "body",
              fontSize: "base",
              lineHeight: "1.6",
              "& p": {
                marginBottom: "1rem",
              },
            })}
          >
            <p>
              <strong>Important:</strong> While the research cited above represents peer-reviewed scientific studies,
              it's crucial to understand the limitations and context:
            </p>
            <ul
              className={css({
                paddingLeft: "2rem",
                listStyleType: "disc",
                marginBottom: "1rem",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <li>Observational studies cannot prove causation</li>
              <li>Many studies have confounding variables (farm exposure, lifestyle factors)</li>
              <li>Animal model results may not translate to humans</li>
              <li>Individual health risks can outweigh potential benefits</li>
              <li>Raw milk carries well-documented microbiological risks</li>
            </ul>
            <p>
              The FDA, CDC, and major medical organizations do not recommend raw milk consumption due to safety concerns.
              Always consult qualified healthcare providers before making dietary changes.
            </p>
          </div>
        </section>

        {/* Additional Resources */}
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
            Learn More
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
              href="/safety"
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
              Safety Information
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
              About This Project
            </Link>
            <Link
              href="/references"
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
              All References
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
