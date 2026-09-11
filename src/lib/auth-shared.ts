/**
 * Auth types and pure helpers shared by server and client code.
 * No Supabase imports here — this is the seam that makes the provider swappable.
 */

export type Role = "consumer" | "hcp" | "reviewer" | "admin";

export interface Session {
  userId: string;
  email: string | null;
  role: Role;
  /** true when the development bypass produced this session */
  devBypass?: boolean;
}

/** Roles allowed to open X-ray mode and the /admin console */
export const XRAY_ROLES: Role[] = ["admin", "reviewer"];

export function canUseXRay(role: Role | null | undefined): boolean {
  return !!role && XRAY_ROLES.includes(role);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Development-only escape hatch so X-ray and /admin can be explored before
 * Supabase is configured. Both conditions are inlined at build time; a
 * production build can never satisfy NODE_ENV === "development".
 */
export function devBypassSession(): Session | null {
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_XRAY_DEV_BYPASS === "true") {
    return { userId: "dev-bypass", email: "dev@localhost", role: "admin", devBypass: true };
  }
  return null;
}

export function signInPath(next: string, reason?: string): string {
  const params = new URLSearchParams({ next });
  if (reason) params.set("reason", reason);
  return `/auth/signin?${params.toString()}`;
}
