import { devBypassSession, isSupabaseConfigured } from "@/lib/auth-shared";
import type { ProposalStore } from "./types";

export * from "./types";

let cached: ProposalStore | null = null;

/**
 * Picks the backend once per server process:
 *   - Supabase when configured and not in dev bypass
 *   - the local JSON file store under the development bypass
 *   - otherwise throws, so a misconfigured production deploy fails loudly
 */
export async function getProposalStore(): Promise<ProposalStore> {
  if (cached) return cached;
  if (isSupabaseConfigured() && !devBypassSession()) {
    const { SupabaseProposalStore } = await import("./supabase-store");
    cached = new SupabaseProposalStore();
  } else if (devBypassSession()) {
    const { FileProposalStore } = await import("./file-store");
    cached = new FileProposalStore();
  } else {
    throw new Error("No proposal store available: configure Supabase or enable the development bypass.");
  }
  return cached;
}
