import type { Claim } from "../claim-types.ts";

/**
 * Claims that entered the registry through the "create claims" workflow
 * (AI-suggested from a source, human-reviewed, approved, and promoted).
 * Promotion appends objects here; pages adopt them with <Claim id="..."/>.
 */
export const suggestedClaims: Claim[] = [];
