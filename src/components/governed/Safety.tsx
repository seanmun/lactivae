import type { ElementType } from "react";
import { getSafety, type SafetyObject } from "@/data/safety";
import Ref from "@/components/ui/Ref";
import { renderInline } from "./inline";

export function safetyAttrs(s: SafetyObject) {
  return {
    "data-governed": "safety",
    "data-safety": s.id,
    "data-kind": s.kind,
    "data-status": s.status,
    "data-version": String(s.version),
  } as const;
}

interface SafetyProps {
  id: string;
  as?: ElementType;
  className?: string;
  /** ISI conventionally shows no reference markers; inline callouts do */
  showRefs?: boolean;
}

/**
 * Renders a governed safety statement from src/data/safety.ts.
 */
export default function Safety({ id, as, className, showRefs = true }: SafetyProps) {
  const s = getSafety(id);
  const Tag: ElementType = as ?? "span";
  const refKeys = Array.from(new Set(s.refs.map((r) => r.key)));
  return (
    <Tag {...safetyAttrs(s)} className={className}>
      {renderInline(s.text)}
      {showRefs && refKeys.length > 0 ? <Ref k={refKeys} /> : null}
    </Tag>
  );
}
