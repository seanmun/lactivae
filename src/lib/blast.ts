/**
 * Blast radius: everything a proposed change to a claim touches, plus review
 * flags. Pure function over the registries and the generated graph, so it
 * runs identically on the server (proposal pages) and in the browser (live
 * preview while typing).
 */

import { claims, getClaim, EVIDENCE_TYPES, type ClaimRef } from "@/data/claims";
import { getSafety } from "@/data/safety";
import { getReference, referenceNumber, shortCitation } from "@/data/references";
import { usagesOf, edgesTo, type GraphNode, type Usage } from "@/lib/graph";

export interface BlastFlag {
  level: "error" | "warn" | "info";
  message: string;
}

export interface BlastRadius {
  usages: Usage[];
  pages: GraphNode[];
  refs: { key: string; number: number; citation: string; locator?: string; state: "kept" | "removed" | "added" }[];
  safety: { id: string; label: string; text: string; state: "kept" | "removed" | "added" }[];
  siblings: { id: string; label: string; sharedRefs: string[] }[];
  numbers: { before: string[]; after: string[]; changed: boolean };
  flags: BlastFlag[];
}

export interface ProposedShape {
  text: string;
  refs: ClaimRef[];
  safety: string[];
}

const NUMBER_RE = /\d+(?:[.,]\d+)?\s?(?:%|×|x\b|mg|mcg|µg|g\b|IU|CI|OR)?/gi;

export function extractNumbers(text: string): string[] {
  return (text.match(NUMBER_RE) ?? []).map((s) => s.replace(/\s+/g, "").toLowerCase());
}

export function blastRadius(claimId: string, proposed: ProposedShape): BlastRadius {
  const claim = getClaim(claimId);
  const nodeId = `claim:${claim.id}`;

  const usages = usagesOf(nodeId);
  const pages = Array.from(new Map(usages.map((u) => [u.page.id, u.page])).values());

  const beforeRefs = Array.from(new Set(claim.refs.map((r) => r.key)));
  const afterRefs = Array.from(new Set(proposed.refs.map((r) => r.key)));
  const refs = Array.from(new Set([...beforeRefs, ...afterRefs])).map((key) => {
    const ref = getReference(key);
    const proposedRef = proposed.refs.find((r) => r.key === key) ?? claim.refs.find((r) => r.key === key);
    return {
      key,
      number: referenceNumber(key),
      citation: `${shortCitation(ref)} — ${ref.title}`,
      locator: proposedRef?.locator,
      state: beforeRefs.includes(key) ? (afterRefs.includes(key) ? ("kept" as const) : ("removed" as const)) : ("added" as const),
    };
  });

  const beforeSafety = claim.safety;
  const afterSafety = proposed.safety;
  const safety = Array.from(new Set([...beforeSafety, ...afterSafety])).map((id) => {
    const s = getSafety(id);
    return {
      id,
      label: s.label,
      text: s.text,
      state: beforeSafety.includes(id) ? (afterSafety.includes(id) ? ("kept" as const) : ("removed" as const)) : ("added" as const),
    };
  });

  // Other claims that rely on the same evidence — unaffected by this text change,
  // but a reviewer changing the interpretation of a source will want to see them.
  const siblings = claims
    .filter((c) => c.id !== claim.id)
    .map((c) => ({ id: c.id, label: c.label, sharedRefs: c.refs.map((r) => r.key).filter((k) => beforeRefs.includes(k)) }))
    .filter((c) => c.sharedRefs.length > 0)
    .map((c) => ({ ...c, sharedRefs: Array.from(new Set(c.sharedRefs)) }));

  // The headline number is fixed on stat cards, so only the text is compared.
  const before = extractNumbers(claim.text);
  const after = extractNumbers(proposed.text);
  const numbersChanged = before.join("|") !== after.join("|");

  const flags: BlastFlag[] = [];
  const textChanged = proposed.text.trim() !== claim.text.trim();

  if (!textChanged && refs.every((r) => r.state === "kept") && safety.every((s) => s.state === "kept")) {
    flags.push({ level: "info", message: "No change from the approved version." });
  }
  if (EVIDENCE_TYPES.includes(claim.type) && afterRefs.length === 0) {
    flags.push({ level: "error", message: `An ${claim.type} claim must cite at least one reference. This proposal removes all evidence.` });
  }
  for (const r of refs.filter((r) => r.state === "removed")) {
    flags.push({ level: "warn", message: `Reference [${r.number}] ${r.citation.split(" — ")[0]} removed. The remaining evidence must still support the statement.` });
  }
  for (const r of refs.filter((r) => r.state === "added")) {
    flags.push({ level: "info", message: `Reference [${r.number}] added. A locator and supporting quote should be recorded before approval.` });
  }
  for (const s of safety.filter((s) => s.state === "removed")) {
    flags.push({ level: "warn", message: `Fair-balance link removed: "${s.label}". Confirm the claim still appears with adequate safety context.` });
  }
  if (numbersChanged) {
    flags.push({
      level: "warn",
      message: `Statistic changed (${before.join(", ") || "none"} → ${after.join(", ") || "none"}). Verify the new figure against the cited quote, not the summary.`,
    });
  }
  if (/\b(cure|cures|treat|treats|heal|heals|prevent|prevents|safe|guaranteed)\b/i.test(proposed.text)) {
    flags.push({ level: "error", message: "Prohibited language: absolute or therapeutic terms (cure, treat, prevent, safe). Use association language." });
  }
  if (claim.note && textChanged) {
    flags.push({ level: "info", message: `Reviewer note on the approved claim: ${claim.note}` });
  }
  if (usages.length > 0) {
    flags.push({
      level: "info",
      message: `Renders in ${usages.length} place${usages.length === 1 ? "" : "s"} across ${pages.length} page${pages.length === 1 ? "" : "s"}. All update together on promotion.`,
    });
  } else {
    flags.push({ level: "info", message: "Not currently rendered on any page." });
  }
  if (siblings.length > 0) {
    flags.push({ level: "info", message: `${siblings.length} other claim${siblings.length === 1 ? " cites" : "s cite"} the same evidence; unchanged by this proposal.` });
  }

  // Referenced safety objects that are no longer cited anywhere else would be orphaned.
  for (const s of safety.filter((s) => s.state === "removed")) {
    const otherClaims = edgesTo(`safety:${s.id}`, "balanced_by").filter((e) => e.from !== nodeId);
    if (otherClaims.length === 0) {
      flags.push({ level: "info", message: `"${s.label}" would no longer balance any claim (still rendered in the ISI).` });
    }
  }

  return { usages, pages, refs, safety, siblings, numbers: { before, after, changed: numbersChanged }, flags };
}
