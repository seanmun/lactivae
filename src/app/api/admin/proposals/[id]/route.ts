import { NextResponse } from "next/server";
import { requireApiRole, READ_ROLES, WRITE_ROLES } from "@/lib/api-auth";
import { getProposalStore, TRANSITIONS, type ProposalStatus } from "@/lib/proposals";
import { blastRadius, newClaimRadius } from "@/lib/blast";
import { claims, type ClaimType } from "@/data/claims";

export const dynamic = "force-dynamic";

/** GET /api/admin/proposals/:id — proposal, blast radius, audit trail */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(READ_ROLES);
  if (auth.error) return auth.error;

  const { id } = await params;
  const store = await getProposalStore();
  const proposal = await store.get(id);
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const shape = { text: proposal.proposedText, refs: proposal.proposedRefs, safety: proposal.proposedSafety };
  const radius = proposal.isNew ? newClaimRadius({ ...shape, type: (proposal.proposedType as ClaimType) ?? "factual" }) : blastRadius(proposal.objectId, shape);
  const audit = await store.listAudit({ proposalId: id });
  return NextResponse.json({
    proposal,
    blastRadius: { ...radius, usages: radius.usages.map((u) => ({ page: u.page.route, component: u.component.label })) },
    audit,
    allowedTransitions: TRANSITIONS[proposal.status],
  });
}

/** PATCH /api/admin/proposals/:id  { status } — move through the lifecycle */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(WRITE_ROLES);
  if (auth.error) return auth.error;

  const { id } = await params;
  let body: { status?: ProposalStatus };
  try {
    body = (await request.json()) as { status?: ProposalStatus };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const status = body.status;
  if (!status || !(status in TRANSITIONS)) {
    return NextResponse.json({ error: "status must be one of draft, staged, approved, rejected" }, { status: 400 });
  }

  const store = await getProposalStore();
  const before = await store.get(id);
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Governance gates, enforced server-side regardless of which UI made the call.
  if (status === "staged" || status === "approved") {
    const shape = { text: before.proposedText, refs: before.proposedRefs, safety: before.proposedSafety };
    const radius = before.isNew ? newClaimRadius({ ...shape, type: (before.proposedType as ClaimType) ?? "factual" }) : blastRadius(before.objectId, shape);
    const blocking = radius.flags.filter((f) => f.level === "error");
    if (blocking.length > 0) {
      return NextResponse.json({ error: `Blocking review flags: ${blocking.map((f) => f.message).join(" ")}`, flags: blocking }, { status: 409 });
    }
  }
  // Promotion requires the proposal still be based on the current approved version.
  if (status === "approved" && before.isNew) {
    if (claims.some((c) => c.id === before.objectId)) {
      return NextResponse.json({ error: `Claim "${before.objectId}" now exists in the registry; this new-claim proposal is obsolete.` }, { status: 409 });
    }
  } else if (status === "approved") {
    const { getClaim } = await import("@/data/claims");
    const claim = getClaim(before.objectId);
    if (claim.version !== before.baseVersion) {
      return NextResponse.json(
        { error: `Approved claim is now v${claim.version}; this proposal was written against v${before.baseVersion}. Re-propose against the current version.` },
        { status: 409 }
      );
    }
  }

  const actor = { userId: auth.session.userId, email: auth.session.email };
  let proposal;
  try {
    proposal = await store.setStatus(id, status, actor);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Transition failed" }, { status: 409 });
  }
  await store.audit({
    actor: actor.userId,
    actorEmail: actor.email,
    action: `proposal.${status}`,
    objectKind: proposal.objectKind,
    objectId: proposal.objectId,
    proposalId: proposal.id,
    details: { from: before.status, to: status },
  });
  return NextResponse.json({ proposal, allowedTransitions: TRANSITIONS[proposal.status] });
}
