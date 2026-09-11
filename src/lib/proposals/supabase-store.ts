import { createClient } from "@/lib/supabase/server";
import {
  assertTransition,
  type Actor,
  type AuditEvent,
  type Proposal,
  type ProposalFilter,
  type ProposalInput,
  type ProposalStatus,
  type ProposalStore,
} from "./types";

/** Row shapes as returned by PostgREST (snake_case) */
interface ProposalRow {
  id: string;
  object_kind: Proposal["objectKind"];
  object_id: string;
  base_version: number;
  proposed_text: string;
  proposed_refs: Proposal["proposedRefs"];
  proposed_safety: string[];
  rationale: string | null;
  ai_assisted: boolean;
  status: ProposalStatus;
  author: string;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

interface AuditRow {
  id: number;
  actor: string | null;
  action: string;
  object_kind: AuditEvent["objectKind"] | null;
  object_id: string | null;
  proposal_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

function toProposal(r: ProposalRow): Proposal {
  return {
    id: r.id,
    objectKind: r.object_kind,
    objectId: r.object_id,
    baseVersion: r.base_version,
    proposedText: r.proposed_text,
    proposedRefs: r.proposed_refs ?? [],
    proposedSafety: r.proposed_safety ?? [],
    rationale: r.rationale,
    aiAssisted: r.ai_assisted,
    status: r.status,
    author: r.author,
    reviewedBy: r.reviewed_by,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toAudit(r: AuditRow): AuditEvent {
  return {
    id: String(r.id),
    actor: r.actor ?? "",
    action: r.action,
    objectKind: r.object_kind ?? undefined,
    objectId: r.object_id ?? undefined,
    proposalId: r.proposal_id ?? undefined,
    details: r.details ?? {},
    createdAt: r.created_at,
  };
}

/**
 * Production proposal store. Row Level Security in supabase/migrations/0001_rx_web.sql
 * enforces that only reviewers/admins read and only admins write.
 */
export class SupabaseProposalStore implements ProposalStore {
  readonly name = "supabase" as const;

  async list(filter?: ProposalFilter): Promise<Proposal[]> {
    const supabase = await createClient();
    let q = supabase.from("proposals").select("*").order("updated_at", { ascending: false });
    if (filter?.objectId) q = q.eq("object_id", filter.objectId);
    if (filter?.objectKind) q = q.eq("object_kind", filter.objectKind);
    if (filter?.status) q = Array.isArray(filter.status) ? q.in("status", filter.status) : q.eq("status", filter.status);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return (data as ProposalRow[]).map(toProposal);
  }

  async get(id: string): Promise<Proposal | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("proposals").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toProposal(data as ProposalRow) : null;
  }

  async create(input: ProposalInput, actor: Actor): Promise<Proposal> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("proposals")
      .insert({
        object_kind: input.objectKind,
        object_id: input.objectId,
        base_version: input.baseVersion,
        proposed_text: input.proposedText,
        proposed_refs: input.proposedRefs,
        proposed_safety: input.proposedSafety,
        rationale: input.rationale ?? null,
        ai_assisted: input.aiAssisted ?? false,
        author: actor.userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return toProposal(data as ProposalRow);
  }

  async setStatus(id: string, status: ProposalStatus, actor: Actor): Promise<Proposal> {
    const current = await this.get(id);
    if (!current) throw new Error(`Proposal ${id} not found`);
    assertTransition(current.status, status);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("proposals")
      .update({ status, reviewed_by: actor.userId })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return toProposal(data as ProposalRow);
  }

  async audit(event: Omit<AuditEvent, "id" | "createdAt">): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("audit_events").insert({
      actor: event.actor,
      action: event.action,
      object_kind: event.objectKind ?? null,
      object_id: event.objectId ?? null,
      proposal_id: event.proposalId ?? null,
      details: event.details,
    });
    if (error) throw new Error(error.message);
  }

  async listAudit(filter?: { objectId?: string; proposalId?: string; limit?: number }): Promise<AuditEvent[]> {
    const supabase = await createClient();
    let q = supabase.from("audit_events").select("*").order("created_at", { ascending: false }).limit(filter?.limit ?? 100);
    if (filter?.objectId) q = q.eq("object_id", filter.objectId);
    if (filter?.proposalId) q = q.eq("proposal_id", filter.proposalId);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return (data as AuditRow[]).map(toAudit);
  }
}
