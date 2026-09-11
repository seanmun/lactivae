import { promises as fs } from "node:fs";
import path from "node:path";
import { createTwoFilesPatch } from "diff";
import { getClaim } from "@/data/claims";
import type { Proposal } from "./proposals/types";

/**
 * Turns an approved proposal into a unified diff against src/data/claims.ts.
 * Promotion to production is a git commit of this patch — the registry in git
 * remains the only source of approved truth.
 */

const CLAIMS_FILE = path.join(process.cwd(), "src", "data", "claims.ts");

function tsString(s: string): string {
  return JSON.stringify(s);
}

export async function buildClaimPatch(proposal: Proposal): Promise<{ patch: string; before: string; after: string }> {
  if (proposal.objectKind !== "claim") throw new Error("Only claim proposals can be patched in this milestone.");
  const claim = getClaim(proposal.objectId);
  const source = await fs.readFile(CLAIMS_FILE, "utf8");

  // Locate this claim's object literal by its id line, then edit fields inside it.
  const idLine = `    id: ${tsString(claim.id)},`;
  const start = source.indexOf(idLine);
  if (start === -1) throw new Error(`Could not find claim "${claim.id}" in claims.ts`);
  const end = source.indexOf("\n  },", start);
  if (end === -1) throw new Error(`Malformed claim block for "${claim.id}"`);

  let block = source.slice(start, end);

  const textLine = block.match(/^\s*text: (".*"),\s*$/m);
  if (!textLine) throw new Error(`No text field found for "${claim.id}"`);
  block = block.replace(textLine[0], textLine[0].replace(textLine[1], tsString(proposal.proposedText)));

  // Version: either an explicit `version: N` line or the shared ...APPROVED spread.
  if (/^\s*version: \d+,\s*$/m.test(block)) {
    block = block.replace(/^(\s*version: )\d+(,\s*)$/m, `$1${claim.version + 1}$2`);
  } else if (/^\s*\.\.\.APPROVED,\s*$/m.test(block)) {
    block = block.replace(/^(\s*)\.\.\.APPROVED,\s*$/m, `$1...APPROVED,\n$1version: ${claim.version + 1},\n$1effectiveFrom: ${tsString(new Date().toISOString().slice(0, 10))},`);
  }

  if (proposal.rationale) {
    if (/^\s*rationale: ".*",\s*$/m.test(block)) {
      block = block.replace(/^(\s*rationale: )".*"(,\s*)$/m, `$1${tsString(proposal.rationale)}$2`);
    } else {
      block += `\n    rationale: ${tsString(proposal.rationale)},`;
    }
  }

  const after = source.slice(0, start) + block + source.slice(end);
  const patch = createTwoFilesPatch("a/src/data/claims.ts", "b/src/data/claims.ts", source, after, undefined, undefined, {
    context: 3,
  });
  return { patch, before: source, after };
}
