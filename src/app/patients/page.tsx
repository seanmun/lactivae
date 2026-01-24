import { css } from "../../../styled-system/css";
import Link from "next/link";

export const metadata = {
  title: "For Patients - LACTIVAE™ Consumer Information",
  description: "Patient resources and information about LACTIVAE™ (raw milk, oral solution) including safety, usage, and frequently asked questions.",
};

export default function PatientsPage() {
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
            backgroundImage: "url('/morning-milk.jpg')",
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
            Information for Patients
          </h1>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "xl",
              color: "text.secondary",
              lineHeight: "1.6",
            })}
          >
            Important information about LACTIVAE™ (raw milk, oral solution)
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
        {/* Modern Safety Evidence */}
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
            What You Should Know
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
              Modern Safety Data
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
              A comprehensive 2024 study analyzing 16 years of data found that properly produced raw milk from
              licensed, tested sources has a strong safety record:
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
              <li>California reported <strong>zero illnesses</strong> from 2016-2020 despite retail grocery store sales</li>
              <li>Outbreak rates have <strong>decreased 74%</strong> since 2005 as production protocols improved</li>
              <li>Most states report <strong>zero hospitalizations</strong> over 15-year period</li>
              <li>Raw milk caused fewer deaths than cantaloupe, leafy greens, and even pasteurized dairy</li>
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
              Source: Stephenson et al. 2024, <em>Journal of Epidemiology and Global Health</em>
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
              Important Precautions
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
              <strong>Talk to your healthcare provider</strong> before consuming raw milk, especially if you are:
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
              <li>Under age 5 or over age 65</li>
              <li>Pregnant or nursing</li>
              <li>Immunocompromised or taking immunosuppressive medications</li>
            </ul>
          </div>
        </section>

        {/* FAQs */}
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
            Frequently Asked Questions
          </h2>

          {[
            {
              q: "What is LACTIVAE™?",
              a: "LACTIVAE™ is unpasteurized cow's milk from grass-fed dairy cows. Unlike conventional milk, it has not undergone heat treatment (pasteurization) to kill potentially harmful bacteria. This website presents it in a pharmaceutical format to demonstrate how marketing techniques could be applied to a controversial food product.",
            },
            {
              q: "Is raw milk safe?",
              a: "When properly produced by licensed, regularly tested dairies with strong protocols, modern raw milk has a strong safety record. A 2024 study found California reported zero illnesses from 2016-2020 despite retail sales, and outbreak rates have decreased 74% since 2005. However, raw milk can contain bacteria if not properly handled, which is why sourcing from tested, licensed producers and following proper storage is critical. The FDA and CDC recommend against consumption, though recent research challenges assumptions about raw milk risk trends.",
            },
            {
              q: "What are the potential benefits?",
              a: "Some research suggests raw milk may have higher levels of certain nutrients and bioactive compounds compared to pasteurized milk. Studies have shown associations with reduced allergy and asthma risk in children, though these findings remain controversial and may be confounded by other lifestyle factors. The evidence is not sufficient to outweigh the safety risks for most people.",
            },
            {
              q: "Who should NOT consume raw milk?",
              a: "Raw milk is especially dangerous for infants and young children, older adults, pregnant women, and people with weakened immune systems (including those with HIV/AIDS, cancer, diabetes, or those taking immunosuppressive medications). Even healthy adults can become seriously ill from raw milk.",
            },
            {
              q: "What symptoms should I watch for?",
              a: "Contact your doctor immediately if you experience diarrhea (especially bloody diarrhea), stomach cramping, nausea, vomiting, fever, headache, or body aches after consuming raw milk. These could be signs of foodborne illness that requires medical attention.",
            },
            {
              q: "How should raw milk be stored?",
              a: "If you choose to consume raw milk despite the risks, keep it refrigerated at 38-40°F (3-4°C) at all times. Never leave it at room temperature. Consume within 7-10 days of production and discard immediately if you notice any off-odors or unusual taste.",
            },
            {
              q: "Is raw milk legal?",
              a: "Laws vary by state. Some states allow retail sale of raw milk, others permit only farm sales or cow-share programs, and some prohibit it entirely. Interstate sale of raw milk for human consumption is federally prohibited. Check your local regulations.",
            },
            {
              q: "Can I give raw milk to my children?",
              a: "The American Academy of Pediatrics strongly recommends against giving raw milk to children. Young children's immune systems are still developing, making them particularly vulnerable to foodborne illness. Infections that might cause mild symptoms in adults can be life-threatening in children.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className={css({
                marginBottom: "2rem",
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
                  marginBottom: "1rem",
                })}
              >
                {faq.q}
              </h3>
              <p
                className={css({
                  fontFamily: "body",
                  fontSize: "base",
                  color: "text.secondary",
                  lineHeight: "1.6",
                })}
              >
                {faq.a}
              </p>
            </div>
          ))}
        </section>

        {/* What to Expect */}
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
            What to Expect
          </h2>

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
              Taste & Texture
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "2rem",
              })}
            >
              Raw milk typically has a richer, creamier taste than pasteurized milk. The cream naturally rises to the top
              and should be shaken before consumption. Flavor varies based on the cows' diet, breed, and season.
            </p>

            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              Digestibility
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "2rem",
              })}
            >
              Some people report better tolerance of raw milk compared to pasteurized milk. However, if you're lactose
              intolerant, raw milk still contains lactose and may cause symptoms. The native lactase enzymes in raw milk
              are present in very small amounts.
            </p>

            <h3
              className={css({
                fontFamily: "body",
                fontSize: "xl",
                fontWeight: "600",
                color: "accent.secondary",
                marginBottom: "1rem",
              })}
            >
              Transition Period
            </h3>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.6",
              })}
            >
              Some consumers report mild digestive adjustment when first consuming raw milk. Start with small amounts
              if you're concerned. However, any severe or persistent symptoms should be evaluated by a healthcare provider
              as they could indicate foodborne illness.
            </p>
          </div>
        </section>

        {/* Finding Quality Sources */}
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
            Finding Quality Sources
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
            If you choose to consume raw milk, source quality is critical for reducing (though not eliminating) risk:
          </p>

          <ul
            className={css({
              fontFamily: "body",
              fontSize: "base",
              color: "text.secondary",
              lineHeight: "1.6",
              paddingLeft: "2rem",
              listStyleType: "disc",
              marginBottom: "1.5rem",
              "& li": {
                marginBottom: "1rem",
              },
            })}
          >
            <li>
              <strong>Licensed & Inspected:</strong> Only purchase from licensed facilities that undergo regular health
              department inspections
            </li>
            <li>
              <strong>Testing:</strong> Look for producers who regularly test their milk for pathogens. Ask about their
              testing frequency and recent results
            </li>
            <li>
              <strong>Cleanliness:</strong> Visit the farm if possible. Observe milking practices, animal health, and
              facility cleanliness
            </li>
            <li>
              <strong>Animal Health:</strong> Healthy cows are essential. Ask about veterinary care, feed quality, and
              herd health management
            </li>
            <li>
              <strong>Cooling:</strong> Milk should be cooled immediately after milking and maintained at proper
              refrigeration temperatures throughout distribution
            </li>
            <li>
              <strong>Freshness:</strong> Consume milk as fresh as possible. Ask about production date and never consume
              past recommended dates
            </li>
          </ul>
        </section>

        {/* When to Seek Medical Help */}
        <section
          className={css({
            marginBottom: "4rem",
            padding: "2rem",
            bg: "bg.tertiary",
            border: "2px solid",
            borderColor: "accent.secondary",
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
            When to Seek Medical Help
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
            Seek immediate medical attention if you experience:
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
            <li>Bloody diarrhea</li>
            <li>High fever (over 101.5°F / 38.6°C)</li>
            <li>Severe abdominal cramping</li>
            <li>Signs of dehydration (decreased urination, dizziness, extreme thirst)</li>
            <li>Symptoms lasting more than 3 days</li>
            <li>Symptoms in pregnant women or immunocompromised individuals</li>
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
              Full Safety Information
            </Link>
            <Link
              href="/studies"
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
              Research & Studies
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
