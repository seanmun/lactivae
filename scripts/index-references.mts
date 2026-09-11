/**
 * Builds src/generated/reference-index.json — the text corpus behind
 * "verify against sources" and "create claims from this source".
 *
 *   - Hosted PDFs (public/references/*.pdf) are parsed page by page.
 *   - Paywalled sources with a PMID get their PubMed abstract (fetched once,
 *     then reused from the existing index so rebuilds are offline).
 *   - Text is chunked on sentence boundaries (~900 chars, one-sentence overlap).
 *
 * The output is committed: it is derived from committed PDFs, and the build
 * must not depend on the network. Re-run with `npm run index` after adding a
 * PDF or a reference.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";
import { references } from "../src/data/references.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/generated/reference-index.json");

interface Chunk {
  id: string;
  ref: string;
  page: number | "Abstract";
  text: string;
}
interface Index {
  generatedAt: string;
  chunks: Chunk[];
  sources: Record<string, { kind: "pdf" | "abstract"; pages?: number; chunks: number }>;
}

const previous: Index | null = existsSync(OUT) ? (JSON.parse(readFileSync(OUT, "utf8")) as Index) : null;

function normalize(text: string): string {
  return text
    .replace(/-\n(?=[a-z])/g, "") // de-hyphenate line breaks
    .replace(/[ \t]*\n[ \t]*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function chunkText(text: string, target = 900): string[] {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z(\[“"0-9])/);
  const out: string[] = [];
  let buf: string[] = [];
  let len = 0;
  for (const s of sentences) {
    if (len + s.length > target && buf.length > 0) {
      out.push(buf.join(" "));
      const carry = buf[buf.length - 1];
      buf = [carry];
      len = carry.length;
    }
    buf.push(s);
    len += s.length + 1;
  }
  if (buf.length > 0) out.push(buf.join(" "));
  return out.map((c) => c.trim()).filter((c) => c.length > 80);
}

async function parsePdf(file: string): Promise<{ num: number; text: string }[]> {
  const data = new Uint8Array(readFileSync(file));
  const parser = new PDFParse({ data });
  try {
    const result = await parser.getText();
    return result.pages.map((p) => ({ num: p.num, text: normalize(p.text) }));
  } finally {
    await parser.destroy();
  }
}

async function fetchAbstract(pmid: string): Promise<string | null> {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&id=${pmid}`;
  const res = await fetch(url, { headers: { "User-Agent": "lactivae-index/1.0" } });
  if (!res.ok) return null;
  const xml = await res.text();
  const parts = [...xml.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)].map((m) => m[1].replace(/<[^>]+>/g, ""));
  const text = normalize(parts.join(" ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
  return text.length > 100 ? text : null;
}

const chunks: Chunk[] = [];
const sources: Index["sources"] = {};

for (const ref of references) {
  if (ref.pdf) {
    const file = resolve(ROOT, "public", ref.pdf.replace(/^\//, ""));
    if (!existsSync(file)) {
      console.warn(`  ⚠ ${ref.key}: PDF missing at ${ref.pdf}`);
      continue;
    }
    const pages = await parsePdf(file);
    let n = 0;
    for (const p of pages) {
      for (const c of chunkText(p.text)) {
        chunks.push({ id: `${ref.key}#p${p.num}-${n}`, ref: ref.key, page: p.num, text: c });
        n += 1;
      }
    }
    sources[ref.key] = { kind: "pdf", pages: pages.length, chunks: n };
    console.log(`  ${ref.key.padEnd(20)} pdf  ${String(pages.length).padStart(3)} pages ${String(n).padStart(4)} chunks`);
  } else if (ref.pmid) {
    const cached = previous?.chunks.filter((c) => c.ref === ref.key && c.page === "Abstract") ?? [];
    let text: string | null = null;
    if (cached.length > 0) text = cached.map((c) => c.text).join(" ");
    else {
      text = await fetchAbstract(ref.pmid);
      await new Promise((r) => setTimeout(r, 450));
    }
    if (!text) {
      console.warn(`  ⚠ ${ref.key}: no abstract available`);
      continue;
    }
    const parts = chunkText(text, 1200);
    parts.forEach((c, i) => chunks.push({ id: `${ref.key}#abstract-${i}`, ref: ref.key, page: "Abstract", text: c }));
    sources[ref.key] = { kind: "abstract", chunks: parts.length };
    console.log(`  ${ref.key.padEnd(20)} abstract${cached.length ? " (cached)" : ""} ${String(parts.length).padStart(3)} chunks`);
  }
}

const index: Index = { generatedAt: new Date().toISOString(), chunks, sources };
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(index) + "\n");
const bytes = Buffer.byteLength(JSON.stringify(index));
console.log(`📚 index: ${chunks.length} chunks from ${Object.keys(sources).length} sources → src/generated/reference-index.json (${(bytes / 1024).toFixed(0)} KB)`);
