/**
 * Builds the regulatory graph: src/generated/graph.json
 *
 * Runs in `prebuild`. Scans page and component source for governed usages,
 * joins them with the claim / safety / reference registries, and emits nodes,
 * edges, and validation checks. The public site never reads this file; X-ray
 * mode and /admin do.
 *
 * Usage conventions the scanner understands (all static, no runtime tracing):
 *   <Claim id="claim-id" …/>          claim usage
 *   <Safety id="safety-id" …/>        safety usage
 *   claimId="claim-id"                claim usage via a governed wrapper component
 *   <Ref k="key"/> or k={["a","b"]}   loose reference marker (outside a Claim)
 *   <Cite k="key"/>                   governed citation line (bibliography, not a claim)
 *   safetyByGroup("group")            every safety object in that group (ISI lists)
 *   data-component="name"             component boundary; usages attach to the
 *                                     most recent boundary above them in the file
 *
 * One page is registered by hand rather than scanned: /assessment picks its
 * governed objects by id in TypeScript, so no tag appears in the source. It
 * declares its surface in src/data/governed/assessment-surface.ts, which the
 * assessment itself also imports, so the graph cannot fall behind the page.
 *
 * Exit code 1 on: unapproved objects in use, dangling reference keys, or
 * evidence-type claims with no references.
 */

import { readFileSync, writeFileSync, mkdirSync, globSync } from "node:fs";
import { resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

import { claims, EVIDENCE_TYPES } from "../src/data/claims.ts";
import { safetyObjects } from "../src/data/safety.ts";
import { references } from "../src/data/references.ts";
import { assessmentSurface } from "../src/data/governed/assessment-surface.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/generated/graph.json");

type NodeKind = "claim" | "safety" | "reference" | "page" | "component";
interface GraphNode {
  id: string;
  kind: NodeKind;
  label: string;
  status?: string;
  number?: number;
  page?: string;
  route?: string;
  file?: string;
}
interface GraphEdge {
  from: string;
  to: string;
  rel: "contains" | "supported_by" | "balanced_by" | "cites";
  order?: number;
  locator?: string;
}

const nodes = new Map<string, GraphNode>();
const edges: GraphEdge[] = [];
const addNode = (n: GraphNode) => {
  if (!nodes.has(n.id)) nodes.set(n.id, n);
};
const addEdge = (e: GraphEdge) => {
  if (!edges.some((x) => x.from === e.from && x.to === e.to && x.rel === e.rel)) edges.push(e);
};

// ---------------------------------------------------------------- registries
const refByKey = new Map(references.map((r, i) => [r.key, { ...r, number: i + 1 }]));
const claimById = new Map(claims.map((c) => [c.id, c]));
const safetyById = new Map(safetyObjects.map((s) => [s.id, s]));

for (const [key, r] of refByKey) {
  addNode({ id: `ref:${key}`, kind: "reference", label: `${r.authors.split(",")[0]} ${r.year}`, number: r.number });
}
for (const c of claims) {
  addNode({ id: `claim:${c.id}`, kind: "claim", label: c.label, status: c.status });
  for (const r of c.refs) addEdge({ from: `claim:${c.id}`, to: `ref:${r.key}`, rel: "supported_by", locator: r.locator });
  for (const s of c.safety) addEdge({ from: `claim:${c.id}`, to: `safety:${s}`, rel: "balanced_by" });
}
for (const s of safetyObjects) {
  addNode({ id: `safety:${s.id}`, kind: "safety", label: s.label, status: s.status });
  for (const r of s.refs) addEdge({ from: `safety:${s.id}`, to: `ref:${r.key}`, rel: "supported_by", locator: r.locator });
}

// ------------------------------------------------------------------- sources
interface Usage {
  kind: "claim" | "safety" | "ref" | "cite";
  id: string;
  component: string;
  order: number;
}

function routeFor(file: string): { route: string; label: string } | null {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const m = rel.match(/^src\/app\/(.*?)\/?page\.tsx$/);
  if (m) {
    const route = "/" + m[1];
    return { route: route === "/" ? "/" : route.replace(/\/$/, ""), label: route === "/" ? "Home" : m[1] };
  }
  return null;
}

const TOKEN =
  /<Claim\b[^>]*?\bid="([^"]+)"|<Safety\b[^>]*?\bid="([^"]+)"|\bclaimId="([^"]+)"|<Ref\b[^>]*?\bk=(?:"([^"]+)"|\{\s*\[([^\]]*)\]\s*\})|data-component="([^"]+)"|safetyByGroup\("([^"]+)"\)|<Cite\b[^>]*?\bk="([^"]+)"/g;

const files = [
  ...globSync("src/app/**/page.tsx", { cwd: ROOT }),
  ...globSync("src/components/**/*.tsx", { cwd: ROOT }),
]
  .map((f) => resolve(ROOT, f))
  .filter((f) => !/src\/components\/(governed|ui\/Ref)/.test(f)) // the primitives themselves
  .sort();

const looseRefsByPage: Record<string, number> = {};
const pagesConverted: string[] = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const relFile = relative(ROOT, file);
  const page = routeFor(file);
  const pageId = page ? `page:${page.route}` : `page:*`;

  // shared components (ISI, Header…) attach to page:* with the file stem as component
  const stem = relFile.replace(/^.*\//, "").replace(/\.tsx$/, "");
  let component = page ? "page" : stem;
  let order = 0;
  const usages: Usage[] = [];

  for (const m of src.matchAll(TOKEN)) {
    const [, claimId, safetyId, claimIdProp, refKey, refList, componentName, safetyGroup, citeKey] = m;
    if (componentName) {
      component = componentName;
      continue;
    }
    order += 1;
    if (claimId || claimIdProp) usages.push({ kind: "claim", id: (claimId ?? claimIdProp)!, component, order });
    else if (safetyId) usages.push({ kind: "safety", id: safetyId, component, order });
    else if (safetyGroup) {
      // safetyByGroup("x").map(...) renders every object in the group, in registry order
      for (const s of safetyObjects.filter((o) => o.group === safetyGroup)) {
        usages.push({ kind: "safety", id: s.id, component, order });
        order += 1;
      }
    }
    else if (citeKey) usages.push({ kind: "cite", id: citeKey, component, order });
    else if (refKey) usages.push({ kind: "ref", id: refKey, component, order });
    else if (refList !== undefined) {
      for (const k of refList.matchAll(/"([^"]+)"/g)) usages.push({ kind: "ref", id: k[1], component, order });
    }
  }

  if (usages.length === 0) continue; // admin/auth routes carry no governed content
  if (page) addNode({ id: pageId, kind: "page", label: page.label, route: page.route, file: relFile });
  else addNode({ id: "page:*", kind: "page", label: "All pages (layout)", route: "*" });
  const routeKey = page ? page.route : "*";
  let loose = 0;

  for (const u of usages) {
    const compId = `component:${routeKey}#${u.component}`;
    addNode({ id: compId, kind: "component", label: u.component, page: pageId, file: relFile });
    addEdge({ from: pageId, to: compId, rel: "contains" });
    if (u.kind === "claim") addEdge({ from: compId, to: `claim:${u.id}`, rel: "contains", order: u.order });
    else if (u.kind === "safety") addEdge({ from: compId, to: `safety:${u.id}`, rel: "contains", order: u.order });
    else {
      addEdge({ from: compId, to: `ref:${u.id}`, rel: "cites", order: u.order });
      if (u.kind === "ref") loose += 1;
    }
  }
  looseRefsByPage[routeKey] = loose;
  if (loose === 0 && usages.some((u) => u.kind === "claim" || u.kind === "safety")) pagesConverted.push(routeKey);
}

// ----------------------------------------------------- the personal assessment
// Selected in code, not rendered as tags, so the scan above finds nothing here.
// Registering it from the same manifest the assessment imports keeps blast
// radius honest for the one page that produces a document people act on.
{
  const pageId = "page:/assessment";
  const compId = "component:/assessment#PersonalAssessment";
  addNode({ id: pageId, kind: "page", label: "assessment", route: "/assessment", file: "src/app/assessment/page.tsx" });
  addNode({ id: compId, kind: "component", label: "PersonalAssessment", page: pageId, file: "src/lib/assessment.ts" });
  addEdge({ from: pageId, to: compId, rel: "contains" });
  let order = 0;
  for (const id of assessmentSurface.safety) {
    if (!safetyById.has(id)) throw new Error(`assessment surface names unknown safety object "${id}"`);
    addEdge({ from: compId, to: `safety:${id}`, rel: "contains", order: (order += 1) });
  }
  for (const id of assessmentSurface.claims) {
    if (!claimById.has(id)) throw new Error(`assessment surface names unknown claim "${id}"`);
    addEdge({ from: compId, to: `claim:${id}`, rel: "contains", order: (order += 1) });
  }
  looseRefsByPage["/assessment"] = 0;
  pagesConverted.push("/assessment");
}

// -------------------------------------------------------------------- checks
const usedClaims = new Set(edges.filter((e) => e.rel === "contains" && e.to.startsWith("claim:")).map((e) => e.to.slice(6)));
const usedSafety = new Set(edges.filter((e) => e.rel === "contains" && e.to.startsWith("safety:")).map((e) => e.to.slice(7)));

const checks = {
  unapprovedInUse: [
    ...[...usedClaims].filter((id) => claimById.get(id)?.status !== "approved").map((id) => `claim:${id}`),
    ...[...usedSafety].filter((id) => safetyById.get(id)?.status !== "approved").map((id) => `safety:${id}`),
  ],
  unknownObjectsInUse: [
    ...[...usedClaims].filter((id) => !claimById.has(id)).map((id) => `claim:${id}`),
    ...[...usedSafety].filter((id) => !safetyById.has(id)).map((id) => `safety:${id}`),
  ],
  danglingRefs: [
    ...claims.flatMap((c) => c.refs.filter((r) => !refByKey.has(r.key)).map((r) => `claim:${c.id} → ${r.key}`)),
    ...safetyObjects.flatMap((s) => s.refs.filter((r) => !refByKey.has(r.key)).map((r) => `safety:${s.id} → ${r.key}`)),
    ...edges.filter((e) => e.rel === "cites" && !refByKey.has(e.to.slice(4))).map((e) => `${e.from} → ${e.to.slice(4)}`),
  ],
  claimsWithoutEvidence: claims.filter((c) => EVIDENCE_TYPES.includes(c.type) && c.refs.length === 0).map((c) => c.id),
  unusedClaims: claims.filter((c) => !usedClaims.has(c.id)).map((c) => c.id),
  unusedSafety: safetyObjects.filter((s) => !usedSafety.has(s.id)).map((s) => s.id),
  looseRefsByPage,
  pagesConverted,
};

// -------------------------------------------------------------------- output
const graph = {
  generatedAt: new Date().toISOString(),
  counts: {
    claims: claims.length,
    safety: safetyObjects.length,
    references: references.length,
    pages: [...nodes.values()].filter((n) => n.kind === "page").length,
    components: [...nodes.values()].filter((n) => n.kind === "component").length,
    edges: edges.length,
  },
  nodes: [...nodes.values()],
  edges,
  checks,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(graph, null, 2) + "\n");

// ---------------------------------------------------------------- build stamp
// Footer shows "As of <commit date> · <sha>" so a stale deployment is obvious.
// Prefer git; fall back to Vercel's env when the checkout has no history.
let commit = (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7) || "local";
let commitDate = new Date().toISOString();
try {
  const out = execSync("git log -1 --format='%h|%cI'", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  const [sha, iso] = out.split("|");
  if (sha) commit = sha;
  if (iso) commitDate = iso;
} catch {
  // no git in this environment
}
writeFileSync(
  resolve(ROOT, "src/generated/build-info.json"),
  JSON.stringify({ commit, commitDate, builtAt: new Date().toISOString(), env: process.env.VERCEL_ENV ?? "local" }, null, 2) + "\n"
);

const c = graph.counts;
console.log(
  `🧬 graph: ${c.claims} claims, ${c.safety} safety, ${c.references} refs, ${c.pages} pages, ${c.components} components, ${c.edges} edges → ${relative(ROOT, OUT)}`
);
console.log(`   converted pages: ${pagesConverted.join(", ") || "none"}`);
console.log(`   loose <Ref> markers by page: ${JSON.stringify(looseRefsByPage)}`);
if (checks.unusedClaims.length) console.log(`   ⚠ unused claims: ${checks.unusedClaims.join(", ")}`);
if (checks.unusedSafety.length) console.log(`   ⚠ unused safety: ${checks.unusedSafety.join(", ")}`);

const fatal = [
  ["unapproved objects in use", checks.unapprovedInUse],
  ["unknown objects in use", checks.unknownObjectsInUse],
  ["dangling reference keys", checks.danglingRefs],
  ["evidence claims without references", checks.claimsWithoutEvidence],
] as const;
let failed = false;
for (const [label, items] of fatal) {
  if (items.length) {
    failed = true;
    console.error(`   ✖ ${label}: ${items.join(", ")}`);
  }
}
if (failed) {
  console.error("   Build blocked: unapproved or unsupported content cannot reach production.");
  process.exit(1);
}
