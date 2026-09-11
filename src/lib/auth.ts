/**
 * Server-side auth facade. Everything in the app that needs to know who the
 * user is goes through getSession / requireRole. Swapping the identity
 * provider (e.g. to Clerk) means rewriting this file and auth-client.ts only.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  type Role,
  type Session,
  devBypassSession,
  isSupabaseConfigured,
  signInPath,
} from "./auth-shared";

export type { Role, Session } from "./auth-shared";
export { canUseXRay, XRAY_ROLES } from "./auth-shared";

export async function getSession(): Promise<Session | null> {
  const bypass = devBypassSession();
  if (bypass) return bypass;
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? null,
    role: ((profile?.role as Role | undefined) ?? "consumer") satisfies Role,
  };
}

/**
 * For server components and route handlers under /admin. Redirects to sign-in
 * when there is no session, or to sign-in with reason=forbidden when the role
 * is insufficient. Never returns without a qualifying session.
 */
export async function requireRole(roles: Role[], nextPath = "/admin"): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(signInPath(nextPath));
  if (!roles.includes(session.role)) redirect(signInPath(nextPath, "forbidden"));
  return session;
}
