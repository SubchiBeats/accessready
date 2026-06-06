# AccessReady 508 Evidence Pack

**Deliverable:** NIH-webinar-promo-package  
**Prepared:** 2026-06-06T18:31:18.014Z  
**Conformance profile:** section-508-wcag-aa-preflight  
**Evaluation method:** Hybrid — AccessReady automated preflight + required manual review  
**Tool:** AccessReady (automated preflight; regex/structure heuristics)

> AccessReady supports accessibility review workflows. It does **not** guarantee legal compliance, and does not replace expert audit, PDF remediation, or ACR/VPAT creation. Findings should be confirmed by a human reviewer before delivery.

## 1. Executive summary

AccessReady performed an automated 508/WCAG preflight on 3 file(s) and identified 19 potential issue(s): 0 critical, 4 high, 10 medium, 5 low. 10 item(s) require manual review that automation cannot confirm.

**Delivery recommendation:** Not ready — remediate high-severity findings, then complete manual review before client submission.

## 2. Files reviewed

| File | Type | Findings | Manual checks | Automated signal |
| --- | --- | ---: | ---: | :---: |
| samples/inaccessible-sample.html | html | 11 | 4 | Review |
| samples/inaccessible-sample.md | markdown | 6 | 3 | Review |
| samples/sample-accessready-report.md | markdown | 2 | 3 | Pass |

## 3. Automated findings

| Severity | File | Issue | Location | Suggested fix | WCAG | Status |
| --- | --- | --- | --- | --- | --- | --- |
| high | samples/inaccessible-sample.html | Button may be missing an accessible name | line 18 | Add visible text or an aria-label for icon-only buttons. | 4.1.2 Name, Role, Value | Open |
| high | samples/inaccessible-sample.html | Form control may be missing a programmatic label | line 17 | Connect a visible label to the control with for/id, or add an accurate aria-label when a visible label is not possible. | 1.3.1 Info and Relationships; 3.3.2 Labels or Instructions; 4.1.2 Name, Role, Value | Open |
| high | samples/inaccessible-sample.html | Image is missing alternative text | line 10 | Add accurate alt text for meaningful images, or alt="" for decorative images. | 1.1.1 Non-text Content | Open |
| medium | samples/inaccessible-sample.html | Text may have insufficient color contrast | line 9 | Choose foreground and background colors with stronger contrast. Confirm in your approved contrast checker. | 1.4.3 Contrast (Minimum) | Open |
| medium | samples/inaccessible-sample.html | Document or page language is missing | samples/inaccessible-sample.html:<html> | Add a valid language attribute to the html element. | 3.1.1 Language of Page | Open |
| medium | samples/inaccessible-sample.html | Document or page title is missing | samples/inaccessible-sample.html:<head> | Add a concise, unique title in the document head. | 2.4.2 Page Titled | Open |
| medium | samples/inaccessible-sample.html | Heading levels appear to skip | line 8 | Use headings in sequence and adjust styling with CSS instead of skipping levels. | 1.3.1 Info and Relationships; 2.4.6 Headings and Labels | Open |
| medium | samples/inaccessible-sample.html | Embedded frame is missing a title | line 20 | Add a concise title that describes the embedded content. | 2.4.1 Bypass Blocks; 4.1.2 Name, Role, Value | Open |
| medium | samples/inaccessible-sample.html | Link text is vague or not meaningful out of context | line 11 | Use descriptive link text or provide an accurate aria-label for icon-only links. | 2.4.4 Link Purpose (In Context); 2.4.9 Link Purpose (Link Only) | Open |
| medium | samples/inaccessible-sample.html | Media needs captions or transcript verification | line 21 | Add a captions track and provide a transcript when appropriate. | 1.2.2 Captions (Prerecorded); 1.2.3 Audio Description or Media Alternative | Open |
| medium | samples/inaccessible-sample.html | Table may not identify header cells | line 12 | Use th elements and scope attributes for data tables. Use CSS layout instead of tables for purely visual layout. | 1.3.1 Info and Relationships | Open |
| high | samples/inaccessible-sample.md | Image is missing alternative text | line 7 | Add concise alt text that communicates the purpose or takeaway of the image. Use empty alt text only when the image is decorative. | 1.1.1 Non-text Content | Open |
| medium | samples/inaccessible-sample.md | Document or page title is missing | samples/inaccessible-sample.md:1 | Add one H1 heading at the beginning of the document. | 2.4.2 Page Titled | Open |
| medium | samples/inaccessible-sample.md | Link text is vague or not meaningful out of context | line 5 | Replace vague wording with the destination or action. | 2.4.4 Link Purpose (In Context); 2.4.9 Link Purpose (Link Only) | Open |
| low | samples/inaccessible-sample.md | Media needs captions or transcript verification | document | Confirm caption and transcript availability before publishing, and link to them near the media. | 1.2.2 Captions (Prerecorded); 1.2.3 Audio Description or Media Alternative | Open |
| low | samples/inaccessible-sample.md | Table may not identify header cells | line 9 | Use a proper Markdown table header row or convert layout tables into lists. | 1.3.1 Info and Relationships | Open |
| low | samples/inaccessible-sample.md | Table may not identify header cells | line 10 | Use a proper Markdown table header row or convert layout tables into lists. | 1.3.1 Info and Relationships | Open |
| low | samples/sample-accessready-report.md | Table may not identify header cells | line 10 | Use a proper Markdown table header row or convert layout tables into lists. | 1.3.1 Info and Relationships | Open |
| low | samples/sample-accessready-report.md | Table may not identify header cells | line 11 | Use a proper Markdown table header row or convert layout tables into lists. | 1.3.1 Info and Relationships | Open |

## 4. Manual review checklist

- [ ] **Confirm reading order** — Use the source application reading order pane, Acrobat reading order tools, or a screen reader spot check.
- [ ] **Review alt text quality** — Review every meaningful image, chart, and infographic with a human subject-matter reviewer.
- [ ] **Confirm color is not the only way meaning is conveyed** — Check charts, tables, buttons, alerts, and status labels for text, pattern, or icon alternatives.
- [ ] **Confirm captions, transcripts, and audio descriptions** — Verify captions for video, transcripts for audio, and audio descriptions or equivalent alternatives when needed.

## 5. Alt text register

| File | Location | Proposed alt text | Approved by |
| --- | --- | --- | --- |
| samples/inaccessible-sample.html | line 10 | _add description_ | |
| samples/inaccessible-sample.md | line 7 | _add description_ | |

## 6. Remediation status

| Open | In progress | Fixed | Manual review | Total |
| ---: | ---: | ---: | ---: | ---: |
| 19 | 0 | 0 | 10 | 29 |

_Update this table as the team works through findings._

## 7. Remaining risks

- 4 high-severity automated finding(s) outstanding.
- 10 manual check(s) not yet confirmed (e.g., reading order, captions, alt-text quality, PDF tag quality).
- Automated preflight cannot confirm subjective quality or full PDF/UA conformance.

## 8. Reviewer sign-off

| Role | Name | Date | Decision |
| --- | --- | --- | --- |
| Preparer |  | | |
| Accessibility reviewer | | | Approve / Return |
| Delivery approver | | | Approve / Hold |

_Generated by AccessReady. Pair with manual review before delivery._
