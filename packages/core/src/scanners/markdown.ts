import type { A11yFinding } from "../types.js";
import { RULES, VAGUE_LINK_TEXT } from "../rules.js";
import { isRawUrl, lineForIndex, makeFinding, normalizeLinkText } from "../utils.js";

export function scanMarkdown(fileName: string, text: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  findings.push(...checkMarkdownTitle(fileName, text));
  findings.push(...checkMarkdownImages(text));
  findings.push(...checkMarkdownLinks(text));
  findings.push(...checkMarkdownHeadings(text));
  findings.push(...checkMarkdownTables(text));
  findings.push(...checkMarkdownMedia(text));
  return findings;
}

function checkMarkdownTitle(fileName: string, text: string): A11yFinding[] {
  if (/^#\s+\S+/m.test(text)) return [];
  return [
    makeFinding({
      ruleId: RULES.docTitle.ruleId,
      title: RULES.docTitle.title,
      severity: "medium",
      wcag: RULES.docTitle.wcag,
      section508: RULES.docTitle.section508,
      location: `${fileName}:1`,
      message: "No top-level Markdown heading was found.",
      whyItMatters: "A clear document title helps screen reader users and all readers understand the purpose of the file.",
      howToFix: "Add one H1 heading at the beginning of the document.",
      exampleFix: "# Annual Report Accessibility Checklist",
      confidence: "medium",
      manualCheck: false
    })
  ];
}

function checkMarkdownImages(text: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const imageRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
  for (const match of text.matchAll(imageRe)) {
    const alt = match[1]?.trim();
    const url = match[2]?.trim();
    if (!alt) {
      findings.push(
        makeFinding({
          ruleId: RULES.imageAlt.ruleId,
          title: RULES.imageAlt.title,
          severity: "high",
          wcag: RULES.imageAlt.wcag,
          section508: RULES.imageAlt.section508,
          location: `line ${lineForIndex(text, match.index ?? 0)}`,
          message: `Image ${url ? `(${url}) ` : ""}has empty alt text.`,
          whyItMatters: "Screen reader users may miss important information if meaningful images do not have text alternatives.",
          howToFix: "Add concise alt text that communicates the purpose or takeaway of the image. Use empty alt text only when the image is decorative.",
          exampleFix: "![Bar chart showing applications increased from 2022 to 2024](chart.png)",
          confidence: "high",
          manualCheck: false,
          snippet: match[0]
        })
      );
    }
  }
  return findings;
}

function checkMarkdownLinks(text: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const linkRe = /(?<!!\[)\[([^\]]+)\]\(([^)]+)\)/g;
  for (const match of text.matchAll(linkRe)) {
    const linkText = normalizeLinkText(match[1] ?? "");
    if (VAGUE_LINK_TEXT.has(linkText) || isRawUrl(linkText)) {
      findings.push(
        makeFinding({
          ruleId: RULES.vagueLink.ruleId,
          title: RULES.vagueLink.title,
          severity: "medium",
          wcag: RULES.vagueLink.wcag,
          section508: RULES.vagueLink.section508,
          location: `line ${lineForIndex(text, match.index ?? 0)}`,
          message: `Link text “${match[1]}” may not describe the destination or purpose.`,
          whyItMatters: "Screen reader users often navigate by links. Link text should make sense out of context.",
          howToFix: "Replace vague wording with the destination or action.",
          exampleFix: "[Download the accessibility checklist](checklist.pdf)",
          confidence: "high",
          manualCheck: false,
          snippet: match[0]
        })
      );
    }
  }
  return findings;
}

function checkMarkdownHeadings(text: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const headings = [...text.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((m) => ({
    level: m[1].length,
    title: m[2].trim(),
    line: lineForIndex(text, m.index ?? 0)
  }));
  let previous = 0;
  for (const heading of headings) {
    if (previous > 0 && heading.level > previous + 1) {
      findings.push(
        makeFinding({
          ruleId: RULES.headingSkip.ruleId,
          title: RULES.headingSkip.title,
          severity: "medium",
          wcag: RULES.headingSkip.wcag,
          section508: RULES.headingSkip.section508,
          location: `line ${heading.line}`,
          message: `Heading “${heading.title}” jumps from H${previous} to H${heading.level}.`,
          whyItMatters: "A logical heading structure helps screen reader users understand and navigate content.",
          howToFix: "Use heading levels in order. Do not choose a heading level only for visual styling.",
          exampleFix: "Change the skipped heading to the next logical level, such as H2 before H3.",
          confidence: "high",
          manualCheck: false
        })
      );
    }
    previous = heading.level;
  }
  return findings;
}

function checkMarkdownTables(text: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("|") && i + 1 < lines.length && !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i + 1])) {
      findings.push(
        makeFinding({
          ruleId: RULES.tableHeaders.ruleId,
          title: RULES.tableHeaders.title,
          severity: "low",
          wcag: RULES.tableHeaders.wcag,
          section508: RULES.tableHeaders.section508,
          location: `line ${i + 1}`,
          message: "This looks like a table, but the Markdown header separator row was not detected.",
          whyItMatters: "Tables need clear header relationships so assistive technology can communicate row and column meaning.",
          howToFix: "Use a proper Markdown table header row or convert layout tables into lists.",
          exampleFix: "| Name | Date | Status |\n| --- | --- | --- |",
          confidence: "low",
          manualCheck: true,
          snippet: line
        })
      );
    }
  }
  return findings;
}

function checkMarkdownMedia(text: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const mediaWords = /(youtube|vimeo|\.mp4|\.mov|\.mp3|webinar|recording|video|audio)/i;
  if (mediaWords.test(text) && !/(caption|captions|transcript|audio description)/i.test(text)) {
    findings.push(
      makeFinding({
        ruleId: RULES.mediaCaptions.ruleId,
        title: RULES.mediaCaptions.title,
        severity: "low",
        wcag: RULES.mediaCaptions.wcag,
        section508: RULES.mediaCaptions.section508,
        location: "document",
        message: "Media is referenced, but captions/transcript language was not detected.",
        whyItMatters: "Video and audio content usually need captions, transcripts, or equivalent alternatives.",
        howToFix: "Confirm caption and transcript availability before publishing, and link to them near the media.",
        confidence: "low",
        manualCheck: true
      })
    );
  }
  return findings;
}
