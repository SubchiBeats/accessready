// Realistic, deliberately-imperfect sample deliverable for the interactive demo.
// Pre-rendered so the demo loads instantly and never depends on a real upload.
import type { ProjectReport } from "@accessready/core";

export const DEMO_DELIVERABLE_NAME = "NIH-webinar-promo-package.zip";

const ts = "2026-06-06T15:00:00Z";

export const DEMO_REPORT: ProjectReport = {
  projectName: DEMO_DELIVERABLE_NAME,
  generatedAt: ts,
  standardProfile: "section-508-wcag-aa-preflight",
  totals: {
    totalFindings: 7,
    critical: 0,
    high: 3,
    medium: 2,
    low: 2,
    info: 0,
    manualChecks: 2,
    passedAutomatedChecks: false
  },
  results: [
    {
      fileName: "webinar-page.html",
      fileType: "html",
      scannedAt: ts,
      standardProfile: "section-508-wcag-aa-preflight",
      summary: { totalFindings: 3, critical: 0, high: 2, medium: 1, low: 0, info: 0, manualChecks: 0, passedAutomatedChecks: false },
      manualChecks: [],
      findings: [
        {
          id: "demo-1",
          ruleId: "AR-IMG-ALT",
          title: "Missing alt text on speaker headshot",
          severity: "high",
          wcag: ["1.1.1 Non-text Content"],
          section508: ["E205.4", "WCAG 2.0 A/AA"],
          location: "line 42",
          message: "Image of Dr. Patel has no alt attribute.",
          whyItMatters: "Screen reader users will not know who the speaker is.",
          howToFix: "Add concise alt text describing the person and role, e.g. alt=\"Dr. Anika Patel, NIH research lead\".",
          exampleFix: "<img src=\"patel.jpg\" alt=\"Dr. Anika Patel, NIH research lead\">",
          confidence: "high",
          manualCheck: false
        },
        {
          id: "demo-2",
          ruleId: "AR-LINK-TEXT",
          title: "Vague link text: \"click here\"",
          severity: "high",
          wcag: ["2.4.4 Link Purpose (In Context)"],
          section508: ["E205.4", "WCAG 2.0 A/AA"],
          location: "line 78",
          message: "Registration link reads \"click here\" with no destination context.",
          whyItMatters: "Screen reader users navigating by links cannot tell where this goes.",
          howToFix: "Rewrite to describe the action, e.g. \"Register for the May 14 webinar\".",
          confidence: "high",
          manualCheck: false
        },
        {
          id: "demo-3",
          ruleId: "AR-HEADING-SKIP",
          title: "Heading order skips from H2 to H4",
          severity: "medium",
          wcag: ["1.3.1 Info and Relationships", "2.4.6 Headings and Labels"],
          section508: ["E205.4", "WCAG 2.0 A/AA"],
          location: "line 110",
          message: "After \"Agenda\" (H2) the next heading is \"Speakers\" (H4).",
          whyItMatters: "Skipped heading levels break the outline assistive tech relies on.",
          howToFix: "Change \"Speakers\" to H3, or insert the missing H3 above it.",
          confidence: "high",
          manualCheck: false
        }
      ]
    },
    {
      fileName: "promo-flyer.pdf",
      fileType: "pdf",
      scannedAt: ts,
      standardProfile: "section-508-wcag-aa-preflight",
      summary: { totalFindings: 2, critical: 0, high: 1, medium: 0, low: 1, info: 0, manualChecks: 1, passedAutomatedChecks: false },
      manualChecks: [
        {
          id: "manual-pdf-ua",
          title: "Validate PDF tags, artifacts, forms, and bookmarks",
          reason: "PDF accessibility requires tag tree, artifact, and reading-order validation beyond preflight.",
          suggestedMethod: "Use Acrobat Accessibility Checker, PAC, CommonLook, or your organization's approved PDF remediation workflow.",
          appliesTo: ["pdf"]
        }
      ],
      findings: [
        {
          id: "demo-4",
          ruleId: "AR-DOC-TITLE",
          title: "PDF missing document title",
          severity: "high",
          wcag: ["2.4.2 Page Titled"],
          section508: ["E205.4", "WCAG 2.0 A/AA"],
          location: "metadata",
          message: "PDF /Title metadata was not detected.",
          whyItMatters: "Without a title, PDF viewers and assistive tech announce the file name instead.",
          howToFix: "Set the title in the source file properties before exporting, and set viewer to display title.",
          confidence: "medium",
          manualCheck: true
        },
        {
          id: "demo-5",
          ruleId: "AR-IMG-EMBEDDED-TEXT",
          title: "Flyer contains embedded text that may need an accessible equivalent",
          severity: "low",
          wcag: ["1.4.5 Images of Text"],
          section508: ["E205.4", "WCAG 2.0 A/AA"],
          location: "page 1",
          message: "Large image regions detected on the flyer; embedded text may not be reachable by screen readers.",
          whyItMatters: "Text baked into images is invisible to assistive technology.",
          howToFix: "Provide an accessible equivalent: real text in the PDF, alt text, or a companion HTML version.",
          confidence: "low",
          manualCheck: true
        }
      ]
    },
    {
      fileName: "speaker-bio.docx",
      fileType: "docx",
      scannedAt: ts,
      standardProfile: "section-508-wcag-aa-preflight",
      summary: { totalFindings: 1, critical: 0, high: 0, medium: 1, low: 0, info: 0, manualChecks: 1, passedAutomatedChecks: true },
      manualChecks: [
        {
          id: "manual-reading-order",
          title: "Confirm reading order",
          reason: "Automated checks cannot reliably confirm the order assistive tech will use.",
          suggestedMethod: "Use Word's reading order pane or a screen-reader spot check before exporting to PDF.",
          appliesTo: ["docx"]
        }
      ],
      findings: [
        {
          id: "demo-6",
          ruleId: "AR-TABLE-HEADERS",
          title: "Table may need header row verification",
          severity: "medium",
          wcag: ["1.3.1 Info and Relationships"],
          section508: ["E205.4", "WCAG 2.0 A/AA"],
          location: "page 2",
          message: "A 3-column table was detected; header row setting not confirmed.",
          whyItMatters: "Without a marked header row, screen readers cannot announce column relationships.",
          howToFix: "In Word: select first row → Table Design → Header Row checkbox.",
          confidence: "medium",
          manualCheck: true
        }
      ]
    },
    {
      fileName: "social-copy.md",
      fileType: "markdown",
      scannedAt: ts,
      standardProfile: "section-508-wcag-aa-preflight",
      summary: { totalFindings: 1, critical: 0, high: 0, medium: 0, low: 1, info: 0, manualChecks: 0, passedAutomatedChecks: true },
      manualChecks: [],
      findings: [
        {
          id: "demo-7",
          ruleId: "AR-MEDIA-CAPTIONS",
          title: "Video link found; captions/transcript should be confirmed",
          severity: "low",
          wcag: ["1.2.2 Captions (Prerecorded)"],
          section508: ["E205.4", "WCAG 2.0 A/AA"],
          location: "line 4",
          message: "Youtube link present without nearby captions/transcript language.",
          whyItMatters: "Audience members who are deaf or hard of hearing need captions or a transcript.",
          howToFix: "Confirm captions on YouTube and link to a transcript in the post.",
          confidence: "medium",
          manualCheck: false
        }
      ]
    }
  ]
};
