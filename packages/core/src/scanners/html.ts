import type { A11yFinding } from "../types.js";
import { RULES, VAGUE_LINK_TEXT } from "../rules.js";
import { contrastRatio, extractStyleColor, parseColor } from "../contrast.js";
import { getAttr, isRawUrl, lineForIndex, makeFinding, normalizeLinkText, stripHtml } from "../utils.js";

export function scanHtml(fileName: string, html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  findings.push(...checkHtmlLanguage(fileName, html));
  findings.push(...checkHtmlTitle(fileName, html));
  findings.push(...checkHtmlImages(html));
  findings.push(...checkHtmlLinks(html));
  findings.push(...checkHtmlHeadings(html));
  findings.push(...checkHtmlTables(html));
  findings.push(...checkHtmlForms(html));
  findings.push(...checkHtmlButtons(html));
  findings.push(...checkHtmlIframes(html));
  findings.push(...checkHtmlMedia(html));
  findings.push(...checkInlineContrast(html));
  return findings;
}

function checkHtmlLanguage(fileName: string, html: string): A11yFinding[] {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  if (getAttr(htmlTag, "lang")) return [];
  return [
    makeFinding({
      ruleId: RULES.docLang.ruleId,
      title: RULES.docLang.title,
      severity: "medium",
      wcag: RULES.docLang.wcag,
      section508: RULES.docLang.section508,
      location: `${fileName}:<html>`,
      message: "The page language was not detected on the html element.",
      whyItMatters: "Screen readers use the page language to choose pronunciation rules.",
      howToFix: "Add a valid language attribute to the html element.",
      exampleFix: "<html lang=\"en\">",
      confidence: "high",
      manualCheck: false
    })
  ];
}

function checkHtmlTitle(fileName: string, html: string): A11yFinding[] {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (title) return [];
  return [
    makeFinding({
      ruleId: RULES.docTitle.ruleId,
      title: RULES.docTitle.title,
      severity: "medium",
      wcag: RULES.docTitle.wcag,
      section508: RULES.docTitle.section508,
      location: `${fileName}:<head>`,
      message: "The page does not include a meaningful title element.",
      whyItMatters: "A page title helps users identify pages in browser tabs, search results, and assistive technology navigation.",
      howToFix: "Add a concise, unique title in the document head.",
      exampleFix: "<title>FY 2026 Webinar Registration</title>",
      confidence: "high",
      manualCheck: false
    })
  ];
}

function checkHtmlImages(html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const alt = getAttr(tag, "alt");
    const role = getAttr(tag, "role")?.toLowerCase();
    const ariaHidden = getAttr(tag, "aria-hidden")?.toLowerCase();
    if (alt === undefined && role !== "presentation" && role !== "none" && ariaHidden !== "true") {
      findings.push(
        makeFinding({
          ruleId: RULES.imageAlt.ruleId,
          title: RULES.imageAlt.title,
          severity: "high",
          wcag: RULES.imageAlt.wcag,
          section508: RULES.imageAlt.section508,
          location: `line ${lineForIndex(html, match.index ?? 0)}`,
          message: "Image element is missing an alt attribute.",
          whyItMatters: "Screen reader users may miss important information if meaningful images do not have text alternatives.",
          howToFix: "Add accurate alt text for meaningful images, or alt=\"\" for decorative images.",
          exampleFix: "<img src=\"chart.png\" alt=\"Line chart showing registrations increased each quarter.\">",
          confidence: "high",
          manualCheck: false,
          snippet: tag
        })
      );
    }
  }
  return findings;
}

function checkHtmlLinks(html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  for (const match of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    const text = normalizeLinkText(match[1] ?? "");
    const tag = match[0];
    const ariaLabel = getAttr(tag, "aria-label");
    const title = getAttr(tag, "title");
    const hasUsefulProgrammaticName = Boolean(ariaLabel?.trim() || title?.trim());
    if (!hasUsefulProgrammaticName && (text.length === 0 || VAGUE_LINK_TEXT.has(text) || isRawUrl(text))) {
      findings.push(
        makeFinding({
          ruleId: RULES.vagueLink.ruleId,
          title: RULES.vagueLink.title,
          severity: text.length === 0 ? "high" : "medium",
          wcag: RULES.vagueLink.wcag,
          section508: RULES.vagueLink.section508,
          location: `line ${lineForIndex(html, match.index ?? 0)}`,
          message: text.length === 0 ? "Link appears to have no accessible text." : `Link text “${stripHtml(match[1] ?? "")}” may be vague.`,
          whyItMatters: "Screen reader users often navigate by links. Link text should be meaningful without surrounding context.",
          howToFix: "Use descriptive link text or provide an accurate aria-label for icon-only links.",
          exampleFix: "<a href=\"/report.pdf\">Download the annual report PDF</a>",
          confidence: "high",
          manualCheck: false,
          snippet: tag.slice(0, 240)
        })
      );
    }
  }
  return findings;
}

function checkHtmlHeadings(html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: stripHtml(m[2] ?? ""),
    line: lineForIndex(html, m.index ?? 0)
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
          message: `Heading “${heading.text}” jumps from H${previous} to H${heading.level}.`,
          whyItMatters: "Headings create a navigable outline for assistive technology users.",
          howToFix: "Use headings in sequence and adjust styling with CSS instead of skipping levels.",
          confidence: "high",
          manualCheck: false
        })
      );
    }
    previous = heading.level;
  }
  return findings;
}

function checkHtmlTables(html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  for (const match of html.matchAll(/<table\b[\s\S]*?<\/table>/gi)) {
    const table = match[0];
    if (!/<th\b/i.test(table) && !/scope\s*=\s*["']?(col|row)/i.test(table)) {
      findings.push(
        makeFinding({
          ruleId: RULES.tableHeaders.ruleId,
          title: RULES.tableHeaders.title,
          severity: "medium",
          wcag: RULES.tableHeaders.wcag,
          section508: RULES.tableHeaders.section508,
          location: `line ${lineForIndex(html, match.index ?? 0)}`,
          message: "Table does not include detectable header cells.",
          whyItMatters: "Header cells help screen reader users understand row and column relationships.",
          howToFix: "Use th elements and scope attributes for data tables. Use CSS layout instead of tables for purely visual layout.",
          exampleFix: "<th scope=\"col\">Date</th>",
          confidence: "medium",
          manualCheck: true,
          snippet: table.slice(0, 240)
        })
      );
    }
  }
  return findings;
}

function checkHtmlForms(html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const labelsFor = new Set([...html.matchAll(/<label\b[^>]*for=["']?([^"'\s>]+)/gi)].map((m) => m[1]));
  for (const match of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    const tag = match[0];
    const type = getAttr(tag, "type")?.toLowerCase();
    if (type === "hidden" || type === "submit" || type === "button") continue;
    const id = getAttr(tag, "id");
    const hasLabel = Boolean((id && labelsFor.has(id)) || getAttr(tag, "aria-label") || getAttr(tag, "aria-labelledby") || getAttr(tag, "title"));
    if (!hasLabel) {
      findings.push(
        makeFinding({
          ruleId: RULES.formLabels.ruleId,
          title: RULES.formLabels.title,
          severity: "high",
          wcag: RULES.formLabels.wcag,
          section508: RULES.formLabels.section508,
          location: `line ${lineForIndex(html, match.index ?? 0)}`,
          message: "Form control may not have a programmatic label.",
          whyItMatters: "Labels help screen reader users understand what information a form field requests.",
          howToFix: "Connect a visible label to the control with for/id, or add an accurate aria-label when a visible label is not possible.",
          exampleFix: "<label for=\"email\">Email address</label><input id=\"email\" type=\"email\">",
          confidence: "medium",
          manualCheck: false,
          snippet: tag
        })
      );
    }
  }
  return findings;
}

function checkHtmlButtons(html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  for (const match of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const tag = match[0];
    const text = stripHtml(match[1] ?? "");
    if (!text && !getAttr(tag, "aria-label") && !getAttr(tag, "title")) {
      findings.push(
        makeFinding({
          ruleId: RULES.buttonName.ruleId,
          title: RULES.buttonName.title,
          severity: "high",
          wcag: RULES.buttonName.wcag,
          section508: RULES.buttonName.section508,
          location: `line ${lineForIndex(html, match.index ?? 0)}`,
          message: "Button appears to have no accessible name.",
          whyItMatters: "Users of assistive technology need to know what action a button performs.",
          howToFix: "Add visible text or an aria-label for icon-only buttons.",
          exampleFix: "<button aria-label=\"Open navigation menu\">☰</button>",
          confidence: "high",
          manualCheck: false,
          snippet: tag
        })
      );
    }
  }
  return findings;
}

function checkHtmlIframes(html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  for (const match of html.matchAll(/<iframe\b[^>]*>/gi)) {
    const tag = match[0];
    if (!getAttr(tag, "title")) {
      findings.push(
        makeFinding({
          ruleId: RULES.iframeTitle.ruleId,
          title: RULES.iframeTitle.title,
          severity: "medium",
          wcag: RULES.iframeTitle.wcag,
          section508: RULES.iframeTitle.section508,
          location: `line ${lineForIndex(html, match.index ?? 0)}`,
          message: "Iframe is missing a title attribute.",
          whyItMatters: "Iframe titles help assistive technology users understand embedded content before entering it.",
          howToFix: "Add a concise title that describes the embedded content.",
          exampleFix: "<iframe title=\"Registration form\" src=\"...\"></iframe>",
          confidence: "high",
          manualCheck: false,
          snippet: tag
        })
      );
    }
  }
  return findings;
}

function checkHtmlMedia(html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  for (const match of html.matchAll(/<(video|audio)\b[\s\S]*?<\/\1>/gi)) {
    const media = match[0];
    if (!/<track\b[^>]*kind=["']captions["']/i.test(media) && !/(transcript|captions)/i.test(media)) {
      findings.push(
        makeFinding({
          ruleId: RULES.mediaCaptions.ruleId,
          title: RULES.mediaCaptions.title,
          severity: "medium",
          wcag: RULES.mediaCaptions.wcag,
          section508: RULES.mediaCaptions.section508,
          location: `line ${lineForIndex(html, match.index ?? 0)}`,
          message: `${match[1]} element does not include a detectable captions track or nearby transcript language.`,
          whyItMatters: "Users who are deaf or hard of hearing need captions or transcripts for audio information.",
          howToFix: "Add a captions track and provide a transcript when appropriate.",
          exampleFix: "<track kind=\"captions\" src=\"captions.vtt\" srclang=\"en\" label=\"English\">",
          confidence: "medium",
          manualCheck: true,
          snippet: media.slice(0, 240)
        })
      );
    }
  }
  return findings;
}

function checkInlineContrast(html: string): A11yFinding[] {
  const findings: A11yFinding[] = [];
  for (const match of html.matchAll(/<([a-z0-9]+)\b[^>]*style=("[^"]*"|'[^']*')[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = match[0];
    const style = (match[2] ?? "").slice(1, -1);
    const fg = parseColor(extractStyleColor(style, "color"));
    const bg = parseColor(extractStyleColor(style, "background-color"));
    const text = stripHtml(match[3] ?? "");
    if (!text || !fg || !bg) continue;
    const ratio = contrastRatio(fg, bg);
    if (ratio < 4.5) {
      findings.push(
        makeFinding({
          ruleId: RULES.contrast.ruleId,
          title: RULES.contrast.title,
          severity: "medium",
          wcag: RULES.contrast.wcag,
          section508: RULES.contrast.section508,
          location: `line ${lineForIndex(html, match.index ?? 0)}`,
          message: `Inline text contrast appears to be ${ratio.toFixed(2)}:1, below the common 4.5:1 minimum for normal text.`,
          whyItMatters: "Low contrast can make text difficult to read for users with low vision, color vision differences, or situational limitations.",
          howToFix: "Choose foreground and background colors with stronger contrast. Confirm in your approved contrast checker.",
          confidence: "medium",
          manualCheck: true,
          snippet: tag.slice(0, 240)
        })
      );
    }
  }
  return findings;
}
