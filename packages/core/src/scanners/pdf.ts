import type { A11yFinding } from "../types.js";
import { RULES } from "../rules.js";
import { makeFinding, toText } from "../utils.js";

export function scanPdfPreflight(fileName: string, content: string | ArrayBuffer | Uint8Array): A11yFinding[] {
  const text = toText(content);
  const findings: A11yFinding[] = [];

  if (!text.startsWith("%PDF")) {
    findings.push(
      makeFinding({
        ruleId: "AR-PDF-VALID",
        title: "File does not look like a valid PDF",
        severity: "medium",
        wcag: [],
        section508: [],
        location: `${fileName}:header`,
        message: "The file extension is PDF, but the PDF header was not detected.",
        whyItMatters: "Invalid or corrupted files cannot be reliably checked or remediated.",
        howToFix: "Re-export or regenerate the PDF and scan again.",
        confidence: "medium",
        manualCheck: true
      })
    );
    return findings;
  }

  if (!/\/StructTreeRoot\b/.test(text)) {
    findings.push(
      makeFinding({
        ruleId: RULES.pdfTagged.ruleId,
        title: RULES.pdfTagged.title,
        severity: "high",
        wcag: RULES.pdfTagged.wcag,
        section508: RULES.pdfTagged.section508,
        location: `${fileName}:catalog`,
        message: "PDF tag tree marker /StructTreeRoot was not detected.",
        whyItMatters: "Tagged PDFs provide the structure assistive technology needs for headings, lists, tables, figures, and reading order.",
        howToFix: "Remediate the PDF tag structure in Acrobat, PAC, CommonLook, or your approved PDF workflow. When possible, fix the source file and export an accessible PDF.",
        confidence: "medium",
        manualCheck: true
      })
    );
  }

  if (!/\/Lang\s*\(/.test(text)) {
    findings.push(
      makeFinding({
        ruleId: RULES.docLang.ruleId,
        title: RULES.docLang.title,
        severity: "medium",
        wcag: RULES.docLang.wcag,
        section508: RULES.docLang.section508,
        location: `${fileName}:catalog`,
        message: "PDF document language marker /Lang was not detected.",
        whyItMatters: "Language metadata helps screen readers apply the correct pronunciation rules.",
        howToFix: "Set the document language in the PDF properties or source document, then re-export/remediate.",
        confidence: "medium",
        manualCheck: true
      })
    );
  }

  if (!/\/Title\s*\(/.test(text)) {
    findings.push(
      makeFinding({
        ruleId: RULES.docTitle.ruleId,
        title: RULES.docTitle.title,
        severity: "medium",
        wcag: RULES.docTitle.wcag,
        section508: RULES.docTitle.section508,
        location: `${fileName}:metadata`,
        message: "PDF title metadata was not detected.",
        whyItMatters: "A meaningful PDF title helps users identify the document in viewer tabs and assistive technology.",
        howToFix: "Add a meaningful document title and set the PDF to display the document title instead of the file name.",
        confidence: "medium",
        manualCheck: true
      })
    );
  }

  return findings;
}
