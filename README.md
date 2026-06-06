# AccessReady

**A Section 508 preflight and remediation assistant for communications teams.**

AccessReady scans common content formats before publication, explains issues in plain English, and produces a clean remediation checklist that teams can review, fix, and archive.

> AccessReady is designed to support accessibility QA. It does **not** guarantee legal compliance, replace manual review, or replace expert remediation for complex PDFs, multimedia, or interactive applications.

## Why this exists

Most accessibility tools are built for developers or for late-stage PDF remediation. Communications teams often work in Word, PowerPoint, Markdown, HTML snippets, social graphics, newsletters, and exported PDFs. AccessReady focuses on the messy middle of that workflow:

1. Catch common issues before publishing.
2. Explain what failed in normal language.
3. Suggest practical fixes.
4. Generate an evidence report for QA/QC tracking.

## How AccessReady fits alongside Acrobat and Office

Strong accessibility checkers already exist, and AccessReady does **not** try to replace them:

- **Adobe Acrobat Pro** is the right tool for deep PDF/UA tag remediation.
- **Microsoft Word & PowerPoint** have a built-in Accessibility Checker for individual source files.
- **axe, WAVE, and Lighthouse** are excellent for live HTML pages.

What none of those do is scan a **whole deliverable of mixed formats in one pass** and hand back a single, archivable report. That is AccessReady's lane:

| | Acrobat / Office checker | Browser a11y tools | **AccessReady** |
| --- | :---: | :---: | :---: |
| One file at a time | ✅ | ✅ | ✅ |
| HTML + Markdown + DOCX + PPTX + PDF in **one run** | — | — | ✅ |
| **Consolidated** Markdown/JSON evidence report | — | — | ✅ |
| Runs automatically in **CI / GitHub Actions** | — | partial | ✅ |
| Plain-English fix + WCAG/508 mapping per finding | partial | partial | ✅ |

Use AccessReady as the **preflight and triage layer**: it tells a team what to fix and where, across every file in a project, before the deeper single-file tools do the final remediation and sign-off.

Section 508 requires covered federal electronic content to conform to WCAG 2.0 Level A and AA criteria, including many non-web documents. The DOJ Title II web and mobile app rule also raises demand for WCAG 2.1 Level AA workflows across state and local government web content and apps.

Useful references:

- Section508.gov Applicability & Conformance: https://www.section508.gov/develop/applicability-conformance/
- Section508.gov Electronic Documents Overview: https://www.section508.gov/test/documents/
- ADA.gov Title II Web and Mobile App Rule Guide: https://www.ada.gov/resources/small-entity-compliance-guide/
- WCAG 2.2 Recommendation: https://www.w3.org/TR/WCAG22/

## What AccessReady checks today

AccessReady is intentionally focused on high-frequency preflight issues:

- Missing image alt text
- Vague link text such as “click here,” “read more,” and raw URLs
- Missing page/document title
- Missing document/page language
- Skipped heading levels
- Tables without detectable headers
- HTML images, links, headings, buttons, forms, iframes, videos, and simple contrast checks
- DOCX/PPTX embedded image description checks using Office XML
- PDF metadata/tagging preflight checks for `/StructTreeRoot`, `/Lang`, and `/Title`
- Manual-review flags for reading order, captions/transcripts, complex charts, and exported PDFs

## What makes it different

AccessReady is not just a scanner. Each finding includes:

- Severity
- WCAG mapping
- Section 508 relevance
- Location
- Why it matters
- How to fix it
- Example fix when helpful
- Confidence level
- Whether a human needs to confirm the result

## Packages

```text
accessready/
├─ apps/web/              Browser-based upload and report UI
├─ packages/core/         Shared scanner engine
├─ packages/cli/          Command-line scanner
├─ .github/workflows/     Example CI workflow
├─ docs/                  Product, roadmap, checklist, and content guidance
├─ samples/               Intentionally broken sample content and reports
└─ templates/             Reusable client/report templates
```

## Quick start

```bash
npm install
npm run build
npm run scan:samples
```

Run the CLI against your own files:

```bash
npm run accessready -- scan ./content --format markdown --out ./accessready-report.md
```

Fail CI when high-severity issues are found:

```bash
npm run accessready -- scan ./dist ./docs --fail-on high
```

Start the web app:

```bash
npm run dev
```

## CLI examples

Scan a folder and print a terminal summary:

```bash
accessready scan ./public
```

Export JSON:

```bash
accessready scan ./public --format json --out accessready-report.json
```

Export Markdown:

```bash
accessready scan ./public --format markdown --out accessready-report.md
```

Ignore generated/vendor folders:

```bash
accessready scan ./public --ignore "**/vendor/**" --ignore "**/.next/**"
```

## GitHub Action example

Copy `.github/workflows/accessready.yml` into your repo and adjust the scan paths.

```yaml
name: AccessReady 508 Preflight

on:
  pull_request:
  push:
    branches: [main]

jobs:
  accessready:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm run accessready -- scan ./public ./docs --format markdown --out accessready-report.md --fail-on high
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: accessready-report
          path: accessready-report.md
```

## Roadmap

- [x] Markdown scanner
- [x] HTML scanner
- [x] DOCX/PPTX Office XML preflight
- [x] PDF metadata/tagging preflight
- [x] Markdown and JSON reports
- [x] Browser demo
- [x] GitHub Action workflow template
- [ ] Better color contrast extraction from CSS files
- [ ] Image/chart alt text drafting workflow with human approval
- [ ] CSV remediation log export
- [ ] Pull request comments
- [ ] Deeper PDF/UA checks through optional external adapters
- [ ] Google Docs/Drive connector concept
- [ ] VPAT/ACR evidence packet helper

## Suggested repo description

> Section 508 preflight assistant for communications teams. Scans HTML, Markdown, DOCX, PPTX, and PDFs for common accessibility issues and exports plain-English remediation reports.

## License

MIT
