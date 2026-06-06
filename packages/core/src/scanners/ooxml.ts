import JSZip from "jszip";
import type { A11yFinding, SupportedFileType } from "../types.js";
import { RULES } from "../rules.js";
import { makeFinding, toUint8 } from "../utils.js";

export async function scanOoxml(fileName: string, fileType: Extract<SupportedFileType, "docx" | "pptx">, content: string | ArrayBuffer | Uint8Array): Promise<A11yFinding[]> {
  const zip = await JSZip.loadAsync(toUint8(content));
  const findings: A11yFinding[] = [];
  findings.push(...await checkOfficeTitle(zip, fileName));
  findings.push(...await checkOfficeLanguage(zip, fileName, fileType));
  findings.push(...await checkOfficeImageDescriptions(zip, fileName, fileType));
  findings.push(...await checkOfficeTables(zip, fileName, fileType));
  if (fileType === "pptx") findings.push(...await checkPowerPointSlideTitles(zip, fileName));
  return findings;
}

async function readZipText(zip: JSZip, path: string): Promise<string | undefined> {
  const file = zip.file(path);
  if (!file) return undefined;
  return file.async("text");
}

async function checkOfficeTitle(zip: JSZip, fileName: string): Promise<A11yFinding[]> {
  const core = await readZipText(zip, "docProps/core.xml");
  const title = core?.match(/<dc:title>([\s\S]*?)<\/dc:title>/)?.[1]?.trim();
  if (title) return [];
  return [
    makeFinding({
      ruleId: RULES.docTitle.ruleId,
      title: RULES.docTitle.title,
      severity: "medium",
      wcag: RULES.docTitle.wcag,
      section508: RULES.docTitle.section508,
      location: `${fileName}:document properties`,
      message: "Office document title metadata was not detected.",
      whyItMatters: "A descriptive title helps users identify the document and improves accessibility metadata after export.",
      howToFix: "Add a meaningful title in the document properties before exporting.",
      exampleFix: "File > Info > Properties > Title: FY 2026 Applicant Webinar Slides",
      confidence: "medium",
      manualCheck: false
    })
  ];
}

async function checkOfficeLanguage(zip: JSZip, fileName: string, fileType: "docx" | "pptx"): Promise<A11yFinding[]> {
  const candidates = fileType === "docx"
    ? ["word/settings.xml", "word/styles.xml"]
    : ["ppt/presentation.xml"];
  const found = await Promise.all(candidates.map((p) => readZipText(zip, p)));
  if (found.some((xml) => xml && /(?:w:lang|lang=|defaultTextStyle)/i.test(xml))) return [];
  return [
    makeFinding({
      ruleId: RULES.docLang.ruleId,
      title: RULES.docLang.title,
      severity: "low",
      wcag: RULES.docLang.wcag,
      section508: RULES.docLang.section508,
      location: `${fileName}:document settings`,
      message: "A document language setting was not confidently detected.",
      whyItMatters: "Language metadata helps assistive technology pronounce content correctly.",
      howToFix: "Set the document proofing/editing language in Word or PowerPoint and confirm language after PDF export.",
      confidence: "low",
      manualCheck: true
    })
  ];
}

async function checkOfficeImageDescriptions(zip: JSZip, fileName: string, fileType: "docx" | "pptx"): Promise<A11yFinding[]> {
  const findings: A11yFinding[] = [];
  const paths = Object.keys(zip.files).filter((path) => {
    if (fileType === "docx") return path === "word/document.xml" || path.startsWith("word/header") || path.startsWith("word/footer");
    return /^ppt\/slides\/slide\d+\.xml$/.test(path);
  });

  for (const path of paths) {
    const xml = await readZipText(zip, path);
    if (!xml) continue;
    const imageRefs = [...xml.matchAll(/<(?:wp:docPr|p:cNvPr)\b[^>]*>/g)];
    for (const match of imageRefs) {
      const tag = match[0];
      const hasDescription = /\sdescr=("[^"]+"|'[^']+')/i.test(tag);
      const name = tag.match(/\sname=("[^"]+"|'[^']+')/i)?.[1]?.replace(/^['"]|['"]$/g, "") ?? "image";
      if (!hasDescription && looksLikeNonDecorativeImageName(name)) {
        findings.push(
          makeFinding({
            ruleId: RULES.imageAlt.ruleId,
            title: RULES.imageAlt.title,
            severity: "high",
            wcag: RULES.imageAlt.wcag,
            section508: RULES.imageAlt.section508,
            location: `${fileName}:${path}`,
            message: `Office image object “${name}” does not include a description attribute.`,
            whyItMatters: "Meaningful images in Office documents need alternative text before export to PDF or publication.",
            howToFix: "In Word or PowerPoint, open Alt Text for the object and add a concise description. Mark decorative images as decorative when appropriate.",
            exampleFix: "Alt text: “Photo of panelists speaking at the applicant webinar.”",
            confidence: "medium",
            manualCheck: false,
            snippet: tag
          })
        );
      }
    }
  }
  return findings;
}

async function checkOfficeTables(zip: JSZip, fileName: string, fileType: "docx" | "pptx"): Promise<A11yFinding[]> {
  const findings: A11yFinding[] = [];
  const paths = Object.keys(zip.files).filter((path) => fileType === "docx" ? path === "word/document.xml" : /^ppt\/slides\/slide\d+\.xml$/.test(path));
  for (const path of paths) {
    const xml = await readZipText(zip, path);
    if (!xml) continue;
    const tables = [...xml.matchAll(/<(?:w:tbl|a:tbl)\b[\s\S]*?<\/(?:w:tbl|a:tbl)>/g)];
    for (const table of tables) {
      const hasHeader = /w:tblHeader|firstRow="1"|bandRow="1"/i.test(table[0]);
      if (!hasHeader) {
        findings.push(
          makeFinding({
            ruleId: RULES.tableHeaders.ruleId,
            title: RULES.tableHeaders.title,
            severity: "medium",
            wcag: RULES.tableHeaders.wcag,
            section508: RULES.tableHeaders.section508,
            location: `${fileName}:${path}`,
            message: "A table was detected, but a header row setting was not confidently detected.",
            whyItMatters: "Table headers help assistive technology communicate row and column relationships.",
            howToFix: "Set the first row as a header row and avoid using tables for layout.",
            confidence: "low",
            manualCheck: true
          })
        );
      }
    }
  }
  return findings;
}

async function checkPowerPointSlideTitles(zip: JSZip, fileName: string): Promise<A11yFinding[]> {
  const findings: A11yFinding[] = [];
  const slidePaths = Object.keys(zip.files).filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path));
  for (const path of slidePaths) {
    const xml = await readZipText(zip, path);
    if (!xml) continue;
    const hasTitlePlaceholder = /type="title"|type="ctrTitle"/i.test(xml);
    if (!hasTitlePlaceholder) {
      findings.push(
        makeFinding({
          ruleId: RULES.docTitle.ruleId,
          title: "PowerPoint slide may be missing a slide title",
          severity: "medium",
          wcag: ["2.4.2 Page Titled", "2.4.6 Headings and Labels"],
          section508: RULES.docTitle.section508,
          location: `${fileName}:${path}`,
          message: "Slide title placeholder was not detected.",
          whyItMatters: "Slide titles help users navigate presentations and exported PDFs.",
          howToFix: "Use PowerPoint's built-in slide title placeholder. If the visual design should hide it, move the title off-slide rather than deleting it.",
          confidence: "low",
          manualCheck: true
        })
      );
    }
  }
  return findings;
}

function looksLikeNonDecorativeImageName(name: string): boolean {
  const normalized = name.toLowerCase();
  return !/(decorative|background|shape|line|rectangle|oval)/i.test(normalized);
}
