# Case Study: Preflighting Section 508 Accessibility Before Publication

**Author:** Sahib Singh
**Project:** AccessReady — an open-source Section 508 / WCAG 2.0 AA preflight assistant

## The problem I kept seeing

In communications and QA/QC work, accessibility almost always gets checked at the *wrong* moment — after a PDF is exported, a page is live, or an email campaign has shipped and approval pressure is already high. By then, fixing an issue means re-opening source files, re-exporting, and re-routing approvals.

The mature tools reinforce this late-stage habit. Adobe Acrobat Pro is built for deep PDF remediation *after* export. The Word and PowerPoint Accessibility Checkers run on one file at a time. Browser tools like axe and WAVE check one live page. All of them are good — but none of them answer the question a communications lead actually asks before a launch:

> "Across **every** file in this deliverable — the slide deck, the two Word docs, the landing-page HTML, and the three PDFs — what is likely to fail, and what do we fix first?"

## What I built

AccessReady is a small, focused tool that scans a whole project of mixed formats (HTML, Markdown, DOCX, PPTX, PDF) in a single pass and produces one consolidated, plain-English report. Each finding includes severity, the WCAG criterion and Section 508 relevance, where it is, why it matters, and a concrete fix — written for a content author, not a developer.

It runs three ways: a command-line scanner, a drag-and-drop browser demo, and a GitHub Action that can gate a release in CI.

### Example: the sample scan

Running AccessReady against a deliberately broken sample project surfaced **19 findings across 4 files** — missing button names and form labels (high severity), skipped heading levels and missing alt text (medium), and PDFs with no detectable tag tree or language marker — plus a **10-item manual-review checklist** for the things automation should never claim to certify (reading order, alt-text quality, caption accuracy, color meaning).

That last point is the design philosophy: **AccessReady is honest about its limits.** It is a preflight and triage layer, not a compliance guarantee. It tells a team what to fix and where, then hands off to Acrobat, the Office checkers, or a human reviewer for the final sign-off.

## Why this matters now

The U.S. Department of Justice's Title II rule sets a hard standard — **WCAG 2.1 Level AA** — for state and local government web content and mobile apps, with compliance deadlines in **2026 and 2027** depending on entity size. Section 508 already requires WCAG 2.0 A/AA conformance for covered federal electronic content, including many documents. Demand for repeatable, defensible accessibility workflows is rising, not falling.

## What this project demonstrates

- **Domain depth:** accurate WCAG 2.x and Section 508 mapping, and a realistic understanding of where automated checking ends and human review begins.
- **Workflow thinking:** built for the comms/QA reality of mixed file types and approval pressure, not just for developers.
- **Engineering:** a TypeScript monorepo with a shared scanner engine, a CLI, a browser app, and a CI integration — typed, documented, and tested against sample fixtures.

---

*AccessReady is open source under the MIT license. It is positioned as a preflight assistant and does not guarantee legal compliance.*
