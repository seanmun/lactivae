import Link from "next/link";
import { css } from "../../../styled-system/css";
import {
  referencesByCategory,
  references,
  ACCESS_LABELS,
  type Reference,
  type ReferenceAccess,
} from "@/data/references";

export const metadata = {
  title: "References - LACTIVAE™ Source Library",
  description:
    "Every numbered claim on LACTIVAE™ resolves to a verified, peer-reviewed or regulatory source listed here, with DOI, PubMed, and full-text links.",
};

const badgeBase = {
  display: "inline-block",
  fontFamily: "mono",
  fontSize: "xs",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "0.2rem 0.55rem",
  borderRadius: "999px",
  border: "1px solid",
  whiteSpace: "nowrap",
} as const;

const accessBadgeClass: Record<ReferenceAccess, string> = {
  open: css({ ...badgeBase, bg: "rgba(34, 139, 34, 0.08)", color: "#1F6B2E", borderColor: "rgba(34, 139, 34, 0.3)" }),
  "public-domain": css({ ...badgeBase, bg: "rgba(34, 139, 34, 0.08)", color: "#1F6B2E", borderColor: "rgba(34, 139, 34, 0.3)" }),
  abstract: css({ ...badgeBase, bg: "rgba(198, 120, 48, 0.1)", color: "accent.secondary", borderColor: "rgba(198, 120, 48, 0.35)" }),
  web: css({ ...badgeBase, bg: "rgba(61, 45, 34, 0.06)", color: "text.secondary", borderColor: "border.medium" }),
  book: css({ ...badgeBase, bg: "rgba(61, 45, 34, 0.06)", color: "text.secondary", borderColor: "border.medium" }),
};

function AccessBadge({ access }: { access: ReferenceAccess }) {
  return <span className={accessBadgeClass[access]}>{ACCESS_LABELS[access]}</span>;
}

function LinkChip({ href, children, primary = false, external = true }: { href: string; children: React.ReactNode; primary?: boolean; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={css({
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        fontFamily: "body",
        fontSize: "sm",
        fontWeight: "600",
        padding: "0.4rem 0.8rem",
        borderRadius: "6px",
        textDecoration: "none",
        border: "1px solid",
        transition: "all 0.2s ease-out",
        bg: primary ? "accent.primary" : "transparent",
        color: primary ? "bg.primary" : "accent.primary",
        borderColor: primary ? "accent.primary" : "border.medium",
        _hover: {
          bg: primary ? "accent.secondary" : "bg.secondary",
          borderColor: "accent.secondary",
          transform: "translateY(-1px)",
        },
      })}
    >
      {children}
    </a>
  );
}

function Entry({ number, entry }: { number: number; entry: Reference }) {
  return (
    <li
      id={`ref-${number}`}
      className={css({
        display: "grid",
        gridTemplateColumns: { base: "2.5rem 1fr", md: "3.5rem 1fr" },
        gap: { base: "0.75rem", md: "1.25rem" },
        padding: { base: "1.25rem 0", md: "1.5rem 0" },
        borderBottom: "1px solid",
        borderColor: "border.light",
        scrollMarginTop: "6rem",
        _target: {
          bg: "bg.secondary",
          boxShadow: "inset 4px 0 0 var(--colors-accent-secondary)",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          borderRadius: "8px",
        },
      })}
    >
      <div
        className={css({
          fontFamily: "mono",
          fontSize: { base: "lg", md: "xl" },
          fontWeight: "700",
          color: "accent.secondary",
          lineHeight: "1.4",
        })}
      >
        {number}.
      </div>

      <div>
        <div
          className={css({
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.5rem 0.75rem",
            marginBottom: "0.35rem",
          })}
        >
          <span
            className={css({
              fontFamily: "body",
              fontSize: "sm",
              fontWeight: "600",
              color: "text.primary",
            })}
          >
            {entry.authors}
          </span>
          <AccessBadge access={entry.access} />
        </div>

        <p
          className={css({
            fontFamily: "body",
            fontSize: "base",
            fontWeight: "600",
            color: "accent.primary",
            lineHeight: "1.5",
            marginBottom: "0.25rem",
          })}
        >
          {entry.title}.
        </p>

        <p
          className={css({
            fontFamily: "body",
            fontSize: "sm",
            color: "text.secondary",
            fontStyle: "italic",
            marginBottom: "0.5rem",
          })}
        >
          {entry.source}. {entry.year}
          {entry.citation ? `;${entry.citation}` : ""}.
        </p>

        {(entry.doi || entry.pmid || entry.pmcid) && (
          <p
            className={css({
              fontFamily: "mono",
              fontSize: "xs",
              color: "text.muted",
              marginBottom: "0.75rem",
              wordBreak: "break-all",
            })}
          >
            {entry.doi && <span>DOI: {entry.doi}</span>}
            {entry.pmid && <span>{entry.doi ? " · " : ""}PMID: {entry.pmid}</span>}
            {entry.pmcid && <span> · PMCID: {entry.pmcid}</span>}
          </p>
        )}

        <p
          className={css({
            fontFamily: "body",
            fontSize: "sm",
            color: "text.secondary",
            lineHeight: "1.6",
            marginBottom: "0.5rem",
          })}
        >
          <strong className={css({ color: "text.primary" })}>Cited for: </strong>
          {entry.supports}
        </p>

        {entry.note && (
          <p
            className={css({
              fontFamily: "body",
              fontSize: "sm",
              color: "text.muted",
              lineHeight: "1.6",
              marginBottom: "0.75rem",
              paddingLeft: "0.75rem",
              borderLeft: "3px solid",
              borderColor: "accent.warm",
            })}
          >
            <strong>Reviewer note: </strong>
            {entry.note}
          </p>
        )}

        <div
          className={css({
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "0.75rem",
          })}
        >
          {entry.pdf && (
            <LinkChip href={entry.pdf} primary>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
              Full text PDF
            </LinkChip>
          )}
          {entry.doi && <LinkChip href={`https://doi.org/${entry.doi}`}>DOI</LinkChip>}
          {entry.pmid && <LinkChip href={`https://pubmed.ncbi.nlm.nih.gov/${entry.pmid}/`}>PubMed</LinkChip>}
          {entry.pmcid && <LinkChip href={`https://pmc.ncbi.nlm.nih.gov/articles/${entry.pmcid}/`}>PubMed Central</LinkChip>}
          {entry.url && <LinkChip href={entry.url}>{entry.access === "web" || entry.access === "public-domain" ? "Website" : "Source"}</LinkChip>}
        </div>
      </div>
    </li>
  );
}

export default function ReferencesPage() {
  const groups = referencesByCategory();
  const openCount = references.filter((r) => r.pdf).length;

  return (
    <>
      {/* Hero Section */}
      <section
        className={css({
          position: "relative",
          padding: "4rem 2rem",
          borderBottom: "1px solid",
          borderColor: "border.light",
          minHeight: "45vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        })}
      >
        <div
          className={css({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/lab-milk.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
            zIndex: 0,
          })}
        />
        <div
          className={css({
            position: "relative",
            zIndex: 1,
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          })}
        >
          <p
            className={css({
              fontFamily: "mono",
              fontSize: "sm",
              fontWeight: "600",
              color: "accent.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "1rem",
            })}
          >
            Source Library
          </p>
          <h1
            className={css({
              fontFamily: "heading",
              fontSize: "4xl",
              fontWeight: "700",
              color: "accent.primary",
              marginBottom: "1rem",
            })}
          >
            References
          </h1>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "xl",
              color: "text.secondary",
              lineHeight: "1.6",
            })}
          >
            Every numbered claim on this site resolves to one of the {references.length} sources below.
          </p>
        </div>
      </section>

      <div
        className={css({
          maxWidth: "1000px",
          margin: "0 auto",
          padding: { base: "2rem 1.25rem", md: "3rem 2rem" },
        })}
      >
        {/* How to read this page */}
        <section
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "2fr 1fr" },
            gap: "1.5rem",
            marginBottom: "3rem",
          })}
        >
          <div
            className={css({
              padding: "1.5rem 2rem",
              bg: "bg.secondary",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "border.light",
            })}
          >
            <h2
              className={css({
                fontFamily: "heading",
                fontSize: "xl",
                fontWeight: "700",
                color: "accent.primary",
                marginBottom: "0.75rem",
              })}
            >
              How citations work on LACTIVAE™
            </h2>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.7",
                marginBottom: "0.75rem",
              })}
            >
              Superscript numbers next to a statistic or statement link directly to the entry that supports it.
              Bibliographic details were checked against PubMed and Crossref, and the &ldquo;Cited for&rdquo; line
              on each entry states exactly what the source is being used to support, so a reviewer can judge the
              match without re-reading the paper.
            </p>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "base",
                color: "text.secondary",
                lineHeight: "1.7",
              })}
            >
              Where the full text is free, a copy is hosted here so links do not rot. Where a journal is paywalled,
              only the abstract is public, and that entry is flagged.
            </p>
          </div>

          <div
            className={css({
              padding: "1.5rem",
              bg: "bg.tertiary",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "border.light",
              display: "flex",
              flexDirection: "column",
              gap: "0.9rem",
            })}
          >
            <h3
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "accent.primary",
                textTransform: "uppercase",
                letterSpacing: "wider",
              })}
            >
              Access legend
            </h3>
            <div className={css({ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "body", fontSize: "sm", color: "text.secondary" })}>
              <AccessBadge access="open" /> Full text free; PDF hosted
            </div>
            <div className={css({ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "body", fontSize: "sm", color: "text.secondary" })}>
              <AccessBadge access="public-domain" /> US government or pre-1929 work
            </div>
            <div className={css({ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "body", fontSize: "sm", color: "text.secondary" })}>
              <AccessBadge access="abstract" /> Paywalled; abstract on PubMed
            </div>
            <div className={css({ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "body", fontSize: "sm", color: "text.secondary" })}>
              <AccessBadge access="web" /> Living web resource
            </div>
            <p
              className={css({
                fontFamily: "mono",
                fontSize: "xs",
                color: "text.muted",
                marginTop: "0.25rem",
                lineHeight: "1.6",
              })}
            >
              {openCount} of {references.length} sources have a hosted full-text PDF.
              <br />
              Machine-readable list:{" "}
              <a href="/api/references" className={css({ color: "accent.secondary", textDecoration: "underline" })}>
                /api/references
              </a>
            </p>
          </div>
        </section>

        {/* Section jump links */}
        <nav
          aria-label="Reference categories"
          className={css({
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "2.5rem",
          })}
        >
          {groups.map((g) => (
            <a
              key={g.category}
              href={`#${g.category}`}
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "accent.primary",
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                border: "1px solid",
                borderColor: "border.medium",
                textDecoration: "none",
                _hover: { bg: "bg.secondary", borderColor: "accent.secondary" },
              })}
            >
              {g.label}{" "}
              <span className={css({ fontFamily: "mono", color: "text.muted" })}>
                {g.items[0]?.number}–{g.items[g.items.length - 1]?.number}
              </span>
            </a>
          ))}
        </nav>

        {/* Grouped reference list */}
        {groups.map((g) => (
          <section key={g.category} id={g.category} className={css({ marginBottom: "3.5rem", scrollMarginTop: "6rem" })}>
            <h2
              className={css({
                fontFamily: "heading",
                fontSize: "2xl",
                fontWeight: "700",
                color: "accent.primary",
                paddingBottom: "0.75rem",
                marginBottom: "0.5rem",
                borderBottom: "2px solid",
                borderColor: "accent.secondary",
              })}
            >
              {g.label}
            </h2>
            <ol className={css({ listStyle: "none", padding: 0, margin: 0 })}>
              {g.items.map(({ number, ref }) => (
                <Entry key={ref.key} number={number} entry={ref} />
              ))}
            </ol>
          </section>
        ))}

        {/* Fair balance footer */}
        <section
          className={css({
            padding: "2rem",
            bg: "accent.primary",
            color: "bg.primary",
            borderRadius: "8px",
            marginBottom: "2rem",
          })}
        >
          <h2
            className={css({
              fontFamily: "heading",
              fontSize: "xl",
              fontWeight: "700",
              color: "accent.warm",
              marginBottom: "0.75rem",
            })}
          >
            Reading the evidence responsibly
          </h2>
          <p className={css({ fontFamily: "body", fontSize: "base", lineHeight: "1.7", marginBottom: "0.75rem" })}>
            The allergy and asthma findings come from observational cohorts and cannot establish causation. The
            longevity finding is from a nematode model using cheese extracts. Grass-fed fatty-acid comparisons
            reflect what the cows ate, not whether the milk was pasteurized. The authors of several sources cited
            here explicitly advise against consuming raw milk because of infection risk.
          </p>
          <p className={css({ fontFamily: "body", fontSize: "sm", lineHeight: "1.7", opacity: 0.85 })}>
            LACTIVAE™ (raw milk, oral solution) is not FDA approved. This site is an educational demonstration project.
            See the <Link href="/safety" className={css({ color: "accent.warm", textDecoration: "underline" })}>Safety</Link> page
            and the Important Safety Information at the bottom of every page.
          </p>
        </section>
      </div>
    </>
  );
}
