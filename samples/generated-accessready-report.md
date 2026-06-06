# AccessReady 508 Preflight Report

**Project:** AccessReady Project
**Generated:** 2026-06-06T07:13:01.533Z
**Profile:** section-508-wcag-aa-preflight

## Summary

| Total | Critical | High | Medium | Low | Info | Manual checks | Automated pass |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: |
| 31 | 0 | 5 | 11 | 15 | 0 | 13 | No |

## samples/generated-accessready-report.md

**Type:** markdown  
**Scanned:** 2026-06-06T07:13:01.516Z  
**Automated pass:** No

### Findings

#### 🔴 Image is missing alternative text

- **Rule:** AR-IMG-ALT
- **Severity:** high
- **Location:** line 200
- **Message:** Image (chart.png) has empty alt text.
- **WCAG:** 1.1.1 Non-text Content
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Screen reader users may miss important information if meaningful images do not have text alternatives.
- **How to fix:** Add concise alt text that communicates the purpose or takeaway of the image. Use empty alt text only when the image is decorative.
- **Example fix:** `![Bar chart showing applications increased from 2022 to 2024](chart.png)`
- **Confidence:** high
- **Snippet:** `![ ](chart.png)`

#### 🟠 Link text is vague or not meaningful out of context

- **Rule:** AR-LINK-TEXT
- **Severity:** medium
- **Location:** line 227
- **Message:** Link text “click here” may not describe the destination or purpose.
- **WCAG:** 2.4.4 Link Purpose (In Context), 2.4.9 Link Purpose (Link Only)
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Screen reader users often navigate by links. Link text should make sense out of context.
- **How to fix:** Replace vague wording with the destination or action.
- **Example fix:** `[Download the accessibility checklist](checklist.pdf)`
- **Confidence:** high
- **Snippet:** `[click here](https://example.com/register)`

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 10
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `| ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: |`

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 11
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `| 19 | 0 | 4 | 10 | 5 | 0 | 10 | No |`

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 252
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `- **Example fix:** \`| Name | Date | Status |\n| --- | --- | --- |\``

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 255
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `- **Snippet:** \`| Date | Speaker | Topic |\``

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 267
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `- **Example fix:** \`| Name | Date | Status |\n| --- | --- | --- |\``

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 270
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `- **Snippet:** \`Jan. 4 | Dr. Lee | Program overview |\``

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 296
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `- **Example fix:** \`| Name | Date | Status |\n| --- | --- | --- |\``

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 299
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `- **Snippet:** \`| ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: |\``

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 311
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `- **Example fix:** \`| Name | Date | Status |\n| --- | --- | --- |\``

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 314
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `- **Snippet:** \`| 10 | 0 | 4 | 5 | 1 | 0 | 8 | No |\``

### Manual review checklist

- **Review alt text quality:** Review every meaningful image, chart, and infographic with a human subject-matter reviewer.
- **Confirm color is not the only way meaning is conveyed:** Check charts, tables, buttons, alerts, and status labels for text, pattern, or icon alternatives.
- **Confirm captions, transcripts, and audio descriptions:** Verify captions for video, transcripts for audio, and audio descriptions or equivalent alternatives when needed.

## samples/inaccessible-sample.html

**Type:** html  
**Scanned:** 2026-06-06T07:13:01.526Z  
**Automated pass:** No

### Findings

#### 🔴 Button may be missing an accessible name

- **Rule:** AR-BUTTON-NAME
- **Severity:** high
- **Location:** line 18
- **Message:** Button appears to have no accessible name.
- **WCAG:** 4.1.2 Name, Role, Value
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Users of assistive technology need to know what action a button performs.
- **How to fix:** Add visible text or an aria-label for icon-only buttons.
- **Example fix:** `<button aria-label="Open navigation menu">☰</button>`
- **Confidence:** high
- **Snippet:** `<button><svg aria-hidden="true"></svg></button>`

#### 🔴 Form control may be missing a programmatic label

- **Rule:** AR-FORM-LABEL
- **Severity:** high
- **Location:** line 17
- **Message:** Form control may not have a programmatic label.
- **WCAG:** 1.3.1 Info and Relationships, 3.3.2 Labels or Instructions, 4.1.2 Name, Role, Value
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Labels help screen reader users understand what information a form field requests.
- **How to fix:** Connect a visible label to the control with for/id, or add an accurate aria-label when a visible label is not possible.
- **Example fix:** `<label for="email">Email address</label><input id="email" type="email">`
- **Confidence:** medium
- **Snippet:** `<input id="email" type="email">`

#### 🔴 Image is missing alternative text

- **Rule:** AR-IMG-ALT
- **Severity:** high
- **Location:** line 10
- **Message:** Image element is missing an alt attribute.
- **WCAG:** 1.1.1 Non-text Content
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Screen reader users may miss important information if meaningful images do not have text alternatives.
- **How to fix:** Add accurate alt text for meaningful images, or alt="" for decorative images.
- **Example fix:** `<img src="chart.png" alt="Line chart showing registrations increased each quarter.">`
- **Confidence:** high
- **Snippet:** `<img src="applications-chart.png">`

#### 🟠 Text may have insufficient color contrast

- **Rule:** AR-CONTRAST
- **Severity:** medium
- **Location:** line 9
- **Message:** Inline text contrast appears to be 2.32:1, below the common 4.5:1 minimum for normal text.
- **WCAG:** 1.4.3 Contrast (Minimum)
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Low contrast can make text difficult to read for users with low vision, color vision differences, or situational limitations.
- **How to fix:** Choose foreground and background colors with stronger contrast. Confirm in your approved contrast checker.
- **Confidence:** medium
- **Manual review needed:** Yes
- **Snippet:** `<p style="color:#aaaaaa;background-color:#ffffff">Applications increased this year.</p>`

#### 🟠 Document or page language is missing

- **Rule:** AR-DOC-LANG
- **Severity:** medium
- **Location:** samples/inaccessible-sample.html:<html>
- **Message:** The page language was not detected on the html element.
- **WCAG:** 3.1.1 Language of Page
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Screen readers use the page language to choose pronunciation rules.
- **How to fix:** Add a valid language attribute to the html element.
- **Example fix:** `<html lang="en">`
- **Confidence:** high

#### 🟠 Document or page title is missing

- **Rule:** AR-DOC-TITLE
- **Severity:** medium
- **Location:** samples/inaccessible-sample.html:<head>
- **Message:** The page does not include a meaningful title element.
- **WCAG:** 2.4.2 Page Titled
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** A page title helps users identify pages in browser tabs, search results, and assistive technology navigation.
- **How to fix:** Add a concise, unique title in the document head.
- **Example fix:** `<title>FY 2026 Webinar Registration</title>`
- **Confidence:** high

#### 🟠 Heading levels appear to skip

- **Rule:** AR-HEADING-SKIP
- **Severity:** medium
- **Location:** line 8
- **Message:** Heading “Application Trends” jumps from H1 to H3.
- **WCAG:** 1.3.1 Info and Relationships, 2.4.6 Headings and Labels
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Headings create a navigable outline for assistive technology users.
- **How to fix:** Use headings in sequence and adjust styling with CSS instead of skipping levels.
- **Confidence:** high

#### 🟠 Embedded frame is missing a title

- **Rule:** AR-IFRAME-TITLE
- **Severity:** medium
- **Location:** line 20
- **Message:** Iframe is missing a title attribute.
- **WCAG:** 2.4.1 Bypass Blocks, 4.1.2 Name, Role, Value
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Iframe titles help assistive technology users understand embedded content before entering it.
- **How to fix:** Add a concise title that describes the embedded content.
- **Example fix:** `<iframe title="Registration form" src="..."></iframe>`
- **Confidence:** high
- **Snippet:** `<iframe src="https://example.com/form">`

#### 🟠 Link text is vague or not meaningful out of context

- **Rule:** AR-LINK-TEXT
- **Severity:** medium
- **Location:** line 11
- **Message:** Link text “click here” may be vague.
- **WCAG:** 2.4.4 Link Purpose (In Context), 2.4.9 Link Purpose (Link Only)
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Screen reader users often navigate by links. Link text should be meaningful without surrounding context.
- **How to fix:** Use descriptive link text or provide an accurate aria-label for icon-only links.
- **Example fix:** `<a href="/report.pdf">Download the annual report PDF</a>`
- **Confidence:** high
- **Snippet:** `<a href="report.pdf">click here</a>`

#### 🟠 Media needs captions or transcript verification

- **Rule:** AR-MEDIA-CAPTIONS
- **Severity:** medium
- **Location:** line 21
- **Message:** video element does not include a detectable captions track or nearby transcript language.
- **WCAG:** 1.2.2 Captions (Prerecorded), 1.2.3 Audio Description or Media Alternative
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Users who are deaf or hard of hearing need captions or transcripts for audio information.
- **How to fix:** Add a captions track and provide a transcript when appropriate.
- **Example fix:** `<track kind="captions" src="captions.vtt" srclang="en" label="English">`
- **Confidence:** medium
- **Manual review needed:** Yes
- **Snippet:** `<video src="event.mp4"></video>`

#### 🟠 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** medium
- **Location:** line 12
- **Message:** Table does not include detectable header cells.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Header cells help screen reader users understand row and column relationships.
- **How to fix:** Use th elements and scope attributes for data tables. Use CSS layout instead of tables for purely visual layout.
- **Example fix:** `<th scope="col">Date</th>`
- **Confidence:** medium
- **Manual review needed:** Yes
- **Snippet:** `<table>\n    <tr><td>Year</td><td>Applications</td></tr>\n    <tr><td>2025</td><td>900</td></tr>\n  </table>`

### Manual review checklist

- **Confirm reading order:** Use the source application reading order pane, Acrobat reading order tools, or a screen reader spot check.
- **Review alt text quality:** Review every meaningful image, chart, and infographic with a human subject-matter reviewer.
- **Confirm color is not the only way meaning is conveyed:** Check charts, tables, buttons, alerts, and status labels for text, pattern, or icon alternatives.
- **Confirm captions, transcripts, and audio descriptions:** Verify captions for video, transcripts for audio, and audio descriptions or equivalent alternatives when needed.

## samples/inaccessible-sample.md

**Type:** markdown  
**Scanned:** 2026-06-06T07:13:01.533Z  
**Automated pass:** No

### Findings

#### 🔴 Image is missing alternative text

- **Rule:** AR-IMG-ALT
- **Severity:** high
- **Location:** line 7
- **Message:** Image (chart.png) has empty alt text.
- **WCAG:** 1.1.1 Non-text Content
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Screen reader users may miss important information if meaningful images do not have text alternatives.
- **How to fix:** Add concise alt text that communicates the purpose or takeaway of the image. Use empty alt text only when the image is decorative.
- **Example fix:** `![Bar chart showing applications increased from 2022 to 2024](chart.png)`
- **Confidence:** high
- **Snippet:** `![ ](chart.png)`

#### 🟠 Document or page title is missing

- **Rule:** AR-DOC-TITLE
- **Severity:** medium
- **Location:** samples/inaccessible-sample.md:1
- **Message:** No top-level Markdown heading was found.
- **WCAG:** 2.4.2 Page Titled
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** A clear document title helps screen reader users and all readers understand the purpose of the file.
- **How to fix:** Add one H1 heading at the beginning of the document.
- **Example fix:** `# Annual Report Accessibility Checklist`
- **Confidence:** medium

#### 🟠 Link text is vague or not meaningful out of context

- **Rule:** AR-LINK-TEXT
- **Severity:** medium
- **Location:** line 5
- **Message:** Link text “click here” may not describe the destination or purpose.
- **WCAG:** 2.4.4 Link Purpose (In Context), 2.4.9 Link Purpose (Link Only)
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Screen reader users often navigate by links. Link text should make sense out of context.
- **How to fix:** Replace vague wording with the destination or action.
- **Example fix:** `[Download the accessibility checklist](checklist.pdf)`
- **Confidence:** high
- **Snippet:** `[click here](https://example.com/register)`

#### 🟡 Media needs captions or transcript verification

- **Rule:** AR-MEDIA-CAPTIONS
- **Severity:** low
- **Location:** document
- **Message:** Media is referenced, but captions/transcript language was not detected.
- **WCAG:** 1.2.2 Captions (Prerecorded), 1.2.3 Audio Description or Media Alternative
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Video and audio content usually need captions, transcripts, or equivalent alternatives.
- **How to fix:** Confirm caption and transcript availability before publishing, and link to them near the media.
- **Confidence:** low
- **Manual review needed:** Yes

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 9
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `| Date | Speaker | Topic |`

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 10
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `Jan. 4 | Dr. Lee | Program overview |`

### Manual review checklist

- **Review alt text quality:** Review every meaningful image, chart, and infographic with a human subject-matter reviewer.
- **Confirm color is not the only way meaning is conveyed:** Check charts, tables, buttons, alerts, and status labels for text, pattern, or icon alternatives.
- **Confirm captions, transcripts, and audio descriptions:** Verify captions for video, transcripts for audio, and audio descriptions or equivalent alternatives when needed.

## samples/sample-accessready-report.md

**Type:** markdown  
**Scanned:** 2026-06-06T07:13:01.533Z  
**Automated pass:** Yes

### Findings

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 10
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `| ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: |`

#### 🟡 Table may not identify header cells

- **Rule:** AR-TABLE-HEADERS
- **Severity:** low
- **Location:** line 11
- **Message:** This looks like a table, but the Markdown header separator row was not detected.
- **WCAG:** 1.3.1 Info and Relationships
- **508 relevance:** E205.4, WCAG 2.0 A/AA
- **Why it matters:** Tables need clear header relationships so assistive technology can communicate row and column meaning.
- **How to fix:** Use a proper Markdown table header row or convert layout tables into lists.
- **Example fix:** `| Name | Date | Status |\n| --- | --- | --- |`
- **Confidence:** low
- **Manual review needed:** Yes
- **Snippet:** `| 10 | 0 | 4 | 5 | 1 | 0 | 8 | No |`

### Manual review checklist

- **Review alt text quality:** Review every meaningful image, chart, and infographic with a human subject-matter reviewer.
- **Confirm color is not the only way meaning is conveyed:** Check charts, tables, buttons, alerts, and status labels for text, pattern, or icon alternatives.
- **Confirm captions, transcripts, and audio descriptions:** Verify captions for video, transcripts for audio, and audio descriptions or equivalent alternatives when needed.

## Notes

AccessReady performs preflight checks and highlights likely issues. A human reviewer should confirm reading order, alt text quality, captions/transcripts, color meaning, PDF tag quality, and any client-specific requirements before publication.
