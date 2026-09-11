import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import type { Role, Session } from "@/lib/auth-shared";

/**
 * Route-handler guard. The proxy already blocks /api/admin for outsiders; this
 * re-checks inside the handler (defense in depth) and distinguishes read roles
 * from write roles.
 */
export async function requireApiRole(roles: Role[]): Promise<{ session: Session; error?: undefined } | { session?: undefined; error: NextResponse }> {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  if (!roles.includes(session.role)) return { error: NextResponse.json({ error: `Requires role: ${roles.join(" or ")}` }, { status: 403 }) };
  return { session };
}

export const READ_ROLES: Role[] = ["reviewer", "admin"];
export const WRITE_ROLES: Role[] = ["admin"];
