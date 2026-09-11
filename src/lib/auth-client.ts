"use client";

/**
 * Client-side auth facade: a single hook the X-ray gate and any client UI use.
 * Mirrors src/lib/auth.ts for the browser.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Role, type Session, devBypassSession, isSupabaseConfigured } from "./auth-shared";

export type { Role, Session } from "./auth-shared";
export { canUseXRay } from "./auth-shared";

interface SessionState {
  session: Session | null;
  loading: boolean;
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>(() => {
    const bypass = devBypassSession();
    return bypass ? { session: bypass, loading: false } : { session: null, loading: isSupabaseConfigured() };
  });

  useEffect(() => {
    if (devBypassSession() || !isSupabaseConfigured()) return;

    const supabase = createClient();
    let cancelled = false;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setState({ session: null, loading: false });
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (cancelled) return;
      setState({
        session: { userId: user.id, email: user.email ?? null, role: (profile?.role as Role | undefined) ?? "consumer" },
        loading: false,
      });
    }

    load();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await createClient().auth.signOut();
}
