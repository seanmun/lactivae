"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { css } from "../../../styled-system/css";
import { getNode, edgesFrom, kindOf, bareId, type GraphNode, type GraphEdge } from "@/lib/graph";
import { getClaim } from "@/data/claims";
import { getSafety } from "@/data/safety";
import { getReference, shortCitation, ACCESS_LABELS } from "@/data/references";
import { renderInline } from "@/components/governed/inline";
import { useXRay } from "./store";
import { collectGoverned, KIND_COLORS, STAGED_COLOR } from "./dom";

/**
 * The "explode": the current page decomposed into its governed objects.
 * Components become clusters in page order, claims and safety statements
 * become cards inside them, and every reference cited on the page gathers in
 * a column on the right. Cards fly out from their real on-page positions
 * (FLIP via the Web Animations API) and fly back on collapse. Inspect and
 * Trace are the same store as overlay mode, so selection carries across.
 */

interface Cluster {
  component: GraphNode;
  items: GraphNode[];
  layout: boolean;
}

interface Placed {
  nodeId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

function uniqueById(nodes: GraphNode[]): GraphNode[] {
  const seen = new Set<string>();
  return nodes.filter((n) => (seen.has(n.id) ? false : (seen.add(n.id), true)));
}

function buildClusters(route: string): { clusters: Cluster[]; refs: GraphNode[]; edges: GraphEdge[] } {
  const clusters: Cluster[] = [];
  for (const pageId of [`page:${route}`, "page:*"]) {
    for (const e of edgesFrom(pageId, "contains")) {
      const component = getNode(e.to);
      if (!component) continue;
      const items = edgesFrom(component.id)
        .filter((x) => x.rel === "contains")
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((x) => getNode(x.to))
        .filter((n): n is GraphNode => Boolean(n) && n!.kind !== "reference");
      clusters.push({ component, items: uniqueById(items), layout: pageId === "page:*" });
    }
  }
  const refIds = new Set<string>();
  const edges: GraphEdge[] = [];
  for (const c of clusters) {
    for (const n of c.items) {
      for (const e of edgesFrom(n.id)) {
        if (e.rel === "supported_by") {
          refIds.add(e.to);
          edges.push(e);
        } else if (e.rel === "balanced_by") {
          edges.push(e);
        }
      }
    }
    for (const e of edgesFrom(c.component.id, "cites")) refIds.add(e.to);
  }
  const refs = Array.from(refIds)
    .map((id) => getNode(id))
    .filter((n): n is GraphNode => Boolean(n))
    .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
  return { clusters, refs, edges };
}

const layer = css({
  position: "fixed",
  inset: 0,
  zIndex: 60,
  overflowY: "auto",
  overflowX: "hidden",
  bg: "rgba(26, 19, 16, 0.96)",
  backgroundImage: "radial-gradient(rgba(249, 232, 212, 0.07) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
  animation: "xray-layer-in 0.35s ease-out both",
  "&[data-closing='true']": { animation: "xray-layer-out 0.4s ease-in forwards" },
});
const wrap = css({
  position: "relative",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: { base: "5.5rem 1rem 10rem", md: "5.5rem 2rem 10rem" },
  paddingRight: { md: "calc(400px + 2rem)" },
  display: "grid",
  gridTemplateColumns: { base: "1fr", lg: "minmax(0, 1fr) 280px" },
  gap: "2rem",
  alignItems: "start",
});
const header = css({
  position: "fixed",
  top: "1rem",
  left: "1rem",
  zIndex: 62,
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
});
const eyebrow = css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#F9E8D4", opacity: 0.9 });
const pill = css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#F9E8D4", bg: "rgba(26, 19, 16, 0.92)", border: "1px solid rgba(249, 232, 212, 0.3)", padding: "0.45rem 0.8rem", borderRadius: "999px" });
const clusterBox = css({
  position: "relative",
  border: "1px dashed rgba(249, 232, 212, 0.35)",
  borderRadius: "14px",
  padding: "2rem 1.25rem 1.25rem",
  marginBottom: "1.5rem",
  transition: "border-color 0.2s",
  "&[data-lit='true']": { borderColor: "rgba(249, 232, 212, 0.9)" },
});
const clusterLabel = css({
  position: "absolute",
  top: "-0.6rem",
  left: "1rem",
  fontFamily: "mono",
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#F9E8D4",
  bg: "#3D2D22",
  padding: "0.2rem 0.6rem",
  borderRadius: "999px",
  cursor: "pointer",
  border: "1px solid rgba(249, 232, 212, 0.35)",
});
const grid = css({ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.9rem" });
const card = css({
  textAlign: "left",
  bg: "bg.primary",
  color: "text.primary",
  border: "2px solid",
  borderRadius: "10px",
  padding: "0.85rem 0.95rem",
  cursor: "pointer",
  fontFamily: "body",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
  transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
  willChange: "transform",
  _hover: { transform: "translateY(-2px)", boxShadow: "0 12px 28px rgba(0, 0, 0, 0.45)" },
  _focusVisible: { outline: "3px solid #93C5FD", outlineOffset: "2px" },
  "&[data-dim='true']": { opacity: 0.28 },
  "&[data-selected='true']": { boxShadow: "0 0 0 4px rgba(147, 197, 253, 0.6), 0 12px 28px rgba(0,0,0,0.45)" },
});
const chip = css({ display: "inline-block", fontFamily: "mono", fontSize: "xs", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff", padding: "0.1rem 0.45rem", borderRadius: "4px", marginBottom: "0.4rem" });
const headline = css({ fontFamily: "mono", fontSize: "2xl", fontWeight: "700", color: "accent.secondary", lineHeight: "1.1", marginBottom: "0.2rem" });
const cardText = css({ fontSize: "sm", lineHeight: "1.45", color: "text.primary" });
const cardMeta = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted", marginTop: "0.5rem" });
const refsCol = css({ position: { lg: "sticky" }, top: { lg: "5.5rem" }, display: "flex", flexDirection: "column", gap: "0.6rem" });
const refCard = css({
  textAlign: "left",
  bg: "rgba(255, 253, 245, 0.06)",
  color: "#F9E8D4",
  border: "1.5px solid",
  borderColor: "#1D4ED8",
  borderRadius: "8px",
  padding: "0.6rem 0.75rem",
  cursor: "pointer",
  fontFamily: "body",
  transition: "opacity 0.2s, background 0.2s",
  _hover: { bg: "rgba(255, 253, 245, 0.12)" },
  _focusVisible: { outline: "3px solid #93C5FD", outlineOffset: "2px" },
  "&[data-dim='true']": { opacity: 0.28 },
  "&[data-selected='true']": { bg: "rgba(29, 78, 216, 0.35)" },
});
const btn = css({
  fontFamily: "mono",
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "0.55rem 0.9rem",
  borderRadius: "999px",
  border: "2px solid #93C5FD",
  bg: "#1D4ED8",
  color: "#fff",
  cursor: "pointer",
  _hover: { bg: "#2563EB" },
  _focusVisible: { outline: "3px solid #93C5FD", outlineOffset: "2px" },
});

export default function ExplodeView() {
  const pathname = usePathname() || "/";
  const { mode, selectedId, lit, select, collapse, setMode, staged } = useXRay();
  const layerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  /** true once the fly-out animation has finished and card positions are final */
  const [settled, setSettled] = useState(false);
  const measureRef = useRef<() => void>(() => {});
  const pageNode = getNode(`page:${pathname}`);

  const { clusters, refs, edges } = useMemo(() => buildClusters(pathname), [pathname]);
  const stagedIds = useMemo(() => new Set(staged.filter((p) => p.objectKind === "claim").map((p) => `claim:${p.objectId}`)), [staged]);

  const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** viewport rect of the first real on-page element for a node */
  const realRects = useCallback(() => {
    const map = new Map<string, DOMRect>();
    for (const g of collectGoverned(pathname)) if (!map.has(g.nodeId)) map.set(g.nodeId, g.el.getBoundingClientRect());
    return map;
  }, [pathname]);

  // ------------------------------------------------------------ enter (FLIP)
  useLayoutEffect(() => {
    if (mode !== "exploded") return;
    const root = layerRef.current;
    if (!root) return;
    document.body.dataset.xrayPhase = "loosen";
    const from = realRects();
    const reduce = reduceMotion();
    setSettled(false);
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-explode-node]"));
    const animations = cards.map((el, i) => {
      const to = el.getBoundingClientRect();
      const src = from.get(el.dataset.explodeNode!);
      const keyframes: Keyframe[] = src
        ? [
            {
              transform: `translate(${src.left - to.left}px, ${src.top - to.top}px) scale(${Math.max(src.width / to.width, 0.05)}, ${Math.max(src.height / to.height, 0.05)})`,
              opacity: 0.35,
            },
            { transform: "none", opacity: 1 },
          ]
        : [{ transform: "translate(120px, 0) scale(0.9)", opacity: 0 }, { transform: "none", opacity: 1 }];
      el.style.transformOrigin = "top left";
      return el.animate(keyframes, { duration: reduce ? 0 : 700, delay: reduce ? 0 : Math.min(i * 12, 320), easing: EASE, fill: "backwards" });
    });
    let done = false;
    const settle = () => {
      if (done) return;
      done = true;
      measureRef.current();
      setSettled(true);
    };
    Promise.all(animations.map((a) => a.finished.catch(() => undefined))).then(settle);
    const fallback = window.setTimeout(settle, reduce ? 50 : 1300);
    return () => window.clearTimeout(fallback);
  }, [mode, realRects]);

  // --------------------------------------------------------- collapse (FLIP)
  useEffect(() => {
    if (mode !== "collapsing") return;
    setSettled(false);
    const root = layerRef.current;
    const to = realRects();
    const reduce = reduceMotion();
    const cards = root ? Array.from(root.querySelectorAll<HTMLElement>("[data-explode-node]")) : [];
    const animations = cards.map((el, i) => {
      const from = el.getBoundingClientRect();
      const dst = to.get(el.dataset.explodeNode!);
      const keyframes: Keyframe[] = dst
        ? [
            { transform: "none", opacity: 1 },
            { transform: `translate(${dst.left - from.left}px, ${dst.top - from.top}px) scale(${dst.width / from.width}, ${dst.height / from.height})`, opacity: 0.2 },
          ]
        : [{ transform: "none", opacity: 1 }, { transform: "translate(120px, 0) scale(0.9)", opacity: 0 }];
      el.style.transformOrigin = "top left";
      return el.animate(keyframes, { duration: reduce ? 0 : 520, delay: reduce ? 0 : Math.min(i * 8, 200), easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" });
    });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      delete document.body.dataset.xrayPhase;
      setMode("overlay");
    };
    Promise.all(animations.map((a) => a.finished.catch(() => undefined))).then(finish);
    const fallback = window.setTimeout(finish, reduce ? 50 : 900);
    return () => window.clearTimeout(fallback);
  }, [mode, realRects, setMode]);

  useEffect(() => () => {
    delete document.body.dataset.xrayPhase;
  }, []);

  // ------------------------------------------------ connector measurement
  useLayoutEffect(() => {
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;
    // Synchronous on purpose: called once the fly-out has settled, and from
    // resize observers. No frame callback, so it cannot be starved.
    const measure = () => {
      const base = wrapEl.getBoundingClientRect();
      const out: Placed[] = [];
      wrapEl.querySelectorAll<HTMLElement>("[data-explode-node]").forEach((el) => {
        const r = el.getBoundingClientRect();
        out.push({ nodeId: el.dataset.explodeNode!, x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height });
      });
      setPlaced(out);
    };
    measureRef.current = measure;
    const ro = new ResizeObserver(() => measure());
    ro.observe(wrapEl);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [clusters, refs]);

  const firstBox = useMemo(() => {
    const m = new Map<string, Placed>();
    for (const p of placed) if (!m.has(p.nodeId)) m.set(p.nodeId, p);
    return m;
  }, [placed]);

  const wrapSize = useMemo(() => {
    let w = 0;
    let h = 0;
    for (const p of placed) {
      w = Math.max(w, p.x + p.w);
      h = Math.max(h, p.y + p.h);
    }
    return { w, h };
  }, [placed]);

  const isLit = (id: string) => selectedId !== null && (id === selectedId || lit.has(id));
  const isDim = (id: string) => selectedId !== null && !isLit(id);

  function connectorPath(a: Placed, b: Placed): string {
    // leave from the right edge of a, arrive at the left edge of b (or vice versa)
    const leftToRight = a.x + a.w <= b.x;
    const p = leftToRight ? { x: a.x + a.w, y: a.y + a.h / 2 } : { x: a.x + a.w / 2, y: a.y + a.h };
    const q = leftToRight ? { x: b.x, y: b.y + b.h / 2 } : { x: b.x + b.w / 2, y: b.y };
    const dx = leftToRight ? Math.max((q.x - p.x) * 0.5, 40) : 0;
    const dy = leftToRight ? 0 : Math.max((q.y - p.y) * 0.5, 40);
    return `M ${p.x} ${p.y} C ${p.x + dx} ${p.y + dy}, ${q.x - dx} ${q.y - dy}, ${q.x} ${q.y}`;
  }

  return (
    <div
      ref={layerRef}
      data-xray-ui="explode"
      data-closing={mode === "collapsing" ? "true" : "false"}
      className={layer}
      onClick={(e) => {
        if (e.target === e.currentTarget) select(null);
      }}
    >
      <div className={header} data-xray-ui="explode-header">
        <span className={pill}>X-ray · Exploded · {pageNode?.label ?? pathname}</span>
        <button type="button" className={btn} onClick={collapse} disabled={mode === "collapsing"}>
          Collapse (Esc)
        </button>
        <span className={pill} style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
          {selectedId ? `${lit.size} connected` : "Click a card to trace it"}
        </span>
      </div>

      <div ref={wrapRef} className={wrap}>
        {/* connectors: faint for every evidence / fair-balance edge, strong for the trace */}
        <svg
          aria-hidden="true"
          width={wrapSize.w}
          height={wrapSize.h}
          className={css({ position: "absolute", top: 0, left: 0, pointerEvents: "none", overflow: "visible", zIndex: 0, transition: "opacity 0.3s" })}
          style={{ opacity: settled ? 1 : 0 }}
        >
          {edges.map((e, i) => {
            const a = firstBox.get(e.from);
            const b = firstBox.get(e.to);
            if (!a || !b) return null;
            const strong = selectedId !== null && (e.from === selectedId || e.to === selectedId);
            const faded = selectedId !== null && !strong;
            const color = e.rel === "balanced_by" ? KIND_COLORS.safety : KIND_COLORS.ref;
            return (
              <path
                key={i}
                d={connectorPath(a, b)}
                fill="none"
                stroke={color}
                strokeWidth={strong ? 2.25 : 1}
                strokeDasharray={e.rel === "balanced_by" ? "5 4" : undefined}
                opacity={strong ? 0.95 : faded ? 0.06 : 0.28}
              />
            );
          })}
        </svg>

        {/* clusters in page order */}
        <div className={css({ position: "relative", zIndex: 1 })}>
          {clusters.map((cl) => (
            <section key={cl.component.id} className={clusterBox} data-lit={isLit(cl.component.id) || cl.component.id === selectedId ? "true" : "false"}>
              <button type="button" className={clusterLabel} data-explode-node={cl.component.id} onClick={() => select(cl.component.id)}>
                {cl.layout ? "layout" : "component"} · {cl.component.label}
              </button>
              <div className={grid}>
                {cl.items.map((n) => {
                  const kind = kindOf(n.id);
                  const id = bareId(n.id);
                  const isStaged = stagedIds.has(n.id);
                  const color = isStaged ? STAGED_COLOR : kind === "claim" ? KIND_COLORS.claim : KIND_COLORS.safety;
                  const refNums = edgesFrom(n.id, "supported_by")
                    .map((e) => getNode(e.to)?.number)
                    .filter((x): x is number => typeof x === "number");
                  if (kind === "claim") {
                    const c = getClaim(id);
                    const stagedText = staged.find((p) => p.objectKind === "claim" && p.objectId === id)?.proposedText;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        className={card}
                        style={{ borderColor: color }}
                        data-explode-node={n.id}
                        data-dim={isDim(n.id) ? "true" : "false"}
                        data-selected={selectedId === n.id ? "true" : "false"}
                        onClick={() => select(selectedId === n.id ? null : n.id)}
                      >
                        <span className={chip} style={{ background: color }}>
                          {isStaged ? "Staged" : "Claim"}
                        </span>
                        {c.headline && <div className={headline}>{c.headline}</div>}
                        <div className={cardText}>{renderInline(stagedText ?? c.text)}</div>
                        <div className={cardMeta}>
                          {refNums.length > 0 ? `refs ${refNums.map((r) => `[${r}]`).join(" ")}` : "no evidence"}
                          {c.safety.length > 0 ? ` · ${c.safety.length} safety` : ""}
                        </div>
                      </button>
                    );
                  }
                  const s = getSafety(id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      className={card}
                      style={{ borderColor: color }}
                      data-explode-node={n.id}
                      data-dim={isDim(n.id) ? "true" : "false"}
                      data-selected={selectedId === n.id ? "true" : "false"}
                      onClick={() => select(selectedId === n.id ? null : n.id)}
                    >
                      <span className={chip} style={{ background: color }}>
                        Safety · {s.kind}
                      </span>
                      <div className={cardText}>{renderInline(s.text)}</div>
                      <div className={cardMeta}>{refNums.length > 0 ? `refs ${refNums.map((r) => `[${r}]`).join(" ")}` : "no reference"}</div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* references column */}
        <aside className={refsCol} aria-label="References cited on this page">
          <span className={eyebrow}>References on this page · {refs.length}</span>
          {refs.map((n) => {
            const key = bareId(n.id);
            const ref = getReference(key);
            return (
              <button
                key={n.id}
                type="button"
                className={refCard}
                data-explode-node={n.id}
                data-dim={isDim(n.id) ? "true" : "false"}
                data-selected={selectedId === n.id ? "true" : "false"}
                onClick={() => select(selectedId === n.id ? null : n.id)}
              >
                <div className={css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", color: "#93C5FD" })}>
                  [{n.number}] {ACCESS_LABELS[ref.access]}
                </div>
                <div className={css({ fontSize: "sm", fontWeight: "600", lineHeight: "1.3" })}>{shortCitation(ref)}</div>
                <div className={css({ fontSize: "xs", opacity: 0.8, lineHeight: "1.35", marginTop: "0.15rem" })}>{ref.title.length > 80 ? `${ref.title.slice(0, 80)}…` : ref.title}</div>
              </button>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
