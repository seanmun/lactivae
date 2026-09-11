/**
 * Governed safety objects — the atomic units of Important Safety Information.
 *
 * Each object is one contraindication, risk statement, mitigation step, or
 * regulatory statement. The ISI component and any inline safety callout render
 * FROM this registry, so a statement has exactly one approved wording no matter
 * how many places show it. Claims reference these by id (`Claim.safety`) to
 * express fair-balance relationships.
 *
 * Inline formatting in `text`: *italic* and **bold** only (see components/governed/inline.tsx).
 */

import type { ClaimRef, ClaimStatus } from "./claim-types";

export type SafetyKind = "contraindication" | "risk" | "mitigation" | "regulatory";

/** ISI presentation groups, in display order */
export type SafetyGroup =
  | "summary"
  | "who-should-not"
  | "potential-risks"
  | "risk-mitigation"
  | "regulatory-status";

export interface SafetyObject {
  id: string;
  kind: SafetyKind;
  group: SafetyGroup;
  label: string;
  text: string;
  refs: ClaimRef[];
  status: ClaimStatus;
  version: number;
  effectiveFrom: string;
  rationale?: string;
}

export const SAFETY_GROUP_LABELS: Record<SafetyGroup, string> = {
  summary: "Summary",
  "who-should-not": "WHO SHOULD NOT CONSUME LACTIVAE™",
  "potential-risks": "POTENTIAL RISKS",
  "risk-mitigation": "RISK MITIGATION",
  "regulatory-status": "REGULATORY STATUS",
};

const FDA: ClaimRef = {
  key: "fda-raw-milk",
  locator: "FDA consumer page",
  quote: "Raw milk can carry dangerous bacteria such as Salmonella, E. coli, Listeria, Campylobacter, and others that cause foodborne illness.",
};

export const safetyObjects: SafetyObject[] = [
  // ---------------------------------------------------------------- summary
  {
    id: "reg-not-fda-approved",
    kind: "regulatory",
    group: "summary",
    label: "Not FDA approved",
    text: "LACTIVAE™ (raw milk, oral solution) is not FDA approved.",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
    rationale: "Required on every benefit surface; anchors the pharma-style fair balance.",
  },
  {
    id: "risk-harmful-bacteria",
    kind: "risk",
    group: "summary",
    label: "May contain harmful bacteria (short)",
    text: "Raw milk may contain harmful bacteria.",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "risk-pathogens-named",
    kind: "risk",
    group: "summary",
    label: "May contain harmful bacteria (named pathogens)",
    text: "Raw milk may contain harmful bacteria including *Campylobacter*, *Salmonella*, *E. coli O157:H7*, and *Listeria monocytogenes*.",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "contra-summary",
    kind: "contraindication",
    group: "summary",
    label: "Not recommended for at-risk populations",
    text: "**Not recommended for:** Children under 5, adults over 65, pregnant women, or immunocompromised individuals.",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },

  // ---------------------------------------------------------- who should not
  {
    id: "contra-under-5",
    kind: "contraindication",
    group: "who-should-not",
    label: "Children under 5",
    text: "Children under age 5",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "contra-over-65",
    kind: "contraindication",
    group: "who-should-not",
    label: "Adults over 65",
    text: "Adults over age 65",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "contra-pregnant",
    kind: "contraindication",
    group: "who-should-not",
    label: "Pregnant women",
    text: "Pregnant women",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "contra-immunocompromised",
    kind: "contraindication",
    group: "who-should-not",
    label: "Immunocompromised people",
    text: "People with weakened immune systems (HIV/AIDS, cancer treatment, transplant recipients, immunosuppressive medications)",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },

  // ---------------------------------------------------------- potential risks
  {
    id: "risk-pathogens-symptoms",
    kind: "risk",
    group: "potential-risks",
    label: "Pathogens and symptoms",
    text: "Raw milk can contain harmful bacteria including *Campylobacter*, *Salmonella*, *E. coli O157:H7*, *Listeria monocytogenes*, and others. Symptoms may include diarrhea, stomach cramping, nausea, vomiting, and fever.",
    refs: [FDA, { key: "cdc-raw-milk", locator: "CDC research anthology" }],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "risk-serious-complications",
    kind: "risk",
    group: "potential-risks",
    label: "Serious complications",
    text: "Serious complications, while rare, may include Hemolytic Uremic Syndrome (HUS), Guillain-Barré Syndrome (GBS), reactive arthritis, or miscarriage in pregnant women.",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },

  // ---------------------------------------------------------- risk mitigation
  {
    id: "mit-licensed-tested",
    kind: "mitigation",
    group: "risk-mitigation",
    label: "Licensed, tested producers",
    text: "Purchase only from licensed, inspected producers who test regularly",
    refs: [{ key: "rawmi", locator: "Common Standards" }],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "mit-refrigerate",
    kind: "mitigation",
    group: "risk-mitigation",
    label: "Keep refrigerated",
    text: "Keep refrigerated at 38-40°F (3-4°C) at all times",
    refs: [{ key: "coleman-2023", locator: "Abstract", quote: "Suppression of pathogens in properly refrigerated raw milk." }],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "mit-consume-within",
    kind: "mitigation",
    group: "risk-mitigation",
    label: "Consume promptly",
    text: "Consume within 7-10 days of production",
    refs: [],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "mit-discard",
    kind: "mitigation",
    group: "risk-mitigation",
    label: "Discard if off",
    text: "Discard if off-odor or unusual taste",
    refs: [],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "mit-visit-farm",
    kind: "mitigation",
    group: "risk-mitigation",
    label: "Visit the farm",
    text: "Visit the farm and understand their practices",
    refs: [{ key: "rawmi", locator: "Common Standards" }],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },

  // -------------------------------------------------------- regulatory status
  {
    id: "reg-federal-interstate",
    kind: "regulatory",
    group: "regulatory-status",
    label: "Federal interstate ban",
    text: "**Federal:** Sale of raw milk across state lines is prohibited by the FDA.",
    refs: [FDA],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "reg-state-varies",
    kind: "regulatory",
    group: "regulatory-status",
    label: "State laws vary",
    text: "**State:** Laws vary—legal retail sale in some states, farm sales only in others, completely illegal in some.",
    refs: [{ key: "realmilk", locator: "State-by-state legal status" }],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
  {
    id: "reg-international",
    kind: "regulatory",
    group: "regulatory-status",
    label: "International guidance",
    text: "**International:** Most developed countries recommend against raw milk consumption.",
    refs: [],
    status: "approved",
    version: 1,
    effectiveFrom: "2026-09-10",
  },
];

const byId = new Map(safetyObjects.map((s) => [s.id, s]));

export function getSafety(id: string): SafetyObject {
  const s = byId.get(id);
  if (!s) throw new Error(`Unknown safety object "${id}". Add it to src/data/safety.ts.`);
  return s;
}

export function safetyByGroup(group: SafetyGroup): SafetyObject[] {
  return safetyObjects.filter((s) => s.group === group);
}
