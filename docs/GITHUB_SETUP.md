# GitHub Setup Guide

## Option 1: Create a new GitHub repo from the ZIP

1. Create a new repository on GitHub named `accessready`.
2. Download and unzip this project.
3. Open a terminal inside the unzipped folder.
4. Run:

```bash
git init
git add .
git commit -m "Launch AccessReady MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/accessready.git
git push -u origin main
```

## Option 2: Test locally first

```bash
npm install
npm run build
npm run scan:samples
npm run dev
```

Then open the local Vite URL printed in the terminal.

## Recommended GitHub repo settings

### Description

Section 508 preflight assistant for communications teams. Scans HTML, Markdown, DOCX, PPTX, and PDFs for common accessibility issues and exports plain-English remediation reports.

### Topics

```text
section-508
accessibility
wcag
a11y
pdf-accessibility
communications
remediation
github-action
vite
typescript
```

### First release title

`AccessReady v0.1.0 Founder MVP`

### First release notes

```markdown
AccessReady v0.1.0 introduces a Section 508 preflight workflow for communications teams.

Included:
- Shared TypeScript scanner engine
- CLI scanner
- Browser upload demo
- Markdown and JSON reports
- GitHub Action workflow template
- Sample inaccessible files
- Client remediation report template
- Alt text log template
- Roadmap and product docs

This release focuses on preflight checks and manual-review guidance, not full legal compliance certification.
```

## Suggested pinned repo blurb

> AccessReady is my flagship accessibility tooling project. It helps content and communications teams catch common Section 508/WCAG issues before publication and generate clear remediation reports.
