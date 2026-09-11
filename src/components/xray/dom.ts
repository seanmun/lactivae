/**
 * Bridges the rendered DOM and the regulatory graph. Governed elements carry
 * data attributes (see components/governed); these helpers map them to node ids.
 */

import { nodeIdFor, kindOf } from "@/lib/graph";

export type GovernedKind = "claim" | "safety" | "ref" | "component";

export interface GovernedElement {
  el: HTMLElement;
  kind: GovernedKind;
  nodeId: string;
}

export const KIND_COLORS: Record<GovernedKind, string> = {
  claim: "#C67830",
  safety: "#B42318",
  ref: "#1D4ED8",
  component: "#3D2D22",
};

export const STAGED_COLOR = "#6D28D9";

export const KIND_LABELS: Record<GovernedKind, string> = {
  claim: "Claim",
  safety: "Safety",
  ref: "Reference",
  component: "Component",
};

export function governedKindOfNode(nodeId: string): GovernedKind {
  const k = kindOf(nodeId);
  return k === "reference" ? "ref" : k === "page" ? "component" : (k as GovernedKind);
}

export function collectGoverned(route: string): GovernedElement[] {
  const out: GovernedElement[] = [];
  const els = document.querySelectorAll<HTMLElement>("[data-governed], [data-component]");
  els.forEach((el) => {
    if (el.dataset.claim) out.push({ el, kind: "claim", nodeId: nodeIdFor("claim", el.dataset.claim, route) });
    else if (el.dataset.safety) out.push({ el, kind: "safety", nodeId: nodeIdFor("safety", el.dataset.safety, route) });
    else if (el.dataset.ref) out.push({ el, kind: "ref", nodeId: nodeIdFor("ref", el.dataset.ref, route) });
    else if (el.dataset.cite) out.push({ el, kind: "ref", nodeId: nodeIdFor("ref", el.dataset.cite, route) });
    else if (el.dataset.component) {
      // Shared layout components (ISI) live on page "*" in the graph
      const isLayout = el.closest("[data-layout-component]") !== null || el.dataset.layoutComponent !== undefined;
      out.push({ el, kind: "component", nodeId: nodeIdFor("component", el.dataset.component, isLayout ? "*" : route) });
    }
  });
  return out;
}

export function findGoverned(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>("[data-governed], [data-component]");
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Document-relative bounding box (so the overlay can be absolutely positioned) */
export function docBox(el: HTMLElement): Box {
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
}
