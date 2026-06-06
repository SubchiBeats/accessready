export type {
  A11yFinding,
  Confidence,
  FileInput,
  ManualCheck,
  ProjectReport,
  ScanOptions,
  ScanResult,
  ScanSummary,
  Severity,
  SupportedFileType
} from "./types.js";

export { RULES } from "./rules.js";
export { toJsonReport, toMarkdownReport, toTerminalSummary } from "./reporters.js";
export { detectFileType, severityRank } from "./utils.js";

import type { A11yFinding, FileInput, ProjectReport, ScanOptions, ScanResult } from "./types.js";
import { STANDARD_PROFILE } from "./rules.js";
import { manualChecksFor } from "./manualChecks.js";
import { scanHtml } from "./scanners/html.js";
import { scanMarkdown } from "./scanners/markdown.js";
import { scanOoxml } from "./scanners/ooxml.js";
import { scanPdfPreflight } from "./scanners/pdf.js";
import { aggregate, detectFileType, summarize, toText } from "./utils.js";

export async function scanFile(input: FileInput, options: ScanOptions = {}): Promise<ScanResult> {
  const fileType = detectFileType(input.fileName, input.mimeType);
  const standardProfile = options.standardProfile ?? STANDARD_PROFILE;
  const includeManualChecks = options.includeManualChecks ?? true;
  let findings: A11yFinding[] = [];

  if (fileType === "html") findings = scanHtml(input.fileName, toText(input.content));
  else if (fileType === "markdown") findings = scanMarkdown(input.fileName, toText(input.content));
  else if (fileType === "docx" || fileType === "pptx") findings = await scanOoxml(input.fileName, fileType, input.content);
  else if (fileType === "pdf") findings = scanPdfPreflight(input.fileName, input.content);
  else {
    findings = [];
  }

  const manualChecks = includeManualChecks ? manualChecksFor(fileType) : [];
  return {
    fileName: input.fileName,
    fileType,
    scannedAt: new Date().toISOString(),
    standardProfile,
    summary: summarize(findings, manualChecks.length),
    findings,
    manualChecks
  };
}

export async function scanProject(files: FileInput[], options: ScanOptions = {}): Promise<ProjectReport> {
  const results = await Promise.all(files.map((file) => scanFile(file, options)));
  const standardProfile = options.standardProfile ?? STANDARD_PROFILE;
  return {
    projectName: options.projectName ?? "AccessReady Project",
    generatedAt: new Date().toISOString(),
    standardProfile,
    totals: aggregate(results.map((result) => result.summary)),
    results
  };
}
