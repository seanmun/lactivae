import { APPROVED, type Claim } from "../claim-types.ts";
import { STEPHENSON_HOSP, STEPHENSON_DEATHS, STEPHENSON_CA, STEPHENSON_CONCLUSION, WHITEHEAD_74, SEBASTIANSKI_LISTERIA, FDA_PAGE, CDC_PAGE, COLEMAN_REFRIGERATION, RAWMI_STANDARDS, REALMILK_LEGAL } from "./refs.ts";

const EPI = ["safety", "surveillance"];

/**
 * Outbreak-surveillance and regulatory statements shared by the Patients,
 * Providers and Safety pages. Each fact has exactly one approved wording.
 */
export const surveillanceClaims: Claim[] = [
  { id: "stephenson-summary", label: "Stephenson 2024: hospitalizations typically zero; pasteurized dairy more deaths", type: "epidemiology", topic: EPI,
    text: "A study in the *Journal of Epidemiology and Global Health* analyzing 16 years of CDC surveillance data (2005–2020) found that hospitalizations from raw milk were typically zero, with a maximum of 10 in any year nationally, and that pasteurized dairy accounted for more deaths than raw milk over the period.",
    refs: [STEPHENSON_HOSP, STEPHENSON_DEATHS], safety: ["risk-harmful-bacteria"], ...APPROVED },
  { id: "whitehead-74-adjusted", label: "Whitehead 2018: outbreak rate down 74% adjusted (sentence)", type: "epidemiology", topic: EPI,
    text: "A separate analysis of 2005–2016 outbreak data found the outbreak rate effectively decreased 74% after adjusting for growth in consumption.", refs: [WHITEHEAD_74], safety: [], ...APPROVED },
  { id: "stephenson-conclusion-quote", label: "Stephenson 2024 conclusion (quoted)", type: "epidemiology", topic: EPI,
    text: "The 2024 study concluded: *“The available evidence conflicts with assumptions of zero risk for pasteurized milk and increasing trends in the burden of illness for raw milk.”*", refs: [STEPHENSON_CONCLUSION], safety: [], ...APPROVED },
  { id: "surveillance-intro", label: "Key findings intro (providers)", type: "factual", topic: EPI,
    text: "Key findings from recent surveillance analyses for informed patient discussions:", refs: [STEPHENSON_DEATHS, WHITEHEAD_74], safety: [], ...APPROVED },
  { id: "deaths-raw-vs-pasteurized", label: "Deaths: raw 0–2 vs pasteurized 5 (2005–2020)", type: "epidemiology", topic: EPI,
    text: "Raw milk: 0–2 deaths over 16 years vs. pasteurized dairy: 5 deaths (same period)", refs: [STEPHENSON_DEATHS], safety: ["risk-harmful-bacteria"], ...APPROVED },
  { id: "ca-zero-illnesses", label: "California: zero illnesses 2016–2020", type: "epidemiology", topic: EPI,
    text: "California reported zero illnesses from 2016–2020 despite retail grocery store sales", refs: [STEPHENSON_CA], safety: [], ...APPROVED },
  { id: "hosp-typically-zero", label: "Hospitalizations typically zero, max 10/year", type: "epidemiology", topic: EPI,
    text: "Hospitalizations from raw milk were typically zero, with a maximum of 10 in any single year nationally", refs: [STEPHENSON_HOSP], safety: ["risk-harmful-bacteria"], ...APPROVED },
  { id: "outbreak-74-adjusted", label: "Outbreak rates down 74% (2005–2016, adjusted)", type: "epidemiology", topic: EPI,
    text: "Outbreak rates decreased 74% from 2005 to 2016 after adjusting for growth in population and consumption", refs: [WHITEHEAD_74], safety: [], ...APPROVED },
  { id: "deaths-comparative-foods", label: "Deaths: raw milk vs cantaloupe, peanut butter, leafy greens, pasteurized dairy", type: "epidemiology", topic: EPI,
    text: "Raw milk caused fewer deaths (0–2) than cantaloupe (38), peanut butter (10), leafy greens (6), and pasteurized dairy (5) over the same period", refs: [STEPHENSON_DEATHS], safety: ["risk-harmful-bacteria"], ...APPROVED },
  { id: "pasteurized-outbreaks-listeria", label: "Sebastianski 2022: Listeria and severity in pasteurized outbreaks", type: "epidemiology", topic: EPI,
    text: "In pasteurized-dairy outbreaks, *Listeria* was more often the agent and the proportions of hospitalizations and deaths were higher than in unpasteurized outbreaks", refs: [SEBASTIANSKI_LISTERIA], safety: [], ...APPROVED },

  // ------------------------------------------------------ deaths by food list
  { id: "deaths-cantaloupe", label: "Cantaloupe: 38 deaths", type: "epidemiology", topic: EPI, text: "Cantaloupe: 38 deaths (19x more than raw milk)", refs: [STEPHENSON_DEATHS], safety: [], ...APPROVED },
  { id: "deaths-peanut-butter", label: "Peanut butter: 10 deaths", type: "epidemiology", topic: EPI, text: "Peanut butter: 10 deaths (5x more than raw milk)", refs: [STEPHENSON_DEATHS], safety: [], ...APPROVED },
  { id: "deaths-leafy-greens", label: "Leafy greens: 6 deaths", type: "epidemiology", topic: EPI, text: "Leafy greens: 6 deaths (3x more than raw milk)", refs: [STEPHENSON_DEATHS], safety: [], ...APPROVED },
  { id: "deaths-pasteurized-dairy", label: "Pasteurized dairy: 5 deaths", type: "epidemiology", topic: EPI, text: "Pasteurized dairy: 5 deaths (2.5x more than raw milk)", refs: [STEPHENSON_DEATHS], safety: [], ...APPROVED },
  { id: "deaths-raw-milk", label: "Raw milk: 0–2 deaths", type: "epidemiology", topic: EPI, text: "**Raw milk: 0–2 deaths**", refs: [STEPHENSON_DEATHS], safety: ["risk-harmful-bacteria"], ...APPROVED },
  { id: "deaths-by-food-intro", label: "Deaths by food intro", type: "factual", topic: EPI, text: "Deaths by food, CDC outbreak surveillance 2005–2020:", refs: [STEPHENSON_DEATHS], safety: [], ...APPROVED },

  // ------------------------------------------------------------- regulatory
  { id: "fda-cdc-recommend-against", label: "FDA and CDC recommend against; research challenges trend assumptions", type: "regulatory", topic: ["regulatory"],
    text: "The FDA and CDC recommend against consumption, though recent research challenges assumptions about raw milk risk trends.", refs: [FDA_PAGE, CDC_PAGE, STEPHENSON_CONCLUSION], safety: [], ...APPROVED },
  { id: "aap-fda-cdc-position", label: "AAP, FDA and CDC traditional position", type: "regulatory", topic: ["regulatory"],
    text: "The American Academy of Pediatrics, FDA, and CDC recommend against raw milk consumption due to potential pathogen contamination.", refs: [FDA_PAGE, CDC_PAGE], safety: [], ...APPROVED },
  { id: "fda-harbor-microorganisms", label: "FDA: raw milk can harbor dangerous microorganisms", type: "regulatory", topic: ["regulatory"],
    text: "The U.S. Food and Drug Administration states that raw milk can harbor dangerous microorganisms that can pose serious health risks.", refs: [FDA_PAGE], safety: [], ...APPROVED },
  { id: "legal-status-varies", label: "Legal status varies by state", type: "regulatory", topic: ["regulatory"],
    text: "Legal status varies by state.", refs: [REALMILK_LEGAL], safety: [], ...APPROVED },

  // --------------------------------------------------------- sourcing advice
  { id: "producer-testing", label: "Ask producers about pathogen testing", type: "factual", topic: ["sourcing"],
    text: "Look for producers who regularly test their milk for pathogens. Ask about their testing frequency and recent results", refs: [RAWMI_STANDARDS], safety: [], ...APPROVED },
  { id: "refrigeration-suppresses", label: "Coleman 2023: pathogens did not grow under refrigeration", type: "epidemiology", topic: ["sourcing", "handling"],
    text: "Major bacterial pathogens did not grow in raw milk held at recommended refrigeration temperature in a controlled study.", refs: [COLEMAN_REFRIGERATION], safety: ["mit-refrigerate"], ...APPROVED },
];
