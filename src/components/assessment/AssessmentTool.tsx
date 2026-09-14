"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { css } from "../../../styled-system/css";
import { assess, describeProfile, type AgeBand, type Profile, type Triple } from "@/lib/assessment";
// The results render through the same governed components the rest of the site
// uses, so a printed sheet carries the same reference markers, X-ray can
// inspect it, and a staged change previews here as it does anywhere else.
import Claim from "@/components/governed/Claim";
import Safety from "@/components/governed/Safety";

const STATES = "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split(" ");

const card = css({ padding: "1.5rem", bg: "bg.secondary", border: "1px solid", borderColor: "border.light", borderRadius: "8px", marginBottom: "1.25rem" });
const legend = css({ fontFamily: "body", fontSize: "base", fontWeight: "600", color: "accent.primary", marginBottom: "0.75rem", display: "block" });
const help = css({ fontFamily: "body", fontSize: "sm", color: "text.muted", lineHeight: "1.5", marginTop: "0.35rem" });
const row = css({ display: "flex", gap: "0.5rem", flexWrap: "wrap" });
const h2 = css({ fontFamily: "heading", fontSize: "2xl", fontWeight: "700", color: "accent.primary", marginTop: "2.5rem", marginBottom: "0.75rem" });
const body = css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.7" });
const mono = css({ fontFamily: "mono", fontSize: "xs", color: "text.muted" });

function choice(active: boolean) {
  return css({
    fontFamily: "body",
    fontSize: "sm",
    fontWeight: "600",
    padding: "0.55rem 1rem",
    borderRadius: "999px",
    border: "2px solid",
    cursor: "pointer",
    transition: "all 0.15s ease-out",
    bg: active ? "accent.primary" : "transparent",
    color: active ? "bg.primary" : "accent.primary",
    borderColor: active ? "accent.primary" : "border.medium",
    _hover: { borderColor: "accent.secondary" },
    _focusVisible: { outline: "2px solid", outlineColor: "accent.secondary", outlineOffset: "2px" },
  });
}

const severityStyle = {
  "not-recommended": { bg: "rgba(180,35,24,0.07)", border: "rgba(180,35,24,0.4)", color: "#7F1D1D", word: "Not recommended" },
  caution: { bg: "rgba(198,120,48,0.09)", border: "rgba(198,120,48,0.45)", color: "#7C3E0B", word: "Check with a clinician" },
  "no-contraindications": { bg: "rgba(34,139,34,0.07)", border: "rgba(34,139,34,0.35)", color: "#14532D", word: "No contraindication found" },
} as const;

export default function AssessmentTool() {
  const [age, setAge] = useState<AgeBand | null>(null);
  const [pregnant, setPregnant] = useState<Triple | null>(null);
  const [immuno, setImmuno] = useState<Triple | null>(null);
  const [kids, setKids] = useState<boolean | null>(null);
  const [state, setState] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const complete = age !== null && pregnant !== null && immuno !== null && kids !== null;
  const profile: Profile | null = complete
    ? { age: age!, pregnant: pregnant!, immunocompromised: immuno!, childrenUnder5: kids!, state: state || undefined }
    : null;
  const result = useMemo(() => (profile && submitted ? assess(profile) : null), [profile, submitted]);

  if (result && profile) {
    const tone = severityStyle[result.severity];
    return (
      <div>
        <div
          className={css({ padding: "1.5rem", borderRadius: "8px", border: "2px solid", marginBottom: "1.5rem" })}
          style={{ background: tone.bg, borderColor: tone.border }}
        >
          <p className={css({ fontFamily: "mono", fontSize: "xs", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" })} style={{ color: tone.color }}>
            {tone.word}
          </p>
          <h2 className={css({ fontFamily: "heading", fontSize: "2xl", fontWeight: "700", lineHeight: "1.25" })} style={{ color: tone.color }}>
            {result.headline}
          </h2>
        </div>

        <p className={mono}>Based on: {describeProfile(profile).join(" · ")}</p>

        {result.findings.length > 0 && (
          <>
            <h2 className={h2}>What applies to {result.findings.some((f) => f.who === "your household") ? "you and your household" : "you"}</h2>
            {result.findings.map((f, i) => (
              <div key={i} className={card}>
                <Safety
                  id={f.safety.id}
                  as="p"
                  className={css({ fontFamily: "body", fontSize: "base", color: "text.primary", lineHeight: "1.6", fontWeight: "600" })}
                />
                <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "text.secondary", marginTop: "0.4rem" })}>
                  Shown because {f.because}
                  {f.certain ? "." : ", which you were unsure about."}
                </p>
              </div>
            ))}
          </>
        )}

        <h2 className={h2}>What the evidence actually says</h2>
        <p className={body}>
          These are the same claims used elsewhere on this site, with the same sources. Nothing here is written for you personally;
          it is selected for you.
        </p>
        {result.evidence.map(({ claim, relevance }) => (
          <div key={claim.id} className={card}>
            <Claim
              id={claim.id}
              variant="stat"
              headlineAs="strong"
              headlineClassName={css({
                fontFamily: "heading",
                fontSize: "2xl",
                fontWeight: "700",
                color: "accent.secondary",
                display: "block",
                marginBottom: "0.15rem",
              })}
              textClassName={css({ fontFamily: "body", fontSize: "base", color: "text.primary", lineHeight: "1.6" })}
            />
            <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "text.secondary", marginTop: "0.4rem" })}>{relevance}</p>
            {claim.note && (
              <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "#7C3E0B", marginTop: "0.35rem", lineHeight: "1.5" })}>
                Caveat: {claim.note}
              </p>
            )}
          </div>
        ))}

        <h2 className={h2}>Risk in context</h2>
        <ul className={css({ paddingLeft: "1.25rem", listStyleType: "disc" })}>
          {result.riskContext.map((c) => (
            <Claim
              key={c.id}
              id={c.id}
              as="li"
              className={css({ fontFamily: "body", fontSize: "base", color: "text.secondary", lineHeight: "1.7", marginBottom: "0.4rem" })}
            />
          ))}
        </ul>

        <h2 className={h2}>Where you can buy it</h2>
        <div className={card}>
          <p className={css({ fontFamily: "body", fontSize: "base", fontWeight: "600", color: "accent.primary" })}>{result.sourcing.label}</p>
          <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "text.secondary", lineHeight: "1.6", marginTop: "0.3rem" })}>
            {result.sourcing.detail}
          </p>
          <p className={css({ marginTop: "0.6rem" })}>
            <a href="https://www.realmilk.com/raw-milk-finder/" target="_blank" rel="noopener noreferrer" className={css({ color: "accent.secondary", textDecoration: "underline", fontFamily: "body", fontSize: "sm" })}>
              Check the current state-by-state listing →
            </a>
          </p>
        </div>

        <h2 className={h2}>Questions for your doctor</h2>
        <p className={body}>Print this page or save it as a PDF and take it with you.</p>
        <ol className={css({ paddingLeft: "1.25rem", listStyleType: "decimal", marginTop: "0.75rem" })}>
          {result.discussionPoints.map((q, i) => (
            <li key={i} className={css({ fontFamily: "body", fontSize: "base", color: "text.primary", lineHeight: "1.7", marginBottom: "0.6rem" })}>
              {q}
            </li>
          ))}
        </ol>

        <div className={css({ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "2rem" }) + " no-print"}>
          <button
            type="button"
            onClick={() => window.print()}
            className={css({
              fontFamily: "body",
              fontSize: "base",
              fontWeight: "600",
              padding: "0.85rem 1.5rem",
              bg: "accent.primary",
              color: "bg.primary",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              _hover: { bg: "accent.secondary" },
            })}
          >
            Print or save as PDF
          </button>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className={css({
              fontFamily: "body",
              fontSize: "base",
              fontWeight: "600",
              padding: "0.85rem 1.5rem",
              bg: "transparent",
              color: "accent.primary",
              border: "2px solid",
              borderColor: "accent.primary",
              borderRadius: "6px",
              cursor: "pointer",
              _hover: { bg: "bg.secondary" },
            })}
          >
            Change my answers
          </button>
        </div>

        <p className={css({ ...{}, fontFamily: "body", fontSize: "sm", color: "text.muted", lineHeight: "1.6", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid", borderColor: "border.light" })}>
          This is not medical advice and nothing here was calculated about your health. It selects published safety statements and
          research findings that match the answers you gave, each linked to its source. LACTIVAE™ is not FDA approved. Your answers
          stay in your browser and are never sent anywhere.{" "}
          <Link href="/references" className={css({ color: "accent.secondary", textDecoration: "underline" })}>
            See every source
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <fieldset className={card} style={{ border: undefined }}>
        <legend className={legend}>How old is the person who would drink it?</legend>
        <div className={row}>
          {([["under5", "Under 5"], ["5to64", "5 to 64"], ["65plus", "65 or older"]] as [AgeBand, string][]).map(([v, l]) => (
            <button key={v} type="button" className={choice(age === v)} onClick={() => setAge(v)} aria-pressed={age === v}>
              {l}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={card}>
        <legend className={legend}>Are you pregnant, or trying to conceive?</legend>
        <div className={row}>
          {([["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] as [Triple, string][]).map(([v, l]) => (
            <button key={v} type="button" className={choice(pregnant === v)} onClick={() => setPregnant(v)} aria-pressed={pregnant === v}>
              {l}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={card}>
        <legend className={legend}>Is your immune system weakened?</legend>
        <div className={row}>
          {([["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] as [Triple, string][]).map(([v, l]) => (
            <button key={v} type="button" className={choice(immuno === v)} onClick={() => setImmuno(v)} aria-pressed={immuno === v}>
              {l}
            </button>
          ))}
        </div>
        <p className={help}>
          This includes cancer treatment, an organ transplant, HIV, and medicines that suppress the immune system such as steroids
          or biologics.
        </p>
      </fieldset>

      <fieldset className={card}>
        <legend className={legend}>Does a child under 5 live in your household?</legend>
        <div className={row}>
          {([[true, "Yes"], [false, "No"]] as [boolean, string][]).map(([v, l]) => (
            <button key={l} type="button" className={choice(kids === v)} onClick={() => setKids(v)} aria-pressed={kids === v}>
              {l}
            </button>
          ))}
        </div>
        <p className={help}>Asked because milk in the fridge is available to everyone in the house, not only the person who bought it.</p>
      </fieldset>

      <fieldset className={card}>
        <legend className={legend}>
          Which state are you in? <span className={css({ fontWeight: "400", color: "text.muted" })}>Optional</span>
        </legend>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className={css({
            fontFamily: "body",
            fontSize: "base",
            padding: "0.6rem 0.8rem",
            border: "1px solid",
            borderColor: "border.medium",
            borderRadius: "6px",
            bg: "#fff",
            color: "text.primary",
            minWidth: "12rem",
          })}
        >
          <option value="">Prefer not to say</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <p className={help}>Used only to point you at the right sourcing information. Nothing is sent anywhere.</p>
      </fieldset>

      <button
        type="button"
        disabled={!complete}
        onClick={() => setSubmitted(true)}
        className={css({
          fontFamily: "body",
          fontSize: "base",
          fontWeight: "600",
          padding: "0.9rem 1.75rem",
          bg: "accent.primary",
          color: "bg.primary",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "0.5rem",
          _hover: { bg: "accent.secondary" },
          _disabled: { opacity: 0.45, cursor: "not-allowed" },
        })}
      >
        {complete ? "Show my results" : "Answer all four questions"}
      </button>
    </div>
  );
}
