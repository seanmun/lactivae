/**
 * Every governed object the personal assessment can put in front of someone.
 *
 * It lives here, apart from the assessment logic, for one reason: the graph
 * builder has to be able to read it.
 *
 * The assessment selects claims and safety statements by id in plain
 * TypeScript rather than by rendering <Claim> tags, so the source scan in
 * scripts/build-graph.mts cannot see any of it. Without this file an approver
 * would be told a change affects three pages when it also changes the sheet
 * someone prints and hands to their doctor — the one place on the site where
 * being wrong about blast radius actually costs something.
 *
 * Imported by both src/lib/assessment.ts and scripts/build-graph.mts, so the
 * two can never drift apart. Deliberately no path aliases and no imports: the
 * build script runs under plain Node and cannot resolve "@/".
 */

/** Contraindications, keyed by the answer that triggers them. */
export const ASSESSMENT_SAFETY = {
  under5: "contra-under-5",
  over65: "contra-over-65",
  pregnant: "contra-pregnant",
  immunocompromised: "contra-immunocompromised",
} as const;

/** Claims the evidence section may show, depending on the answers. */
export const ASSESSMENT_EVIDENCE = {
  asthma: "benefit-asthma-meta-or",
  respiratory: "hero-respiratory-30",
  discouraged: "meta-discouraged",
  omega3: "cmp-omega3",
  lactose: "lactose-no-benefit",
  listeria: "pasteurized-outbreaks-listeria",
} as const;

/** Shown to everyone, in this order. */
export const ASSESSMENT_RISK_CONTEXT = [
  "deaths-comparative-foods",
  "hosp-typically-zero",
  "outbreak-74-adjusted",
] as const;

/** The flat surface, for the graph builder. */
export const assessmentSurface: { claims: string[]; safety: string[] } = {
  claims: [...Object.values(ASSESSMENT_EVIDENCE), ...ASSESSMENT_RISK_CONTEXT],
  safety: [...Object.values(ASSESSMENT_SAFETY)],
};
