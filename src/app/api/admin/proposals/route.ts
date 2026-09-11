import { NextResponse } from "next/server";
import { requireApiRole, READ_ROLES, WRITE_ROLES } from "@/lib/api-auth";
import { getProposalStore, type ProposalStatus } from "@/lib/proposals";
import { claims, getClaim, type ClaimRef, type ClaimType } from "@/data/claims";
import { getSafety } from "@/data/safety";
import { getReference } from "@/data/references";

export const dynamic = "force-dynamic";

/** GET /api/admin/proposals?status=staged&objectId=hero-asthma-42 */
export async function GET(request: Request) {
  const auth = await requireApiRole(READ_ROLES);
  if (auth.error) return auth.error;

  const url = new URL(request.url);
  const status = url.searchParams.getAll("status") as ProposalStatus[];
  const objectId = url.searchParams.get("objectId") ?? undefined;
  const store = await getProposalStore();
  const proposals = await store.list({ status: status.length ? status : undefined, objectId });
  return NextResponse.json({ store: store.name, proposals });
}

interface CreateBody {
  objectKind?: "claim" | "safety";
  objectId?: string;
  proposedText?: string;
  proposedRefs?: ClaimRef[];
  proposedSafety?: string[];
  rationale?: string | null;
  aiAssisted?: boolean;
  /** create-claims workflow: objectId is a new slug that must not exist yet */
  isNew?: boolean;
  proposedType?: ClaimType;
  proposedLabel?: string;
  sourceRef?: string;
}

const CLAIM_TYPES: ClaimType[] = ["efficacy", "composition", "epidemiology", "regulatory", "factual"];
const SLUG = /^[a-z0-9][a-z0-9-]{2,60}$/;

/** POST /api/admin/proposals — create a draft proposal for a claim */
export async function POST(request: Request) {
  const auth = await requireApiRole(WRITE_ROLES);
  if (auth.error) return auth.error;

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.objectKind !== "claim") {
    return NextResponse.json({ error: "Only claim proposals are supported in this milestone" }, { status: 400 });
  }
  if (!body.objectId || typeof body.proposedText !== "string" || !body.proposedText.trim()) {
    return NextResponse.json({ error: "objectId and proposedText are required" }, { status: 400 });
  }

  const store = await getProposalStore();
  const actor = { userId: auth.session.userId, email: auth.session.email };

  // ---- new claim (create-claims workflow)
  if (body.isNew) {
    if (!SLUG.test(body.objectId)) return NextResponse.json({ error: "objectId must be a slug: lowercase letters, digits and hyphens" }, { status: 400 });
    if (claims.some((c) => c.id === body.objectId)) return NextResponse.json({ error: `Claim "${body.objectId}" already exists; propose a change to it instead` }, { status: 409 });
    if (!body.proposedType || !CLAIM_TYPES.includes(body.proposedType)) return NextResponse.json({ error: `proposedType must be one of ${CLAIM_TYPES.join(", ")}` }, { status: 400 });
    const proposedRefs = (body.proposedRefs ?? []).map((r) => ({ key: r.key, locator: r.locator, quote: r.quote }));
    const proposedSafety = body.proposedSafety ?? [];
    try {
      for (const r of proposedRefs) getReference(r.key);
      for (const s of proposedSafety) getSafety(s);
      if (body.sourceRef) getReference(body.sourceRef);
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid reference or safety id" }, { status: 400 });
    }
    const proposal = await store.create(
      {
        objectKind: "claim",
        objectId: body.objectId,
        baseVersion: 0,
        proposedText: body.proposedText.trim(),
        proposedRefs,
        proposedSafety,
        rationale: body.rationale ?? null,
        aiAssisted: body.aiAssisted ?? false,
        isNew: true,
        proposedType: body.proposedType,
        proposedLabel: body.proposedLabel ?? null,
        sourceRef: body.sourceRef ?? null,
      },
      actor
    );
    await store.audit({ actor: actor.userId, actorEmail: actor.email, action: "proposal.created", objectKind: "claim", objectId: body.objectId, proposalId: proposal.id, details: { isNew: true, sourceRef: body.sourceRef ?? null, aiAssisted: proposal.aiAssisted } });
    return NextResponse.json({ proposal }, { status: 201 });
  }

  let claim;
  try {
    claim = getClaim(body.objectId);
  } catch {
    return NextResponse.json({ error: `Unknown claim "${body.objectId}"` }, { status: 404 });
  }

  const proposedRefs = (body.proposedRefs ?? claim.refs).map((r) => ({ key: r.key, locator: r.locator, quote: r.quote }));
  const proposedSafety = body.proposedSafety ?? claim.safety;
  try {
    for (const r of proposedRefs) getReference(r.key);
    for (const s of proposedSafety) getSafety(s);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid reference or safety id" }, { status: 400 });
  }

  const proposal = await store.create(
    {
      objectKind: "claim",
      objectId: claim.id,
      baseVersion: claim.version,
      proposedText: body.proposedText.trim(),
      proposedRefs,
      proposedSafety,
      rationale: body.rationale ?? null,
      aiAssisted: body.aiAssisted ?? false,
    },
    actor
  );
  await store.audit({
    actor: actor.userId,
    actorEmail: actor.email,
    action: "proposal.created",
    objectKind: "claim",
    objectId: claim.id,
    proposalId: proposal.id,
    details: { baseVersion: claim.version, aiAssisted: proposal.aiAssisted },
  });

  return NextResponse.json({ proposal }, { status: 201 });
}
