"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Session } from "@/lib/auth-shared";
import { getNode } from "@/lib/graph";
import { XRayStoreProvider, useXRay } from "./store";
import XRayToggle from "./XRayToggle";
import XRayOverlay from "./XRayOverlay";
import Inspector from "./Inspector";
import StagingOverlay from "./StagingOverlay";

function XRayShell({ session }: { session: Session }) {
  const { mode, selectedId, select, setMode, setStaged, setEnv } = useXRay();
  const params = useSearchParams();

  // Deep link: ?env=staging previews staged proposals in place.
  useEffect(() => {
    if (params.get("env") === "staging") setEnv("staging");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Staged proposals power the Production / Staging switch. Refetch whenever X-ray is toggled.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/proposals?status=staged", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { proposals: [] }))
      .then((d: { proposals?: import("@/lib/proposals/types").Proposal[] }) => {
        if (!cancelled) setStaged(d.proposals ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mode, setStaged]);

  // Deep link: ?xray=1 opens the overlay; ?xray=claim:some-id opens it with a selection.
  // Lets a reviewer share a link straight into a trace.
  useEffect(() => {
    const wanted = params.get("xray");
    if (!wanted) return;
    setMode("overlay");
    if (wanted.includes(":") && getNode(wanted)) {
      // wait a frame so governed elements are measured before the trace lights up
      requestAnimationFrame(() => select(wanted));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Body attributes drive the dimming CSS in globals.css and let other
  // components (video backgrounds, animations) react to X-ray being on.
  useEffect(() => {
    const body = document.body;
    if (mode === "off") {
      delete body.dataset.xray;
      delete body.dataset.xrayHasSelection;
      document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
        if (v.dataset.xrayPaused) {
          v.play().catch(() => {});
          delete v.dataset.xrayPaused;
        }
      });
      return;
    }
    body.dataset.xray = mode;
    body.dataset.xrayHasSelection = selectedId ? "true" : "false";
    document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
      if (!v.paused) {
        v.pause();
        v.dataset.xrayPaused = "true";
      }
    });
  }, [mode, selectedId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode !== "off") {
        e.preventDefault();
        if (selectedId) select(null);
        else setMode("off");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode, selectedId, select, setMode]);

  return (
    <>
      <XRayToggle session={session} />
      <StagingOverlay />
      {mode !== "off" && <XRayOverlay />}
      {mode !== "off" && <Inspector />}
    </>
  );
}

export default function XRayProvider({ session }: { session: Session }) {
  return (
    <XRayStoreProvider>
      <XRayShell session={session} />
    </XRayStoreProvider>
  );
}
