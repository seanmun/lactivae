/**
 * The personal risk–benefit assessment.
 *
 * Everything it returns is a governed object: contraindications are the same
 * safety statements the ISI renders, and the evidence shown is the same claim
 * set the pages use, with the same references. Nothing here invents a fact, so
 * a person's individual result is as traceable as any page on the site, and a
 * change approved in the console flows through to it automatically.
 *
 * Pure functions, no React, so the logic can be tested and reasoned about on
 * its own.
 */

import { claims, getClaim, type Claim } from "@/data/claims";
import { getSafety, type SafetyObject } from "@/data/safety";
import {
  ASSESSMENT_EVIDENCE as EV,
  ASSESSMENT_RISK_CONTEXT,
  ASSESSMENT_SAFETY as SAFE,
} from "@/data/governed/assessment-surface";

export type AgeBand = "under5" | "5to64" | "65plus";
export type Triple = "yes" | "no" | "unsure";

export interface Profile {
  age: AgeBand;
  pregnant: Triple;
  immunocompromised: Triple;
  childrenUnder5: boolean;
  /** Two-letter state code; optional, used only for sourcing */
  state?: string;
}

export type Severity = "not-recommended" | "caution" | "no-contraindications";

export interface Finding {
  safety: SafetyObject;
  /** Who this applies to */
  who: "you" | "your household";
  /** Why it was triggered, in the visitor's own terms */
  because: string;
  certain: boolean;
}

export interface EvidenceItem {
  claim: Claim;
  relevance: string;
}

export interface Assessment {
  severity: Severity;
  headline: string;
  findings: Finding[];
  evidence: EvidenceItem[];
  riskContext: Claim[];
  discussionPoints: string[];
  sourcing: SourcingStatus;
}

// ---------------------------------------------------------------- sourcing
// Only what the research document actually names. Every other state links out
// rather than asserting a legal status, because laws change and getting this
// wrong matters more than the convenience of a definitive answer.
export const RETAIL_STATES = ["CA", "CT", "ME", "NH", "NM", "PA", "SC", "WA"];
export const HERD_SHARE_STATES = ["CO", "OH", "WY"];

export interface SourcingStatus {
  state?: string;
  label: string;
  detail: string;
  /** true when we are citing a source rather than telling people to check */
  cited: boolean;
}

export function sourcingFor(state?: string): SourcingStatus {
  if (!state) {
    return {
      label: "Varies by state",
      detail:
        "Raw milk sale is regulated state by state: retail sale in some, farm sale only in others, herd shares in others, and prohibited in some. Check the current position where you live before buying.",
      cited: false,
    };
  }
  if (RETAIL_STATES.includes(state)) {
    return {
      state,
      label: "Retail sale is permitted",
      detail: `${state} is listed among the states permitting retail store sale. Laws change, so confirm the current position before buying.`,
      cited: true,
    };
  }
  if (HERD_SHARE_STATES.includes(state)) {
    return {
      state,
      label: "Herd share or cow share",
      detail: `${state} is listed among the states where herd share or cow share arrangements operate. Laws change, so confirm the current position before buying.`,
      cited: true,
    };
  }
  return {
    state,
    label: "Not determined here",
    detail: `This site does not hold a sourced legal status for ${state}. Rather than guess, check the state-by-state listing before buying.`,
    cited: false,
  };
}

// ------------------------------------------------------------- the assessment
/**
 * Resolve a claim id, loudly.
 *
 * A mistyped id is the one failure this feature could ship with unnoticed: the
 * page still renders, the visitor just silently loses a piece of their result.
 * So it throws during development and in the build, and degrades rather than
 * crashing for a visitor if one ever slips through.
 */
function lookup(id: string): Claim | undefined {
  const c = claims.find((x) => x.id === id);
  if (!c && process.env.NODE_ENV !== "production") {
    throw new Error(`assessment references unknown claim "${id}"`);
  }
  return c;
}

const YES = (v: Triple) => v === "yes";
const MAYBE = (v: Triple) => v === "unsure";

export function assess(profile: Profile): Assessment {
  const findings: Finding[] = [];

  if (profile.age === "under5") {
    findings.push({
      safety: getSafety(SAFE.under5),
      who: "you",
      because: "the person drinking it is under 5",
      certain: true,
    });
  }
  if (profile.age === "65plus") {
    findings.push({
      safety: getSafety(SAFE.over65),
      who: "you",
      because: "the person drinking it is over 65",
      certain: true,
    });
  }
  if (YES(profile.pregnant) || MAYBE(profile.pregnant)) {
    findings.push({
      safety: getSafety(SAFE.pregnant),
      who: "you",
      because: MAYBE(profile.pregnant) ? "you may be pregnant" : "you are pregnant or trying to conceive",
      certain: YES(profile.pregnant),
    });
  }
  if (YES(profile.immunocompromised) || MAYBE(profile.immunocompromised)) {
    findings.push({
      safety: getSafety(SAFE.immunocompromised),
      who: "you",
      because: MAYBE(profile.immunocompromised)
        ? "you are not sure whether your immune system is weakened"
        : "your immune system is weakened",
      certain: YES(profile.immunocompromised),
    });
  }
  if (profile.childrenUnder5 && profile.age !== "under5") {
    findings.push({
      safety: getSafety(SAFE.under5),
      who: "your household",
      because: "a child under 5 lives with you and could drink it",
      certain: true,
    });
  }

  const certain = findings.filter((f) => f.certain).length;
  const severity: Severity = certain > 0 ? "not-recommended" : findings.length > 0 ? "caution" : "no-contraindications";

  const headline =
    severity === "not-recommended"
      ? findings.some((f) => f.who === "your household" && f.certain) && certain === 1
        ? "Raw milk is not recommended for someone in your household"
        : "Raw milk is not recommended for you"
      : severity === "caution"
        ? "Answer a couple of things with your doctor before deciding"
        : "No contraindication from the answers you gave";

  // ---- evidence relevant to this person, drawn from the governed claims
  const evidence: EvidenceItem[] = [];
  const add = (id: string, relevance: string) => {
    const c = lookup(id);
    if (c) evidence.push({ claim: c, relevance });
  };

  if (profile.childrenUnder5 || profile.age === "under5") {
    add(EV.asthma, "You have a young child, and the allergy findings are specific to early-life consumption.");
    add(EV.respiratory, "This finding is about infants, and it sits directly against the contraindication above.");
    add(EV.discouraged, "The authors of those studies still advise against raw milk, which is the tension to weigh.");
  } else {
    add(EV.asthma, "The most-cited benefit claim, though it concerns children rather than adults.");
  }
  add(EV.omega3, "A composition difference that comes from grass feeding, not from skipping pasteurization.");
  add(EV.lactose, "A common reason people try raw milk that the evidence does not support.");
  if (profile.age === "65plus" || YES(profile.immunocompromised)) {
    add(EV.listeria, "Severity, not just frequency, is what matters for you — and it cuts both ways between raw and pasteurized.");
  }

  const riskContext = ASSESSMENT_RISK_CONTEXT.map((id) => lookup(id)).filter((c): c is Claim => Boolean(c));

  // ---- what to actually ask a clinician
  const discussionPoints: string[] = [];
  if (severity === "not-recommended") {
    discussionPoints.push(
      `The FDA advises against raw milk for ${findings.map((f) => f.safety.label.toLowerCase()).join(", ")}. Does that apply to my situation, and how strongly?`
    );
  }
  if (YES(profile.immunocompromised) || MAYBE(profile.immunocompromised)) {
    discussionPoints.push("Given my medication and diagnoses, how would you rate my risk from a foodborne infection specifically?");
  }
  if (YES(profile.pregnant) || MAYBE(profile.pregnant)) {
    discussionPoints.push("What is the actual risk of listeria in pregnancy, and what would you advise about unpasteurized dairy generally?");
  }
  if (profile.childrenUnder5) {
    discussionPoints.push(
      "European studies link early-life farm milk to less asthma, but the same authors advise against raw milk. How would you weigh that for my child?"
    );
  }
  discussionPoints.push("Are there pasteurized or minimally processed options that would give me what I am looking for?");
  discussionPoints.push("If I did drink it, what symptoms should send me to you or to an emergency department?");

  return { severity, headline, findings, evidence, riskContext, discussionPoints, sourcing: sourcingFor(profile.state) };
}

/** Human-readable summary of the answers, for the printed guide */
export function describeProfile(p: Profile): string[] {
  const age = { under5: "Under 5", "5to64": "Between 5 and 64", "65plus": "65 or older" }[p.age];
  const t = (v: Triple) => ({ yes: "Yes", no: "No", unsure: "Not sure" })[v];
  return [
    `Age: ${age}`,
    `Pregnant or trying to conceive: ${t(p.pregnant)}`,
    `Weakened immune system: ${t(p.immunocompromised)}`,
    `Children under 5 in the household: ${p.childrenUnder5 ? "Yes" : "No"}`,
    ...(p.state ? [`State: ${p.state}`] : []),
  ];
}

export { getClaim };
