import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
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

/**
 * Development-only proposal store backed by a JSON file in the repo root
 * (.rxweb/proposals.json, gitignored). Lets the change workflow be demoed
 * before Supabase is configured. Never used in production builds.
 */

interface FileData {
  proposals: Proposal[];
  audit: AuditEvent[];
}

const FILE = path.join(process.cwd(), ".rxweb", "proposals.json");

async function read(): Promise<FileData> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as FileData;
  } catch {
    return { proposals: [], audit: [] };
  }
}

async function write(data: FileData): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2) + "\n");
}

function matches(p: Proposal, f?: ProposalFilter): boolean {
  if (!f) return true;
  if (f.objectId && p.objectId !== f.objectId) return false;
  if (f.objectKind && p.objectKind !== f.objectKind) return false;
  if (f.status) {
    const statuses = Array.isArray(f.status) ? f.status : [f.status];
    if (!statuses.includes(p.status)) return false;
  }
  return true;
}

export class FileProposalStore implements ProposalStore {
  readonly name = "file" as const;

  async list(filter?: ProposalFilter): Promise<Proposal[]> {
    const { proposals } = await read();
    return proposals.filter((p) => matches(p, filter)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(id: string): Promise<Proposal | null> {
    const { proposals } = await read();
    return proposals.find((p) => p.id === id) ?? null;
  }

  async create(input: ProposalInput, actor: Actor): Promise<Proposal> {
    const data = await read();
    const now = new Date().toISOString();
    const proposal: Proposal = {
      id: randomUUID(),
      objectKind: input.objectKind,
      objectId: input.objectId,
      baseVersion: input.baseVersion,
      proposedText: input.proposedText,
      proposedRefs: input.proposedRefs,
      proposedSafety: input.proposedSafety,
      rationale: input.rationale ?? null,
      aiAssisted: input.aiAssisted ?? false,
      status: "draft",
      author: actor.userId,
      authorEmail: actor.email,
      reviewedBy: null,
      createdAt: now,
      updatedAt: now,
    };
    data.proposals.push(proposal);
    await write(data);
    return proposal;
  }

  async setStatus(id: string, status: ProposalStatus, actor: Actor): Promise<Proposal> {
    const data = await read();
    const p = data.proposals.find((x) => x.id === id);
    if (!p) throw new Error(`Proposal ${id} not found`);
    assertTransition(p.status, status);
    p.status = status;
    p.reviewedBy = actor.userId;
    p.updatedAt = new Date().toISOString();
    await write(data);
    return p;
  }

  async audit(event: Omit<AuditEvent, "id" | "createdAt">): Promise<void> {
    const data = await read();
    data.audit.push({ ...event, id: randomUUID(), createdAt: new Date().toISOString() });
    await write(data);
  }

  async listAudit(filter?: { objectId?: string; proposalId?: string; limit?: number }): Promise<AuditEvent[]> {
    const { audit } = await read();
    return audit
      .filter((e) => (!filter?.objectId || e.objectId === filter.objectId) && (!filter?.proposalId || e.proposalId === filter.proposalId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, filter?.limit ?? 100);
  }
}
