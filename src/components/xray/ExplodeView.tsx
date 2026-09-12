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
import { KIND_COLORS, STAGED_COLOR } from "./dom";

/**
 * The "explode": the current page decomposed onto a pan/zoom board, the way a
 * design tool shows a whole file. Components become artboards in reading
 * order, claims and safety statements become cards inside them, and every
 * reference cited on the page stands in a column at the right.
 *
 * The board is one transformed layer, so zooming is cheap and connectors scale
 * with the content. Geometry is measured in unscaled board coordinates
 * (screen rect ÷ scale), keeping the maths independent of the zoom level.
 * Inspect and Trace share the store with overlay mode, so a selection carries
 * across when you explode or collapse.
 */

interface Cluster {
  component: GraphNode;
  items: GraphNode[];
  layout: boolean;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const MIN_SCALE = 0.08;
const MAX_SCALE = 2.5;
const FIT_PADDING = 110;

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

// ------------------------------------------------------------------ styles
const stage = css({
  position: "fixed",
  inset: 0,
  zIndex: 60,
  overflow: "hidden",
  bg: "rgba(26, 19, 16, 0.97)",
  backgroundImage: "radial-gradient(rgba(249, 232, 212, 0.09) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
  cursor: "grab",
  touchAction: "none",
  animation: "xray-layer-in 0.3s ease-out both",
  "&[data-panning='true']": { cursor: "grabbing" },
  "&[data-closing='true']": { animation: "xray-layer-out 0.35s ease-in forwards" },
});
const board = css({
  position: "absolute",
  top: 0,
  left: 0,
  transformOrigin: "0 0",
  display: "flex",
  alignItems: "flex-start",
  gap: "72px",
  padding: "40px",
  willChange: "transform",
});
const artboards = css({ display: "flex", flexWrap: "wrap", gap: "48px", width: "1840px", alignContent: "flex-start" });
const artboard = css({
  position: "relative",
  zIndex: 1,
  width: "560px",
  border: "1px dashed rgba(249, 232, 212, 0.32)",
  borderRadius: "16px",
  padding: "2.25rem 1.25rem 1.25rem",
  transition: "border-color 0.2s, background 0.2s",
  "&[data-lit='true']": { borderColor: "rgba(249, 232, 212, 0.95)", bg: "rgba(249, 232, 212, 0.04)" },
});
const artboardLabel = css({
  position: "absolute",
  top: "-0.7rem",
  left: "1rem",
  fontFamily: "mono",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#F9E8D4",
  bg: "#3D2D22",
  padding: "0.25rem 0.7rem",
  borderRadius: "999px",
  cursor: "pointer",
  border: "1px solid rgba(249, 232, 212, 0.35)",
  whiteSpace: "nowrap",
});
const grid = css({ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.9rem" });
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
  transition: "opacity 0.2s, box-shadow 0.2s",
  "&[data-dim='true']": { opacity: 0.22 },
  "&[data-selected='true']": { boxShadow: "0 0 0 4px rgba(147, 197, 253, 0.65), 0 12px 28px rgba(0,0,0,0.45)" },
});
const chip = css({
  display: "inline-block",
  fontFamily: "mono",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#fff",
  padding: "0.1rem 0.45rem",
  borderRadius: "4px",
  marginBottom: "0.4rem",
});
const headline = css({ fontFamily: "mono", fontSize: "26px", fontWeight: "700", color: "accent.secondary", lineHeight: "1.1", marginBottom: "0.2rem" });
const cardText = css({ fontSize: "14px", lineHeight: "1.45", color: "text.primary" });
const cardMeta = css({ fontFamily: "mono", fontSize: "11px", color: "text.muted", marginTop: "0.5rem" });
const refsCol = css({ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "0.6rem", width: "300px", flexShrink: 0 });
const refCard = css({
  textAlign: "left",
  bg: "rgba(255, 253, 245, 0.06)",
  color: "#F9E8D4",
  border: "1.5px solid #1D4ED8",
  borderRadius: "8px",
  padding: "0.6rem 0.75rem",
  cursor: "pointer",
  fontFamily: "body",
  transition: "opacity 0.2s, background 0.2s",
  "&[data-dim='true']": { opacity: 0.22 },
  "&[data-selected='true']": { bg: "rgba(29, 78, 216, 0.4)" },
});
const bar = css({ position: "fixed", top: "1rem", left: "1rem", zIndex: 63, display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" });
const pill = css({
  fontFamily: "mono",
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#F9E8D4",
  bg: "rgba(26, 19, 16, 0.92)",
  border: "1px solid rgba(249, 232, 212, 0.3)",
  padding: "0.45rem 0.8rem",
  borderRadius: "999px",
  whiteSpace: "nowrap",
});
const btn = css({
  fontFamily: "mono",
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  padding: "0.45rem 0.75rem",
  borderRadius: "999px",
  border: "2px solid #93C5FD",
  bg: "#1D4ED8",
  color: "#fff",
  cursor: "pointer",
  _hover: { bg: "#2563EB" },
  _focusVisible: { outline: "3px solid #93C5FD", outlineOffset: "2px" },
  _disabled: { opacity: 0.5, cursor: "wait" },
});
const zoomBtn = css({
  fontFamily: "mono",
  fontSize: "sm",
  fontWeight: "700",
  height: "34px",
  minWidth: "34px",
  padding: "0 0.55rem",
  borderRadius: "8px",
  border: "1px solid rgba(249, 232, 212, 0.3)",
  bg: "rgba(26, 19, 16, 0.92)",
  color: "#F9E8D4",
  cursor: "pointer",
  _hover: { borderColor: "#93C5FD" },
  _focusVisible: { outline: "3px solid #93C5FD", outlineOffset: "2px" },
});

export default function ExplodeView() {
  const pathname = usePathname() || "/";
  const { mode, selectedId, lit, select, collapse, setMode, staged } = useXRay();
  const stageRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const pageNode = getNode(`page:${pathname}`);

  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const pan = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const scaleRef = useRef(1);
  scaleRef.current = view.scale;

  const { clusters, refs, edges } = useMemo(() => buildClusters(pathname), [pathname]);
  const stagedIds = useMemo(() => new Set(staged.filter((p) => p.objectKind === "claim").map((p) => `claim:${p.objectId}`)), [staged]);

  /** Visible stage area, minus the inspector panel on wide screens. */
  const viewport = useCallback(() => {
    const el = stageRef.current;
    const w = el?.clientWidth ?? window.innerWidth;
    const h = el?.clientHeight ?? window.innerHeight;
    const inspector = typeof window !== "undefined" && window.matchMedia("(min-width: 48em)").matches ? 400 : 0;
    return { w: Math.max(w - inspector, 320), h };
  }, []);

  /** Measure every card in unscaled board coordinates. */
  const measure = useCallback(() => {
    const b = boardRef.current;
    if (!b) return;
    const base = b.getBoundingClientRect();
    const s = scaleRef.current || 1;
    const next: Record<string, Box> = {};
    b.querySelectorAll<HTMLElement>("[data-explode-node]").forEach((el) => {
      const r = el.getBoundingClientRect();
      next[el.dataset.explodeNode!] = { x: (r.left - base.left) / s, y: (r.top - base.top) / s, w: r.width / s, h: r.height / s };
    });
    setBoxes(next);
  }, []);

  /** Fit the whole board in view. */
  const fit = useCallback(() => {
    const b = boardRef.current;
    if (!b) return;
    const vp = viewport();
    const bw = b.scrollWidth;
    const bh = b.scrollHeight;
    if (!bw || !bh) return;
    const s = Math.max(Math.min((vp.w - FIT_PADDING) / bw, (vp.h - FIT_PADDING) / bh, MAX_SCALE), MIN_SCALE);
    setView({ scale: s, x: (vp.w - bw * s) / 2, y: (vp.h - bh * s) / 2 });
  }, [viewport]);

  /** Zoom about a point in stage coordinates. */
  const zoomTo = useCallback((next: number, cx?: number, cy?: number) => {
    setView((v) => {
      const s = Math.min(Math.max(next, MIN_SCALE), MAX_SCALE);
      const el = stageRef.current;
      const px = cx ?? (el ? el.clientWidth / 2 : 0);
      const py = cy ?? (el ? el.clientHeight / 2 : 0);
      return { scale: s, x: px - (px - v.x) * (s / v.scale), y: py - (py - v.y) * (s / v.scale) };
    });
  }, []);

  /** Frame one artboard or card. */
  const frame = useCallback(
    (nodeId: string) => {
      const box = boxes[nodeId];
      if (!box) return;
      const vp = viewport();
      const s = Math.min(Math.max(Math.min((vp.w - 140) / box.w, (vp.h - 140) / box.h), MIN_SCALE), 1.4);
      setView({ scale: s, x: vp.w / 2 - (box.x + box.w / 2) * s, y: vp.h / 2 - (box.y + box.h / 2) * s });
    },
    [boxes, viewport]
  );

  // ------------------------------------------------- first measure and fit
  useLayoutEffect(() => {
    if (mode !== "exploded") return;
    const b = boardRef.current;
    if (!b) return;
    document.body.dataset.xrayPhase = "board";
    measure();
    fit();
    setReady(true);
    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(b);
    const onResize = () => {
      measure();
      fit();
    };
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [mode, clusters, refs, measure, fit]);

  // a selection can arrive before the first measure (deep link); re-measure once
  useEffect(() => {
    if (mode === "exploded" && Object.keys(boxes).length === 0) measure();
  }, [mode, boxes, measure]);

  useEffect(() => {
    if (mode !== "collapsing") return;
    const t = window.setTimeout(() => {
      delete document.body.dataset.xrayPhase;
      setMode("overlay");
    }, 320);
    return () => window.clearTimeout(t);
  }, [mode, setMode]);

  useEffect(
    () => () => {
      delete document.body.dataset.xrayPhase;
    },
    []
  );

  // ------------------------------------------------------------ wheel/pinch
  useEffect(() => {
    const el = stageRef.current;
    if (!el || mode !== "exploded") return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        // trackpad pinch arrives as ctrl+wheel
        zoomTo(scaleRef.current * Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top);
      } else {
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [mode, zoomTo]);

  // ------------------------------------------------------------- shortcuts
  useEffect(() => {
    if (mode !== "exploded") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "0") {
        e.preventDefault();
        fit();
      } else if (k === "1") {
        e.preventDefault();
        zoomTo(1);
      } else if (k === "=" || k === "+") {
        e.preventDefault();
        zoomTo(scaleRef.current * 1.25);
      } else if (k === "-" || k === "_") {
        e.preventDefault();
        zoomTo(scaleRef.current / 1.25);
      } else if (k === "f" && selectedId) {
        e.preventDefault();
        frame(selectedId);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode, fit, zoomTo, frame, selectedId]);

  // ------------------------------------------------------------------- pan
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest("[data-explode-node], [data-xray-ui='explode-bar']")) return;
    pan.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    setIsPanning(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const p = pan.current;
    if (!p) return;
    setView((v) => ({ ...v, x: p.vx + (e.clientX - p.x), y: p.vy + (e.clientY - p.y) }));
  };
  const endPan = () => {
    if (!pan.current) return;
    pan.current = null;
    setIsPanning(false);
  };

  const isLit = (id: string) => selectedId !== null && (id === selectedId || lit.has(id));
  const isDim = (id: string) => selectedId !== null && !isLit(id);

  function connector(a: Box, b: Box): string {
    const leftToRight = a.x + a.w <= b.x;
    const p = leftToRight ? { x: a.x + a.w, y: a.y + a.h / 2 } : { x: a.x + a.w / 2, y: a.y + a.h };
    const q = leftToRight ? { x: b.x, y: b.y + b.h / 2 } : { x: b.x + b.w / 2, y: b.y };
    const dx = leftToRight ? Math.max((q.x - p.x) * 0.45, 48) : 0;
    const dy = leftToRight ? 0 : Math.max((q.y - p.y) * 0.45, 48);
    return `M ${p.x} ${p.y} C ${p.x + dx} ${p.y + dy}, ${q.x - dx} ${q.y - dy}, ${q.x} ${q.y}`;
  }

  const boardSize = useMemo(() => {
    let w = 0;
    let h = 0;
    for (const b of Object.values(boxes)) {
      w = Math.max(w, b.x + b.w);
      h = Math.max(h, b.y + b.h);
    }
    return { w: w + 80, h: h + 80 };
  }, [boxes]);

  return (
    <div
      ref={stageRef}
      data-xray-ui="explode"
      data-closing={mode === "collapsing" ? "true" : "false"}
      data-panning={isPanning ? "true" : "false"}
      className={stage}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPan}
      onPointerCancel={endPan}
      onClick={(e) => {
        if (e.target === e.currentTarget) select(null);
      }}
    >
      <div className={bar} data-xray-ui="explode-bar">
        <span className={pill}>X-ray · Board · {pageNode?.label ?? pathname}</span>
        <button type="button" className={btn} onClick={collapse} disabled={mode === "collapsing"}>
          Collapse (Esc)
        </button>
        <button type="button" className={zoomBtn} onClick={() => zoomTo(scaleRef.current / 1.25)} aria-label="Zoom out" title="Zoom out (−)">
          −
        </button>
        <span className={pill} style={{ minWidth: 64, textAlign: "center" }}>
          {Math.round(view.scale * 100)}%
        </span>
        <button type="button" className={zoomBtn} onClick={() => zoomTo(scaleRef.current * 1.25)} aria-label="Zoom in" title="Zoom in (+)">
          +
        </button>
        <button type="button" className={zoomBtn} onClick={fit} title="Fit board (0)">
          Fit
        </button>
        <button type="button" className={zoomBtn} onClick={() => zoomTo(1)} title="Actual size (1)">
          1:1
        </button>
        {selectedId && (
          <button type="button" className={zoomBtn} onClick={() => frame(selectedId)} title="Frame selection (F)">
            Frame
          </button>
        )}
        <span className={pill} style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
          {selectedId ? `${lit.size} connected` : "Drag to pan · pinch or ⌘-scroll to zoom · double-click to frame"}
        </span>
      </div>

      <div
        ref={boardRef}
        className={board}
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          opacity: ready ? 1 : 0,
          transition: isPanning ? "none" : "opacity 0.25s ease-out",
        }}
      >
        {/* connectors, drawn in unscaled board coordinates */}
        <svg
          aria-hidden="true"
          width={boardSize.w}
          height={boardSize.h}
          className={css({ position: "absolute", top: 0, left: 0, pointerEvents: "none", overflow: "visible", zIndex: 0 })}
        >
          {edges.map((e, i) => {
            const a = boxes[e.from];
            const b = boxes[e.to];
            if (!a || !b) return null;
            const strong = selectedId !== null && (e.from === selectedId || e.to === selectedId);
            const faded = selectedId !== null && !strong;
            const color = e.rel === "balanced_by" ? KIND_COLORS.safety : KIND_COLORS.ref;
            return (
              <path
                key={i}
                d={connector(a, b)}
                fill="none"
                stroke={color}
                strokeWidth={strong ? 2.5 : 1}
                strokeDasharray={e.rel === "balanced_by" ? "6 5" : undefined}
                opacity={strong ? 0.95 : faded ? 0.05 : 0.24}
              />
            );
          })}
        </svg>

        <div className={artboards}>
          {clusters.map((cl) => (
            <section key={cl.component.id} className={artboard} data-lit={isLit(cl.component.id) ? "true" : "false"}>
              <button
                type="button"
                className={artboardLabel}
                data-explode-node={cl.component.id}
                onClick={() => select(cl.component.id)}
                onDoubleClick={() => frame(cl.component.id)}
              >
                {cl.layout ? "layout" : "component"} · {cl.component.label} · {cl.items.length}
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
                  const common = {
                    "data-explode-node": n.id,
                    "data-dim": isDim(n.id) ? "true" : "false",
                    "data-selected": selectedId === n.id ? "true" : "false",
                    onClick: () => select(selectedId === n.id ? null : n.id),
                    onDoubleClick: () => frame(n.id),
                  };
                  if (kind === "claim") {
                    const c = getClaim(id);
                    const stagedText = staged.find((p) => p.objectKind === "claim" && p.objectId === id)?.proposedText;
                    return (
                      <button key={n.id} type="button" className={card} style={{ borderColor: color }} {...common}>
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
                    <button key={n.id} type="button" className={card} style={{ borderColor: color }} {...common}>
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

        <aside className={refsCol} aria-label="References cited on this page">
          <span
            className={css({
              fontFamily: "mono",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#F9E8D4",
              opacity: 0.9,
            })}
          >
            References · {refs.length}
          </span>
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
                onDoubleClick={() => frame(n.id)}
              >
                <div className={css({ fontFamily: "mono", fontSize: "11px", fontWeight: "700", color: "#93C5FD" })}>
                  [{n.number}] {ACCESS_LABELS[ref.access]}
                </div>
                <div className={css({ fontSize: "14px", fontWeight: "600", lineHeight: "1.3" })}>{shortCitation(ref)}</div>
                <div className={css({ fontSize: "12px", opacity: 0.8, lineHeight: "1.35", marginTop: "0.15rem" })}>
                  {ref.title.length > 76 ? `${ref.title.slice(0, 76)}…` : ref.title}
                </div>
              </button>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
