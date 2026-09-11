import { APPROVED, type Claim } from "../claim-types.ts";
import {
  BRICK_ASTHMA, BRICK_STUDIES, BRICK_OTHER, BRICK_RURAL, BRICK_DISCOURAGED,
  GABRIELA_DESIGN, GABRIELA_ASTHMA, GABRIELA_WHEY,
  PARSIFAL_DESIGN, PARSIFAL_ASTHMA, PARSIFAL_INDEPENDENT,
  PASTURE_DESIGN, PASTURE_OR, PASTURE_30, PASTURE_CRP,
  BENBROOK_DESIGN, BENBROOK_OMEGA3, BENBROOK_VALUES,
  CLAEYS_REVIEW, CLAEYS_ENZYMES, CLAEYS_MINERALS, MACDONALD_VITAMINS, PEILA_BIOACTIVES, HAAS_HTST,
  CARDIN_63, CARDIN_DAF16, CARDIN_OXIDATIVE, CARDIN_ROS,
} from "./refs.ts";

const ALLERGY = ["allergy", "asthma", "pediatric"];
const FB = ["reg-not-fda-approved"];

/** Clinical Studies page */
export const studiesClaims: Claim[] = [
  // ---------------------------------------------------------- key findings
  { id: "studies-kf-asthma-42", label: "42% lower odds of asthma (studies key finding)", type: "efficacy", topic: ALLERGY, headline: "42%",
    text: "Lower odds of asthma in children who consumed raw farm milk early in life (meta-analysis of 8 studies, OR 0.58)", refs: [BRICK_ASTHMA], safety: FB, ...APPROVED },
  { id: "studies-kf-omega3-147", label: "147% higher omega-3, grass-fed (studies key finding)", type: "composition", topic: ["nutrition", "fatty-acids", "grass-fed"], headline: "147%",
    text: "Higher total omega-3 content in grass-fed milk than in conventional milk (a feeding effect, not a pasteurization effect)", refs: [BENBROOK_OMEGA3], safety: [], ...APPROVED },
  { id: "studies-kf-lifespan-63", label: "63% longer maximum lifespan in C. elegans (studies key finding)", type: "efficacy", topic: ["longevity", "model-organism"], headline: "63%",
    text: "Longer maximum lifespan in *C. elegans* given freeze-dried raw-milk cheese (nematode model, not a human outcome)", refs: [CARDIN_63], safety: [], ...APPROVED,
    note: "Nematode model; raw goat-milk cheese, not fluid milk." },

  // -------------------------------------------------------------- GABRIELA
  { id: "gabriela-design", label: "GABRIELA study design", type: "factual", topic: ALLERGY,
    text: "Cross-sectional study of 8,334 school-aged children in rural Germany, Austria and Switzerland, with milk constituents measured directly in 800 household samples:", refs: [GABRIELA_DESIGN], safety: [], ...APPROVED },
  { id: "gabriela-asthma-41", label: "GABRIELA: 41% lower odds of asthma", type: "efficacy", topic: ALLERGY,
    text: "41% lower odds of asthma with reported raw milk consumption (aOR 0.59, 95% CI 0.46–0.74)", refs: [GABRIELA_ASTHMA], safety: FB, ...APPROVED },
  { id: "gabriela-hayfever-49", label: "GABRIELA: 49% lower odds of hay fever, 26% atopy", type: "efficacy", topic: ALLERGY,
    text: "49% lower odds of hay fever (aOR 0.51, 95% CI 0.37–0.69) and 26% lower odds of atopy (aOR 0.74)", refs: [GABRIELA_ASTHMA], safety: FB, ...APPROVED },
  { id: "gabriela-independent", label: "GABRIELA: independent of farm exposure; boiled milk no effect", type: "efficacy", topic: ALLERGY,
    text: "Association held independent of other farm exposures; boiled farm milk showed no protective effect", refs: [GABRIELA_ASTHMA], safety: [], ...APPROVED },
  { id: "gabriela-whey", label: "GABRIELA: whey proteins inversely associated with asthma", type: "efficacy", topic: ALLERGY,
    text: "Higher levels of the heat-sensitive whey proteins BSA, α-lactalbumin and β-lactoglobulin in the milk were each inversely associated with asthma", refs: [GABRIELA_WHEY], safety: [], ...APPROVED },

  // -------------------------------------------------------------- PARSIFAL
  { id: "parsifal-design", label: "PARSIFAL study design", type: "factual", topic: ALLERGY,
    text: "Cross-sectional multi-centre study of 14,893 children aged 5–13 in five European countries, comparing farm-produced with shop-purchased dairy:", refs: [PARSIFAL_DESIGN], safety: [], ...APPROVED },
  { id: "parsifal-asthma-26", label: "PARSIFAL: 26% lower odds of asthma", type: "efficacy", topic: ALLERGY,
    text: "26% lower odds of asthma with farm milk consumption ever in life (aOR 0.74, 95% CI 0.61–0.88)", refs: [PARSIFAL_ASTHMA], safety: FB, ...APPROVED },
  { id: "parsifal-rhino-44", label: "PARSIFAL: 44% lower odds of rhinoconjunctivitis", type: "efficacy", topic: ALLERGY,
    text: "44% lower odds of rhinoconjunctivitis (aOR 0.56, 95% CI 0.43–0.73) and lower odds of sensitization to pollen and common foods", refs: [PARSIFAL_ASTHMA], safety: FB, ...APPROVED },
  { id: "parsifal-independent", label: "PARSIFAL: consistent across subpopulations", type: "efficacy", topic: ALLERGY,
    text: "Observed in all four subpopulations and independent of other farm-related exposures; other farm-produced foods showed no independent association", refs: [PARSIFAL_INDEPENDENT], safety: [], ...APPROVED },

  // --------------------------------------------------------------- PASTURE
  { id: "pasture-design", label: "PASTURE cohort design", type: "factual", topic: ["respiratory", "infant"],
    text: "Prospective cohort of 983 rural infants in five European countries, followed with weekly health diaries through the first year of life (37,306 person-weeks):", refs: [PASTURE_DESIGN], safety: [], ...APPROVED },
  { id: "pasture-infections-or", label: "PASTURE: odds ratios for infections", type: "efficacy", topic: ["respiratory", "infant"],
    text: "Versus ultra-heat-treated milk, raw milk consumption was inversely associated with rhinitis (aOR 0.71), respiratory tract infections (aOR 0.77), otitis (aOR 0.14) and fever (aOR 0.69)", refs: [PASTURE_OR], safety: ["contra-under-5"], ...APPROVED },
  { id: "pasture-30", label: "PASTURE: ~30% fewer respiratory infections and fever", type: "efficacy", topic: ["respiratory", "infant"],
    text: "The authors summarize this as roughly 30% fewer manifest respiratory infections and fever episodes", refs: [PASTURE_30], safety: ["contra-under-5"], ...APPROVED },
  { id: "pasture-crp", label: "PASTURE: lower CRP at 12 months", type: "efficacy", topic: ["inflammation", "infant"],
    text: "Lower C-reactive protein at 12 months (geometric mean ratio 0.66, 95% CI 0.45–0.98), consistent with a sustained anti-inflammatory effect", refs: [PASTURE_CRP], safety: [], ...APPROVED },
  { id: "pasture-boiled", label: "PASTURE: boiled milk weaker", type: "efficacy", topic: ["respiratory", "infant"],
    text: "Boiled farm milk showed similar but weaker associations", refs: [PASTURE_OR], safety: [], ...APPROVED },

  // --------------------------------------------------------- meta-analysis
  { id: "meta-design", label: "Meta-analysis scope", type: "factual", topic: ALLERGY,
    text: "Pooled analysis of 8 studies (12 publications) on raw farm milk consumption between infancy and age five:", refs: [BRICK_STUDIES], safety: [], ...APPROVED },
  { id: "meta-asthma-42", label: "Meta-analysis: 42% lower odds of asthma", type: "efficacy", topic: ALLERGY,
    text: "42% lower odds of asthma (OR 0.58, 95% CI 0.49–0.69)", refs: [BRICK_ASTHMA], safety: FB, ...APPROVED },
  { id: "meta-other-outcomes", label: "Meta-analysis: wheeze, hay fever, sensitization", type: "efficacy", topic: ALLERGY,
    text: "Lower odds of current wheeze (OR 0.66), hay fever or allergic rhinitis (OR 0.68) and atopic sensitization (OR 0.76)", refs: [BRICK_OTHER], safety: FB, ...APPROVED },
  { id: "meta-rural-independent", label: "Meta-analysis: effect in rural non-farm children", type: "efficacy", topic: ALLERGY,
    text: "The asthma association was present in children living in rural areas but not on farms (OR 0.60), suggesting it is independent of other farm exposures", refs: [BRICK_RURAL], safety: [], ...APPROVED },
  { id: "meta-discouraged", label: "Meta-analysis authors discourage raw milk; MARTHA trial", type: "factual", topic: ["safety", "fair-balance"],
    text: "The authors nonetheless strongly discourage raw milk consumption because of the risk of life-threatening infection, and are testing microbiologically safe, minimally processed milk in the MARTHA trial", refs: [BRICK_DISCOURAGED], safety: [], ...APPROVED },

  // ------------------------------------------------------------- Benbrook
  { id: "benbrook-design", label: "Benbrook study design; feeding not pasteurization", type: "factual", topic: ["nutrition", "fatty-acids", "grass-fed"],
    text: "US-wide analysis of 1,163 milk samples over three years comparing cows on a nearly 100% forage diet with conventional and organic management. These differences come from what the cows ate, not from whether the milk was pasteurized:", refs: [BENBROOK_DESIGN], safety: [], ...APPROVED },
  { id: "benbrook-omega3-147", label: "Benbrook: 147% higher omega-3", type: "composition", topic: ["nutrition", "fatty-acids", "grass-fed"],
    text: "147% higher total omega-3 content in grass-fed milk (0.049 vs 0.020 g/100 g)", refs: [BENBROOK_OMEGA3, BENBROOK_VALUES], safety: [], ...APPROVED },
  { id: "benbrook-ratio", label: "Benbrook: omega-6:3 ratio 0.95 vs 2.28 vs 5.77", type: "composition", topic: ["nutrition", "fatty-acids", "grass-fed"],
    text: "Omega-6 to omega-3 ratio of 0.95:1 in grass-fed milk versus 2.28:1 in organic and 5.77:1 in conventional milk", refs: [BENBROOK_VALUES], safety: [], ...APPROVED },
  { id: "benbrook-cla-126", label: "Benbrook: 126% higher CLA", type: "composition", topic: ["nutrition", "fatty-acids", "grass-fed"],
    text: "126% higher conjugated linoleic acid (CLA) content (0.043 vs 0.019 g/100 g)", refs: [BENBROOK_VALUES], safety: [], ...APPROVED },

  // -------------------------------------------------------- heat-sensitive
  { id: "heat-vitamins", label: "Pasteurization: vitamin changes (Macdonald)", type: "composition", topic: ["nutrition", "vitamins", "pasteurization"],
    text: "Vitamins B1, B2, C and folate significantly decreased; B6 unchanged; B12 and E decreased qualitatively. The reviewers judged the overall nutritional impact minimal because milk is not a major source of these vitamins (meta-analysis of 40 studies)", refs: [MACDONALD_VITAMINS], safety: [], ...APPROVED },
  { id: "heat-minerals", label: "Pasteurization: minerals unaffected", type: "composition", topic: ["nutrition", "minerals", "pasteurization"],
    text: "No significant effect on calcium, phosphorus, iron, zinc or iodine content or bioavailability", refs: [CLAEYS_MINERALS], safety: [], ...APPROVED },
  { id: "heat-enzymes", label: "Pasteurization: ALP, lactoperoxidase, lipase", type: "composition", topic: ["enzymes", "pasteurization"],
    text: "Alkaline phosphatase completely inactivated (it is the regulatory marker of adequate pasteurization); lactoperoxidase system and lipase destroyed", refs: [CLAEYS_ENZYMES], safety: [], ...APPROVED },
  { id: "heat-immunoglobulins", label: "Pasteurization: IgG stable, IgA reduced, IgM destroyed", type: "composition", topic: ["bioactives", "pasteurization"],
    text: "IgG, the predominant bovine immunoglobulin, is largely heat-stable under HTST (about 1% denaturation); IgA reduced roughly 20–35%; IgM destroyed", refs: [CLAEYS_REVIEW, PEILA_BIOACTIVES], safety: [], ...APPROVED },
  { id: "heat-lactoferrin", label: "Pasteurization: lactoferrin 35–65% reduced", type: "composition", topic: ["bioactives", "pasteurization"],
    text: "Lactoferrin reduced 35–65% and IgA, IgM and enzyme activity significantly lower after commercial HTST processing", refs: [PEILA_BIOACTIVES, HAAS_HTST], safety: [], ...APPROVED },

  // ------------------------------------------------------------ C. elegans
  { id: "celegans-design", label: "C. elegans model design", type: "factual", topic: ["longevity", "model-organism"],
    text: "Research using *Caenorhabditis elegans* (nematode worm) as a model organism, fed freeze-dried raw goat-milk cheese and its chemical extracts:", refs: [CARDIN_DAF16], safety: [], ...APPROVED },
  { id: "celegans-63", label: "C. elegans: 63% maximum lifespan", type: "efficacy", topic: ["longevity", "model-organism"],
    text: "63% increase in maximum lifespan with freeze-dried raw-milk cheese", refs: [CARDIN_63], safety: [], ...APPROVED, note: "Nematode model; not a human outcome." },
  { id: "celegans-daf16", label: "C. elegans: DAF-2/DAF-16 activation", type: "efficacy", topic: ["longevity", "model-organism"],
    text: "Activation of the insulin-like DAF-2/DAF-16 (FOXO homolog) pathway, shown with mutant strains and nuclear translocation of DAF-16", refs: [CARDIN_DAF16], safety: [], ...APPROVED },
  { id: "celegans-oxidative", label: "C. elegans: oxidative stress survival", type: "efficacy", topic: ["longevity", "model-organism"],
    text: "Increased survival under oxidative stress with every extract tested", refs: [CARDIN_OXIDATIVE], safety: [], ...APPROVED },
  { id: "celegans-ros", label: "Human leukocytes: ROS reduced 23% and 28%", type: "efficacy", topic: ["longevity", "in-vitro"],
    text: "Cheese-lipid extract and the water-soluble extract W70 reduced reactive oxygen species production in human leukocytes by 23% and 28%", refs: [CARDIN_ROS], safety: [], ...APPROVED, note: "In vitro leukocyte assay, not a clinical outcome." },
];
