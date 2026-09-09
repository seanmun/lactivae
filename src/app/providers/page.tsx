import { css } from "../../../styled-system/css";
import Link from "next/link";
import Ref from "@/components/ui/Ref";

export const metadata = {
  title: "For Healthcare Providers - LACTIVAE™ Professional Resources",
  description: "Clinical information and resources for healthcare professionals regarding LACTIVAE™ (raw milk, oral solution).",
};

export default function ProvidersPage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className={css({
          position: "relative",
          padding: "4rem 2rem",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          bg: "accent.primary",
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
            backgroundImage: "url('/milk-doctor.jpg')",
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
              marginBottom: "1rem",
              color: "accent.warm",
            })}
          >
            For Healthcare Providers
          </h1>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "xl",
              lineHeight: "1.6",
              color: "bg.primary",
            })}
          >
            Clinical information and patient counseling resources
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div
        className={css({
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "4rem 2rem",
        })}
      >
        {/* Clinical Overview */}
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
            Clinical Overview
          </h2>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
              marginBottom: "2rem",
            })}
          >
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              <strong>LACTIVAE™ (raw milk, oral solution)</strong> is unpasteurized cow's milk that has not undergone
              heat treatment. While regulatory agencies recommend against consumption, recent peer-reviewed research
              provides important context for evidence-based patient counseling.
            </p>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1rem",
              })}
            >
              <strong>Traditional Position:</strong> The American Academy of Pediatrics, FDA, and CDC recommend
              against raw milk consumption due to potential pathogen contamination.<Ref k={["fda-raw-milk", "cdc-raw-milk"]} />
            </p>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
              })}
            >
              <strong>Recent Evidence (2024):</strong> A study in the <em>Journal of Epidemiology and Global Health</em> analyzing
              16 years of CDC surveillance data (2005–2020) found that hospitalizations from raw milk were typically zero, with a
              maximum of 10 in any year nationally, and that pasteurized dairy accounted for more deaths than raw milk over the
              period.<Ref k="stephenson-2024" /> A separate analysis of 2005–2016 outbreak data found the outbreak rate effectively
              decreased 74% after adjusting for growth in consumption.<Ref k="whitehead-2018" /> The 2024 study concluded:{" "}
              <em>"The available evidence conflicts with assumptions of zero risk for pasteurized milk and increasing trends in
              the burden of illness for raw milk."</em><Ref k="stephenson-2024" />
            </p>
          </div>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.tertiary",
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
              Modern Safety Data for Counseling
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
              Key findings from recent surveillance analyses for informed patient discussions:<Ref k={["stephenson-2024", "whitehead-2018"]} />
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                "& li": {
                  marginBottom: "0.75rem",
                },
              })}
            >
              <li>Raw milk: 0–2 deaths over 16 years vs. pasteurized dairy: 5 deaths (same period)<Ref k="stephenson-2024" /></li>
              <li>California retail sales: zero reported illnesses 2016–2020<Ref k="stephenson-2024" /></li>
              <li>Hospitalizations from raw milk typically zero nationally; maximum of 10 in any single year<Ref k="stephenson-2024" /></li>
              <li>Outbreak rates: 74% decrease from 2005 to 2016 after adjusting for growth in population and consumption<Ref k="whitehead-2018" /></li>
              <li>Comparative risk: fewer deaths than cantaloupe (38), peanut butter (10), or leafy greens (6)<Ref k="stephenson-2024" /></li>
              <li>In pasteurized-dairy outbreaks, <em>Listeria</em> was more often the agent and the proportions of hospitalizations and deaths were higher than in unpasteurized outbreaks<Ref k="sebastianski-2022" /></li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                lineHeight: "1.6",
                fontStyle: "italic",
                marginTop: "1rem",
              })}
            >
              Sources: Stephenson MM, et al. J Epidemiol Glob Health. 2024;14(3):787-816.<Ref k="stephenson-2024" /> Whitehead J,
              Lake B. PLoS Curr. 2018.<Ref k="whitehead-2018" /> Sebastianski M, et al. Can J Public Health. 2022;113(4):569-578.<Ref k="sebastianski-2022" />
            </p>
          </div>
        </section>

        {/* Absolute Contraindications */}
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
            Absolute Contraindications
          </h2>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.tertiary",
              border: "2px solid",
              borderColor: "accent.secondary",
              borderRadius: "8px",
            })}
          >
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.primary",
                lineHeight: "1.6",
                marginBottom: "1.5rem",
                fontWeight: "600",
              })}
            >
              Raw milk consumption should be strongly discouraged in:
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                "& li": {
                  marginBottom: "1rem",
                },
              })}
            >
              <li>
                <strong>Infants and children under 5 years:</strong> Developing immune systems; higher risk of severe
                complications including HUS
              </li>
              <li>
                <strong>Pregnant women:</strong> Risk of Listeria infection leading to miscarriage, stillbirth, or
                neonatal infection
              </li>
              <li>
                <strong>Adults over 65 years:</strong> Age-related immune senescence increases infection risk
              </li>
              <li>
                <strong>Immunocompromised patients:</strong> HIV/AIDS, active cancer treatment, solid organ transplant
                recipients, chronic corticosteroid use, biologic immunosuppressants, congenital immunodeficiency
              </li>
              <li>
                <strong>Chronic conditions affecting immunity:</strong> Diabetes mellitus, chronic kidney disease,
                chronic liver disease, inflammatory bowel disease on immunosuppressants
              </li>
            </ul>
          </div>
        </section>

        {/* Microbiological Risks */}
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
            Microbiological Risks
          </h2>

          <div
            className={css({
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
              gap: "1.5rem",
            })}
          >
            {[
              {
                pathogen: "Campylobacter jejuni",
                risks: "Most common bacterial cause of diarrheal illness. Can lead to Guillain-Barré syndrome (GBS) in 1:1000 infections.",
              },
              {
                pathogen: "Salmonella spp.",
                risks: "Can cause severe gastroenteritis. Risk of bacteremia particularly in immunocompromised patients. Antibiotic resistance increasingly common.",
              },
              {
                pathogen: "E. coli O157:H7",
                risks: "Produces Shiga toxin. 5-10% of infections progress to Hemolytic Uremic Syndrome (HUS), leading to acute kidney injury requiring dialysis.",
              },
              {
                pathogen: "Listeria monocytogenes",
                risks: "Crosses placental barrier. Causes meningitis in neonates and immunocompromised. Case fatality rate 20-30% even with treatment.",
              },
              {
                pathogen: "Brucella spp.",
                risks: "Causes chronic undulant fever. Can persist for months. Associated with arthritis, endocarditis, neurobrucellosis.",
              },
              {
                pathogen: "Mycobacterium bovis",
                risks: "Tuberculosis-causing organism. Can cause pulmonary TB and extrapulmonary disease. Difficult to treat.",
              },
            ].map((item) => (
              <div
                key={item.pathogen}
                className={css({
                  padding: "1.5rem",
                  bg: "bg.secondary",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: "border.light",
                })}
              >
                <h3
                  className={css({
                    fontFamily: "mono",
                    fontSize: "base",
                    fontWeight: "600",
                    color: "accent.secondary",
                    marginBottom: "0.75rem",
                  })}
                >
                  {item.pathogen}
                </h3>
                <p
                  className={css({
                    fontFamily: "body",
                    fontSize: "sm",
                    color: "text.secondary",
                    lineHeight: "1.6",
                  })}
                >
                  {item.risks}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Clinical Evidence */}
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
            Clinical Evidence Review
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
              Proposed Benefits (Observational Data)
            </h3>
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
                  marginBottom: "0.75rem",
                },
              })}
            >
              <li>
                <strong>Allergic disease:</strong> The GABRIELA<Ref k="loss-2011" /> and PARSIFAL<Ref k="waser-2007" /> studies
                found inverse associations between farm milk consumption and asthma and allergic rhinitis in children; a 2020
                meta-analysis of eight studies pooled the asthma association at OR 0.58 (95% CI 0.49–0.69)<Ref k="brick-2020" />
              </li>
              <li>
                <strong>Respiratory infections:</strong> In the PASTURE birth cohort, raw milk consumption was associated with
                about 30% fewer respiratory infections and fever episodes in the first year of life, and lower CRP at 12 months<Ref k="loss-2015" />
              </li>
              <li>
                <strong>Nutritional content:</strong> Modest reductions in B1, B2, C and folate with pasteurization; native
                enzymes (alkaline phosphatase, lipase, lactoperoxidase), IgM and a substantial share of lactoferrin are lost;
                minerals are unaffected<Ref k={["macdonald-2011", "claeys-2013", "haas-2025"]} />
              </li>
              <li>
                <strong>Fatty acid profile:</strong> Grass-fed milk has roughly 2.5 times the omega-3 content of conventional
                milk, an effect of feeding rather than of pasteurization<Ref k="benbrook-2018" />
              </li>
              <li>
                <strong>Lactose intolerance:</strong> A randomized crossover pilot found no benefit of raw over pasteurized milk;
                counsel patients that this common claim is not supported<Ref k="mummah-2014" />
              </li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                fontStyle: "italic",
                marginTop: "1rem",
              })}
            >
              <strong>Note:</strong> These are observational studies with significant confounding variables (farm exposure,
              rural lifestyle, overall diet). Causation has not been established. No randomized controlled trials exist.
            </p>
          </div>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.tertiary",
              border: "1px solid",
              borderColor: "border.medium",
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
              Evidence Quality Assessment
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
              The quality of evidence for benefits is <strong>LOW to MODERATE</strong> based on:
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <li>Primarily observational study design (cannot prove causation)</li>
              <li>Multiple confounding variables difficult to control</li>
              <li>No prospective randomized controlled trials</li>
              <li>Publication bias toward positive findings</li>
              <li>Limited long-term safety data</li>
            </ul>
          </div>
        </section>

        {/* Patient Counseling */}
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
            Patient Counseling Points
          </h2>

          <div
            className={css({
              padding: "2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
            })}
          >
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "1.5rem",
              })}
            >
              When patients inquire about raw milk, provide balanced, evidence-based counseling:
            </p>

            <ol
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                counterReset: "item",
                listStyleType: "none",
                "& li": {
                  marginBottom: "1.5rem",
                  counterIncrement: "item",
                  _before: {
                    content: "counter(item) '. '",
                    fontWeight: "600",
                    color: "accent.secondary",
                  },
                },
              })}
            >
              <li>
                <strong>Acknowledge their interest</strong> while clearly explaining documented safety risks
              </li>
              <li>
                <strong>Review absolute contraindications</strong> - emphasize risks to vulnerable populations
              </li>
              <li>
                <strong>Discuss the evidence</strong> - explain that observed benefits are associations, not proven causation
              </li>
              <li>
                <strong>Explain relative risk</strong> - while overall foodborne illness risk may seem low, consequences
                can be severe (HUS, GBS, pregnancy loss)
              </li>
              <li>
                <strong>Provide risk mitigation strategies</strong> if patient chooses to proceed despite counseling
              </li>
              <li>
                <strong>Document the discussion</strong> in the medical record, including that risks were explained
              </li>
              <li>
                <strong>Offer alternatives</strong> - discuss other ways to achieve nutritional goals with safer options
              </li>
            </ol>
          </div>
        </section>

        {/* Reporting */}
        <section
          className={css({
            marginBottom: "4rem",
            padding: "2rem",
            bg: "bg.tertiary",
            borderRadius: "8px",
          })}
        >
          <h2
            className={css({
              fontFamily: "heading",
              fontSize: "2xl",
              fontWeight: "700",
              color: "accent.primary",
              marginBottom: "1rem",
            })}
          >
            Adverse Event Reporting
          </h2>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              lineHeight: "1.6",
              marginBottom: "1rem",
            })}
          >
            Healthcare providers are encouraged to report suspected foodborne illness cases to:
          </p>
          <ul
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              lineHeight: "1.6",
              paddingLeft: "2rem",
              listStyleType: "disc",
              "& li": {
                marginBottom: "0.5rem",
              },
            })}
          >
            <li>Local health department</li>
            <li>State health department</li>
            <li>CDC Foodborne Disease Outbreak Surveillance System</li>
          </ul>
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
            Additional Resources
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
              Clinical Studies
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
