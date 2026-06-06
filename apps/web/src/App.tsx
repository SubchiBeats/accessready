import { useMemo, useState } from "react";
import {
  scanProject,
  toCsvReport,
  toJsonReport,
  toMarkdownReport,
  type ProjectReport,
  type Severity
} from "@accessready/core";

const severityOrder: Severity[] = ["critical", "high", "medium", "low", "info"];

export function App() {
  const [report, setReport] = useState<ProjectReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFilesSelected(files: FileList | null) {
    if (!files?.length) return;
    setIsScanning(true);
    setError(null);
    try {
      const inputs = await Promise.all(
        Array.from(files).map(async (file) => ({
          fileName: file.name,
          mimeType: file.type,
          content: await file.arrayBuffer()
        }))
      );
      const nextReport = await scanProject(inputs, {
        projectName: "Browser Upload",
        includeManualChecks: true,
        standardProfile: "section-508-wcag-aa-preflight"
      });
      setReport(nextReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsScanning(false);
    }
  }

  const markdown = useMemo(() => (report ? toMarkdownReport(report) : ""), [report]);
  const json = useMemo(() => (report ? toJsonReport(report) : ""), [report]);
  const csv = useMemo(() => (report ? toCsvReport(report) : ""), [report]);

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">Section 508 preflight assistant</p>
          <h1 id="hero-title">Catch accessibility issues before content ships.</h1>
          <p className="hero-copy">
            Upload HTML, Markdown, DOCX, PPTX, or PDF files. AccessReady scans for common issues, explains why they matter, and creates a plain-English remediation checklist.
          </p>
          <div className="cta-row">
            <label className="upload-card">
              <span>Upload files</span>
              <input
                type="file"
                multiple
                accept=".html,.htm,.md,.markdown,.docx,.pptx,.pdf"
                onChange={(event) => onFilesSelected(event.target.files)}
              />
            </label>
            <a className="secondary-link" href="https://www.section508.gov/test/documents/" target="_blank" rel="noreferrer">Document testing guidance</a>
          </div>
        </div>
        <div className="hero-panel" aria-label="AccessReady product highlights">
          <strong>Built for comms teams</strong>
          <ul>
            <li>Plain-English fixes</li>
            <li>Manual review checklist</li>
            <li>JSON and Markdown reports</li>
            <li>Source-file-first workflow</li>
          </ul>
        </div>
      </section>

      {isScanning && <p className="status">Scanning files…</p>}
      {error && <p className="error" role="alert">{error}</p>}

      {report && (
        <section className="report" aria-labelledby="report-title">
          <div className="report-header">
            <div>
              <p className="eyebrow">Report</p>
              <h2 id="report-title">{report.projectName}</h2>
            </div>
            <div className="download-row">
              <DownloadButton fileName="accessready-report.md" text={markdown} label="Download Markdown" />
              <DownloadButton fileName="accessready-report.json" text={json} label="Download JSON" />
              <DownloadButton fileName="accessready-remediation-log.csv" text={csv} label="Download CSV log" />
            </div>
          </div>

          <div className="summary-grid" aria-label="Report totals">
            {severityOrder.map((severity) => (
              <div className="metric" key={severity}>
                <span>{severity}</span>
                <strong>{report.totals[severity]}</strong>
              </div>
            ))}
            <div className="metric">
              <span>manual checks</span>
              <strong>{report.totals.manualChecks}</strong>
            </div>
          </div>

          <div className="results-list">
            {report.results.map((result) => (
              <article className="result-card" key={result.fileName}>
                <div className="result-title-row">
                  <h3>{result.fileName}</h3>
                  <span className={result.summary.passedAutomatedChecks ? "badge pass" : "badge needs-review"}>
                    {result.summary.passedAutomatedChecks ? "Automated pass" : "Needs review"}
                  </span>
                </div>
                <p className="muted">{result.fileType.toUpperCase()} · {result.summary.totalFindings} findings · {result.summary.manualChecks} manual checks</p>
                {result.findings.length > 0 ? (
                  <ul className="findings">
                    {result.findings.slice(0, 8).map((finding) => (
                      <li key={finding.id}>
                        <span className={`severity ${finding.severity}`}>{finding.severity}</span>
                        <div>
                          <strong>{finding.title}</strong>
                          <p>{finding.message}</p>
                          <p className="fix">Fix: {finding.howToFix}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No automated findings detected. Complete the manual review checklist before publishing.</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function DownloadButton({ fileName, text, label }: { fileName: string; text: string; label: string }) {
  function download() {
    const mime = fileName.endsWith(".json") ? "application/json" : fileName.endsWith(".csv") ? "text/csv" : "text/markdown";
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <button type="button" className="button" onClick={download}>{label}</button>;
}
