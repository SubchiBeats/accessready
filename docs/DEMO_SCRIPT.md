# Demo Script

Use this to show AccessReady in an interview, portfolio walkthrough, or GitHub README video.

## 30-second version

AccessReady is a Section 508 preflight assistant for communications teams. Instead of waiting until a PDF or web page fails review, teams can scan source content earlier, get plain-English remediation guidance, and export a report for QA tracking.

## 2-minute version

1. Open the web demo.
2. Upload `samples/inaccessible-sample.html` and `samples/inaccessible-sample.md`.
3. Show the summary cards for high, medium, low, and manual checks.
4. Open one finding and explain:
   - What failed
   - Why it matters
   - How to fix it
   - Whether manual review is needed
5. Download the Markdown report.
6. Show the CLI command:

```bash
npm run accessready -- scan samples --format markdown --out accessready-report.md
```

7. Show the GitHub Action workflow that can run the same checks in CI.

## Portfolio framing

This project demonstrates:

- Accessibility and Section 508 knowledge
- Communications workflow understanding
- TypeScript architecture
- CLI design
- Front-end product design
- GitHub Actions/CI awareness
- Practical remediation documentation
