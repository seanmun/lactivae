import { css } from "../../../styled-system/css";
import AssessmentTool from "@/components/assessment/AssessmentTool";

export const metadata = {
  title: "Is LACTIVAE™ right for you?",
  description:
    "Answer four questions and see which published safety statements apply to you, what the research does and does not support, and what to ask your doctor.",
};

export default function AssessmentPage() {
  return (
    <>
      <section
        className={css({
          position: "relative",
          padding: "4rem 2rem",
          borderBottom: "1px solid",
          borderColor: "border.light",
          overflow: "hidden",
          bg: "bg.secondary",
        })}
      >
        <div
          className={css({
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/milk-doctor.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
            zIndex: 0,
          })}
        />
        <div className={css({ position: "relative", zIndex: 1, maxWidth: "760px", margin: "0 auto", textAlign: "center" })}>
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
            Personal risk–benefit
          </p>
          <h1 className={css({ fontFamily: "heading", fontSize: "4xl", fontWeight: "700", color: "accent.primary", marginBottom: "1rem" })}>
            Is LACTIVAE™ right for you?
          </h1>
          <p className={css({ fontFamily: "body", fontSize: "lg", color: "text.secondary", lineHeight: "1.6" })}>
            Four questions. You&rsquo;ll get the safety statements that apply to your situation, the research that is and
            isn&rsquo;t relevant to it, and a list of questions to take to your doctor.
          </p>
        </div>
      </section>

      <div className={css({ maxWidth: "760px", margin: "0 auto", padding: { base: "2rem 1.25rem 4rem", md: "3rem 2rem 6rem" } })}>
        <p
          className={css({
            fontFamily: "body",
            fontSize: "sm",
            color: "text.secondary",
            lineHeight: "1.6",
            padding: "1rem 1.25rem",
            bg: "bg.tertiary",
            border: "1px solid",
            borderColor: "border.light",
            borderRadius: "8px",
            marginBottom: "2rem",
          })}
        >
          <strong>How this works.</strong> Nothing is calculated about your health and no score is produced. Your answers select
          which published statements and findings apply to you, each one linked to its source. Everything stays in your browser.
        </p>

        <AssessmentTool />
      </div>
    </>
  );
}
