"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { trace } from "@/lib/graph";
import type { Proposal } from "@/lib/proposals/types";

export type XRayMode = "off" | "overlay";
export type XRayEnv = "production" | "staging";

interface XRayState {
  mode: XRayMode;
  selectedId: string | null;
  /** Node ids connected to the selection; empty when nothing is selected */
  lit: Set<string>;
  /** Which version of governed content the admin is looking at */
  env: XRayEnv;
  /** Proposals currently staged, fetched from the console API */
  staged: Proposal[];
  setMode: (mode: XRayMode) => void;
  toggle: () => void;
  select: (nodeId: string | null) => void;
  setEnv: (env: XRayEnv) => void;
  setStaged: (proposals: Proposal[]) => void;
}

const XRayContext = createContext<XRayState | null>(null);

export function XRayStoreProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<XRayMode>("off");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [env, setEnv] = useState<XRayEnv>("production");
  const [staged, setStaged] = useState<Proposal[]>([]);

  const lit = useMemo(() => {
    if (!selectedId) return new Set<string>();
    try {
      return trace(selectedId).connected;
    } catch {
      return new Set<string>();
    }
  }, [selectedId]);

  const select = useCallback((id: string | null) => setSelectedId(id), []);
  const toggle = useCallback(() => {
    setMode((m) => (m === "off" ? "overlay" : "off"));
    setSelectedId(null);
  }, []);

  const value = useMemo<XRayState>(
    () => ({ mode, selectedId, lit, env, staged, setMode, toggle, select, setEnv, setStaged }),
    [mode, selectedId, lit, env, staged, toggle, select]
  );

  return <XRayContext.Provider value={value}>{children}</XRayContext.Provider>;
}

export function useXRay(): XRayState {
  const ctx = useContext(XRayContext);
  if (!ctx) throw new Error("useXRay must be used inside XRayStoreProvider");
  return ctx;
}
