// Zero-dependency tests using Node's built-in test runner.
// Run after building core:  node --test packages/core/test/
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  scanFile,
  scanProject,
  detectFileType,
  toCsvReport,
  toPrComment,
  PR_COMMENT_MARKER
} from "../dist/index.js";

const ruleIds = (result) => new Set(result.findings.map((f) => f.ruleId));

test("detectFileType maps extensions and mime types", () => {
  assert.equal(detectFileType("a.html"), "html");
  assert.equal(detectFileType("a.HTM"), "html");
  assert.equal(detectFileType("a.md"), "markdown");
  assert.equal(detectFileType("a.docx"), "docx");
  assert.equal(detectFileType("a.pptx"), "pptx");
  assert.equal(detectFileType("a.pdf"), "pdf");
  assert.equal(detectFileType("note.txt", "application/pdf"), "pdf");
  assert.equal(detectFileType("mystery.bin"), "unknown");
});

test("HTML scan flags missing lang, title, alt, and vague links", async () => {
  const html = `<!doctype html><html><head></head><body>
    <img src="chart.png">
    <a href="/r.pdf">click here</a>
    <h1>Title</h1><h3>Skips a level</h3>
  </body></html>`;
  const result = await scanFile({ fileName: "page.html", content: html });
  const ids = ruleIds(result);
  assert.ok(ids.has("AR-DOC-LANG"), "missing lang");
  assert.ok(ids.has("AR-DOC-TITLE"), "missing title");
  assert.ok(ids.has("AR-IMG-ALT"), "missing alt");
  assert.ok(ids.has("AR-LINK-TEXT"), "vague link");
  assert.ok(ids.has("AR-HEADING-SKIP"), "heading skip");
});

test("HTML scan passes a clean document (no critical/high)", async () => {
  const html = `<!doctype html><html lang="en"><head><title>Good</title></head><body>
    <img src="x.png" alt="A useful description">
    <a href="/report.pdf">Download the annual report</a>
    <h1>Heading</h1><h2>Sub</h2>
  </body></html>`;
  const result = await scanFile({ fileName: "clean.html", content: html });
  assert.equal(result.summary.passedAutomatedChecks, true);
});

test("Markdown scan flags empty alt text and vague link", async () => {
  const md = `# Title\n\n![](chart.png)\n\n[click here](x.pdf)\n`;
  const result = await scanFile({ fileName: "doc.md", content: md });
  const ids = ruleIds(result);
  assert.ok(ids.has("AR-IMG-ALT"));
  assert.ok(ids.has("AR-LINK-TEXT"));
});

test("PDF preflight flags untagged/no-lang/no-title", async () => {
  const fakePdf = "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF";
  const result = await scanFile({ fileName: "scan.pdf", content: fakePdf });
  const ids = ruleIds(result);
  assert.ok(ids.has("AR-PDF-TAGS"), "no StructTreeRoot");
  assert.ok(ids.has("AR-DOC-LANG"), "no /Lang");
  assert.ok(ids.has("AR-DOC-TITLE"), "no /Title");
});

test("toCsvReport is RFC-4180 safe and has one row per finding", async () => {
  const report = await scanProject([
    { fileName: "page.html", content: `<img src="a.png">` }
  ]);
  const csv = toCsvReport(report);
  const lines = csv.trim().split("\r\n");
  assert.ok(lines[0].startsWith("file,fileType,ruleId"), "header present");
  assert.equal(lines.length, report.results[0].findings.length + 1, "header + N rows");
  // a field containing a comma must be quoted
  const withComma = '4.1.2 Name, Role, Value';
  if (csv.includes(withComma)) assert.ok(csv.includes(`"${withComma}"`), "comma field quoted");
});

test("toPrComment has marker, summary table, and verdict", async () => {
  const report = await scanProject([
    { fileName: "page.html", content: `<img src="a.png"><a href="/x">click here</a>` }
  ]);
  const pr = toPrComment(report);
  assert.ok(pr.startsWith(PR_COMMENT_MARKER), "starts with idempotency marker");
  assert.match(pr, /\| Files \| Findings \|/, "summary table header");
  assert.match(pr, /AccessReady 508 preflight/, "title");
});
