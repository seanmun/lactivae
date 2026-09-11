import { css } from "../../../styled-system/css";
import type { ProposalStatus } from "@/lib/proposals/types";

const base = {
  display: "inline-block",
  fontFamily: "mono",
  fontSize: "xs",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: "0.2rem 0.6rem",
  borderRadius: "999px",
  border: "1px solid",
} as const;

const styles: Record<ProposalStatus, string> = {
  draft: css({ ...base, bg: "bg.tertiary", color: "text.secondary", borderColor: "border.medium" }),
  staged: css({ ...base, bg: "rgba(109, 40, 217, 0.1)", color: "#4C1D95", borderColor: "rgba(109, 40, 217, 0.35)" }),
  approved: css({ ...base, bg: "rgba(34, 139, 34, 0.1)", color: "#14532D", borderColor: "rgba(34, 139, 34, 0.35)" }),
  rejected: css({ ...base, bg: "rgba(180, 35, 24, 0.08)", color: "#7F1D1D", borderColor: "rgba(180, 35, 24, 0.3)" }),
};

export default function StatusPill({ status }: { status: ProposalStatus }) {
  return <span className={styles[status]}>{status}</span>;
}
