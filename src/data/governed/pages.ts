import { APPROVED, type Claim } from "../claim-types.ts";
import {
  STEPHENSON_DEATHS, STEPHENSON_CA, STEPHENSON_HOSP, WHITEHEAD_74,
  CLAEYS_REVIEW, CLAEYS_ENZYMES, PEILA_BIOACTIVES, HAAS_HTST, MACDONALD_VITAMINS, BENBROOK_OMEGA3, MUMMAH_LACTOSE, USDA_UNFORTIFIED,
  BRICK_ASTHMA, BRICK_DISCOURAGED, GABRIELA_ASTHMA, PARSIFAL_ASTHMA, PASTURE_30, PASTURE_CRP,
} from "./refs.ts";

const EPI = ["safety", "surveillance"];
const ALLERGY = ["allergy", "asthma", "pediatric"];

/** Page-specific claims for Nutritional Data, Patients, Providers and Safety */
export const pageClaims: Claim[] = [
  // ------------------------------------------------------- nutritional data
  { id: "nutr-serving-basis", label: "Nutrition tables: unfortified whole milk basis", type: "factual", topic: ["nutrition"],
    text: "Values are for unfortified whole cow’s milk.", refs: [USDA_UNFORTIFIED], safety: [], ...APPROVED },
  { id: "nutr-vitd-unfortified", label: "Raw milk is not vitamin-D fortified", type: "composition", topic: ["nutrition", "vitamins"],
    text: "Raw milk is not fortified with vitamin D, so the vitamin D content is far below that of store milk.", refs: [USDA_UNFORTIFIED], safety: [], ...APPROVED },
  { id: "nutr-row-vitd", label: "Vitamin D3 per 8 oz (unfortified)", type: "composition", topic: ["nutrition", "vitamins"],
    text: "Vitamin D3 (cholecalciferol): about 5 IU (0.1 mcg) per 8 oz serving, under 1% of the Daily Value; unfortified, whereas store milk is fortified to about 100 IU per serving.",
    data: { name: "Vitamin D3 (Cholecalciferol)", amount: "~5 IU (0.1 mcg)", dv: "<1%", benefits: "Bone health, immune modulation. Unfortified; store milk is fortified to ~100 IU per serving" },
    refs: [USDA_UNFORTIFIED], safety: [], ...APPROVED },
  { id: "nutr-row-vitc", label: "Vitamin C per 8 oz (raw)", type: "composition", topic: ["nutrition", "vitamins"],
    text: "Vitamin C (ascorbic acid): 2.3 mg per 8 oz serving, about 3% of the Daily Value.",
    data: { name: "Vitamin C (Ascorbic Acid)", amount: "2.3 mg", dv: "3%", benefits: "Immune function, collagen synthesis" },
    refs: [CLAEYS_REVIEW], safety: [], ...APPROVED, note: "USDA lists 0 mg for pasteurized whole milk; raw value attributed to Claeys 2013 (unverified)." },
  { id: "nutr-native-enzymes", label: "Native enzymes remain active in raw milk", type: "composition", topic: ["enzymes"],
    text: "Lipase, alkaline phosphatase and the lactoperoxidase system remain active in raw milk.", refs: [CLAEYS_ENZYMES], safety: [], ...APPROVED },
  { id: "lactose-no-benefit", label: "No lactose-intolerance benefit (Mummah 2014)", type: "efficacy", topic: ["lactose", "digestion"],
    text: "Raw milk contains negligible lactase; a randomized crossover trial found no improvement in lactose intolerance symptoms versus pasteurized milk.", refs: [MUMMAH_LACTOSE], safety: [], ...APPROVED,
    rationale: "Guards against the most common unsupported raw-milk claim." },

  // --------------------------------------------------------------- patients
  { id: "pat-safety-intro", label: "Patients: safety evidence intro", type: "factual", topic: EPI,
    text: "A 2024 analysis of 16 years of CDC surveillance data (2005–2020), together with an earlier outbreak-trend study, found that properly produced raw milk from licensed, tested sources has a stronger safety record than commonly assumed:",
    refs: [STEPHENSON_DEATHS, WHITEHEAD_74], safety: ["risk-harmful-bacteria"], ...APPROVED },
  { id: "raw-retains-bioactives", label: "Raw milk retains heat-sensitive components", type: "composition", topic: ["bioactives", "pasteurization"],
    text: "Some research suggests raw milk retains heat-sensitive enzymes, immune proteins and live bacteria that pasteurization reduces or destroys.", refs: [CLAEYS_REVIEW, PEILA_BIOACTIVES], safety: [], ...APPROVED },
  { id: "cohorts-asthma-allergy", label: "Cohorts: asthma/allergy association, observational caveat", type: "efficacy", topic: ALLERGY,
    text: "Large European cohort studies have found associations between early-life raw farm milk consumption and lower rates of asthma and allergy in children, though these are observational findings that may be confounded by other lifestyle factors.",
    refs: [BRICK_ASTHMA, GABRIELA_ASTHMA, PARSIFAL_ASTHMA], safety: ["reg-not-fda-approved"], ...APPROVED },
  { id: "authors-advise-against", label: "Study authors advise against raw milk", type: "factual", topic: ["safety", "fair-balance"],
    text: "The authors of those studies advise against raw milk consumption because of infection risk, and the evidence is not sufficient to outweigh the safety risks for most people.", refs: [BRICK_DISCOURAGED], safety: [], ...APPROVED },

  // -------------------------------------------------------------- providers
  { id: "prov-allergic-disease", label: "Providers: allergic disease evidence", type: "efficacy", topic: ALLERGY,
    text: "The GABRIELA and PARSIFAL studies found inverse associations between farm milk consumption and asthma and allergic rhinitis in children; a 2020 meta-analysis of eight studies pooled the asthma association at OR 0.58 (95% CI 0.49–0.69)",
    refs: [GABRIELA_ASTHMA, PARSIFAL_ASTHMA, BRICK_ASTHMA], safety: ["reg-not-fda-approved"], ...APPROVED },
  { id: "prov-respiratory", label: "Providers: PASTURE respiratory infections", type: "efficacy", topic: ["respiratory", "infant"],
    text: "In the PASTURE birth cohort, raw milk consumption was associated with about 30% fewer respiratory infections and fever episodes in the first year of life, and lower CRP at 12 months", refs: [PASTURE_30, PASTURE_CRP], safety: ["contra-under-5"], ...APPROVED },
  { id: "prov-nutritional-content", label: "Providers: nutritional content summary", type: "composition", topic: ["nutrition", "pasteurization"],
    text: "Modest reductions in B1, B2, C and folate with pasteurization; native enzymes (alkaline phosphatase, lipase, lactoperoxidase), IgM and a substantial share of lactoferrin are lost; minerals are unaffected",
    refs: [MACDONALD_VITAMINS, CLAEYS_REVIEW, HAAS_HTST], safety: [], ...APPROVED },
  { id: "prov-fatty-acid", label: "Providers: omega-3 feeding effect", type: "composition", topic: ["nutrition", "fatty-acids", "grass-fed"],
    text: "Grass-fed milk has roughly 2.5 times the omega-3 content of conventional milk, an effect of feeding rather than of pasteurization", refs: [BENBROOK_OMEGA3], safety: [], ...APPROVED },
  { id: "prov-lactose", label: "Providers: counsel that lactose claim is unsupported", type: "efficacy", topic: ["lactose", "digestion"],
    text: "A randomized crossover pilot found no benefit of raw over pasteurized milk; counsel patients that this common claim is not supported", refs: [MUMMAH_LACTOSE], safety: [], ...APPROVED },

  // ----------------------------------------------------------------- safety
  { id: "safety-evidence-intro", label: "Safety page: evidence intro", type: "factual", topic: EPI,
    text: "A 2024 study published in the *Journal of Epidemiology and Global Health* analyzed 16 years of CDC surveillance data (2005–2020), and an earlier analysis examined outbreak trends against legalization and consumption growth (2005–2016):",
    refs: [STEPHENSON_DEATHS, WHITEHEAD_74], safety: [], ...APPROVED },
  { id: "stat-deaths-0-2", label: "Stat: 0–2 deaths in 16 years", type: "epidemiology", topic: EPI, headline: "0–2 deaths",
    text: "Total deaths from raw milk in 16 years (vs. 5 deaths from pasteurized dairy)", refs: [STEPHENSON_DEATHS], safety: ["risk-harmful-bacteria"], ...APPROVED },
  { id: "stat-outbreak-74", label: "Stat: 74% decrease in outbreak rates", type: "epidemiology", topic: EPI, headline: "74% decrease",
    text: "In outbreak rates from 2005 to 2016, after adjusting for growth in population and consumption", refs: [WHITEHEAD_74], safety: [], ...APPROVED },
  { id: "stat-ca-zero", label: "Stat: zero illnesses in California", type: "epidemiology", topic: EPI, headline: "Zero illnesses",
    text: "Reported in California (2016–2020) despite retail grocery store sales", refs: [STEPHENSON_CA], safety: [], ...APPROVED },
  { id: "stat-hosp", label: "Stat: hospitalizations 0 typical, 10 max", type: "epidemiology", topic: EPI, headline: "0 typical, 10 max",
    text: "Hospitalizations from raw milk per year nationally: typically zero, never more than 10", refs: [STEPHENSON_HOSP], safety: ["risk-harmful-bacteria"], ...APPROVED },
];
