/**
 * Keyless retrieval over the reference library.
 *
 * scripts/index-references.mts extracts text from the hosted PDFs (and PubMed
 * abstracts for paywalled sources) into src/generated/reference-index.json.
 * This module ranks chunks with BM25. A few hundred chunks over 30 sources is
 * small enough that a lexical index is fast, deterministic, and needs no
 * embedding vendor; swap in vector search later behind the same `search()`.
 */

import indexJson from "@/generated/reference-index.json";

export interface Chunk {
  id: string;
  ref: string;
  /** 1-based PDF page, or "Abstract" for PubMed abstracts */
  page: number | "Abstract";
  text: string;
}

export interface ReferenceIndex {
  generatedAt: string;
  chunks: Chunk[];
  sources: Record<string, { kind: "pdf" | "abstract"; pages?: number; chunks: number }>;
}

export interface Hit extends Chunk {
  score: number;
}

export const index = indexJson as unknown as ReferenceIndex;

const STOP = new Set(
  "a an and are as at be by for from has have in is it its of on or that the to was were with which this these those than then there their they we our not no into over under vs versus per".split(" ")
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[‐‑‒–—]/g, "-")
    .split(/[^a-z0-9%.\-]+/)
    .map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t));
}

// ------------------------------------------------------------- BM25 index
const docs = index.chunks.map((c) => tokenize(c.text));
const df = new Map<string, number>();
for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) ?? 0) + 1);
const N = docs.length;
const avgdl = docs.reduce((s, d) => s + d.length, 0) / Math.max(N, 1);
const K1 = 1.4;
const B = 0.75;

function idf(term: string): number {
  const n = df.get(term) ?? 0;
  return Math.log(1 + (N - n + 0.5) / (n + 0.5));
}

export interface SearchOptions {
  /** Restrict to these reference keys */
  refs?: string[];
  k?: number;
}

export function search(query: string, opts: SearchOptions = {}): Hit[] {
  const q = Array.from(new Set(tokenize(query)));
  if (q.length === 0) return [];
  const allowed = opts.refs ? new Set(opts.refs) : null;
  const hits: Hit[] = [];
  for (let i = 0; i < N; i++) {
    const chunk = index.chunks[i];
    if (allowed && !allowed.has(chunk.ref)) continue;
    const d = docs[i];
    if (d.length === 0) continue;
    const tf = new Map<string, number>();
    for (const t of d) tf.set(t, (tf.get(t) ?? 0) + 1);
    let score = 0;
    for (const term of q) {
      const f = tf.get(term);
      if (!f) continue;
      score += idf(term) * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.length) / avgdl)));
    }
    if (score > 0) hits.push({ ...chunk, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, opts.k ?? 8);
}

/** Every chunk for one reference, in document order (for "suggest claims") */
export function chunksFor(ref: string): Chunk[] {
  return index.chunks.filter((c) => c.ref === ref);
}

export function isIndexed(ref: string): boolean {
  return Boolean(index.sources[ref]);
}
