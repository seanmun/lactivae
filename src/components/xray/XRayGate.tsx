"use client";

import dynamic from "next/dynamic";
import { useSession, canUseXRay } from "@/lib/auth-client";

/**
 * Mounted in the root layout for every visitor, but renders nothing unless the
 * session has an X-ray role. The provider is loaded on demand so the public
 * bundle never includes X-ray code.
 */
const XRayProvider = dynamic(() => import("./XRayProvider"), { ssr: false });

export default function XRayGate() {
  const { session } = useSession();
  if (!canUseXRay(session?.role)) return null;
  return <XRayProvider session={session!} />;
}
