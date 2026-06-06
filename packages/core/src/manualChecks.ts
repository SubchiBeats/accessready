import type { ManualCheck, SupportedFileType } from "./types.js";

export function manualChecksFor(fileType: SupportedFileType): ManualCheck[] {
  const checks: ManualCheck[] = [
    {
      id: "manual-reading-order",
      title: "Confirm reading order",
      reason: "Automated checks cannot reliably confirm whether assistive technology will encounter content in the intended order.",
      suggestedMethod: "Use the source application reading order pane, Acrobat reading order tools, or a screen reader spot check.",
      appliesTo: ["docx", "pptx", "pdf", "html"]
    },
    {
      id: "manual-alt-quality",
      title: "Review alt text quality",
      reason: "Automated tools can detect missing alt text but cannot guarantee that alt text communicates the purpose of the image accurately.",
      suggestedMethod: "Review every meaningful image, chart, and infographic with a human subject-matter reviewer.",
      appliesTo: ["markdown", "html", "docx", "pptx", "pdf"]
    },
    {
      id: "manual-color-meaning",
      title: "Confirm color is not the only way meaning is conveyed",
      reason: "Color-only distinctions often require visual and content-context review.",
      suggestedMethod: "Check charts, tables, buttons, alerts, and status labels for text, pattern, or icon alternatives.",
      appliesTo: ["html", "docx", "pptx", "pdf", "markdown"]
    },
    {
      id: "manual-captions-transcripts",
      title: "Confirm captions, transcripts, and audio descriptions",
      reason: "Media accessibility often depends on external files or platform settings that are not visible in static source files.",
      suggestedMethod: "Verify captions for video, transcripts for audio, and audio descriptions or equivalent alternatives when needed.",
      appliesTo: ["html", "markdown", "pdf", "docx", "pptx"]
    }
  ];

  if (fileType === "pdf") {
    checks.push({
      id: "manual-pdf-ua",
      title: "Validate PDF tags, artifacts, forms, and bookmarks",
      reason: "PDF accessibility requires tag tree, artifact, form, bookmark, table, and reading order validation beyond this lightweight preflight.",
      suggestedMethod: "Use Acrobat Accessibility Checker, PAC, CommonLook, or your organization's approved PDF remediation workflow.",
      appliesTo: ["pdf"]
    });
  }

  return checks.filter((check) => check.appliesTo.includes(fileType));
}
