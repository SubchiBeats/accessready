import type { A11yFinding, ProjectReport, ScanResult, Severity } from "./types.js";

export function toJsonReport(report: ProjectReport): string {
  return JSON.stringify(report, null, 2);
}

export function toMarkdownReport(report: ProjectReport): string {
  const lines: string[] = [];
  lines.push(`# AccessReady 508 Preflight Report`);
  lines.push("");
  lines.push(`**Project:** ${report.projectName}`);
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Profile:** ${report.standardProfile}`);
  lines.push("");
  lines.push(`## Summary`);
  lines.push("");
  lines.push(`| Total | Critical | High | Medium | Low | Info | Manual checks | Automated pass |`);
  lines.push(`| ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: |`);
  lines.push(`| ${report.totals.totalFindings} | ${report.totals.critical} | ${report.totals.high} | ${report.totals.medium} | ${report.totals.low} | ${report.totals.info} | ${report.totals.manualChecks} | ${report.totals.passedAutomatedChecks ? "Yes" : "No"} |`);
  lines.push("");

  for (const result of report.results) {
    lines.push(...resultToMarkdown(result));
  }

  lines.push(`## Notes`);
  lines.push("");
  lines.push(`AccessReady performs preflight checks and highlights likely issues. A human reviewer should confirm reading order, alt text quality, captions/transcripts, color meaning, PDF tag quality, and any client-specific requirements before publication.`);
  lines.push("");
  return lines.join("\n");
}

function resultToMarkdown(result: ScanResult): string[] {
  const lines: string[] = [];
  lines.push(`## ${escapeMd(result.fileName)}`);
  lines.push("");
  lines.push(`**Type:** ${result.fileType}  `);
  lines.push(`**Scanned:** ${result.scannedAt}  `);
  lines.push(`**Automated pass:** ${result.summary.passedAutomatedChecks ? "Yes" : "No"}`);
  lines.push("");
  if (result.findings.length === 0) {
    lines.push(`No automated findings detected.`);
    lines.push("");
  } else {
    lines.push(`### Findings`);
    lines.push("");
    for (const finding of sortFindings(result.findings)) {
      lines.push(`#### ${severityIcon(finding.severity)} ${finding.title}`);
      lines.push("");
      lines.push(`- **Rule:** ${finding.ruleId}`);
      lines.push(`- **Severity:** ${finding.severity}`);
      lines.push(`- **Location:** ${escapeMd(finding.location)}`);
      lines.push(`- **Message:** ${escapeMd(finding.message)}`);
      if (finding.wcag.length) lines.push(`- **WCAG:** ${finding.wcag.join(", ")}`);
      if (finding.section508.length) lines.push(`- **508 relevance:** ${finding.section508.join(", ")}`);
      lines.push(`- **Why it matters:** ${escapeMd(finding.whyItMatters)}`);
      lines.push(`- **How to fix:** ${escapeMd(finding.howToFix)}`);
      if (finding.exampleFix) lines.push(`- **Example fix:** ${inlineCode(finding.exampleFix)}`);
      lines.push(`- **Confidence:** ${finding.confidence}`);
      if (finding.manualCheck) lines.push(`- **Manual review needed:** Yes`);
      if (finding.snippet) lines.push(`- **Snippet:** ${inlineCode(finding.snippet.slice(0, 180))}`);
      lines.push("");
    }
  }

  if (result.manualChecks.length) {
    lines.push(`### Manual review checklist`);
    lines.push("");
    for (const check of result.manualChecks) {
      lines.push(`- **${escapeMd(check.title)}:** ${escapeMd(check.suggestedMethod)}`);
    }
    lines.push("");
  }
  return lines;
}

const CSV_HEADERS = [
  "file",
  "fileType",
  "ruleId",
  "title",
  "severity",
  "wcag",
  "section508",
  "location",
  "message",
  "howToFix",
  "exampleFix",
  "confidence",
  "manualReviewNeeded",
  "status"
] as const;

export function toCsvReport(report: ProjectReport): string {
  const rows: string[] = [CSV_HEADERS.join(",")];
  for (const result of report.results) {
    for (const finding of sortFindings(result.findings)) {
      rows.push([
        result.fileName,
        result.fileType,
        finding.ruleId,
        finding.title,
        finding.severity,
        finding.wcag.join("; "),
        finding.section508.join("; "),
        finding.location,
        finding.message,
        finding.howToFix,
        finding.exampleFix ?? "",
        finding.confidence,
        finding.manualCheck ? "yes" : "no",
        "Open"
      ].map(csvCell).join(","));
    }
  }
  return rows.join("\r\n") + "\r\n";
}

export function toPrComment(report: ProjectReport): string {
  const t = report.totals;
  const verdict = t.passedAutomatedChecks
    ? "✅ **No critical or high-severity issues found.**"
    : `⚠️ **${t.critical + t.high} critical/high finding(s) need attention.**`;
  const lines: string[] = [];
  lines.push(PR_COMMENT_MARKER);
  lines.push(`## ♿ AccessReady 508 preflight`);
  lines.push("");
  lines.push(verdict);
  lines.push("");
  lines.push(`| Files | Findings | 🛑 Critical | 🔴 High | 🟠 Medium | 🟡 Low | Manual checks |`);
  lines.push(`| ---: | ---: | ---: | ---: | ---: | ---: | ---: |`);
  lines.push(`| ${report.results.length} | ${t.totalFindings} | ${t.critical} | ${t.high} | ${t.medium} | ${t.low} | ${t.manualChecks} |`);
  lines.push("");

  const topFindings: { file: string; finding: A11yFinding }[] = [];
  for (const result of report.results) {
    for (const finding of sortFindings(result.findings)) topFindings.push({ file: result.fileName, finding });
  }
  topFindings.sort((a, b) => severityWeight(b.finding.severity) - severityWeight(a.finding.severity));

  if (topFindings.length) {
    const shown = topFindings.slice(0, 10);
    lines.push(`<details${t.passedAutomatedChecks ? "" : " open"}><summary><strong>Top ${shown.length} of ${topFindings.length} finding(s)</strong></summary>`);
    lines.push("");
    for (const { file, finding } of shown) {
      lines.push(`- ${severityIcon(finding.severity)} **${finding.title}** — \`${file}\` (${escapeMd(finding.location)})`);
      lines.push(`  - ${escapeMd(finding.howToFix)}`);
    }
    if (topFindings.length > shown.length) {
      lines.push("");
      lines.push(`_…and ${topFindings.length - shown.length} more. See the full report artifact._`);
    }
    lines.push("");
    lines.push(`</details>`);
    lines.push("");
  }

  lines.push(`> Preflight only — confirm reading order, alt-text quality, captions, and PDF tags by hand before publishing.`);
  return lines.join("\n");
}

export const PR_COMMENT_MARKER = "<!-- accessready-report -->";

function csvCell(value: string): string {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function severityWeight(severity: Severity): number {
  return { critical: 5, high: 4, medium: 3, low: 2, info: 1 }[severity];
}

export interface EvidencePackOptions {
  deliverableName?: string;
  reviewer?: string;
  organization?: string;
}

/** Delivery readiness based on automated signal only. Never asserts legal compliance. */
export function deliveryRecommendation(report: ProjectReport): string {
  const t = report.totals;
  if (t.critical + t.high > 0) return "Not ready — remediate high-severity findings, then complete manual review before client submission.";
  if (t.manualChecks > 0 || t.medium + t.low > 0) return "Needs manual review before client submission.";
  return "Lower automated risk — complete manual sign-off before delivery.";
}

/**
 * A client-ready "508 Evidence Pack": documents evaluation method, files reviewed,
 * automated findings, manual checks, an alt-text register, remediation status,
 * remaining risks, a delivery recommendation, and a reviewer sign-off block.
 */
export function toEvidencePack(report: ProjectReport, options: EvidencePackOptions = {}): string {
  const t = report.totals;
  const L: string[] = [];
  const altFindings = report.results.flatMap((r) =>
    r.findings.filter((f) => f.ruleId === "AR-IMG-ALT").map((f) => ({ file: r.fileName, finding: f }))
  );

  L.push(`# AccessReady 508 Evidence Pack`);
  L.push("");
  L.push(`**Deliverable:** ${escapeMd(options.deliverableName ?? report.projectName)}  `);
  if (options.organization) L.push(`**Organization:** ${escapeMd(options.organization)}  `);
  L.push(`**Prepared:** ${report.generatedAt}  `);
  L.push(`**Conformance profile:** ${report.standardProfile}  `);
  L.push(`**Evaluation method:** Hybrid — AccessReady automated preflight + required manual review  `);
  L.push(`**Tool:** AccessReady (automated preflight; regex/structure heuristics)`);
  L.push("");
  L.push(`> AccessReady supports accessibility review workflows. It does **not** guarantee legal compliance, and does not replace expert audit, PDF remediation, or ACR/VPAT creation. Findings should be confirmed by a human reviewer before delivery.`);
  L.push("");

  // 1. Executive summary
  L.push(`## 1. Executive summary`);
  L.push("");
  L.push(`AccessReady performed an automated 508/WCAG preflight on ${report.results.length} file(s) and identified ${t.totalFindings} potential issue(s): ${t.critical} critical, ${t.high} high, ${t.medium} medium, ${t.low} low. ${t.manualChecks} item(s) require manual review that automation cannot confirm.`);
  L.push("");
  L.push(`**Delivery recommendation:** ${deliveryRecommendation(report)}`);
  L.push("");

  // 2. Files reviewed
  L.push(`## 2. Files reviewed`);
  L.push("");
  L.push(`| File | Type | Findings | Manual checks | Automated signal |`);
  L.push(`| --- | --- | ---: | ---: | :---: |`);
  for (const r of report.results) {
    L.push(`| ${escapeMd(r.fileName)} | ${r.fileType} | ${r.summary.totalFindings} | ${r.summary.manualChecks} | ${r.summary.passedAutomatedChecks ? "Pass" : "Review"} |`);
  }
  L.push("");

  // 3. Automated findings
  L.push(`## 3. Automated findings`);
  L.push("");
  if (t.totalFindings === 0) {
    L.push(`No automated findings detected.`);
  } else {
    L.push(`| Severity | File | Issue | Location | Suggested fix | WCAG | Status |`);
    L.push(`| --- | --- | --- | --- | --- | --- | --- |`);
    for (const r of report.results) {
      for (const f of sortFindings(r.findings)) {
        L.push(`| ${f.severity} | ${escapeMd(r.fileName)} | ${escapeMd(f.title)} | ${escapeMd(f.location)} | ${escapeMd(f.howToFix)} | ${f.wcag.join("; ") || "—"} | Open |`);
      }
    }
  }
  L.push("");

  // 4. Manual review checklist
  L.push(`## 4. Manual review checklist`);
  L.push("");
  const seen = new Set<string>();
  let anyManual = false;
  for (const r of report.results) {
    for (const c of r.manualChecks) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      anyManual = true;
      L.push(`- [ ] **${escapeMd(c.title)}** — ${escapeMd(c.suggestedMethod)}`);
    }
  }
  if (!anyManual) L.push(`- [ ] No standard manual checks flagged; confirm reading order and content accuracy.`);
  L.push("");

  // 5. Alt text register
  L.push(`## 5. Alt text register`);
  L.push("");
  if (altFindings.length === 0) {
    L.push(`No missing image text alternatives detected by automation. Confirm that every meaningful image has accurate alt text and decorative images are marked decorative.`);
  } else {
    L.push(`| File | Location | Proposed alt text | Approved by |`);
    L.push(`| --- | --- | --- | --- |`);
    for (const { file, finding } of altFindings) {
      L.push(`| ${escapeMd(file)} | ${escapeMd(finding.location)} | _add description_ | |`);
    }
  }
  L.push("");

  // 6. Remediation status
  L.push(`## 6. Remediation status`);
  L.push("");
  L.push(`| Open | In progress | Fixed | Manual review | Total |`);
  L.push(`| ---: | ---: | ---: | ---: | ---: |`);
  L.push(`| ${t.totalFindings} | 0 | 0 | ${t.manualChecks} | ${t.totalFindings + t.manualChecks} |`);
  L.push("");
  L.push(`_Update this table as the team works through findings._`);
  L.push("");

  // 7. Remaining risks
  L.push(`## 7. Remaining risks`);
  L.push("");
  L.push(`- ${t.critical + t.high} high-severity automated finding(s) outstanding.`);
  L.push(`- ${t.manualChecks} manual check(s) not yet confirmed (e.g., reading order, captions, alt-text quality, PDF tag quality).`);
  L.push(`- Automated preflight cannot confirm subjective quality or full PDF/UA conformance.`);
  L.push("");

  // 8. Reviewer sign-off
  L.push(`## 8. Reviewer sign-off`);
  L.push("");
  L.push(`| Role | Name | Date | Decision |`);
  L.push(`| --- | --- | --- | --- |`);
  L.push(`| Preparer | ${escapeMd(options.reviewer ?? "")} | | |`);
  L.push(`| Accessibility reviewer | | | Approve / Return |`);
  L.push(`| Delivery approver | | | Approve / Hold |`);
  L.push("");
  L.push(`_Generated by AccessReady. Pair with manual review before delivery._`);
  L.push("");
  return L.join("\n");
}

export function toTerminalSummary(report: ProjectReport): string {
  const lines: string[] = [];
  lines.push(`AccessReady report for ${report.projectName}`);
  lines.push(`Findings: ${report.totals.totalFindings} | critical ${report.totals.critical} | high ${report.totals.high} | medium ${report.totals.medium} | low ${report.totals.low} | info ${report.totals.info}`);
  for (const result of report.results) {
    lines.push(`- ${result.fileName}: ${result.summary.totalFindings} findings, ${result.summary.manualChecks} manual checks`);
  }
  return lines.join("\n");
}

function sortFindings(findings: A11yFinding[]): A11yFinding[] {
  const rank: Record<Severity, number> = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
  return [...findings].sort((a, b) => rank[b.severity] - rank[a.severity] || a.ruleId.localeCompare(b.ruleId));
}

function severityIcon(severity: Severity): string {
  return { critical: "🛑", high: "🔴", medium: "🟠", low: "🟡", info: "🔵" }[severity];
}

function escapeMd(text: string): string {
  return text.replace(/\|/g, "\\|");
}

function inlineCode(text: string): string {
  return "`" + text.replace(/`/g, "\\`").replace(/\n/g, "\\n") + "`";
}
