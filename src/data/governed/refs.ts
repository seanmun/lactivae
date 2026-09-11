/**
 * Shared evidence locators: the exact passages that support recurring claims.
 * One place to fix a quote; every claim that cites it updates.
 */
import type { ClaimRef } from "../claim-types.ts";

// ---------------------------------------------------------------- allergy / asthma
export const BRICK_ASTHMA: ClaimRef = {
  key: "brick-2020",
  locator: "Abstract",
  quote:
    "A meta-analysis corroborated the protective effect of raw milk consumption early in life (<1 to 5 years, according to study) on asthma (odds ratio [OR], 0.58; 95% CI, 0.49-0.69).",
};
export const BRICK_STUDIES: ClaimRef = { key: "brick-2020", locator: "Abstract", quote: "A literature search identified 12 publications on 8 pertinent studies." };
export const BRICK_OTHER: ClaimRef = {
  key: "brick-2020",
  locator: "Abstract",
  quote: "current wheeze (OR, 0.66; 95% CI, 0.55-0.78), hay fever or allergic rhinitis (OR, 0.68; 95% CI, 0.57-0.82), and atopic sensitization (OR, 0.76; 95% CI, 0.62-0.95).",
};
export const BRICK_RURAL: ClaimRef = {
  key: "brick-2020",
  locator: "Abstract",
  quote: "The effect particularly on asthma was observed not only in children raised on farms (OR, 0.62) but also in children living in rural areas but not on a farm (OR, 0.60; 95% CI, 0.48-0.74).",
};
export const BRICK_DISCOURAGED: ClaimRef = {
  key: "brick-2020",
  locator: "Abstract",
  quote: "Because of the minimal but real risk of life-threatening infections, however, consumption of raw milk and products thereof is strongly discouraged. The Milk Against Respiratory Tract Infections and Asthma (MARTHA) trial is currently testing the protective effect of microbiologically safe, minimally processed cow's milk.",
};

export const GABRIELA_DESIGN: ClaimRef = {
  key: "loss-2011",
  locator: "Abstract",
  quote: "a comprehensive questionnaire about farm milk consumption and other farm-related exposures was completed by parents of 8334 school-aged children ... In 800 cow's milk samples collected at the participants' homes, viable bacterial counts, whey protein levels, and total fat content were analyzed.",
};
export const GABRIELA_ASTHMA: ClaimRef = {
  key: "loss-2011",
  locator: "Abstract",
  quote: "Reported raw milk consumption was inversely associated to asthma (adjusted odds ratio [aOR], 0.59; 95% CI, 0.46-0.74), atopy (aOR, 0.74; 95% CI, 0.61-0.90), and hay fever (aOR, 0.51; 95% CI, 0.37-0.69) independent of other farm exposures. Boiled farm milk did not show a protective effect.",
};
export const GABRIELA_WHEY: ClaimRef = {
  key: "loss-2011",
  locator: "Abstract",
  quote: "Increased levels of the whey proteins BSA (aOR for highest vs lowest levels and asthma, 0.53), α-lactalbumin (aOR, 0.71), and β-lactoglobulin (aOR, 0.62), however, were inversely associated with asthma but not with atopy.",
};

export const PARSIFAL_DESIGN: ClaimRef = {
  key: "waser-2007",
  locator: "Abstract",
  quote: "Cross sectional multi-centre study (PARSIFAL) including 14,893 children aged 5-13 years from five European countries.",
};
export const PARSIFAL_ASTHMA: ClaimRef = {
  key: "waser-2007",
  locator: "Abstract",
  quote: "Farm milk consumption ever in life showed a statistically significant inverse association with asthma: covariate adjusted odds ratio (aOR) 0.74 [95% confidence interval (CI) 0.61-0.88], rhinoconjunctivitis: aOR 0.56 (0.43-0.73) and sensitization to pollen and the food mix fx5: aOR 0.67 (0.47-0.96) and aOR 0.42 (0.19-0.92).",
};
export const PARSIFAL_INDEPENDENT: ClaimRef = {
  key: "waser-2007",
  locator: "Abstract",
  quote: "The associations were observed in all four subpopulations and independent of farm-related co-exposures. Other farm-produced products were not independently related to any allergy-related health outcome.",
};

export const PASTURE_DESIGN: ClaimRef = {
  key: "loss-2015",
  locator: "Abstract",
  quote: "The PASTURE birth cohort followed 983 infants from rural areas in Austria, Finland, France, Germany, and Switzerland, for the first year of life, covering 37,306 person-weeks.",
};
export const PASTURE_OR: ClaimRef = {
  key: "loss-2015",
  locator: "Abstract",
  quote: "When contrasted with ultra-heat treated milk, raw milk consumption was inversely associated with occurrence of rhinitis (adjusted odds ratio [95% CI]: 0.71 [0.54-0.94]), respiratory tract infections (0.77 [0.59-0.99]), otitis (0.14 [0.05-0.42]), and fever (0.69 [0.47-1.01]). Boiled farm milk showed similar but weaker associations.",
};
export const PASTURE_30: ClaimRef = {
  key: "loss-2015",
  locator: "Abstract",
  quote: "Early life consumption of raw cow's milk reduced the risk of manifest respiratory infections and fever by about 30%.",
};
export const PASTURE_CRP: ClaimRef = {
  key: "loss-2015",
  locator: "Abstract",
  quote: "Raw farm milk consumption was inversely associated with C-reactive protein levels at 12 months (geometric means ratio [95% CI]: 0.66 [0.45-0.98]).",
};

// ---------------------------------------------------------------- composition
export const BENBROOK_DESIGN: ClaimRef = {
  key: "benbrook-2018",
  locator: "Abstract",
  quote: "In a U. S.-wide study of 1,163 milk samples collected over 3 years, we quantified the fatty acid profile in milk from cows fed a nearly 100% forage-based diet (grassmilk) and compared it to profiles from a similar nationwide study of milk from cows under conventional and organic management.",
};
export const BENBROOK_OMEGA3: ClaimRef = {
  key: "benbrook-2018",
  locator: "Results, fatty acid profile",
  quote: "The mean level of total ω‐3 in the adjusted grassmilk samples is more than twice that in the conventional samples (up 147%).",
};
export const BENBROOK_VALUES: ClaimRef = {
  key: "benbrook-2018",
  locator: "Abstract",
  quote: "The omega-6/omega-3 ratios were, respectively, 0.95, 2.28, and 5.77 in grassmilk, organic, and conventional milk; total omega-3 levels were 0.049, 0.032, and 0.020 g/100 g milk; total conjugated linoleic acid levels were 0.043, 0.023, and 0.019 g/100 g milk.",
};

export const CLAEYS_REVIEW: ClaimRef = { key: "claeys-2013", locator: "Review, effects of heat treatment" };
export const CLAEYS_ENZYMES: ClaimRef = { key: "claeys-2013", locator: "Review, enzymes", quote: "Alkaline phosphatase is used as the marker of adequate pasteurization." };
export const CLAEYS_MINERALS: ClaimRef = { key: "claeys-2013", locator: "Review, minerals", quote: "No significant effect of pasteurization on mineral content or bioavailability." };
export const MACDONALD_VITAMINS: ClaimRef = {
  key: "macdonald-2011",
  locator: "Abstract",
  quote:
    "Pasteurization significantly decreased vitamin B1, B2, C and folate concentrations; the effect of pasteurization on milk's nutritive value was minimal because many of these vitamins are naturally found in relatively low levels.",
};
export const PEILA_BIOACTIVES: ClaimRef = { key: "peila-2016", locator: "Review, immunoglobulins and lactoferrin" };
export const HAAS_HTST: ClaimRef = { key: "haas-2025", locator: "Abstract" };
export const USDA_UNFORTIFIED: ClaimRef = { key: "usda-fdc", locator: "FDC 172217, per 100 g", quote: "Vitamin D (D2 + D3) 0.1 µg; Vitamin A, RAE 46 µg; Calcium 113 mg." };
export const MUMMAH_LACTOSE: ClaimRef = {
  key: "mummah-2014",
  locator: "Abstract",
  quote: "Raw milk failed to reduce lactose malabsorption or lactose intolerance symptoms compared with pasteurized milk among adults positive for lactose malabsorption.",
};
export const BUTLER_LACTOBACILLUS: ClaimRef = {
  key: "butler-2020",
  locator: "Abstract",
  quote: "Relative abundance of the genus Lactobacillus increased significantly between pre- and post-course time points.",
};

// ---------------------------------------------------------------- longevity
export const CARDIN_63: ClaimRef = { key: "cardin-2021", locator: "Results, longevity assay", quote: "The freeze-dried cheese presented the ability to increase the maximum lifespan by 63%." };
export const CARDIN_DAF16: ClaimRef = {
  key: "cardin-2021",
  locator: "Abstract",
  quote: "Our results demonstrated that freeze-dried raw goat milk cheese, and its extracts, induced the activation of the DAF-2/DAF-16 pathway, increasing longevity.",
};
export const CARDIN_OXIDATIVE: ClaimRef = { key: "cardin-2021", locator: "Abstract", quote: "Concerning oxidative-stress resistance, all the extracts increased the survival of the worms." };
export const CARDIN_ROS: ClaimRef = {
  key: "cardin-2021",
  locator: "Results, ROS assay",
  quote: "A significant decrease was observed for W70 for the highest concentration, decreasing the ROS production by 28% ... the cheese-lipid extract significantly reduced the production of ROS ... by 23%.",
};

// ---------------------------------------------------------------- surveillance
export const STEPHENSON_HOSP: ClaimRef = { key: "stephenson-2024", locator: "Results, hospitalizations", quote: "The number of hospitalizations [from raw milk] was typically 0, and the maximum per year was 10." };
export const STEPHENSON_DEATHS: ClaimRef = { key: "stephenson-2024", locator: "Fig. 8 (deaths by food) and Fig. 10 (raw vs pasteurized)" };
export const STEPHENSON_CA: ClaimRef = { key: "stephenson-2024", locator: "Fig. 15, California 2005–2020" };
export const STEPHENSON_CONCLUSION: ClaimRef = {
  key: "stephenson-2024",
  locator: "Conclusion",
  quote: "The available evidence conflicts with assumptions of zero risk for pasteurized milk and increasing trends in the burden of illness for raw milk.",
};
export const WHITEHEAD_74: ClaimRef = {
  key: "whitehead-2018",
  locator: "Abstract",
  quote: "Controlling for growth in population and consumption, the outbreak rate has effectively decreased by 74% since 2005.",
};
export const SEBASTIANSKI_LISTERIA: ClaimRef = {
  key: "sebastianski-2022",
  locator: "Abstract",
  quote: "L. monocytogenes was more likely to be the causative agent in pasteurized dairy outbreaks (p < 0.001) and the proportions of hospitalizations and deaths were higher in pasteurized than in unpasteurized outbreaks (p < 0.01).",
};
export const COLEMAN_REFRIGERATION: ClaimRef = { key: "coleman-2023", locator: "Abstract", quote: "Suppression of pathogens in properly refrigerated raw milk." };

// ---------------------------------------------------------------- regulatory
export const FDA_PAGE: ClaimRef = {
  key: "fda-raw-milk",
  locator: "FDA consumer page",
  quote: "Raw milk can carry dangerous bacteria such as Salmonella, E. coli, Listeria, Campylobacter, and others that cause foodborne illness.",
};
export const CDC_PAGE: ClaimRef = { key: "cdc-raw-milk", locator: "CDC research anthology" };
export const RAWMI_STANDARDS: ClaimRef = { key: "rawmi", locator: "Common Standards" };
export const REALMILK_LEGAL: ClaimRef = { key: "realmilk", locator: "State-by-state legal status" };
