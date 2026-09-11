"use client";

import { css } from "../../../styled-system/css";
import Link from "next/link";
import { useState } from "react";
import Ref from "@/components/ui/Ref";
import Claim, { governedAttrs } from "@/components/governed/Claim";
import Cite from "@/components/governed/Cite";
import { getClaim } from "@/data/claims";

export default function NutritionalDataPage() {
  const [activeComparison, setActiveComparison] = useState<"pasteurized" | "supplements">("pasteurized");

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
            backgroundImage: "url('/milk-glass.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
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
            Nutritional Superiority Data
          </h1>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "xl",
              color: "text.secondary",
              lineHeight: "1.6",
            })}
          >
            Complete nutritional profile and bioavailability comparison
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div
        className={css({
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "4rem 2rem",
        })}
      >
        {/* Complete Vitamin Profile */}
        <section
          data-component="vitamin-profile"
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
            Complete Vitamin & Mineral Profile
          </h2>

          <p
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              lineHeight: "1.6",
              marginBottom: "2rem",
            })}
          >
            Per 8 oz (240 mL) serving of grass-fed LACTIVAE™ (raw milk, oral solution). <Claim id="nutr-serving-basis" />{" "}
            <Claim id="nutr-vitd-unfortified" />
          </p>

          {/* Vitamins Table */}
          <div
            className={css({
              overflowX: "auto",
              marginBottom: "3rem",
            })}
          >
            <table
              className={css({
                width: "100%",
                borderCollapse: "collapse",
                bg: "bg.secondary",
                borderRadius: "8px",
                overflow: "hidden",
                "& th": {
                  fontFamily: "body",
                  fontSize: "sm",
                  fontWeight: "600",
                  color: "bg.primary",
                  bg: "accent.primary",
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "2px solid",
                  borderColor: "accent.secondary",
                },
                "& td": {
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.secondary",
                  padding: "1rem",
                  borderBottom: "1px solid",
                  borderColor: "border.light",
                },
                "& tr:hover": {
                  bg: "bg.tertiary",
                },
              })}
            >
              <thead>
                <tr>
                  <th>Vitamin</th>
                  <th>Amount</th>
                  <th>% Daily Value</th>
                  <th>Key Benefits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Vitamin A (Retinol)</strong></td>
                  <td>395 IU (118 mcg RAE)</td>
                  <td>13%</td>
                  <td>Vision, immune function, skin health</td>
                </tr>
                <VitaminRow claimId="nutr-row-vitd" />
                <tr>
                  <td><strong>Vitamin E (Tocopherol)</strong></td>
                  <td>0.2 mg</td>
                  <td>1%</td>
                  <td>Antioxidant, cellular protection</td>
                </tr>
                <tr>
                  <td><strong>Vitamin K2 (Menaquinone)</strong></td>
                  <td>1.0 mcg</td>
                  <td>1%</td>
                  <td>Bone mineralization, cardiovascular health</td>
                </tr>
                <VitaminRow claimId="nutr-row-vitc" />
                <tr>
                  <td><strong>Thiamin (B1)</strong></td>
                  <td>0.11 mg</td>
                  <td>9%</td>
                  <td>Energy metabolism, nerve function</td>
                </tr>
                <tr>
                  <td><strong>Riboflavin (B2)</strong></td>
                  <td>0.45 mg</td>
                  <td>35%</td>
                  <td>Energy production, cellular function</td>
                </tr>
                <tr>
                  <td><strong>Niacin (B3)</strong></td>
                  <td>0.26 mg</td>
                  <td>2%</td>
                  <td>DNA repair, cellular signaling</td>
                </tr>
                <tr>
                  <td><strong>Pantothenic Acid (B5)</strong></td>
                  <td>0.88 mg</td>
                  <td>18%</td>
                  <td>Hormone synthesis, energy metabolism</td>
                </tr>
                <tr>
                  <td><strong>Vitamin B6 (Pyridoxine)</strong></td>
                  <td>0.09 mg</td>
                  <td>5%</td>
                  <td>Neurotransmitter synthesis, immune function</td>
                </tr>
                <tr>
                  <td><strong>Folate (B9)</strong></td>
                  <td>12 mcg</td>
                  <td>3%</td>
                  <td>DNA synthesis, cell division</td>
                </tr>
                <tr>
                  <td><strong>Vitamin B12 (Cobalamin)</strong></td>
                  <td>1.1 mcg</td>
                  <td>46%</td>
                  <td>Red blood cell formation, neurological function</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Minerals Table */}
          <h3
            className={css({
              fontFamily: "heading",
              fontSize: "2xl",
              fontWeight: "700",
              color: "accent.primary",
              marginBottom: "1.5rem",
            })}
          >
            Essential Minerals
          </h3>

          <div
            className={css({
              overflowX: "auto",
            })}
          >
            <table
              className={css({
                width: "100%",
                borderCollapse: "collapse",
                bg: "bg.secondary",
                borderRadius: "8px",
                overflow: "hidden",
                "& th": {
                  fontFamily: "body",
                  fontSize: "sm",
                  fontWeight: "600",
                  color: "bg.primary",
                  bg: "accent.primary",
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "2px solid",
                  borderColor: "accent.secondary",
                },
                "& td": {
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.secondary",
                  padding: "1rem",
                  borderBottom: "1px solid",
                  borderColor: "border.light",
                },
                "& tr:hover": {
                  bg: "bg.tertiary",
                },
              })}
            >
              <thead>
                <tr>
                  <th>Mineral</th>
                  <th>Amount</th>
                  <th>% Daily Value</th>
                  <th>Key Benefits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Calcium</strong></td>
                  <td>300 mg</td>
                  <td>30%</td>
                  <td>Bone health, muscle contraction, nerve signaling</td>
                </tr>
                <tr>
                  <td><strong>Phosphorus</strong></td>
                  <td>232 mg</td>
                  <td>23%</td>
                  <td>Bone formation, energy production (ATP)</td>
                </tr>
                <tr>
                  <td><strong>Magnesium</strong></td>
                  <td>27 mg</td>
                  <td>7%</td>
                  <td>Muscle/nerve function, blood glucose control</td>
                </tr>
                <tr>
                  <td><strong>Potassium</strong></td>
                  <td>366 mg</td>
                  <td>8%</td>
                  <td>Blood pressure regulation, electrolyte balance</td>
                </tr>
                <tr>
                  <td><strong>Sodium</strong></td>
                  <td>120 mg</td>
                  <td>5%</td>
                  <td>Fluid balance, nerve impulse transmission</td>
                </tr>
                <tr>
                  <td><strong>Zinc</strong></td>
                  <td>1.0 mg</td>
                  <td>9%</td>
                  <td>Immune function, wound healing, protein synthesis</td>
                </tr>
                <tr>
                  <td><strong>Selenium</strong></td>
                  <td>4.9 mcg</td>
                  <td>9%</td>
                  <td>Antioxidant defense, thyroid hormone metabolism</td>
                </tr>
                <tr>
                  <td><strong>Iodine</strong></td>
                  <td>56 mcg</td>
                  <td>37%</td>
                  <td>Thyroid hormone production</td>
                </tr>
                <tr>
                  <td><strong>Iron</strong></td>
                  <td>0.07 mg</td>
                  <td>0.4%</td>
                  <td>Oxygen transport, energy metabolism</td>
                </tr>
                <tr>
                  <td><strong>Copper</strong></td>
                  <td>0.03 mg</td>
                  <td>3%</td>
                  <td>Iron metabolism, connective tissue formation</td>
                </tr>
                <tr>
                  <td><strong>Manganese</strong></td>
                  <td>0.01 mg</td>
                  <td>0.4%</td>
                  <td>Bone formation, antioxidant function</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Comparison Tabs */}
        <section
          data-component="comparison"
          className={css({
            marginBottom: "4rem",
          })}
        >
          <div
            className={css({
              display: "flex",
              gap: "1rem",
              marginBottom: "2rem",
              borderBottom: "2px solid",
              borderColor: "border.light",
            })}
          >
            <button
              onClick={() => setActiveComparison("pasteurized")}
              className={css({
                fontFamily: "body",
                fontSize: "base",
                fontWeight: "600",
                padding: "1rem 2rem",
                bg: "transparent",
                color: activeComparison === "pasteurized" ? "accent.primary" : "text.muted",
                border: "none",
                borderBottom: "3px solid",
                borderColor: activeComparison === "pasteurized" ? "accent.primary" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease-out",
                _hover: {
                  color: "accent.primary",
                },
              })}
            >
              vs. Pasteurized Milk
            </button>
            <button
              onClick={() => setActiveComparison("supplements")}
              className={css({
                fontFamily: "body",
                fontSize: "base",
                fontWeight: "600",
                padding: "1rem 2rem",
                bg: "transparent",
                color: activeComparison === "supplements" ? "accent.primary" : "text.muted",
                border: "none",
                borderBottom: "3px solid",
                borderColor: activeComparison === "supplements" ? "accent.primary" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease-out",
                _hover: {
                  color: "accent.primary",
                },
              })}
            >
              vs. Synthetic Supplements
            </button>
          </div>

          {activeComparison === "pasteurized" && (
            <div>
              <h2
                className={css({
                  fontFamily: "heading",
                  fontSize: "3xl",
                  fontWeight: "700",
                  color: "accent.primary",
                  marginBottom: "2rem",
                })}
              >
                LACTIVAE™ vs. Pasteurized Milk
              </h2>

              <div
                className={css({
                  overflowX: "auto",
                })}
              >
                <table
                  className={css({
                    width: "100%",
                    borderCollapse: "collapse",
                    bg: "bg.secondary",
                    borderRadius: "8px",
                    overflow: "hidden",
                    "& th": {
                      fontFamily: "body",
                      fontSize: "sm",
                      fontWeight: "600",
                      color: "bg.primary",
                      bg: "accent.primary",
                      padding: "1rem",
                      textAlign: "left",
                    },
                    "& td": {
                      fontFamily: "body",
                      fontSize: "sm",
                      color: "text.secondary",
                      padding: "1rem",
                      borderBottom: "1px solid",
                      borderColor: "border.light",
                    },
                    "& tr:hover": {
                      bg: "bg.tertiary",
                    },
                  })}
                >
                  <thead>
                    <tr>
                      <th>Nutrient</th>
                      <th>LACTIVAE™ (Raw)</th>
                      <th>Pasteurized</th>
                      <th>Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    <NutrientRow claimId="cmp-vitamin-c" />
                    <NutrientRow claimId="cmp-b12" />
                    <NutrientRow claimId="cmp-folate" />
                    <NutrientRow claimId="cmp-omega3" />
                    <NutrientRow claimId="cmp-cla" />
                    <NutrientRow claimId="cmp-alp" />
                    <NutrientRow claimId="cmp-lipase" />
                    <NutrientRow claimId="cmp-lactoperoxidase" />
                    <NutrientRow claimId="cmp-igg" />
                    <NutrientRow claimId="cmp-iga" />
                    <NutrientRow claimId="cmp-lactoferrin" />
                  </tbody>
                </table>
              </div>

              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  fontStyle: "italic",
                  marginTop: "1.5rem",
                })}
              >
                Sources: <Cite k="claeys-2013" /> <Cite k="macdonald-2011" short /> <Cite k="peila-2016" short />{" "}
                <Cite k="haas-2025" short /> Fatty-acid rows: <Cite k="benbrook-2018" short /> <Claim id="cmp-framing-fatty-acids" />{" "}
                <Claim id="heat-minerals" />.
              </p>
            </div>
          )}

          {activeComparison === "supplements" && (
            <div>
              <h2
                className={css({
                  fontFamily: "heading",
                  fontSize: "3xl",
                  fontWeight: "700",
                  color: "accent.primary",
                  marginBottom: "2rem",
                })}
              >
                Bioavailability: LACTIVAE™ vs. Synthetic Supplements
              </h2>

              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  lineHeight: "1.6",
                  marginBottom: "2rem",
                  padding: "1.5rem",
                  bg: "bg.tertiary",
                  borderRadius: "8px",
                })}
              >
                <strong>Bioavailability</strong> refers to the proportion of a nutrient that is absorbed and utilized
                by the body. Nutrients in whole food matrices like LACTIVAE™ are often significantly more bioavailable
                than isolated synthetic supplements due to synergistic co-factors, natural fat carriers, and optimal
                molecular forms.
              </p>

              <div
                className={css({
                  overflowX: "auto",
                  marginBottom: "3rem",
                })}
              >
                <table
                  className={css({
                    width: "100%",
                    borderCollapse: "collapse",
                    bg: "bg.secondary",
                    borderRadius: "8px",
                    overflow: "hidden",
                    "& th": {
                      fontFamily: "body",
                      fontSize: "sm",
                      fontWeight: "600",
                      color: "bg.primary",
                      bg: "accent.primary",
                      padding: "1rem",
                      textAlign: "left",
                    },
                    "& td": {
                      fontFamily: "body",
                      fontSize: "sm",
                      color: "text.secondary",
                      padding: "1rem",
                      borderBottom: "1px solid",
                      borderColor: "border.light",
                    },
                    "& tr:hover": {
                      bg: "bg.tertiary",
                    },
                  })}
                >
                  <thead>
                    <tr>
                      <th>Nutrient</th>
                      <th>LACTIVAE™ Form</th>
                      <th>Supplement Form</th>
                      <th>Bioavailability Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Vitamin A</strong></td>
                      <td>Preformed Retinol</td>
                      <td>Beta-carotene</td>
                      <td className={css({ color: "accent.secondary", fontWeight: "600" })}>6-12x more bioavailable</td>
                    </tr>
                    <tr>
                      <td><strong>Vitamin D3</strong></td>
                      <td>Natural D3 in fat matrix</td>
                      <td>Isolated cholecalciferol</td>
                      <td className={css({ color: "accent.secondary", fontWeight: "600" })}>2.3x better absorption</td>
                    </tr>
                    <tr>
                      <td><strong>Vitamin K2</strong></td>
                      <td>Menaquinone-4 (MK-4)</td>
                      <td>Synthetic phylloquinone</td>
                      <td className={css({ color: "accent.secondary", fontWeight: "600" })}>Better tissue distribution</td>
                    </tr>
                    <tr>
                      <td><strong>Calcium</strong></td>
                      <td>Hydroxyapatite complex</td>
                      <td>Calcium carbonate</td>
                      <td className={css({ color: "accent.secondary", fontWeight: "600" })}>2.5x better absorption</td>
                    </tr>
                    <tr>
                      <td><strong>Magnesium</strong></td>
                      <td>Protein-bound complex</td>
                      <td>Magnesium oxide</td>
                      <td className={css({ color: "accent.secondary", fontWeight: "600" })}>3-4x better absorption</td>
                    </tr>
                    <tr>
                      <td><strong>Vitamin B12</strong></td>
                      <td>Methylcobalamin + protein</td>
                      <td>Cyanocobalamin</td>
                      <td className={css({ color: "accent.secondary", fontWeight: "600" })}>Higher retention rate</td>
                    </tr>
                    <tr>
                      <td><strong>Zinc</strong></td>
                      <td>Protein-chelated zinc</td>
                      <td>Zinc sulfate</td>
                      <td className={css({ color: "accent.secondary", fontWeight: "600" })}>2x better absorption</td>
                    </tr>
                    <tr>
                      <td><strong>Selenium</strong></td>
                      <td>Selenomethionine</td>
                      <td>Sodium selenite</td>
                      <td className={css({ color: "accent.secondary", fontWeight: "600" })}>90% vs 50% absorption</td>
                    </tr>
                    <tr>
                      <td><strong>Iodine</strong></td>
                      <td>Protein-bound iodine</td>
                      <td>Potassium iodide</td>
                      <td className={css({ color: "accent.secondary", fontWeight: "600" })}>Sustained release</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Synergistic Benefits */}
              <div
                className={css({
                  padding: "2rem",
                  bg: "bg.tertiary",
                  borderRadius: "8px",
                })}
              >
                <h3
                  className={css({
                    fontFamily: "heading",
                    fontSize: "xl",
                    fontWeight: "700",
                    color: "accent.primary",
                    marginBottom: "1.5rem",
                  })}
                >
                  Synergistic Co-Factors in Whole Food Matrix
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
                      marginBottom: "1rem",
                    },
                  })}
                >
                  <li>
                    <strong>Fat-soluble vitamins (A, D, E, K):</strong> Naturally delivered in milk fat, enhancing
                    absorption without need for separate fat intake
                  </li>
                  <li>
                    <strong>Calcium-phosphorus ratio:</strong> Optimal 1.3:1 ratio for bone mineralization (supplements
                    often lack this balance)
                  </li>
                  <li>
                    <strong>Vitamin D + Calcium + K2:</strong> Synergistic trio for bone health - K2 directs calcium
                    to bones, D3 enhances absorption
                  </li>
                  <li>
                    <strong>Protein-mineral complexes:</strong> Casein phosphopeptides enhance calcium, iron, and zinc
                    bioavailability
                  </li>
                  <li>
                    <strong>Native enzymes:</strong> <Claim id="nutr-native-enzymes" /> <Claim id="lactose-no-benefit" />
                  </li>
                  <li>
                    <strong>Bioactive peptides:</strong> Released during digestion, provide additional immune and
                    cardiovascular benefits
                  </li>
                </ul>
              </div>

              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "sm",
                  color: "text.muted",
                  fontStyle: "italic",
                  marginTop: "1.5rem",
                })}
              >
                Sources: <Cite k="heaney-2000" /> <Cite k="scholz-ahrens-2020" />
              </p>
            </div>
          )}
        </section>

        {/* Visual Comparison Charts */}
        <section
          id="charts"
          data-component="charts"
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
            Key Nutrient Advantages (Visual Comparison)
          </h2>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "sm",
              color: "text.secondary",
              lineHeight: "1.6",
              marginBottom: "2rem",
              maxWidth: "800px",
            })}
          >
            Each bar is scaled to the larger of the two values. Fatty-acid cards compare grass-fed with conventional feeding;
            the others compare raw with HTST-pasteurized milk. Values and references are the same governed objects as the table above.
          </p>

          <div
            className={css({
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
              gap: "2rem",
            })}
          >
            {/* One card per governed comparison claim; bars are scaled to the larger value */}
            <ChartCard claimId="cmp-omega3" />
            <ChartCard claimId="cmp-cla" />
            <ChartCard claimId="cmp-vitamin-c" />
            <ChartCard claimId="cmp-folate" />
            <ChartCard claimId="cmp-lactoferrin" />
            <ChartCard claimId="cmp-iga" />
            <ChartCard claimId="cmp-alp" />
            <ChartCard claimId="cmp-lab" />
          </div>
        </section>

        {/* Learn More */}
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
              Research Studies
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

/** A vitamin/mineral row whose values come from a governed claim's structured data. */
function VitaminRow({ claimId }: { claimId: string }) {
  const claim = getClaim(claimId);
  const d = claim.data ?? {};
  const refKeys = Array.from(new Set(claim.refs.map((r) => r.key)));
  return (
    <tr {...governedAttrs(claim)}>
      <td>
        <strong>{d.name}</strong>
        <Ref k={refKeys} />
      </td>
      <td>{d.amount}</td>
      <td>{d.dv}</td>
      <td>{d.benefits}</td>
    </tr>
  );
}

/** A raw-vs-pasteurized comparison row rendered from the shared comparison claims. */
function NutrientRow({ claimId }: { claimId: string }) {
  const claim = getClaim(claimId);
  const d = claim.data ?? {};
  const refKeys = Array.from(new Set(claim.refs.map((r) => r.key)));
  const numeric = /^[+-]\d/.test(d.advantage ?? "");
  return (
    <tr {...governedAttrs(claim)}>
      <td>
        <strong>{d.nutrient}</strong>
        {d.qualifier ? ` (${d.qualifier})` : ""}
        <Ref k={refKeys} />
      </td>
      <td>{d.rawValue}</td>
      <td>{d.pastValue}</td>
      <td className={css({ color: d.tone === "muted" ? "text.muted" : "accent.secondary", fontWeight: "600" })}>
        {d.advantage}
        {numeric ? " ↑" : d.advantage === "Native" ? " ✓" : ""}
      </td>
    </tr>
  );
}

/** Parse "49 mg", "2.3 mg", "35–65% retained (HTST)" into a number for charting */
function chartValue(raw: string | undefined, past: string | undefined): { raw: number; past: number; rawLabel: string; pastLabel: string } {
  const num = (v: string) => {
    const m = v.match(/(\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?/);
    if (!m) return null;
    const a = parseFloat(m[1]);
    const b = m[2] ? parseFloat(m[2]) : null;
    return b === null ? a : (a + b) / 2; // "35–65% retained" → 50
  };
  const r = num(raw ?? "");
  const pv = num(past ?? "");
  if (r !== null && pv !== null) return { raw: r, past: pv, rawLabel: raw ?? "", pastLabel: past ?? "" };
  // qualitative rows: Native/Active/Present vs retained % / Inactivated / Destroyed / Eliminated
  if (pv !== null) return { raw: 100, past: pv, rawLabel: "100%", pastLabel: past ?? "" };
  return { raw: 100, past: 0, rawLabel: raw ?? "Active", pastLabel: past ?? "None" };
}

/** A relative bar chart for one governed comparison claim. */
function ChartCard({ claimId }: { claimId: string }) {
  const claim = getClaim(claimId);
  const d = claim.data ?? {};
  const v = chartValue(d.rawValue, d.pastValue);
  const max = Math.max(v.raw, v.past, 1);
  const rawPct = Math.round((v.raw / max) * 100);
  const pastPct = Math.round((v.past / max) * 100);
  const refKeys = Array.from(new Set(claim.refs.map((r) => r.key)));
  const advantage = /^[+-]\d/.test(d.advantage ?? "") ? `${d.advantage} advantage` : d.advantage;

  const row = (label: string, pct: number, valueLabel: string, fill: string, textColor: string) => (
    <div className={css({ display: "flex", alignItems: "center", marginBottom: "0.5rem" })}>
      <span className={css({ fontFamily: "body", fontSize: "xs", color: "text.muted", width: "100px", flexShrink: 0 })}>{label}</span>
      <div className={css({ flex: 1, height: "32px", bg: "bg.tertiary", borderRadius: "4px", position: "relative", overflow: "hidden" })}>
        <div className={css({ height: "100%", borderRadius: "4px", transition: "width 0.4s ease-out" })} style={{ width: `${Math.max(pct, 2)}%`, background: fill }} />
        <span
          className={css({ position: "absolute", top: "50%", transform: "translateY(-50%)", fontFamily: "mono", fontSize: "sm", fontWeight: "700", whiteSpace: "nowrap" })}
          style={pct > 45 ? { right: "8px", color: textColor } : { left: `calc(${Math.max(pct, 2)}% + 8px)`, color: "#4D4D4D" }}
        >
          {valueLabel}
        </span>
      </div>
    </div>
  );

  return (
    <div
      {...governedAttrs(claim)}
      className={css({
        padding: "1.5rem",
        bg: "bg.secondary",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "border.light",
      })}
    >
      <h3 className={css({ fontFamily: "body", fontSize: "base", fontWeight: "600", color: "accent.primary", marginBottom: "0.25rem" })}>
        {d.nutrient}
        <Ref k={refKeys} />
      </h3>
      {d.qualifier && <p className={css({ fontFamily: "mono", fontSize: "xs", color: "text.muted", marginBottom: "1rem" })}>{d.qualifier}</p>}
      <div className={css({ marginBottom: "1rem", marginTop: d.qualifier ? 0 : "0.75rem" })}>
        {row("LACTIVAE™", rawPct, v.rawLabel, "#C67830", "#FFFDF5")}
        {row("Pasteurized", pastPct, v.pastLabel, "rgba(61, 45, 34, 0.35)", "#FFFDF5")}
      </div>
      {advantage && (
        <p className={css({ fontFamily: "body", fontSize: "xs", color: d.tone === "muted" ? "text.muted" : "accent.secondary", fontWeight: "600" })}>{advantage}</p>
      )}
    </div>
  );
}
