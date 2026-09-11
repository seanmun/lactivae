"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { css } from "../../../styled-system/css";
import { useXRay } from "./store";
import { collectGoverned, docBox, findGoverned, KIND_COLORS, KIND_LABELS, STAGED_COLOR, type Box, type GovernedElement, type GovernedKind } from "./dom";

interface Placed extends GovernedElement {
  box: Box;
}

const legendChip = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  fontFamily: "mono",
  fontSize: "xs",
  fontWeight: "600",
  color: "text.primary",
  bg: "rgba(255, 253, 245, 0.95)",
  padding: "0.3rem 0.6rem",
  borderRadius: "999px",
  border: "1px solid",
  borderColor: "border.medium",
});

function center(b: Box) {
  return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
}

function connector(a: Box, b: Box): string {
  const p = center(a);
  const q = center(b);
  const dx = (q.x - p.x) * 0.4;
  return `M ${p.x} ${p.y} C ${p.x + dx} ${p.y}, ${q.x - dx} ${q.y}, ${q.x} ${q.y}`;
}

export default function XRayOverlay() {
  const pathname = usePathname() || "/";
  const { selectedId, lit, select } = useXRay();
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [docSize, setDocSize] = useState({ w: 0, h: 0 });

  // Measure governed elements; re-measure on resize, scroll-driven layout, and DOM changes (ISI expanding).
  useLayoutEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const items = collectGoverned(pathname).map((g) => ({ ...g, box: docBox(g.el) }));
        setPlaced(items.filter((p) => p.box.w > 0 && p.box.h > 0));
        setDocSize({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight });
      });
    };
    measure();
    window.addEventListener("resize", measure);
    // fixed elements (the ISI) move relative to the document on scroll
    window.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const mo = new MutationObserver(measure);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "aria-expanded", "data-staged"] });
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      ro.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  // Mark DOM elements so CSS can dim unrelated content and highlight the trace.
  useEffect(() => {
    for (const p of placed) {
      const isSelected = p.nodeId === selectedId;
      const isLit = lit.has(p.nodeId);
      if (isSelected) p.el.setAttribute("data-xray-selected", "true");
      else p.el.removeAttribute("data-xray-selected");
      if (isLit || isSelected) p.el.setAttribute("data-xray-lit", "true");
      else p.el.removeAttribute("data-xray-lit");
    }
    return () => {
      for (const p of placed) {
        p.el.removeAttribute("data-xray-selected");
        p.el.removeAttribute("data-xray-lit");
      }
    };
  }, [placed, selectedId, lit]);

  // Intercept clicks on governed elements (capture phase, so links don't navigate).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.("[data-xray-ui]")) return;
      const el = findGoverned(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const hit = placed.find((p) => p.el === el);
      if (hit) select(hit.nodeId === selectedId ? null : hit.nodeId);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [placed, selectedId, select]);

  const selected = useMemo(() => placed.find((p) => p.nodeId === selectedId) ?? null, [placed, selectedId]);
  const litPlaced = useMemo(() => placed.filter((p) => lit.has(p.nodeId)), [placed, lit]);
  const kindsPresent = useMemo(() => Array.from(new Set(placed.map((p) => p.kind))), [placed]);

  return (
    <>
      <svg
        aria-hidden="true"
        data-xray-ui="overlay"
        width={docSize.w}
        height={docSize.h}
        className={css({
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 45,
          pointerEvents: "none",
          overflow: "visible",
        })}
        style={{ width: docSize.w, height: docSize.h }}
      >
        <defs>
          <marker id="xray-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1D4ED8" />
          </marker>
        </defs>

        {/* connectors from the selection to everything it lights up */}
        {selected &&
          litPlaced.map((p, i) => (
            <path
              key={`c-${i}`}
              d={connector(selected.box, p.box)}
              fill="none"
              stroke={KIND_COLORS[p.kind]}
              strokeWidth={1.75}
              strokeDasharray={p.kind === "component" ? "6 4" : undefined}
              opacity={0.85}
            />
          ))}

        {/* outlines */}
        {placed.map((p, i) => {
          const isSelected = p.nodeId === selectedId;
          const isLit = lit.has(p.nodeId);
          const dim = selectedId !== null && !isSelected && !isLit;
          const staged = p.el.dataset.staged === "true";
          const color = staged ? STAGED_COLOR : KIND_COLORS[p.kind];
          const pad = p.kind === "component" ? 6 : p.kind === "ref" ? 2 : 3;
          return (
            <g key={i} opacity={dim ? 0.25 : 1}>
              <rect
                x={p.box.x - pad}
                y={p.box.y - pad}
                width={p.box.w + pad * 2}
                height={p.box.h + pad * 2}
                rx={p.kind === "component" ? 10 : 4}
                fill={isSelected ? color : "none"}
                fillOpacity={isSelected ? 0.08 : 0}
                stroke={color}
                strokeWidth={isSelected ? 3 : isLit ? 2 : 1.25}
                strokeDasharray={p.kind === "component" ? "8 5" : undefined}
              />
              {(isSelected || staged || (isLit && p.kind !== "ref") || p.kind === "component") && (
                <g transform={`translate(${p.box.x - pad}, ${p.box.y - pad - 9})`}>
                  <rect width={p.kind === "component" ? 96 : 70} height={16} rx={3} fill={color} />
                  <text x={5} y={11.5} fontFamily="'JetBrains Mono', monospace" fontSize={9.5} fontWeight={700} fill="#fff" letterSpacing={0.5}>
                    {p.kind === "component" ? `COMPONENT · ${p.el.dataset.component}` : staged ? "STAGED" : KIND_LABELS[p.kind].toUpperCase()}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* legend + status */}
      <div
        data-xray-ui="legend"
        className={css({
          position: "fixed",
          top: "5rem",
          left: "1rem",
          zIndex: 70,
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          alignItems: "flex-start",
        })}
      >
        <div className={css({ display: "flex", gap: "0.4rem", flexWrap: "wrap" })}>
          {(["claim", "safety", "ref", "component"] as GovernedKind[])
            .filter((k) => kindsPresent.includes(k))
            .map((k) => (
              <span key={k} className={legendChip}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: KIND_COLORS[k], display: "inline-block" }} />
                {KIND_LABELS[k]} {placed.filter((p) => p.kind === k).length}
              </span>
            ))}
        </div>
        <span className={css({ fontFamily: "mono", fontSize: "xs", color: "text.secondary", bg: "rgba(255,253,245,0.9)", padding: "0.2rem 0.5rem", borderRadius: "4px" })}>
          {selectedId ? `${litPlaced.length} connected on this page · Esc clears` : "Click any governed object to trace it · Esc exits"}
        </span>
      </div>
    </>
  );
}
