import { css } from "../../../styled-system/css";
import Link from "next/link";
import Ref from "@/components/ui/Ref";

export const metadata = {
  title: "Safety Information - LACTIVAE™ (raw milk, oral solution)",
  description: "Comprehensive safety information for LACTIVAE™ including contraindications, risks, and safe handling practices.",
};

export default function SafetyPage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className={css({
          bg: "accent.primary",
          color: "bg.primary",
          padding: "4rem 2rem",
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
              marginBottom: "1rem",
              color: "accent.warm",
            })}
          >
            Important Safety Information
          </h1>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "xl",
              lineHeight: "1.6",
            })}
          >
            Critical information about LACTIVAE™ (raw milk, oral solution)
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
        {/* Modern Safety Evidence - Lead with positive data */}
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
            Modern Safety Evidence (2005-2020)
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
                marginBottom: "1.5rem",
              })}
            >
              Recent peer-reviewed research challenges common perceptions about raw milk safety. A 2024 study published in the{" "}
              <em>Journal of Epidemiology and Global Health</em> analyzed 16 years of CDC surveillance data (2005–2020),<Ref k="stephenson-2024" />{" "}
              and an earlier analysis examined outbreak trends against legalization and consumption growth (2005–2016):<Ref k="whitehead-2018" />
            </p>

            <div
              className={css({
                display: "grid",
                gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
                gap: "1.5rem",
                marginBottom: "1.5rem",
              })}
            >
              {[
                {
                  stat: "0–2 deaths",
                  ref: "stephenson-2024",
                  description: "Total deaths from raw milk in 16 years (vs. 5 deaths from pasteurized dairy)",
                },
                {
                  stat: "74% decrease",
                  ref: "whitehead-2018",
                  description: "In outbreak rates from 2005 to 2016, after adjusting for growth in population and consumption",
                },
                {
                  stat: "Zero illnesses",
                  ref: "stephenson-2024",
                  description: "Reported in California (2016–2020) despite retail grocery store sales",
                },
                {
                  stat: "0 typical, 10 max",
                  ref: "stephenson-2024",
                  description: "Hospitalizations from raw milk per year nationally: typically zero, never more than 10",
                },
              ].map((item) => (
                <div
                  key={item.stat}
                  className={css({
                    padding: "1.5rem",
                    bg: "bg.tertiary",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "border.light",
                  })}
                >
                  <h3
                    className={css({
                      fontFamily: "heading",
                      fontSize: "2xl",
                      fontWeight: "700",
                      color: "accent.secondary",
                      marginBottom: "0.5rem",
                    })}
                  >
                    {item.stat}
                    <Ref k={item.ref} />
                  </h3>
                  <p
                    className={css({
                      fontFamily: "body",
                      fontSize: "sm",
                      color: "text.secondary",
                      lineHeight: "1.6",
                    })}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.muted",
                lineHeight: "1.6",
                fontStyle: "italic",
              })}
            >
              Sources: Stephenson MM, et al. <em>J Epidemiol Glob Health</em>. 2024;14(3):787-816.<Ref k="stephenson-2024" />{" "}
              Whitehead J, Lake B. <em>PLoS Curr</em>. 2018.<Ref k="whitehead-2018" />
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
              Comparative Risk Context
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
              Deaths by food, CDC outbreak surveillance 2005–2020:<Ref k="stephenson-2024" />
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
              <li>Cantaloupe: 38 deaths (19x more than raw milk)</li>
              <li>Peanut butter: 10 deaths (5x more than raw milk)</li>
              <li>Leafy greens: 6 deaths (3x more than raw milk)</li>
              <li>Pasteurized dairy: 5 deaths (2.5x more than raw milk)</li>
              <li><strong>Raw milk: 0-2 deaths</strong></li>
            </ul>
          </div>
        </section>

        {/* FDA Position - Moved down but still included */}
        <section
          className={css({
            marginBottom: "4rem",
            padding: "2rem",
            bg: "bg.tertiary",
            border: "1px solid",
            borderColor: "border.medium",
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
            Regulatory Position
          </h2>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.primary",
              lineHeight: "1.6",
              marginBottom: "1rem",
            })}
          >
            <strong>LACTIVAE™ is NOT FDA approved.</strong> The U.S. Food and Drug Administration states that raw milk
            can harbor dangerous microorganisms that can pose serious health risks.<Ref k="fda-raw-milk" />
          </p>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.primary",
              lineHeight: "1.6",
            })}
          >
            However, the 2024 peer-reviewed study concluded: <em>"The available evidence conflicts with assumptions of
            zero risk for pasteurized milk and increasing trends in the burden of illness for raw milk."</em><Ref k="stephenson-2024" />
          </p>
        </section>

        {/* Contraindications */}
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
            WHO SHOULD NOT CONSUME LACTIVAE™<Ref k="fda-raw-milk" />
          </h2>

          <div
            className={css({
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
              gap: "2rem",
            })}
          >
            {[
              {
                title: "Children Under 5",
                description: "Young children have developing immune systems and are at higher risk for severe complications from foodborne illness.",
              },
              {
                title: "Adults Over 65",
                description: "Older adults may have weakened immune systems and are more susceptible to serious infections.",
              },
              {
                title: "Pregnant Women",
                description: "Listeria infection during pregnancy can cause miscarriage, stillbirth, premature delivery, or life-threatening infection of the newborn.",
              },
              {
                title: "Immunocompromised Individuals",
                description: "People with HIV/AIDS, cancer patients undergoing treatment, transplant recipients, or those on immunosuppressive medications face significantly elevated risks.",
              },
            ].map((item) => (
              <div
                key={item.title}
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
                    fontFamily: "body",
                    fontSize: "lg",
                    fontWeight: "600",
                    color: "accent.secondary",
                    marginBottom: "0.75rem",
                  })}
                >
                  {item.title}
                </h3>
                <p
                  className={css({
                    fontFamily: "body",
                    fontSize: "sm",
                    color: "text.secondary",
                    lineHeight: "1.6",
                  })}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Potential Risks */}
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
            Potential Health Risks
          </h2>

          <div className={css({ marginBottom: "2rem" })}>
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              Harmful Bacteria
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
              Raw milk can contain dangerous bacteria including:
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "2rem",
                listStyleType: "disc",
                listStylePosition: "outside",
                "& li": {
                  marginBottom: "0.5rem",
                },
              })}
            >
              <li><strong>Campylobacter</strong> - Leading cause of bacterial diarrhea</li>
              <li><strong>Salmonella</strong> - Can cause severe gastrointestinal illness</li>
              <li><strong>E. coli O157:H7</strong> - Can cause kidney failure (HUS)</li>
              <li><strong>Listeria monocytogenes</strong> - Particularly dangerous for pregnant women</li>
              <li><strong>Brucella</strong> - Can cause chronic recurring fever</li>
            </ul>
          </div>

          <div className={css({ marginBottom: "2rem" })}>
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              Common Symptoms
            </h3>
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
              <li>Diarrhea (sometimes bloody)</li>
              <li>Stomach cramping and pain</li>
              <li>Nausea and vomiting</li>
              <li>Fever and chills</li>
              <li>Headache and body aches</li>
            </ul>
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
              Serious Complications
            </h3>
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
              <li><strong>Hemolytic Uremic Syndrome (HUS)</strong> - Kidney failure requiring dialysis</li>
              <li><strong>Guillain-Barré Syndrome (GBS)</strong> - Paralysis that can be permanent</li>
              <li><strong>Reactive Arthritis</strong> - Chronic joint inflammation</li>
              <li><strong>Miscarriage or Stillbirth</strong> - From Listeria infection during pregnancy</li>
            </ul>
          </div>
        </section>

        {/* Safe Handling */}
        <section
          className={css({
            marginBottom: "4rem",
            padding: "2rem",
            bg: "bg.secondary",
            borderRadius: "8px",
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
            Risk Mitigation Strategies
          </h2>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              lineHeight: "1.6",
              marginBottom: "1.5rem",
            })}
          >
            If you choose to consume raw milk despite the risks, follow these guidelines:
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
            <li>Purchase only from licensed, regularly inspected producers who test their milk frequently</li>
            <li>Maintain refrigeration at 38-40°F (3-4°C) at all times - never leave at room temperature</li>
            <li>Consume within 7-10 days of production</li>
            <li>Discard immediately if you notice off-odors, unusual taste, or visible contamination</li>
            <li>Visit the farm to understand their sanitation and animal health practices</li>
            <li>Keep raw milk separate from other foods to prevent cross-contamination</li>
            <li>Use dedicated containers and utensils for raw milk</li>
          </ul>
        </section>

        {/* Regulatory Information */}
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
            Regulatory Status
          </h2>
          <div
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              lineHeight: "1.6",
              "& p": {
                marginBottom: "1rem",
              },
            })}
          >
            <p>
              <strong>Federal:</strong> The sale of raw milk for human consumption across state lines is prohibited
              by the FDA under 21 CFR 1240.61.
            </p>
            <p>
              <strong>State Laws:</strong> Regulations vary significantly by state. Some states allow retail sale,
              others permit only farm sales, and some prohibit raw milk sales entirely. Check your local regulations.
            </p>
            <p>
              <strong>International:</strong> Most developed countries recommend against raw milk consumption.
              The CDC, FDA, and American Academy of Pediatrics all advise against drinking raw milk.
            </p>
          </div>
        </section>

        {/* Additional Resources */}
        <section
          className={css({
            textAlign: "center",
            padding: "3rem 0",
            borderTop: "1px solid",
            borderColor: "border.light",
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
            For More Information
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
              href="/prescribing-information"
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
              Full Prescribing Information
            </Link>
            <Link
              href="/patients"
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
              Patient Resources
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
