#!/usr/bin/env node
import { Command } from "commander";
import fg from "fast-glob";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import {
  scanProject,
  severityRank,
  toCsvReport,
  toJsonReport,
  toMarkdownReport,
  toPrComment,
  toTerminalSummary,
  type FileInput,
  type Severity
} from "@accessready/core";

const program = new Command();

program
  .name("accessready")
  .description("Section 508 preflight and remediation assistant for communications teams")
  .version("0.1.0");

program
  .command("scan")
  .description("Scan files or directories for common accessibility issues")
  .argument("[paths...]", "Files or folders to scan", ["."])
  .option("-f, --format <format>", "summary, markdown, json, csv, or pr-comment", "summary")
  .option("-o, --out <file>", "Write report to file")
  .option("--project-name <name>", "Project name for the report", "AccessReady Project")
  .option("--fail-on <severity>", "Fail when this severity or higher is found: critical, high, medium, low, info, none", "none")
  .option("--ignore <pattern...>", "Glob patterns to ignore")
  .action(async (paths: string[], options: ScanCommandOptions) => {
    try {
      const files = await collectFiles(paths, options.ignore ?? []);
      if (files.length === 0) {
        console.error(pc.yellow("No supported files found."));
        process.exitCode = 0;
        return;
      }

      const report = await scanProject(files, {
        projectName: options.projectName,
        includeManualChecks: true,
        standardProfile: "section-508-wcag-aa-preflight"
      });

      const output = renderReport(report, options.format);
      if (options.out) {
        await writeFile(options.out, output, "utf-8");
        console.log(pc.green(`AccessReady report written to ${options.out}`));
      } else {
        console.log(output);
      }

      const failOn = normalizeFailOn(options.failOn);
      if (failOn && report.results.some((result) => result.findings.some((finding) => severityRank(finding.severity) >= severityRank(failOn)))) {
        console.error(pc.red(`AccessReady found ${failOn}+ findings.`));
        process.exitCode = 2;
      }
    } catch (error) {
      console.error(pc.red(error instanceof Error ? error.message : String(error)));
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);

interface ScanCommandOptions {
  format: "summary" | "markdown" | "json" | "csv" | "pr-comment";
  out?: string;
  projectName: string;
  failOn: string;
  ignore?: string[];
}

function renderReport(report: Awaited<ReturnType<typeof scanProject>>, format: string): string {
  if (format === "json") return toJsonReport(report);
  if (format === "markdown") return toMarkdownReport(report);
  if (format === "csv") return toCsvReport(report);
  if (format === "pr-comment") return toPrComment(report);
  return toTerminalSummary(report);
}

function normalizeFailOn(input: string): Severity | undefined {
  if (input === "none") return undefined;
  if (["critical", "high", "medium", "low", "info"].includes(input)) return input as Severity;
  throw new Error(`Invalid --fail-on value: ${input}`);
}

async function collectFiles(paths: string[], ignore: string[]): Promise<FileInput[]> {
  const supported = ["**/*.html", "**/*.htm", "**/*.md", "**/*.markdown", "**/*.docx", "**/*.pptx", "**/*.pdf"];
  const entries = await fg(paths.flatMap((entry) => {
    const normalized = entry.replace(/\\/g, "/");
    if (/\.(html?|md|markdown|docx|pptx|pdf)$/i.test(normalized)) return normalized;
    return supported.map((pattern) => path.posix.join(normalized, pattern));
  }), {
    onlyFiles: true,
    unique: true,
    ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**", ...ignore]
  });

  return Promise.all(entries.map(async (filePath) => ({
    fileName: filePath,
    content: await readFile(filePath)
  })));
}
