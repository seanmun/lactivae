/**
 * LACTIVAE™ reference library — single source of truth for every citation on the site.
 *
 * Every claim marker (<Ref k="..." />) resolves to an entry here by `key`, and the
 * displayed reference number is the entry's 1-based position in this array. Reorder
 * the array and every marker on the site renumbers itself.
 *
 * Bibliographic identifiers (DOI / PMID / PMCID, volume, pages, author lists) were
 * verified against PubMed and Crossref on 2026-09-08. `legacyId` is the number the
 * same source carried in context.MD, kept so the research document can be cross-read.
 *
 * `access` describes what a reader can actually open:
 *   open           — full text freely available; a local PDF copy is in /public/references
 *   abstract       — peer-reviewed but paywalled; PubMed abstract only
 *   public-domain  — US government or pre-1929 work; local PDF copy available
 *   web            — living web resource (no fixed document)
 *   book           — in-copyright book, no digital copy
 */

export type ReferenceAccess = "open" | "abstract" | "public-domain" | "web" | "book";

export type ReferenceCategory =
  | "clinical"
  | "composition"
  | "safety"
  | "regulatory"
  | "historical";

export interface Reference {
  key: string;
  legacyId?: number;
  category: ReferenceCategory;
  authors: string;
  title: string;
  /** Journal, publisher, or site name */
  source: string;
  year: number;
  /** volume(issue):pages, or edition / publisher city for books */
  citation?: string;
  doi?: string;
  pmid?: string;
  pmcid?: string;
  /** Landing page for web resources or when there is no DOI */
  url?: string;
  /** Path under /public to a local copy of the full document */
  pdf?: string;
  access: ReferenceAccess;
  /** What this source is cited for on the site — the claims it is expected to support */
  supports: string;
  /** Free-text caution for reviewers (e.g. model organism, retrospective design) */
  note?: string;
}

export const CATEGORY_LABELS: Record<ReferenceCategory, string> = {
  clinical: "Clinical & Epidemiological Evidence",
  composition: "Composition & Effects of Processing",
  safety: "Safety & Foodborne Illness Surveillance",
  regulatory: "Regulatory & Public Health Guidance",
  historical: "Historical Sources",
};

export const ACCESS_LABELS: Record<ReferenceAccess, string> = {
  open: "Open access",
  abstract: "Abstract only",
  "public-domain": "Public domain",
  web: "Website",
  book: "Book",
};

export const references: Reference[] = [
  // ---------------------------------------------------------------------------
  // Clinical & epidemiological evidence
  // ---------------------------------------------------------------------------
  {
    key: "brick-2020",
    legacyId: 1,
    category: "clinical",
    authors: "Brick T, Hettinga K, Kirchner B, Pfaffl MW, Ege MJ",
    title:
      "The beneficial effect of farm milk consumption on asthma, allergies, and infections: from meta-analysis of evidence to clinical trial",
    source: "J Allergy Clin Immunol Pract",
    year: 2020,
    citation: "8(3):878-889.e3",
    doi: "10.1016/j.jaip.2019.11.017",
    pmid: "31770653",
    access: "abstract",
    supports:
      "Meta-analysis of 8 studies: raw farm milk in early life associated with lower odds of asthma (OR 0.58, 95% CI 0.49–0.69), i.e. a 42% reduction; also current wheeze (OR 0.66), hay fever (OR 0.68) and atopic sensitization (OR 0.76).",
    note: "Authors state consumption of raw milk is strongly discouraged because of the risk of infection.",
  },
  {
    key: "loss-2011",
    legacyId: 5,
    category: "clinical",
    authors: "Loss G, Apprich S, Waser M, Kneifel W, Genuneit J, Büchele G, et al.",
    title:
      "The protective effect of farm milk consumption on childhood asthma and atopy: the GABRIELA study",
    source: "J Allergy Clin Immunol",
    year: 2011,
    citation: "128(4):766-773.e4",
    doi: "10.1016/j.jaci.2011.07.048",
    pmid: "21875744",
    access: "abstract",
    supports:
      "GABRIELA: 8,334 school-aged children. Reported raw milk consumption inversely associated with asthma (aOR 0.59, 95% CI 0.46–0.74), atopy (aOR 0.74) and hay fever (aOR 0.51, 95% CI 0.37–0.69). Higher whey protein levels (BSA, α-lactalbumin, β-lactoglobulin) inversely associated with asthma; boiled farm milk showed no protective effect.",
  },
  {
    key: "waser-2007",
    legacyId: 6,
    category: "clinical",
    authors: "Waser M, Michels KB, Bieli C, Flöistrup H, Pershagen G, von Mutius E, et al.",
    title:
      "Inverse association of farm milk consumption with asthma and allergy in rural and suburban populations across Europe",
    source: "Clin Exp Allergy",
    year: 2007,
    citation: "37(5):661-670",
    doi: "10.1111/j.1365-2222.2006.02640.x",
    pmid: "17456213",
    access: "abstract",
    supports:
      "PARSIFAL: 14,893 children aged 5–13 in five European countries. Farm milk consumption inversely associated with asthma (aOR 0.74, 95% CI 0.61–0.88) and rhinoconjunctivitis (aOR 0.56, 95% CI 0.43–0.73), independent of other farm exposures.",
  },
  {
    key: "loss-2015",
    legacyId: 2,
    category: "clinical",
    authors: "Loss G, Depner M, Ulfman LH, van Neerven RJ, Hose AJ, Genuneit J, et al.",
    title:
      "Consumption of unprocessed cow's milk protects infants from common respiratory infections",
    source: "J Allergy Clin Immunol",
    year: 2015,
    citation: "135(1):56-62",
    doi: "10.1016/j.jaci.2014.08.044",
    pmid: "25441645",
    access: "abstract",
    supports:
      "PASTURE birth cohort, 983 infants. Raw milk consumption inversely associated with rhinitis (aOR 0.71), respiratory tract infections (aOR 0.77), otitis (aOR 0.14) and fever (aOR 0.69); authors summarise this as a roughly 30% reduction in respiratory infections and fever. Lower C-reactive protein at 12 months (GMR 0.66).",
  },
  {
    key: "brick-2016",
    legacyId: 7,
    category: "clinical",
    authors: "Brick T, Schober Y, Böcking C, Pekkanen J, Genuneit J, Loss G, et al.",
    title: "ω-3 fatty acids contribute to the asthma-protective effect of unprocessed cow's milk",
    source: "J Allergy Clin Immunol",
    year: 2016,
    citation: "137(6):1699-1706.e13",
    doi: "10.1016/j.jaci.2015.10.042",
    pmid: "26792208",
    access: "abstract",
    supports:
      "Mechanistic follow-up in the PASTURE cohort attributing part of the asthma-protective association to the ω-3 fatty acid content of unprocessed milk.",
  },
  {
    key: "baars-2019",
    legacyId: 8,
    category: "clinical",
    authors: "Baars T, Berge AC, Garssen J, Verster JC",
    title:
      "Effect of raw milk consumption on perceived health, mood and immune functioning among US adults with a poor and normal health: a retrospective questionnaire based study",
    source: "Complement Ther Med",
    year: 2019,
    citation: "47:102196",
    doi: "10.1016/j.ctim.2019.102196",
    pmid: "31780022",
    access: "abstract",
    supports: "Self-reported health, mood and immune outcomes among US adult raw milk consumers.",
    note: "Retrospective, self-report questionnaire design.",
  },
  {
    key: "mummah-2014",
    legacyId: 11,
    category: "clinical",
    authors: "Mummah S, Oelrich B, Hope J, Vu Q, Gardner CD",
    title: "Effect of raw milk on lactose intolerance: a randomized controlled pilot study",
    source: "Ann Fam Med",
    year: 2014,
    citation: "12(2):134-141",
    doi: "10.1370/afm.1618",
    pmid: "24615309",
    pmcid: "PMC3948760",
    pdf: "/references/mummah-2014.pdf",
    access: "open",
    supports:
      "Randomized crossover pilot (n=16): raw milk did NOT reduce lactose malabsorption or intolerance symptoms versus pasteurized milk. Cited as the reason the site makes no lactose-tolerance claim.",
  },
  {
    key: "butler-2020",
    legacyId: 4,
    category: "clinical",
    authors: "Butler MI, Bastiaanssen TFS, Long-Smith C, Berding K, Morkl S, Cusack AM, et al.",
    title:
      "Recipe for a healthy gut: intake of unpasteurised milk is associated with increased Lactobacillus abundance in the human gut microbiome",
    source: "Nutrients",
    year: 2020,
    citation: "12(5):1468",
    doi: "10.3390/nu12051468",
    pmid: "32438623",
    pmcid: "PMC7285075",
    pdf: "/references/butler-2020.pdf",
    access: "open",
    supports:
      "Observational 12-week study (n=24): relative abundance of Lactobacillus increased significantly and was associated with unpasteurised dairy intake.",
  },
  {
    key: "cardin-2021",
    legacyId: 19,
    category: "clinical",
    authors: "Cardin G, Poupet C, Bonnet M, Veisseire P, Ripoche I, Chalard P, et al.",
    title: "A mechanistic study of the antiaging effect of raw-milk cheese extracts",
    source: "Nutrients",
    year: 2021,
    citation: "13(3):897",
    doi: "10.3390/nu13030897",
    pmid: "33802038",
    pmcid: "PMC8000626",
    pdf: "/references/cardin-2021.pdf",
    access: "open",
    supports:
      "Freeze-dried raw goat-milk cheese increased maximum lifespan of C. elegans by 63% and activated the DAF-2/DAF-16 (insulin-like) pathway; cheese-lipid and water-soluble extracts increased oxidative-stress survival and reduced reactive oxygen species production in human leukocytes.",
    note: "Nematode model organism and raw-milk CHEESE extracts, not fluid milk. No human longevity outcome.",
  },

  // ---------------------------------------------------------------------------
  // Composition & effects of processing
  // ---------------------------------------------------------------------------
  {
    key: "benbrook-2018",
    legacyId: 3,
    category: "composition",
    authors: "Benbrook CM, Davis DR, Heins BJ, Latif MA, Leifert C, Peterman L, et al.",
    title:
      "Enhancing the fatty acid profile of milk through forage-based rations, with nutrition modeling of diet outcomes",
    source: "Food Sci Nutr",
    year: 2018,
    citation: "6(3):681-700",
    doi: "10.1002/fsn3.610",
    pmid: "29876120",
    pmcid: "PMC5980250",
    pdf: "/references/benbrook-2018.pdf",
    access: "open",
    supports:
      "1,163 US grass-fed milk samples over 3 years. Versus conventional milk: total ω-3 0.049 vs 0.020 g/100 g (≈147% higher), CLA 0.043 vs 0.019 g/100 g (≈126% higher), ω-6:ω-3 ratio 0.95 vs 5.77.",
    note: "Compares GRASS-FED versus conventional feeding. It does not compare raw with pasteurized milk.",
  },
  {
    key: "macdonald-2011",
    legacyId: 25,
    category: "composition",
    authors: "Macdonald LE, Brett J, Kelton D, Majowicz SE, Snedeker K, Sargeant JM",
    title:
      "A systematic review and meta-analysis of the effects of pasteurization on milk vitamins, and evidence for raw milk consumption and other health-related outcomes",
    source: "J Food Prot",
    year: 2011,
    citation: "74(11):1814-1832",
    doi: "10.4315/0362-028X.JFP-10-269",
    pmid: "22054181",
    access: "abstract",
    supports:
      "Meta-analysis of 40 studies. Pasteurization significantly decreased vitamins B1, B2, C and folate; B6 not significantly changed; B12 and E decreased qualitatively; vitamin A increased. Authors conclude the effect on nutritive value is minimal because milk is not a major source of these vitamins.",
  },
  {
    key: "claeys-2013",
    legacyId: 26,
    category: "composition",
    authors:
      "Claeys WL, Cardoen S, Daube G, De Block J, Dewettinck K, Dierick K, et al.",
    title: "Raw or heated cow milk consumption: review of risks and benefits",
    source: "Food Control",
    year: 2013,
    citation: "31(1):251-262",
    doi: "10.1016/j.foodcont.2012.09.035",
    access: "abstract",
    supports:
      "Comprehensive review of pasteurization effects: no significant effect on mineral content or bioavailability; IgG largely heat-stable under HTST; indigenous enzymes (alkaline phosphatase, lipase, lactoperoxidase) inactivated; nutrient values used in the raw-versus-pasteurized comparison tables.",
  },
  {
    key: "peila-2016",
    legacyId: 27,
    category: "composition",
    authors: "Peila C, Moro GE, Bertino E, Cavallarin L, Giribaldi M, Giuliani F, et al.",
    title:
      "The effect of Holder pasteurization on nutrients and biologically-active components in donor human milk: a review",
    source: "Nutrients",
    year: 2016,
    citation: "8(8):477",
    doi: "10.3390/nu8080477",
    pmid: "27490567",
    pmcid: "PMC4997390",
    pdf: "/references/peila-2016.pdf",
    access: "open",
    supports:
      "Retention of immunoglobulins, lactoferrin and lysozyme under Holder, HTST and UHT processing.",
    note: "Reviews donor HUMAN milk; extrapolation to bovine milk is by analogy.",
  },
  {
    key: "haas-2025",
    legacyId: 28,
    category: "composition",
    authors: "Haas J, Kim BJ, Atamer Z, Wu C, Dallas DC",
    title:
      "Effects of high-temperature, short-time pasteurization on milk and whey during commercial whey protein concentrate production",
    source: "J Dairy Sci",
    year: 2025,
    citation: "108(1):257-271",
    doi: "10.3168/jds.2024-25493",
    pmid: "39343217",
    access: "abstract",
    supports:
      "Reduction in lactoferrin, IgA, IgM and enzyme activity after commercial HTST pasteurization of bovine milk.",
  },
  {
    key: "heaney-2000",
    category: "composition",
    authors: "Heaney RP",
    title: "Calcium, dairy products and osteoporosis",
    source: "J Am Coll Nutr",
    year: 2000,
    citation: "19(2 Suppl):83S-99S",
    doi: "10.1080/07315724.2000.10718088",
    pmid: "10759135",
    access: "abstract",
    supports: "Calcium bioavailability from dairy foods relative to supplements and non-dairy sources.",
    note: "Replaces a previously cited Heaney paper whose title, volume and pages could not be verified.",
  },
  {
    key: "scholz-ahrens-2020",
    category: "composition",
    authors: "Scholz-Ahrens KE, Ahrens F, Barth CA",
    title: "Nutritional and health attributes of milk and milk imitations",
    source: "Eur J Nutr",
    year: 2020,
    citation: "59(1):19-34",
    doi: "10.1007/s00394-019-01936-3",
    pmid: "30937581",
    access: "abstract",
    supports:
      "Nutrient matrix effects and bioavailability of vitamins and minerals from whole milk versus isolated nutrients.",
    note: "Replaces a previously cited 2011 citation whose title, volume and pages could not be verified.",
  },
  {
    key: "usda-fdc",
    category: "composition",
    authors: "U.S. Department of Agriculture, Agricultural Research Service",
    title:
      "FoodData Central, SR Legacy: Milk, whole, 3.25% milkfat, without added vitamin A and vitamin D (FDC ID 172217)",
    source: "USDA FoodData Central",
    year: 2019,
    url: "https://fdc.nal.usda.gov/food-details/172217/nutrients",
    access: "web",
    supports:
      "Per-serving vitamin and mineral amounts and % Daily Values in the Complete Nutritional Profile tables. The unfortified whole-milk entry is used because raw milk is not fortified. Per 244 g it lists vitamin A 395 IU, vitamin D 0.1 µg (≈5 IU), thiamin 0.11 mg, riboflavin 0.41 mg, folate 12 µg, B12 1.1 µg, calcium 276 mg, phosphorus 205 mg, iron 0.07 mg.",
    note: "USDA lists 0 mg vitamin C for pasteurized whole milk; the raw-milk vitamin C value on the site comes from Claeys et al.",
  },

  // ---------------------------------------------------------------------------
  // Safety & foodborne illness surveillance
  // ---------------------------------------------------------------------------
  {
    key: "stephenson-2024",
    legacyId: 20,
    category: "safety",
    authors: "Stephenson MM, Coleman ME, Azzolina NA",
    title:
      "Trends in burdens of disease by transmission source (USA, 2005–2020) and hazard identification for foods: focus on milkborne disease",
    source: "J Epidemiol Glob Health",
    year: 2024,
    citation: "14(3):787-816",
    doi: "10.1007/s44197-024-00216-6",
    pmid: "38546802",
    pmcid: "PMC11442898",
    pdf: "/references/stephenson-2024.pdf",
    access: "open",
    supports:
      "CDC NORS data 2005–2020: deaths by food (cantaloupe 38, peanut butter 10, leafy greens 6, pasteurized dairy 5, raw milk 0–2); California zero reported raw-milk illnesses 2016–2020 despite retail sales; hospitalizations typically 0 and at most 10 per year nationally; concluding statement that the evidence conflicts with assumptions of zero risk for pasteurized milk and rising illness burden for raw milk.",
    note: "Open access (CC BY 4.0).",
  },
  {
    key: "whitehead-2018",
    legacyId: 21,
    category: "safety",
    authors: "Whitehead J, Lake B",
    title:
      "Recent trends in unpasteurized fluid milk outbreaks, legalization, and consumption in the United States",
    source: "PLoS Curr",
    year: 2018,
    citation: "10:ecurrents.outbreaks.bae5a0fd685616839c9cf857792730d1",
    doi: "10.1371/currents.outbreaks.bae5a0fd685616839c9cf857792730d1",
    pmid: "30279996",
    pmcid: "PMC6140832",
    pdf: "/references/whitehead-2018.pdf",
    access: "open",
    supports:
      "CDC outbreak data 2005–2016: controlling for population and consumption growth, the unpasteurized-milk outbreak rate effectively decreased by 74% since 2005 while legal distribution expanded.",
    note: "PLoS Currents ceased publication; the local PDF is a print of the PubMed Central archive copy.",
  },
  {
    key: "sebastianski-2022",
    legacyId: 23,
    category: "safety",
    authors: "Sebastianski M, Bridger NA, Featherstone RM, Robinson JL",
    title:
      "Disease outbreaks linked to pasteurized and unpasteurized dairy products in Canada and the United States: a systematic review",
    source: "Can J Public Health",
    year: 2022,
    citation: "113(4):569-578",
    doi: "10.17269/s41997-022-00614-y",
    pmid: "35277846",
    pmcid: "PMC9262997",
    pdf: "/references/sebastianski-2022.pdf",
    access: "open",
    supports:
      "Listeria monocytogenes more likely the causative agent in pasteurized-dairy outbreaks; proportions of hospitalizations and deaths higher in pasteurized than unpasteurized outbreaks.",
  },
  {
    key: "coleman-2023",
    legacyId: 24,
    category: "safety",
    authors: "Coleman ME, Oscar TP, Negley TL, Stephenson MM",
    title: "Suppression of pathogens in properly refrigerated raw milk",
    source: "PLoS One",
    year: 2023,
    citation: "18(12):e0289249",
    doi: "10.1371/journal.pone.0289249",
    pmid: "38085721",
    pmcid: "PMC10715650",
    pdf: "/references/coleman-2023.pdf",
    access: "open",
    supports:
      "Major bacterial pathogens did not grow in raw milk held at recommended refrigeration temperature; basis for the cold-chain (38–40 °F) handling guidance.",
  },
  {
    key: "dietert-2021",
    legacyId: 22,
    category: "safety",
    authors: "Dietert RR, Coleman ME, North DW, Stephenson MM",
    title:
      "Nourishing the human holobiont to reduce the risk of non-communicable diseases: a cow's milk evidence map example",
    source: "Applied Microbiology",
    year: 2021,
    citation: "2(1):25-52",
    doi: "10.3390/applmicrobiol2010003",
    access: "open",
    supports:
      "Benefit–risk evidence map for raw cow's milk, including the human provocation pilot data cited in the risk–benefit discussion.",
    note: "Open access at MDPI; automated download was refused, open via DOI.",
  },
  {
    key: "esser-2024",
    legacyId: 29,
    category: "safety",
    authors: "Esser MB, Sherk A, Liu Y, Naimi TS",
    title: "Deaths from excessive alcohol use — United States, 2016–2021",
    source: "MMWR Morb Mortal Wkly Rep",
    year: 2024,
    citation: "73(8):154-161",
    doi: "10.15585/mmwr.mm7308a1",
    pmid: "38421934",
    pmcid: "PMC10907037",
    pdf: "/references/esser-2024.pdf",
    access: "public-domain",
    supports:
      "Approximately 178,000 US deaths per year from excessive alcohol use (2020–2021 average), used only as a comparative-risk anchor.",
  },

  // ---------------------------------------------------------------------------
  // Regulatory & public health guidance
  // ---------------------------------------------------------------------------
  {
    key: "fda-raw-milk",
    legacyId: 12,
    category: "regulatory",
    authors: "U.S. Food and Drug Administration",
    title: "The dangers of raw milk: unpasteurized milk can pose a serious health risk",
    source: "FDA.gov",
    year: 2024,
    url: "https://www.fda.gov/food/buy-store-serve-safe-food/dangers-raw-milk-unpasteurized-milk-can-pose-serious-health-risk",
    pdf: "/references/fda-raw-milk-2024.pdf",
    access: "public-domain",
    supports:
      "FDA position that raw milk can harbor dangerous microorganisms; pathogen list (Campylobacter, Salmonella, E. coli O157:H7, Listeria); populations at highest risk. Basis for the Important Safety Information.",
  },
  {
    key: "cdc-raw-milk",
    legacyId: 13,
    category: "regulatory",
    authors: "Centers for Disease Control and Prevention, Public Health Law Program",
    title: "Raw milk research anthology",
    source: "CDC.gov",
    year: 2024,
    url: "https://www.cdc.gov/phlp/php/publications/research-anthology-raw-milk.html",
    pdf: "/references/cdc-raw-milk-anthology.pdf",
    access: "public-domain",
    supports: "CDC summary of raw-milk outbreak literature and state legal frameworks.",
  },
  {
    key: "rawmi",
    legacyId: 14,
    category: "regulatory",
    authors: "Raw Milk Institute",
    title: "Common standards for low-risk raw milk production and listed farmers",
    source: "rawmilkinstitute.org",
    year: 2026,
    url: "https://www.rawmilkinstitute.org/",
    access: "web",
    supports:
      "Producer standards (testing frequency, cold chain, herd health) used in the quality checklist and questions-to-ask-your-farmer guidance.",
  },
  {
    key: "realmilk",
    legacyId: 15,
    category: "regulatory",
    authors: "Weston A. Price Foundation",
    title: "Real Milk Finder and state-by-state raw milk legal status",
    source: "realmilk.com",
    year: 2026,
    url: "https://www.realmilk.com/raw-milk-finder/",
    access: "web",
    supports: "State legality categories and farm / herd-share locator.",
  },

  // ---------------------------------------------------------------------------
  // Historical sources
  // ---------------------------------------------------------------------------
  {
    key: "porter-1911",
    legacyId: 16,
    category: "historical",
    authors: "Porter CS",
    title: "Milk diet as a remedy for chronic disease",
    source: "Long Beach, CA: self-published",
    year: 1911,
    citation: "5th ed.",
    url: "https://archive.org/details/milkdietasremedy00portiala",
    pdf: "/references/porter-1911.pdf",
    access: "public-domain",
    supports: "Historical context: the early-20th-century 'milk cure' era.",
    note: "Historical document only. Nothing in it is presented as current medical evidence.",
  },
  {
    key: "schmid-2009",
    legacyId: 17,
    category: "historical",
    authors: "Schmid R",
    title:
      "The untold story of milk: the history, politics and science of nature's perfect food: raw milk from pasture-fed cows",
    source: "NewTrends Publishing",
    year: 2009,
    citation: "Revised ed.",
    access: "book",
    supports: "Historical narrative of pasteurization's introduction and the modern raw milk movement.",
    note: "Advocacy book, not peer-reviewed.",
  },
  {
    key: "science-history",
    legacyId: 18,
    category: "historical",
    authors: "Science History Institute",
    title: "The lingering heat over pasteurized milk",
    source: "Distillations magazine",
    year: 2009,
    url: "https://www.sciencehistory.org/stories/magazine/the-lingering-heat-over-pasteurized-milk/",
    access: "web",
    supports: "Why pasteurization was introduced; the swill-milk era and public-health history.",
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

const indexByKey: Map<string, number> = new Map(references.map((r, i) => [r.key, i + 1]));

/** 1-based reference number for a key. Throws at build time on a typo. */
export function referenceNumber(key: string): number {
  const n = indexByKey.get(key);
  if (!n) throw new Error(`Unknown reference key "${key}". Add it to src/data/references.ts.`);
  return n;
}

export function getReference(key: string): Reference {
  return references[referenceNumber(key) - 1];
}

/** "Brick et al., 2020" — used for tooltips and aria-labels */
export function shortCitation(ref: Reference): string {
  const first = ref.authors.split(",")[0].trim();
  const etAl = ref.authors.includes(",") ? " et al." : "";
  return `${first}${etAl}, ${ref.year}`;
}

export function referencesByCategory(): { category: ReferenceCategory; label: string; items: { number: number; ref: Reference }[] }[] {
  const order: ReferenceCategory[] = ["clinical", "composition", "safety", "regulatory", "historical"];
  return order.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: references
      .map((ref, i) => ({ number: i + 1, ref }))
      .filter(({ ref }) => ref.category === category),
  }));
}
