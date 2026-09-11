/**
 * Governed claims — the atomic regulated units of LACTIVAE™ copy.
 *
 * A claim is a durable object with identity, approved text, evidence, fair-balance
 * links, and lifecycle state. Pages render claims with <Claim id="..."/> rather than
 * typing the sentence, so a sentence has one approved wording no matter where it
 * appears, and the regulatory graph (scripts/build-graph.mts) can see every usage.
 *
 * Registries live in src/data/governed/*.ts, grouped by where the claims are used.
 * Shared facts (comparison rows, surveillance statistics) are defined once and
 * rendered on several pages.
 *
 * Rules enforced by the graph build:
 *   - a claim rendered on a public page must have status "approved"
 *   - evidence-bearing claim types must cite at least one reference
 *   - every cited reference key must exist in references.ts
 */

import type { Claim } from "./claim-types";
import { homeClaims } from "./governed/home.ts";
import { comparisonClaims } from "./governed/comparison.ts";
import { studiesClaims } from "./governed/studies.ts";
import { surveillanceClaims } from "./governed/surveillance.ts";
import { pageClaims } from "./governed/pages.ts";
import { suggestedClaims } from "./governed/suggested.ts";

export type { Claim, ClaimRef, ClaimStatus, ClaimType } from "./claim-types";
export { EVIDENCE_TYPES } from "./claim-types.ts";

export const claims: Claim[] = [...homeClaims, ...comparisonClaims, ...studiesClaims, ...surveillanceClaims, ...pageClaims, ...suggestedClaims];

const byId = new Map<string, Claim>();
for (const c of claims) {
  if (byId.has(c.id)) throw new Error(`Duplicate claim id "${c.id}"`);
  byId.set(c.id, c);
}

export function getClaim(id: string): Claim {
  const c = byId.get(id);
  if (!c) throw new Error(`Unknown claim "${id}". Add it to src/data/governed/*.ts.`);
  return c;
}
