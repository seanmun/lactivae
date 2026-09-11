/**
 * Types for governed claims. Kept separate from the registries so page modules
 * and safety.ts can import them without circular dependencies.
 */

export type ClaimType =
  | "efficacy" // health outcome association
  | "composition" // nutrient or bioactive content
  | "epidemiology" // outbreak / surveillance statistics
  | "regulatory" // legal / regulatory status
  | "factual"; // study design or framing statement that is checkable but not a health claim

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
  /** Approved copy, exactly as rendered. *italic* and **bold** only. */
  text: string;
  refs: ClaimRef[];
  /** Safety object ids that must accompany this claim (fair balance) */
  safety: string[];
  /** Structured values for table-row claims; the page reads these, never retypes them */
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

/** Claim types that must cite evidence */
export const EVIDENCE_TYPES: ClaimType[] = ["efficacy", "composition", "epidemiology"];

export const APPROVED = { status: "approved" as const, version: 1, effectiveFrom: "2026-09-11" };
