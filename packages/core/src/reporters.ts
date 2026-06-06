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
