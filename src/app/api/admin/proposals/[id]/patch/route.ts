import { NextResponse } from "next/server";
import { requireApiRole, READ_ROLES } from "@/lib/api-auth";
import { getProposalStore } from "@/lib/proposals";
import { buildClaimPatch } from "@/lib/patch";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/proposals/:id/patch — unified diff against src/data/claims.ts.
 * Available once a proposal is staged (preview) or approved (promotion artifact).
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(READ_ROLES);
  if (auth.error) return auth.error;

  const { id } = await params;
  const store = await getProposalStore();
  const proposal = await store.get(id);
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (proposal.status !== "approved" && proposal.status !== "staged") {
    return NextResponse.json({ error: `Patch is only generated for staged or approved proposals (status: ${proposal.status})` }, { status: 409 });
  }

  try {
    const { patch } = await buildClaimPatch(proposal);
    const download = new URL(request.url).searchParams.get("download") === "1";
    const filename = `claims-${proposal.objectId}-v${proposal.baseVersion + 1}.patch`;
    return new NextResponse(patch, {
      headers: {
        "Content-Type": "text/x-patch; charset=utf-8",
        ...(download ? { "Content-Disposition": `attachment; filename="${filename}"` } : {}),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not build patch" }, { status: 500 });
  }
}
