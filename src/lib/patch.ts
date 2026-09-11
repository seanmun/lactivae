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

const GOVERNED_DIR = path.join(process.cwd(), "src", "data", "governed");

/** Locate the registry file that defines a claim id */
async function findClaimFile(id: string): Promise<{ file: string; source: string }> {
  const entries = (await fs.readdir(GOVERNED_DIR)).filter((f) => f.endsWith(".ts")).sort();
  const idLine = `id: ${JSON.stringify(id)},`;
  for (const f of entries) {
    const file = path.join(GOVERNED_DIR, f);
    const source = await fs.readFile(file, "utf8");
    if (source.includes(idLine)) return { file, source };
  }
  throw new Error(`Could not find claim "${id}" in src/data/governed/*.ts`);
}

function tsString(s: string): string {
  return JSON.stringify(s);
}

function refLiteral(r: { key: string; locator?: string; quote?: string }): string {
  const parts = [`key: ${tsString(r.key)}`];
  if (r.locator) parts.push(`locator: ${tsString(r.locator)}`);
  if (r.quote) parts.push(`quote: ${tsString(r.quote)}`);
  return `{ ${parts.join(", ")} }`;
}

/** New claims are appended to the suggested registry as approved, unused objects. */
async function buildNewClaimPatch(proposal: Proposal): Promise<{ patch: string; before: string; after: string }> {
  const file = path.join(GOVERNED_DIR, "suggested.ts");
  const source = await fs.readFile(file, "utf8");
  const relFile = "src/data/governed/suggested.ts";
  if (source.includes(`id: ${tsString(proposal.objectId)},`)) throw new Error(`Claim "${proposal.objectId}" already exists in ${relFile}`);
  const closing = source.lastIndexOf("];");
  if (closing === -1) throw new Error(`Malformed ${relFile}`);
  const today = new Date().toISOString().slice(0, 10);
  const obj = [
    "  {",
    `    id: ${tsString(proposal.objectId)},`,
    `    label: ${tsString(proposal.proposedLabel ?? proposal.objectId)},`,
    `    type: ${tsString(proposal.proposedType ?? "factual")},`,
    `    topic: ["suggested"${proposal.sourceRef ? `, ${tsString(proposal.sourceRef)}` : ""}],`,
    `    text: ${tsString(proposal.proposedText)},`,
    `    refs: [${proposal.proposedRefs.map(refLiteral).join(", ")}],`,
    `    safety: [${proposal.proposedSafety.map(tsString).join(", ")}],`,
    `    status: "approved",`,
    `    version: 1,`,
    `    effectiveFrom: ${tsString(today)},`,
    proposal.rationale ? `    rationale: ${tsString(proposal.rationale)},` : null,
    `    note: ${tsString(`Created from ${proposal.sourceRef ?? "the reference library"} via the create-claims workflow; not yet used on any page.`)},`,
    "  },",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
  const before = source.slice(0, closing).replace(/\s*$/, "");
  const after = `${before}\n${obj}\n${source.slice(closing)}`;
  const patch = createTwoFilesPatch(`a/${relFile}`, `b/${relFile}`, source, after, undefined, undefined, { context: 3 });
  return { patch, before: source, after };
}

export async function buildClaimPatch(proposal: Proposal): Promise<{ patch: string; before: string; after: string }> {
  if (proposal.objectKind !== "claim") throw new Error("Only claim proposals can be patched in this milestone.");
  if (proposal.isNew) return buildNewClaimPatch(proposal);
  const claim = getClaim(proposal.objectId);
  const { file, source } = await findClaimFile(claim.id);
  const relFile = path.relative(process.cwd(), file).split(path.sep).join("/");

  // Locate this claim's object literal by its id line, then edit fields inside it.
  // Registries use either one-field-per-line or compact single-line objects.
  const idLine = `id: ${tsString(claim.id)},`;
  const start = source.indexOf(idLine);
  if (start === -1) throw new Error(`Could not find claim "${claim.id}" in ${relFile}`);
  const endMulti = source.indexOf("\n  },", start);
  const endCompact = source.indexOf("...APPROVED", start);
  let end = endMulti;
  if (endCompact !== -1 && (endMulti === -1 || endCompact < endMulti)) {
    // compact object: block ends at the closing " }," after the spread and any trailing fields
    end = source.indexOf(" },\n", endCompact);
  }
  if (end === -1) throw new Error(`Malformed claim block for "${claim.id}"`);

  let block = source.slice(start, end);

  const textField = block.match(/\btext: (".*?"),(?=\s)/s);
  if (!textField) throw new Error(`No text field found for "${claim.id}"`);
  block = block.replace(textField[0], textField[0].replace(textField[1], tsString(proposal.proposedText)));

  // Version and effective date: either explicit fields or the shared ...APPROVED spread.
  // Fields added after the spread override it. Works for both one-field-per-line
  // blocks ("...APPROVED,\n") and compact blocks ("...APPROVED }").
  const today = tsString(new Date().toISOString().slice(0, 10));
  const hasRationale = /\brationale: ".*?",?/s.test(block);
  const rationaleField = proposal.rationale && !hasRationale ? `, rationale: ${tsString(proposal.rationale)}` : "";
  if (/\bversion: \d+/.test(block)) {
    block = block.replace(/\bversion: \d+/, `version: ${claim.version + 1}`);
    if (/\beffectiveFrom: "[^"]*"/.test(block)) block = block.replace(/\beffectiveFrom: "[^"]*"/, `effectiveFrom: ${today}`);
    if (rationaleField) block += `\n   ${rationaleField.slice(1)},`;
  } else if (/\.\.\.APPROVED\b/.test(block)) {
    block = block.replace(/\.\.\.APPROVED\b/, `...APPROVED, version: ${claim.version + 1}, effectiveFrom: ${today}${rationaleField}`);
  }
  if (proposal.rationale && hasRationale) {
    block = block.replace(/\brationale: ".*?"/s, `rationale: ${tsString(proposal.rationale)}`);
  }

  const after = source.slice(0, start) + block + source.slice(end);
  const patch = createTwoFilesPatch(`a/${relFile}`, `b/${relFile}`, source, after, undefined, undefined, {
    context: 3,
  });
  return { patch, before: source, after };
}
