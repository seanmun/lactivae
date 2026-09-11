/**
 * Governed claims — the atomic regulated units of LACTIVAE™ copy.
 *
 * A claim is a durable object with identity, approved text, evidence, fair-balance
 * links, and lifecycle state. Pages render claims with <Claim id="..."/> rather than
 * typing the sentence, so a sentence has one approved wording no matter where it
 * appears, and the regulatory graph (scripts/build-graph.mts) can see every usage.
 *
 * Rules enforced by the graph build:
 *   - a claim rendered on a public page must have status "approved"
 *   - evidence-bearing claim types must cite at least one reference
 *   - every cited reference key must exist in references.ts
 *
 * Inline formatting in `text`: *italic* and **bold** only.
 */

export type ClaimType =
  | "efficacy" // health outcome association
  | "composition" // nutrient or bioactive content
  | "epidemiology" // outbreak / surveillance statistics
  | "regulatory" // legal / regulatory status
  | "factual"; // framing statement that is checkable but not a health claim

export type ClaimStatus = "draft" | "under-review" | "approved" | "superseded" | "retired";

export interface ClaimRef {
  /** Key in src/data/references.ts */
  key: string;
  /** Where in the source the support is found: "Abstract", "Table 3", "p. 4 ¶2" */
  locator?: string;
  /** The supporting passage, verbatim, so a reviewer can check without opening the paper */
  quote?: string;
}

export interface Claim {
  id: string;
  label: string;
  type: ClaimType;
  topic: string[];
  /** Big number for stat cards ("42%"); optional */
  headline?: string;
  /** Approved copy, exactly as rendered */
  text: string;
  refs: ClaimRef[];
  /** Safety object ids that must accompany this claim (fair balance) */
  safety: string[];
  /** Structured values for table-cell claims; the page reads these, never retypes them */
  data?: Record<string, string>;
  status: ClaimStatus;
  version: number;
  effectiveFrom: string;
  approvedBy?: string;
  rationale?: string;
  supersedes?: string;
  /** Caution for reviewers (model organism, feeding vs processing, etc.) */
  note?: string;
}

const APPROVED = { status: "approved" as const, version: 1, effectiveFrom: "2026-09-10" };

const BRICK_ASTHMA: ClaimRef = {
  key: "brick-2020",
  locator: "Abstract",
  quote:
    "A meta-analysis corroborated the protective effect of raw milk consumption early in life (<1 to 5 years, according to study) on asthma (odds ratio [OR], 0.58; 95% CI, 0.49-0.69).",
};

const BENBROOK_OMEGA3: ClaimRef = {
  key: "benbrook-2018",
  locator: "Results, fatty acid profile",
  quote:
    "The mean level of total ω‐3 in the adjusted grassmilk samples is more than twice that in the conventional samples (up 147%).",
};

const BENBROOK_ABSTRACT_VALUES: ClaimRef = {
  key: "benbrook-2018",
  locator: "Abstract",
  quote:
    "total omega-3 levels were 0.049, 0.032, and 0.020 g/100 g milk; total conjugated linoleic acid levels were 0.043, 0.023, and 0.019 g/100 g milk [grassmilk, organic, conventional].",
};

const LOSS_RESP: ClaimRef = {
  key: "loss-2015",
  locator: "Abstract",
  quote:
    "Early life consumption of raw cow's milk reduced the risk of manifest respiratory infections and fever by about 30%.",
};

const CARDIN_63: ClaimRef = {
  key: "cardin-2021",
  locator: "Results, longevity assay",
  quote: "The freeze-dried cheese presented the ability to increase the maximum lifespan by 63%.",
};

const CLAEYS_REVIEW: ClaimRef = { key: "claeys-2013", locator: "Review, effects of heat treatment" };
const MACDONALD_VITAMINS: ClaimRef = {
  key: "macdonald-2011",
  locator: "Abstract",
  quote:
    "Pasteurization significantly decreased vitamin B1, B2, C and folate concentrations; the effect of pasteurization on milk's nutritive value was minimal because many of these vitamins are naturally found in relatively low levels.",
};
const PEILA_BIOACTIVES: ClaimRef = { key: "peila-2016", locator: "Review, immunoglobulins and lactoferrin" };
const HAAS_HTST: ClaimRef = { key: "haas-2025", locator: "Abstract" };

export const claims: Claim[] = [
  // ------------------------------------------------------------- home: hero
  {
    id: "hero-asthma-42",
    label: "42% lower odds of childhood asthma (hero)",
    type: "efficacy",
    topic: ["allergy", "asthma", "pediatric"],
    headline: "42%",
    text: "Lower odds of childhood asthma",
    refs: [BRICK_ASTHMA],
    safety: ["reg-not-fda-approved", "contra-summary"],
    ...APPROVED,
    rationale: "OR 0.58 from the 2020 meta-analysis; expressed as 1 − OR. Observational evidence only.",
  },
  {
    id: "hero-omega3-147",
    label: "147% more omega-3 in grass-fed milk (hero)",
    type: "composition",
    topic: ["nutrition", "fatty-acids", "grass-fed"],
    headline: "147%",
    text: "More omega-3 in grass-fed milk",
    refs: [BENBROOK_OMEGA3],
    safety: [],
    ...APPROVED,
    note: "Compares grass-fed with conventional feeding, not raw with pasteurized milk.",
  },
  {
    id: "hero-respiratory-30",
    label: "30% fewer respiratory infections in infants (hero)",
    type: "efficacy",
    topic: ["respiratory", "infection", "infant"],
    headline: "30%",
    text: "Fewer respiratory infections in infants",
    refs: [LOSS_RESP],
    safety: ["contra-under-5", "reg-not-fda-approved"],
    ...APPROVED,
    note: "The study population is infants; the ISI advises against raw milk for children under 5. Fair-balance tension is deliberate and must stay visible.",
  },

  // --------------------------------------------------------- home: benefits
  {
    id: "benefit-asthma-meta-or",
    label: "42% lower odds of asthma, meta-analysis OR 0.58",
    type: "efficacy",
    topic: ["allergy", "asthma", "pediatric"],
    headline: "42%",
    text: "Lower odds of childhood asthma (meta-analysis, OR 0.58)",
    refs: [BRICK_ASTHMA],
    safety: ["reg-not-fda-approved"],
    ...APPROVED,
  },
  {
    id: "benefit-omega3-vs-conventional",
    label: "147% more omega-3, grass-fed vs conventional",
    type: "composition",
    topic: ["nutrition", "fatty-acids", "grass-fed"],
    headline: "147%",
    text: "More omega-3 in grass-fed versus conventional milk",
    refs: [BENBROOK_OMEGA3],
    safety: [],
    ...APPROVED,
    note: "Feeding effect, not a pasteurization effect.",
  },
  {
    id: "benefit-lifespan-celegans-63",
    label: "63% longer maximum lifespan in C. elegans",
    type: "efficacy",
    topic: ["longevity", "model-organism"],
    headline: "63%",
    text: "Longer maximum lifespan in *C. elegans* given raw-milk cheese extract",
    refs: [CARDIN_63],
    safety: [],
    ...APPROVED,
    note: "Nematode model with raw goat-milk CHEESE extracts. Not a human outcome and not fluid milk.",
  },

  // ---------------------------------------------- home: comparison framing
  {
    id: "cmp-framing-fatty-acids",
    label: "Fatty-acid rows reflect feeding, not pasteurization",
    type: "factual",
    topic: ["nutrition", "fair-balance"],
    text: "Fatty-acid rows reflect grass-fed versus conventional feeding, not pasteurization.",
    refs: [BENBROOK_OMEGA3],
    safety: [],
    ...APPROVED,
  },
  {
    id: "cmp-framing-heat",
    label: "Vitamin and bioactive rows reflect heat treatment",
    type: "factual",
    topic: ["nutrition", "pasteurization"],
    text: "Vitamin and bioactive rows reflect heat treatment.",
    refs: [CLAEYS_REVIEW, MACDONALD_VITAMINS, PEILA_BIOACTIVES],
    safety: [],
    ...APPROVED,
  },

  // ------------------------------------------------- home: comparison rows
  {
    id: "cmp-omega3",
    label: "Omega-3: 49 vs 20 mg/100 g",
    type: "composition",
    topic: ["nutrition", "fatty-acids", "grass-fed"],
    text: "Omega-3 fatty acids: 49 mg per 100 g in grass-fed milk versus 20 mg in conventional milk (+147%).",
    data: { nutrient: "Omega-3 fatty acids (per 100 g)", rawValue: "49 mg", advantage: "+147%", pastValue: "20 mg" },
    refs: [BENBROOK_ABSTRACT_VALUES, BENBROOK_OMEGA3],
    safety: [],
    ...APPROVED,
    note: "Feeding effect. 0.049 vs 0.020 g/100 g rounds to +145%; the paper reports +147% on unrounded means.",
  },
  {
    id: "cmp-cla",
    label: "CLA: 43 vs 19 mg/100 g",
    type: "composition",
    topic: ["nutrition", "fatty-acids", "grass-fed"],
    text: "Conjugated linoleic acid: 43 mg per 100 g in grass-fed milk versus 19 mg in conventional milk (+126%).",
    data: { nutrient: "CLA (per 100 g)", rawValue: "43 mg", advantage: "+126%", pastValue: "19 mg" },
    refs: [BENBROOK_ABSTRACT_VALUES],
    safety: [],
    ...APPROVED,
    note: "Feeding effect.",
  },
  {
    id: "cmp-vitamin-c",
    label: "Vitamin C: 2.3 vs 1.7 mg per 8 oz",
    type: "composition",
    topic: ["nutrition", "vitamins", "pasteurization"],
    text: "Vitamin C: 2.3 mg per 8 oz in raw milk versus 1.7 mg in pasteurized milk (+35%).",
    data: { nutrient: "Vitamin C (per 8 oz)", rawValue: "2.3 mg", advantage: "+35%", pastValue: "1.7 mg" },
    refs: [CLAEYS_REVIEW, MACDONALD_VITAMINS],
    safety: [],
    ...APPROVED,
    note: "Direction confirmed by Macdonald 2011; absolute values attributed to Claeys 2013 (paywalled, unverified).",
  },
  {
    id: "cmp-folate",
    label: "Folate: 12 vs 10 mcg per 8 oz",
    type: "composition",
    topic: ["nutrition", "vitamins", "pasteurization"],
    text: "Folate (B9): 12 mcg per 8 oz in raw milk versus 10 mcg in pasteurized milk (+20%).",
    data: { nutrient: "Folate (B9) (per 8 oz)", rawValue: "12 mcg", advantage: "+20%", pastValue: "10 mcg" },
    refs: [CLAEYS_REVIEW, MACDONALD_VITAMINS],
    safety: [],
    ...APPROVED,
    note: "Direction confirmed by Macdonald 2011; absolute values unverified.",
  },
  {
    id: "cmp-b12",
    label: "Vitamin B12: 1.1 vs 1.0 mcg per 8 oz",
    type: "composition",
    topic: ["nutrition", "vitamins", "pasteurization"],
    text: "Vitamin B12: 1.1 mcg per 8 oz in raw milk versus 1.0 mcg in pasteurized milk (+10%).",
    data: { nutrient: "Vitamin B12 (per 8 oz)", rawValue: "1.1 mcg", advantage: "+10%", pastValue: "1.0 mcg" },
    refs: [CLAEYS_REVIEW, MACDONALD_VITAMINS],
    safety: [],
    ...APPROVED,
    note: "Macdonald 2011 reports B12 decrease as a qualitative finding only.",
  },
  {
    id: "cmp-alp",
    label: "Alkaline phosphatase inactivated by pasteurization",
    type: "composition",
    topic: ["enzymes", "pasteurization"],
    text: "Alkaline phosphatase is active in raw milk and inactivated by pasteurization.",
    data: { nutrient: "Alkaline phosphatase", rawValue: "Active", advantage: "Native", pastValue: "Inactivated" },
    refs: [{ key: "claeys-2013", locator: "Review, enzymes", quote: "Alkaline phosphatase is used as the marker of adequate pasteurization." }],
    safety: [],
    ...APPROVED,
  },
  {
    id: "cmp-lactoferrin",
    label: "Lactoferrin 35–65% lower after HTST",
    type: "composition",
    topic: ["bioactives", "pasteurization"],
    text: "Lactoferrin is intact in raw milk and 35–65% lower after HTST pasteurization.",
    data: { nutrient: "Lactoferrin", rawValue: "Intact", advantage: "Native", pastValue: "35–65% lower" },
    refs: [PEILA_BIOACTIVES, HAAS_HTST],
    safety: [],
    ...APPROVED,
    note: "Peila reviews donor human milk; Haas measured bovine milk under commercial HTST.",
  },
  {
    id: "cmp-lab",
    label: "Live lactic acid bacteria eliminated by pasteurization",
    type: "composition",
    topic: ["microbiome", "pasteurization"],
    text: "Live lactic acid bacteria are present in raw milk and eliminated by pasteurization.",
    data: { nutrient: "Live lactic acid bacteria", rawValue: "Present", advantage: "Live", pastValue: "Eliminated" },
    refs: [
      CLAEYS_REVIEW,
      { key: "butler-2020", locator: "Abstract", quote: "Relative abundance of the genus Lactobacillus increased significantly between pre- and post-course time points." },
    ],
    safety: [],
    ...APPROVED,
  },
];

const byId = new Map(claims.map((c) => [c.id, c]));

export function getClaim(id: string): Claim {
  const c = byId.get(id);
  if (!c) throw new Error(`Unknown claim "${id}". Add it to src/data/claims.ts.`);
  return c;
}

/** Claim types that must cite evidence */
export const EVIDENCE_TYPES: ClaimType[] = ["efficacy", "composition", "epidemiology"];
