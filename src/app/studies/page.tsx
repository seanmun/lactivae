import { css } from "../../../styled-system/css";
import Link from "next/link";
import Ref from "@/components/ui/Ref";

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
                Lower odds of asthma in children who consumed raw farm milk early in life (meta-analysis of 8 studies, OR 0.58)<Ref k="brick-2020" />
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
                Higher total omega-3 content in grass-fed milk than in conventional milk (a feeding effect, not a pasteurization effect)<Ref k="benbrook-2018" />
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
                Longer maximum lifespan in <em>C. elegans</em> given freeze-dried raw-milk cheese (nematode model, not a human outcome)<Ref k="cardin-2021" />
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
              Cross-sectional study of 8,334 school-aged children in rural Germany, Austria and Switzerland, with milk
              constituents measured directly in 800 household samples:<Ref k="loss-2011" />
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
              <li>41% lower odds of asthma with reported raw milk consumption (aOR 0.59, 95% CI 0.46–0.74)<Ref k="loss-2011" /></li>
              <li>49% lower odds of hay fever (aOR 0.51, 95% CI 0.37–0.69) and 26% lower odds of atopy (aOR 0.74)<Ref k="loss-2011" /></li>
              <li>Association held independent of other farm exposures; boiled farm milk showed no protective effect<Ref k="loss-2011" /></li>
              <li>Higher levels of the heat-sensitive whey proteins BSA, α-lactalbumin and β-lactoglobulin in the milk were each inversely associated with asthma<Ref k="loss-2011" /></li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              Loss G, et al. "The protective effect of farm milk consumption on childhood asthma and atopy: the GABRIELA study."
              J Allergy Clin Immunol. 2011;128(4):766-773.e4.<Ref k="loss-2011" />
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
              Cross-sectional multi-centre study of 14,893 children aged 5–13 in five European countries, comparing
              farm-produced with shop-purchased dairy:<Ref k="waser-2007" />
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
              <li>26% lower odds of asthma with farm milk consumption ever in life (aOR 0.74, 95% CI 0.61–0.88)<Ref k="waser-2007" /></li>
              <li>44% lower odds of rhinoconjunctivitis (aOR 0.56, 95% CI 0.43–0.73) and lower odds of sensitization to pollen and common foods<Ref k="waser-2007" /></li>
              <li>Observed in all four subpopulations and independent of other farm-related exposures; other farm-produced foods showed no independent association<Ref k="waser-2007" /></li>
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
              Clin Exp Allergy. 2007;37(5):661-670.<Ref k="waser-2007" />
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
              Prospective cohort of 983 rural infants in five European countries, followed with weekly health diaries
              through the first year of life (37,306 person-weeks):<Ref k="loss-2015" />
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
              <li>Versus ultra-heat-treated milk, raw milk consumption was inversely associated with rhinitis (aOR 0.71), respiratory tract infections (aOR 0.77), otitis (aOR 0.14) and fever (aOR 0.69)<Ref k="loss-2015" /></li>
              <li>The authors summarize this as roughly 30% fewer manifest respiratory infections and fever episodes<Ref k="loss-2015" /></li>
              <li>Lower C-reactive protein at 12 months (geometric mean ratio 0.66, 95% CI 0.45–0.98), consistent with a sustained anti-inflammatory effect<Ref k="loss-2015" /></li>
              <li>Boiled farm milk showed similar but weaker associations<Ref k="loss-2015" /></li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              Loss G, et al. "Consumption of unprocessed cow's milk protects infants from common respiratory infections."
              J Allergy Clin Immunol. 2015;135(1):56-62.<Ref k="loss-2015" />
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
              Pooled analysis of 8 studies (12 publications) on raw farm milk consumption between infancy and age five:<Ref k="brick-2020" />
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
              <li>42% lower odds of asthma (OR 0.58, 95% CI 0.49–0.69)<Ref k="brick-2020" /></li>
              <li>Lower odds of current wheeze (OR 0.66), hay fever or allergic rhinitis (OR 0.68) and atopic sensitization (OR 0.76)<Ref k="brick-2020" /></li>
              <li>The asthma association was present in children living in rural areas but not on farms (OR 0.60), suggesting it is independent of other farm exposures<Ref k="brick-2020" /></li>
              <li>The authors nonetheless strongly discourage raw milk consumption because of the risk of life-threatening infection, and are testing microbiologically safe, minimally processed milk in the MARTHA trial<Ref k="brick-2020" /></li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              Brick T, et al. "The beneficial effect of farm milk consumption on asthma, allergies, and infections: from meta-analysis of evidence to clinical trial."
              J Allergy Clin Immunol Pract. 2020;8(3):878-889.e3.<Ref k="brick-2020" />
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
              US-wide analysis of 1,163 milk samples over three years comparing cows on a nearly 100% forage diet with
              conventional and organic management. These differences come from what the cows ate, not from whether the
              milk was pasteurized:<Ref k="benbrook-2018" />
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
              <li>147% higher total omega-3 content in grass-fed milk (0.049 vs 0.020 g/100 g)<Ref k="benbrook-2018" /></li>
              <li>Omega-6 to omega-3 ratio of 0.95:1 in grass-fed milk versus 2.28:1 in organic and 5.77:1 in conventional milk<Ref k="benbrook-2018" /></li>
              <li>126% higher conjugated linoleic acid (CLA) content (0.043 vs 0.019 g/100 g)<Ref k="benbrook-2018" /></li>
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
              Food Sci Nutr. 2018;6(3):681-700.<Ref k="benbrook-2018" />
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
              <li>Vitamins B1, B2, C and folate significantly decreased; B6 unchanged; B12 and E decreased qualitatively. The reviewers judged the overall nutritional impact minimal because milk is not a major source of these vitamins (meta-analysis of 40 studies)<Ref k="macdonald-2011" /></li>
              <li>No significant effect on calcium, phosphorus, iron, zinc or iodine content or bioavailability<Ref k="claeys-2013" /></li>
              <li>Alkaline phosphatase completely inactivated (it is the regulatory marker of adequate pasteurization); lactoperoxidase system and lipase destroyed<Ref k="claeys-2013" /></li>
              <li>IgG, the predominant bovine immunoglobulin, is largely heat-stable under HTST (about 1% denaturation); IgA reduced roughly 20–35%; IgM destroyed<Ref k={["claeys-2013", "peila-2016"]} /></li>
              <li>Lactoferrin reduced 35–65% and IgA, IgM and enzyme activity significantly lower after commercial HTST processing<Ref k={["peila-2016", "haas-2025"]} /></li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
              })}
            >
              Claeys WL, et al. "Raw or heated cow milk consumption: review of risks and benefits."
              Food Control. 2013;31(1):251-262.<Ref k="claeys-2013" /> Macdonald LE, et al. J Food Prot. 2011;74(11):1814-1832.<Ref k="macdonald-2011" /> Peila C, et al. Nutrients. 2016;8(8):477.<Ref k="peila-2016" /> Haas J, et al. J Dairy Sci. 2025;108(1):257-271.<Ref k="haas-2025" />
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
              Research using <em>Caenorhabditis elegans</em> (nematode worm) as a model organism, fed freeze-dried raw
              goat-milk cheese and its chemical extracts:<Ref k="cardin-2021" />
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
              <li>63% increase in maximum lifespan with freeze-dried raw-milk cheese<Ref k="cardin-2021" /></li>
              <li>Activation of the insulin-like DAF-2/DAF-16 (FOXO homolog) pathway, shown with mutant strains and nuclear translocation of DAF-16<Ref k="cardin-2021" /></li>
              <li>Increased survival under oxidative stress with every extract tested<Ref k="cardin-2021" /></li>
              <li>Cheese-lipid extract and the water-soluble extract W70 reduced reactive oxygen species production in human leukocytes by 23% and 28%<Ref k="cardin-2021" /></li>
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
              Cardin G, et al. "A mechanistic study of the antiaging effect of raw-milk cheese extracts."
              Nutrients. 2021;13(3):897.<Ref k="cardin-2021" />
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
