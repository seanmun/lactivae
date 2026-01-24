import { css } from "../../../styled-system/css";
import Link from "next/link";

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
              <div
                className={css({
                  fontFamily: "mono",
                  fontSize: "4xl",
                  fontWeight: "700",
                  color: "accent.secondary",
                  marginBottom: "0.5rem",
                })}
              >
                42%
              </div>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  lineHeight: "1.6",
                })}
              >
                Reduction in asthma risk in children consuming raw milk
              </p>
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
              <div
                className={css({
                  fontFamily: "mono",
                  fontSize: "4xl",
                  fontWeight: "700",
                  color: "accent.secondary",
                  marginBottom: "0.5rem",
                })}
              >
                147%
              </div>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  lineHeight: "1.6",
                })}
              >
                Higher omega-3 fatty acid content in grass-fed raw milk
              </p>
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
              <div
                className={css({
                  fontFamily: "mono",
                  fontSize: "4xl",
                  fontWeight: "700",
                  color: "accent.secondary",
                  marginBottom: "0.5rem",
                })}
              >
                63%
              </div>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  lineHeight: "1.6",
                })}
              >
                Lifespan extension in C. elegans model organism
              </p>
            </div>
          </div>
        </section>

        {/* Respiratory Health */}
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
              Large-scale European study examining 8,334 children found significant protective effects of raw milk consumption:
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
              <li>42% reduction in asthma risk (OR 0.58, 95% CI 0.48-0.71)</li>
              <li>49% reduction in hay fever risk (OR 0.51, 95% CI 0.37-0.69)</li>
              <li>Protective effect remained significant after adjusting for farm exposure and other confounders</li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              Waser M, et al. "Inverse association of farm milk consumption with asthma and allergy in rural and suburban populations across Europe."
              Clinical & Experimental Allergy. 2007;37(5):661-670.
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
              Study of 14,893 children demonstrated that early-life raw milk consumption was associated with:
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
              <li>Lower prevalence of asthma and atopic sensitization</li>
              <li>Protective effect strongest when consumption began in first year of life</li>
              <li>Dose-dependent relationship observed</li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              Riedler J, et al. "Exposure to farming in early life and development of asthma and allergy: a cross-sectional survey."
              Lancet. 2001;358(9288):1129-1133.
            </p>
          </div>
        </section>

        {/* Nutritional Composition */}
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
              Research comparing grass-fed to conventional dairy:
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
              <li>147% higher omega-3 fatty acid content in grass-fed milk</li>
              <li>Better omega-6 to omega-3 ratio (2.5:1 vs 5.7:1)</li>
              <li>62% higher conjugated linoleic acid (CLA) content</li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              Benbrook CM, et al. "Enhancing the fatty acid profile of milk through forage-based rations, with nutrition modeling of diet outcomes."
              Food Science & Nutrition. 2018;6(3):681-700.
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
              Pasteurization effects on bioactive compounds:
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
              <li>Vitamin C reduced by up to 25%</li>
              <li>Vitamin B12 reduced by 7-10%</li>
              <li>Native enzymes (lactase, lipase) largely inactivated</li>
              <li>Immunoglobulins (IgG, IgA) reduced by 20-30%</li>
              <li>Whey protein denaturation varies by heat treatment intensity</li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              Claeys WL, et al. "Raw or heated cow milk consumption: Review of risks and benefits."
              Food Control. 2013;31(1):251-262.
            </p>
          </div>
        </section>

        {/* Longevity Research */}
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
              Research using <em>Caenorhabditis elegans</em> (nematode worm) as a model organism:
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
              <li>63% increase in mean lifespan with raw milk supplementation</li>
              <li>Enhanced stress resistance and thermotolerance</li>
              <li>Upregulation of longevity-associated genes (DAF-16/FOXO pathway)</li>
              <li>Increased autophagy markers</li>
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
              Kim J, et al. "Cow milk bioactive compounds improve healthspan in Caenorhabditis elegans."
              Journal of Dairy Science. 2019;102(4):2926-2937.
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
          </div>
        </section>
      </div>
    </>
  );
}
