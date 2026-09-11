import type { ClaimRef } from "@/data/claims";

export type ProposalStatus = "draft" | "staged" | "approved" | "rejected";
export type GovernedKind = "claim" | "safety";

/**
 * A proposed version of a governed object. Approved objects live in git
 * (src/data/*.ts); proposals live in the store until promoted, at which point
 * the change is applied to the registry as a patch and committed.
 */
export interface Proposal {
  id: string;
  objectKind: GovernedKind;
  objectId: string;
  /** Version of the approved object this proposal was written against */
  baseVersion: number;
  proposedText: string;
  proposedRefs: ClaimRef[];
  proposedSafety: string[];
  rationale: string | null;
  aiAssisted: boolean;
  status: ProposalStatus;
  author: string;
  authorEmail?: string | null;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalInput {
  objectKind: GovernedKind;
  objectId: string;
  baseVersion: number;
  proposedText: string;
  proposedRefs: ClaimRef[];
  proposedSafety: string[];
  rationale?: string | null;
  aiAssisted?: boolean;
}

export interface AuditEvent {
  id: string;
  actor: string;
  actorEmail?: string | null;
  action: string;
  objectKind?: GovernedKind;
  objectId?: string;
  proposalId?: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface ProposalFilter {
  status?: ProposalStatus | ProposalStatus[];
  objectId?: string;
  objectKind?: GovernedKind;
}

export interface Actor {
  userId: string;
  email: string | null;
}

export interface ProposalStore {
  readonly name: "supabase" | "file";
  list(filter?: ProposalFilter): Promise<Proposal[]>;
  get(id: string): Promise<Proposal | null>;
  create(input: ProposalInput, actor: Actor): Promise<Proposal>;
  setStatus(id: string, status: ProposalStatus, actor: Actor): Promise<Proposal>;
  audit(event: Omit<AuditEvent, "id" | "createdAt">): Promise<void>;
  listAudit(filter?: { objectId?: string; proposalId?: string; limit?: number }): Promise<AuditEvent[]>;
}

/** Allowed lifecycle transitions — the store enforces these regardless of backend */
export const TRANSITIONS: Record<ProposalStatus, ProposalStatus[]> = {
  draft: ["staged", "rejected"],
  staged: ["approved", "rejected", "draft"],
  approved: [],
  rejected: ["draft"],
};

export function assertTransition(from: ProposalStatus, to: ProposalStatus): void {
  if (!TRANSITIONS[from].includes(to)) {
    throw new Error(`Cannot move a proposal from "${from}" to "${to}".`);
  }
}
