export const STANDARD_PROFILE = "section-508-wcag-aa-preflight";

export const RULES = {
  imageAlt: {
    ruleId: "AR-IMG-ALT",
    title: "Image is missing alternative text",
    wcag: ["1.1.1 Non-text Content"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  vagueLink: {
    ruleId: "AR-LINK-TEXT",
    title: "Link text is vague or not meaningful out of context",
    wcag: ["2.4.4 Link Purpose (In Context)", "2.4.9 Link Purpose (Link Only)"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  headingSkip: {
    ruleId: "AR-HEADING-SKIP",
    title: "Heading levels appear to skip",
    wcag: ["1.3.1 Info and Relationships", "2.4.6 Headings and Labels"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  docTitle: {
    ruleId: "AR-DOC-TITLE",
    title: "Document or page title is missing",
    wcag: ["2.4.2 Page Titled"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  docLang: {
    ruleId: "AR-DOC-LANG",
    title: "Document or page language is missing",
    wcag: ["3.1.1 Language of Page"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  tableHeaders: {
    ruleId: "AR-TABLE-HEADERS",
    title: "Table may not identify header cells",
    wcag: ["1.3.1 Info and Relationships"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  contrast: {
    ruleId: "AR-CONTRAST",
    title: "Text may have insufficient color contrast",
    wcag: ["1.4.3 Contrast (Minimum)"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  mediaCaptions: {
    ruleId: "AR-MEDIA-CAPTIONS",
    title: "Media needs captions or transcript verification",
    wcag: ["1.2.2 Captions (Prerecorded)", "1.2.3 Audio Description or Media Alternative"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  formLabels: {
    ruleId: "AR-FORM-LABEL",
    title: "Form control may be missing a programmatic label",
    wcag: ["1.3.1 Info and Relationships", "3.3.2 Labels or Instructions", "4.1.2 Name, Role, Value"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  buttonName: {
    ruleId: "AR-BUTTON-NAME",
    title: "Button may be missing an accessible name",
    wcag: ["4.1.2 Name, Role, Value"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  iframeTitle: {
    ruleId: "AR-IFRAME-TITLE",
    title: "Embedded frame is missing a title",
    wcag: ["2.4.1 Bypass Blocks", "4.1.2 Name, Role, Value"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  },
  pdfTagged: {
    ruleId: "AR-PDF-TAGS",
    title: "PDF may not be tagged for assistive technology",
    wcag: ["1.3.1 Info and Relationships", "2.4.3 Focus Order"],
    section508: ["E205.4", "WCAG 2.0 A/AA"]
  }
} as const;

export const VAGUE_LINK_TEXT = new Set([
  "click here",
  "here",
  "read more",
  "learn more",
  "more",
  "link",
  "this link",
  "download",
  "view",
  "details",
  "see more"
]);
