import { NextResponse } from "next/server";
import { requireApiRole, WRITE_ROLES } from "@/lib/api-auth";
import { getProposalStore } from "@/lib/proposals";
import { blastRadius, newClaimRadius } from "@/lib/blast";
import { claims, type ClaimType } from "@/data/claims";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Read the assurance level and the factors used from the session's access token. */
function readAssurance(accessToken: string | undefined): { aal: string; amr: string[] } {
  if (!accessToken) return { aal: "aal1", amr: [] };
  try {
    const part = accessToken.split(".")[1];
    const json = JSON.parse(Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    const amr = Array.isArray(json.amr) ? json.amr.map((e: { method?: string }) => e?.method).filter(Boolean) : [];
    return { aal: typeof json.aal === "string" ? json.aal : "aal1", amr };
  } catch {
    return { aal: "aal1", amr: [] };
  }
}

/**
 * POST /api/admin/proposals/:id/publish
 *
 * Signs an approval and publishes it, replacing the old download-a-patch step.
 *
 *   1. the usual governance gates (staged, no blocking flags, not stale)
 *   2. an append-only signature row; the database computes its content hash
 *      from the proposal itself and chains it to the previous signature, and
 *      the insert policy requires a multi-factor session, so a signature
 *      cannot exist without one
 *   3. the published wording, which the next build merges over the baseline
 *   4. a deploy hook, so the live site rebuilds without anyone opening a
 *      terminal
 *
 * The MFA requirement is enforced by Postgres. This route reports it clearly
 * rather than relying on that check alone.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(WRITE_ROLES);
  if (auth.error) return auth.error;

  const { id } = await params;
  let body: { meaning?: string; factorType?: string };
  try {
    body = (await request.json()) as { meaning?: string; factorType?: string };
  } catch {
    body = {};
  }

  const store = await getProposalStore();
  if (store.name !== "supabase") {
    return NextResponse.json({ error: "Signed publishing requires the Supabase store; the local file store cannot hold a signature chain." }, { status: 409 });
  }
  const proposal = await store.get(id);
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (proposal.objectKind !== "claim") return NextResponse.json({ error: "Only claim proposals can be published" }, { status: 400 });
  if (proposal.status !== "staged") {
    return NextResponse.json({ error: `Only a staged proposal can be published (this one is ${proposal.status}).` }, { status: 409 });
  }

  // ---- governance gates, the same ones the lifecycle endpoint applies
  const shape = { text: proposal.proposedText, refs: proposal.proposedRefs, safety: proposal.proposedSafety };
  const radius = proposal.isNew
    ? newClaimRadius({ ...shape, type: (proposal.proposedType as ClaimType) ?? "factual" })
    : blastRadius(proposal.objectId, shape);
  const blocking = radius.flags.filter((f) => f.level === "error");
  if (blocking.length > 0) {
    return NextResponse.json({ error: `Blocking review flags: ${blocking.map((f) => f.message).join(" ")}`, flags: blocking }, { status: 409 });
  }
  const existing = claims.find((c) => c.id === proposal.objectId);
  if (proposal.isNew && existing) {
    return NextResponse.json({ error: `Claim "${proposal.objectId}" already exists.` }, { status: 409 });
  }
  if (!proposal.isNew) {
    if (!existing) return NextResponse.json({ error: `Claim "${proposal.objectId}" no longer exists.` }, { status: 409 });
    if (existing.version !== proposal.baseVersion) {
      return NextResponse.json(
        { error: `This proposal was written against v${proposal.baseVersion}; the approved claim is now v${existing.version}. Re-propose against the current version.` },
        { status: 409 }
      );
    }
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { aal, amr } = readAssurance(session?.access_token);
  if (aal !== "aal2") {
    return NextResponse.json(
      { error: "This session is not multi-factor verified. Confirm your identity to sign this approval.", needsMfa: true, currentLevel: aal },
      { status: 403 }
    );
  }

  const nextVersion = proposal.isNew ? 1 : proposal.baseVersion + 1;

  // ---- 1. the signature. Postgres computes content_hash, prev_hash and
  //         record_hash, and its insert policy re-checks aal2.
  const { data: signature, error: sigError } = await supabase
    .from("approval_signatures")
    .insert({
      proposal_id: proposal.id,
      object_kind: "claim",
      object_id: proposal.objectId,
      version: nextVersion,
      signer: auth.session.userId,
      signer_email: auth.session.email ?? "",
      meaning: body.meaning?.trim() || "Approved for publication",
      aal,
      factor_type: body.factorType ?? amr.find((m) => m !== "otp" && m !== "magiclink") ?? null,
      // content_hash / prev_hash / record_hash are set by the sign_approval trigger
      content_hash: "",
      record_hash: "",
    })
    .select("seq, record_hash, prev_hash, content_hash, signed_at")
    .single();

  if (sigError) {
    const mfa = /row-level security/i.test(sigError.message);
    return NextResponse.json(
      { error: mfa ? "The database refused the signature: this session is not multi-factor verified." : sigError.message, needsMfa: mfa },
      { status: mfa ? 403 : 500 }
    );
  }

  // ---- 2. the published wording
  const { error: pubError } = await supabase.from("published_claims").upsert(
    {
      object_id: proposal.objectId,
      version: nextVersion,
      text: proposal.proposedText,
      refs: proposal.proposedRefs,
      safety: proposal.proposedSafety,
      approval_seq: signature.seq,
      published_at: new Date().toISOString(),
    },
    { onConflict: "object_id" }
  );
  if (pubError) return NextResponse.json({ error: `Signed, but publishing failed: ${pubError.message}`, signature }, { status: 500 });

  // ---- 3. lifecycle + audit
  await store.setStatus(proposal.id, "approved", { userId: auth.session.userId, email: auth.session.email });
  await store.audit({
    actor: auth.session.userId,
    actorEmail: auth.session.email,
    action: "proposal.published",
    objectKind: "claim",
    objectId: proposal.objectId,
    proposalId: proposal.id,
    details: { version: nextVersion, signature_seq: signature.seq, record_hash: signature.record_hash, aal },
  });

  // ---- 4. rebuild the site
  let deploy: string;
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) {
    deploy = "No deploy hook configured — the change is published and will appear on the next deploy.";
  } else {
    try {
      const res = await fetch(hook, { method: "POST", signal: AbortSignal.timeout(15000) });
      deploy = res.ok ? "Rebuild triggered; the live site updates in about a minute." : `Deploy hook returned ${res.status}.`;
    } catch (e) {
      deploy = `Deploy hook failed: ${e instanceof Error ? e.message : "unknown"}. The change is published and will appear on the next deploy.`;
    }
  }

  return NextResponse.json({ ok: true, version: nextVersion, signature, deploy });
}
