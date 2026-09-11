"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useXRay } from "./store";

/** Escape, then allow only the *italic* / **bold** markup governed text uses */
function inlineHtml(text: string): string {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

/**
 * Admin-only staging preview. When the environment switch is on "staging",
 * every governed claim that has a staged proposal shows the proposed text in
 * place. The swap is client-side and reversible; the served HTML never changes.
 */
export default function StagingOverlay() {
  const { env, staged } = useXRay();
  const pathname = usePathname();

  useEffect(() => {
    if (env !== "staging" || staged.length === 0) {
      delete document.body.dataset.xrayEnv;
      return;
    }
    document.body.dataset.xrayEnv = "staging";
    const restores: Array<() => void> = [];

    for (const p of staged) {
      if (p.objectKind !== "claim") continue;
      document.querySelectorAll<HTMLElement>(`[data-claim="${CSS.escape(p.objectId)}"]`).forEach((host) => {
        const target = host.querySelector<HTMLElement>("[data-claim-text]");
        if (!target) return;
        const original = target.innerHTML;
        target.innerHTML = inlineHtml(p.proposedText);
        host.setAttribute("data-staged", "true");
        host.setAttribute("data-staged-proposal", p.id);
        restores.push(() => {
          target.innerHTML = original;
          host.removeAttribute("data-staged");
          host.removeAttribute("data-staged-proposal");
        });
      });
    }

    return () => {
      restores.forEach((restore) => restore());
      delete document.body.dataset.xrayEnv;
    };
  }, [env, staged, pathname]);

  return null;
}
