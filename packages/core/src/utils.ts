import type { A11yFinding, ScanSummary, Severity, SupportedFileType } from "./types.js";

export function detectFileType(fileName: string, mimeType?: string): SupportedFileType {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".html") || lower.endsWith(".htm") || mimeType === "text/html") return "html";
  if (lower.endsWith(".md") || lower.endsWith(".markdown") || mimeType === "text/markdown") return "markdown";
  if (lower.endsWith(".docx")) return "docx";
  if (lower.endsWith(".pptx")) return "pptx";
  if (lower.endsWith(".pdf") || mimeType === "application/pdf") return "pdf";
  return "unknown";
}

export function toText(content: string | ArrayBuffer | Uint8Array): string {
  if (typeof content === "string") return content;
  const bytes = content instanceof Uint8Array ? content : new Uint8Array(content);
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

export function toUint8(content: string | ArrayBuffer | Uint8Array): Uint8Array {
  if (content instanceof Uint8Array) return content;
  if (typeof content === "string") return new TextEncoder().encode(content);
  return new Uint8Array(content);
}

export function stripHtml(text: string): string {
  return decodeEntities(text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

export function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function getAttr(tag: string, attr: string): string | undefined {
  const re = new RegExp(`${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = tag.match(re);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

export function hasAttr(tag: string, attr: string): boolean {
  return new RegExp(`\\s${attr}(?:\\s|=|>)`, "i").test(tag);
}

export function makeFinding(partial: Omit<A11yFinding, "id">): A11yFinding {
  const seed = `${partial.ruleId}:${partial.location}:${partial.message}`;
  const id = "ar_" + hash(seed).slice(0, 10);
  return { id, ...partial };
}

export function summarize(findings: A11yFinding[], manualChecks: number): ScanSummary {
  const counts: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  };
  for (const finding of findings) counts[finding.severity] += 1;
  return {
    totalFindings: findings.length,
    critical: counts.critical,
    high: counts.high,
    medium: counts.medium,
    low: counts.low,
    info: counts.info,
    manualChecks,
    passedAutomatedChecks: counts.critical === 0 && counts.high === 0
  };
}

export function aggregate(summaries: ScanSummary[]): ScanSummary {
  const total: ScanSummary = {
    totalFindings: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
    manualChecks: 0,
    passedAutomatedChecks: true
  };
  for (const item of summaries) {
    total.totalFindings += item.totalFindings;
    total.critical += item.critical;
    total.high += item.high;
    total.medium += item.medium;
    total.low += item.low;
    total.info += item.info;
    total.manualChecks += item.manualChecks;
    total.passedAutomatedChecks = total.passedAutomatedChecks && item.passedAutomatedChecks;
  }
  return total;
}

export function lineForIndex(text: string, index: number): number {
  return text.slice(0, Math.max(0, index)).split(/\r?\n/).length;
}

export function normalizeLinkText(text: string): string {
  return stripHtml(text).trim().replace(/\s+/g, " ").toLowerCase();
}

export function isRawUrl(text: string): boolean {
  return /^https?:\/\/\S+$/i.test(text.trim()) || /^www\.\S+$/i.test(text.trim());
}

export function severityRank(severity: Severity): number {
  return { info: 0, low: 1, medium: 2, high: 3, critical: 4 }[severity];
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function hash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
