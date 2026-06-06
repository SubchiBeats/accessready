import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type Ref } from "react";
import {
  scanProject,
  toCsvReport,
  toEvidencePack,
  toJsonReport,
  toMarkdownReport,
  deliveryRecommendation,
  type A11yFinding,
  type ProjectReport,
  type Severity
} from "@accessready/core";
import { DEMO_REPORT, DEMO_DELIVERABLE_NAME } from "./demoData.js";

type FindingStatus = "open" | "in-progress" | "fixed" | "manual";
const STATUS_KEY = "accessready.demo.statuses.v1";
const STATUS_LABELS: Record<FindingStatus, string> = {
  "open": "Open",
  "in-progress": "In progress",
  "fixed": "Fixed",
  "manual": "Manual review"
};

export function App() {
  const [uploadedReport, setUploadedReport] = useState<ProjectReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, FindingStatus>>(() => loadStatuses());
  const [showEvidence, setShowEvidence] = useState(false);
  const demoRef = useRef<HTMLElement>(null);
  const evidenceRef = useRef<HTMLElement>(null);

  useEffect(() => { try { localStorage.setItem(STATUS_KEY, JSON.stringify(statuses)); } catch { /* ignore quota */ } }, [statuses]);

  const setStatus = useCallback((id: string, s: FindingStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: s }));
  }, []);

  const allFindings = useMemo(() => flattenFindings(DEMO_REPORT), []);
  const statusCounts = useMemo(() => countStatuses(allFindings, statuses), [allFindings, statuses]);

  const onFilesSelected = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    setIsScanning(true);
    setError(null);
    try {
      const inputs = await Promise.all(Array.from(files).map(async (f) => ({
        fileName: f.name, mimeType: f.type, content: await f.arrayBuffer()
      })));
      const report = await scanProject(inputs, {
        projectName: "Your deliverable",
        includeManualChecks: true,
        standardProfile: "section-508-wcag-aa-preflight"
      });
      setUploadedReport(report);
      setTimeout(() => demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsScanning(false);
    }
  }, []);

  const activeReport = uploadedReport ?? DEMO_REPORT;
  const isLiveScan = uploadedReport !== null;

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Header />
      <main id="main">
        <Hero
          onScroll={() => demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          onEvidence={() => { setShowEvidence(true); setTimeout(() => evidenceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }}
        />
        <FeatureCards />
        <DemoSection
          ref={demoRef}
          report={activeReport}
          isLive={isLiveScan}
          isScanning={isScanning}
          error={error}
          statuses={statuses}
          setStatus={setStatus}
          onFilesSelected={onFilesSelected}
          onResetToDemo={() => { setUploadedReport(null); setError(null); }}
          statusCounts={statusCounts}
        />
        <EvidencePackPreview
          ref={evidenceRef}
          report={activeReport}
          isLive={isLiveScan}
          opened={showEvidence}
          onOpen={() => setShowEvidence(true)}
        />
        <WhyNotJustScanner />
        <BuiltForComms />
        <GapAccessReadyFills />
        <Architecture />
        <Trust />
        <Roadmap />
        <Footer />
      </main>
    </>
  );
}

/* ------------------------------- HEADER ---------------------------------- */

function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="container header-row">
        <a className="brand" href="#main" aria-label="AccessReady home">
          <ShieldMark />
          <span>AccessReady</span>
        </a>
        <nav aria-label="Primary" className="site-nav">
          <a href="#demo">Demo</a>
          <a href="#evidence">Evidence Pack</a>
          <a href="#architecture">How it works</a>
          <a href="#roadmap">Roadmap</a>
          <a href="https://github.com/SubchiBeats/accessready" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
  );
}

function ShieldMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M14 14l18-7 18 7v15c0 14-7.5 24.5-18 32-10.5-7.5-18-18-18-32V14z" fill="#173b73"/>
      <path d="M24 34l6 6 13-17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* -------------------------------- HERO ----------------------------------- */

function Hero({ onScroll, onEvidence }: { onScroll: () => void; onEvidence: () => void }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">Section 508 preflight assistant</p>
          <h1 id="hero-title">Know if your deliverable is AccessReady before you send it.</h1>
          <p className="lead">
            AccessReady is a Section 508 preflight assistant for communications teams. Scan common issues,
            organize remediation, and export a client-ready evidence package before publishing or delivery.
          </p>
          <div className="cta-row">
            <button type="button" className="button primary" onClick={onScroll}>Run a sample preflight</button>
            <button type="button" className="button secondary" onClick={onEvidence}>View evidence pack example</button>
          </div>
          <p className="disclaimer">
            AccessReady supports accessibility review workflows. It does not guarantee legal compliance and
            should be paired with manual review.
          </p>
        </div>
        <aside className="hero-panel" aria-labelledby="hero-panel-title">
          <strong id="hero-panel-title">For the team handing off the deliverable</strong>
          <ul>
            <li>Catch issues before the handoff</li>
            <li>Plain-English remediation guidance</li>
            <li>Client-ready evidence package</li>
            <li>Hybrid automated + manual review</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

/* ----------------------------- FEATURE CARDS ----------------------------- */

function FeatureCards() {
  const items = [
    { title: "Deliverable Gate", body: "Upload or scan HTML, Markdown, DOCX, PPTX, and PDF files to identify common accessibility risks before final delivery." },
    { title: "Plain-English Fix Guidance", body: "Translate technical accessibility findings into practical next steps for writers, designers, developers, and project managers." },
    { title: "508 Evidence Pack", body: "Export a structured review package with findings, manual checks, alt text notes, remediation status, and delivery recommendations." }
  ];
  return (
    <section className="section" aria-labelledby="features-title">
      <div className="container">
        <h2 id="features-title">What AccessReady does</h2>
        <div className="card-grid three">
          {items.map((it) => (
            <article className="feature-card" key={it.title}>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ DEMO PANEL ------------------------------- */

interface DemoProps {
  report: ProjectReport;
  isLive: boolean;
  isScanning: boolean;
  error: string | null;
  statuses: Record<string, FindingStatus>;
  setStatus: (id: string, s: FindingStatus) => void;
  onFilesSelected: (files: FileList | null) => void;
  onResetToDemo: () => void;
  statusCounts: Record<FindingStatus, number>;
}

const DemoSection = forwardable<HTMLElement, DemoProps>(function DemoSection(
  { report, isLive, isScanning, error, statuses, setStatus, onFilesSelected, onResetToDemo, statusCounts },
  ref
) {
  const t = report.totals;
  const verdict = deliveryRecommendation(report);
  const findings = flattenFindings(report);

  return (
    <section className="section demo" id="demo" aria-labelledby="demo-title" ref={ref}>
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow">Interactive preflight</p>
            <h2 id="demo-title">{isLive ? "Your scan" : `Sample: ${DEMO_DELIVERABLE_NAME}`}</h2>
            <p className="muted">
              {isLive
                ? "Live scan of the files you uploaded. Statuses persist in this browser only."
                : "A realistic communications deliverable with mixed file types and common 508 risks."}
            </p>
          </div>
          <div className="demo-actions">
            <label className="button primary upload-btn">
              <span>{isScanning ? "Scanning…" : "Upload your own files"}</span>
              <input
                type="file" multiple
                accept=".html,.htm,.md,.markdown,.docx,.pptx,.pdf"
                onChange={(e) => onFilesSelected(e.target.files)}
                aria-label="Upload files for accessibility preflight"
              />
            </label>
            {isLive && (
              <button type="button" className="button secondary" onClick={onResetToDemo}>
                Show sample again
              </button>
            )}
          </div>
        </header>

        {error && <p className="alert error" role="alert">{error}</p>}

        <div className={`verdict ${t.critical + t.high > 0 ? "needs-review" : t.totalFindings ? "review" : "ok"}`} role="status">
          <strong>Delivery recommendation:</strong> {verdict}
        </div>

        <div className="summary-grid" aria-label="Scan totals">
          <Metric label="Files" value={report.results.length} />
          <Metric label="Findings" value={t.totalFindings} />
          <Metric label="High" value={t.high} tone="bad" />
          <Metric label="Medium" value={t.medium} tone="warn" />
          <Metric label="Low" value={t.low} tone="info" />
          <Metric label="Manual" value={t.manualChecks} tone="dark" />
        </div>

        <div className="remediation-bar" aria-label="Remediation status">
          {(["open", "in-progress", "fixed", "manual"] as FindingStatus[]).map((s) => (
            <span className={`pill pill-${s}`} key={s}>
              <strong>{statusCounts[s]}</strong> {STATUS_LABELS[s]}
            </span>
          ))}
        </div>

        <ul className="findings-list" aria-label="Findings">
          {findings.map(({ file, finding }) => (
            <FindingCard
              key={finding.id}
              file={file}
              finding={finding}
              status={statuses[finding.id] ?? (finding.manualCheck ? "manual" : "open")}
              onChange={(s) => setStatus(finding.id, s)}
            />
          ))}
        </ul>

        <p className="footnote">
          Statuses are saved in your browser only (no server, no account). Use the Evidence Pack section below to export
          a delivery-ready package.
        </p>
      </div>
    </section>
  );
});

function Metric({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "bad" | "warn" | "info" | "dark" }) {
  return (
    <div className={`metric tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FindingCard({
  file, finding, status, onChange
}: { file: string; finding: A11yFinding; status: FindingStatus; onChange: (s: FindingStatus) => void }) {
  const selectId = `status-${finding.id}`;
  return (
    <li className={`finding status-${status}`}>
      <div className="finding-head">
        <span className={`severity sev-${finding.severity}`}>{finding.severity}</span>
        <div>
          <h3>{finding.title}</h3>
          <p className="finding-meta">
            <code>{file}</code> · {finding.location}
            {finding.wcag.length ? <> · <span title="WCAG">WCAG {finding.wcag[0]}</span></> : null}
          </p>
        </div>
        <div className="finding-status">
          <label htmlFor={selectId} className="visually-hidden">Status for {finding.title}</label>
          <select id={selectId} value={status} onChange={(e) => onChange(e.target.value as FindingStatus)}>
            {(["open", "in-progress", "fixed", "manual"] as FindingStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>
      <p>{finding.message}</p>
      <p className="fix"><strong>Fix:</strong> {finding.howToFix}</p>
    </li>
  );
}

/* --------------------------- EVIDENCE PACK ------------------------------- */

const EvidencePackPreview = forwardable<HTMLElement, {
  report: ProjectReport; isLive: boolean; opened: boolean; onOpen: () => void;
}>(function EvidencePackPreview({ report, isLive, opened, onOpen }, ref) {
  const markdown = useMemo(() => toEvidencePack(report, {
    deliverableName: isLive ? "Your deliverable" : DEMO_DELIVERABLE_NAME,
    reviewer: "",
    organization: ""
  }), [report, isLive]);

  const verdict = deliveryRecommendation(report);
  const altFindings = report.results.flatMap((r) => r.findings.filter((f) => f.ruleId === "AR-IMG-ALT").map((f) => ({ file: r.fileName, finding: f })));

  return (
    <section className="section evidence" id="evidence" aria-labelledby="evidence-title" ref={ref}>
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow">Client-ready documentation</p>
            <h2 id="evidence-title">508 Evidence Pack</h2>
            <p className="muted">A structured review package — methodology, findings, manual checks, alt text register, remaining risks, and reviewer sign-off.</p>
          </div>
          <div className="demo-actions">
            <button type="button" className="button primary" onClick={() => downloadText(`AccessReady-evidence-pack.md`, markdown, "text/markdown")}>
              Export sample report
            </button>
            <button type="button" className="button secondary" onClick={() => downloadText(`AccessReady-findings.csv`, toCsvReport(report), "text/csv")}>
              Export CSV log
            </button>
            <button type="button" className="button secondary" onClick={() => downloadText(`AccessReady-report.json`, toJsonReport(report), "application/json")}>
              Export JSON
            </button>
          </div>
        </header>

        <div className="card-grid pack">
          <article className="pack-card">
            <h3>Executive summary</h3>
            <p>{report.results.length} files reviewed. {report.totals.totalFindings} automated finding(s); {report.totals.manualChecks} manual check(s).</p>
            <p className="muted small">Profile: {report.standardProfile}. Evaluation: hybrid (automated + manual).</p>
          </article>
          <article className="pack-card">
            <h3>Final delivery recommendation</h3>
            <p>{verdict}</p>
          </article>
          <article className="pack-card">
            <h3>Files reviewed</h3>
            <ul className="bare">
              {report.results.map((r) => <li key={r.fileName}><code>{r.fileName}</code> <span className="muted small">· {r.fileType}</span></li>)}
            </ul>
          </article>
          <article className="pack-card">
            <h3>Alt text register</h3>
            {altFindings.length === 0
              ? <p className="muted">No missing alt detected by automation. Confirm every meaningful image has accurate alt text.</p>
              : <ul className="bare">{altFindings.map(({ file, finding }) => <li key={finding.id}><code>{file}</code> · {finding.location} — <em>add description</em></li>)}</ul>}
          </article>
          <article className="pack-card">
            <h3>Reviewer sign-off</h3>
            <table className="signoff">
              <thead><tr><th>Role</th><th>Name</th><th>Decision</th></tr></thead>
              <tbody>
                <tr><td>Preparer</td><td className="ghost">—</td><td className="ghost">—</td></tr>
                <tr><td>Accessibility reviewer</td><td className="ghost">—</td><td className="ghost">Approve / Return</td></tr>
                <tr><td>Delivery approver</td><td className="ghost">—</td><td className="ghost">Approve / Hold</td></tr>
              </tbody>
            </table>
          </article>
          <article className="pack-card">
            <h3>Remaining risks</h3>
            <ul className="bare">
              <li>{report.totals.critical + report.totals.high} high-severity automated finding(s) outstanding</li>
              <li>{report.totals.manualChecks} manual check(s) pending</li>
              <li>Automated preflight cannot confirm full PDF/UA conformance</li>
            </ul>
          </article>
        </div>

        {opened && (
          <details className="evidence-raw" open>
            <summary>Preview generated Markdown</summary>
            <pre><code>{markdown}</code></pre>
          </details>
        )}
        {!opened && (
          <p className="footnote">
            <button type="button" className="button-link" onClick={onOpen}>Show the generated Markdown</button> — the same output you get from
            the CLI (<code>accessready scan ... --format evidence-pack</code>) or the export button above.
          </p>
        )}
      </div>
    </section>
  );
});

/* ----------------------- WHY NOT JUST A SCANNER ------------------------- */

function WhyNotJustScanner() {
  return (
    <section className="section banded" aria-labelledby="why-title">
      <div className="container narrow">
        <h2 id="why-title">Why not just use a scanner?</h2>
        <p className="lead">
          Scanners are useful, but they are not the whole workflow. AccessReady focuses on the handoff: what needs
          fixing, who needs to review it, what evidence was captured, and whether the deliverable is ready to send.
        </p>
      </div>
    </section>
  );
}

/* ------------------------ BUILT FOR COMMS WORK -------------------------- */

function BuiltForComms() {
  const examples = [
    "Reports", "Fact sheets", "Webinar pages", "Slide decks",
    "Newsletters", "Social graphics", "Event flyers", "PDFs",
    "Markdown / HTML content", "Client deliverable packages"
  ];
  return (
    <section className="section" aria-labelledby="comms-title">
      <div className="container">
        <h2 id="comms-title">Built for communications workflows</h2>
        <p className="lead">Designed for the people who publish the content, not just the people who code it.</p>
        <ul className="chip-list" aria-label="Content types supported">
          {examples.map((e) => <li key={e} className="chip">{e}</li>)}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------ THE GAP IT FILLS ------------------------------ */

function GapAccessReadyFills() {
  return (
    <section className="section banded" aria-labelledby="gap-title">
      <div className="container narrow">
        <h2 id="gap-title">The gap AccessReady fills</h2>
        <p className="lead">
          Most accessibility tools focus on detection or deep remediation. AccessReady focuses on the moment teams
          actually feel pain: right before delivery.
        </p>
        <p>It helps answer: <em>What did we check? What needs fixing? What requires manual review? What evidence can we give the client?</em></p>
      </div>
    </section>
  );
}

/* ----------------------------- ARCHITECTURE ----------------------------- */

function Architecture() {
  const steps: { name: string; body: string }[] = [
    { name: "Create", body: "Writers and designers create content." },
    { name: "Preflight", body: "AccessReady checks common risks." },
    { name: "Remediate", body: "Team fixes issues with plain-English guidance." },
    { name: "Review", body: "Manual checks confirm what automation can't." },
    { name: "Evidence Pack", body: "Documentation is exported." },
    { name: "Deliver", body: "Team sends content with more confidence." }
  ];
  return (
    <section className="section" id="architecture" aria-labelledby="arch-title">
      <div className="container">
        <h2 id="arch-title">How AccessReady fits into the workflow</h2>
        <ol className="flow" aria-label="AccessReady workflow steps">
          {steps.map((s, i) => (
            <li className="flow-step" key={s.name}>
              <span className="flow-num" aria-hidden="true">{i + 1}</span>
              <div>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------- TRUST --------------------------------- */

function Trust() {
  const points = [
    "Supports automated, manual, and hybrid review workflows",
    "Helps document methodology and findings",
    "Encourages human review for subjective checks",
    "Designed around common 508 / WCAG issue patterns",
    "Does not replace expert audit, PDF remediation, VPAT / ACR creation, or legal review"
  ];
  const links = [
    { label: "Section508.gov — Testing Overview", href: "https://www.section508.gov/test/testing-overview/" },
    { label: "Section508.gov — Essential Elements of a Test Report", href: "https://www.section508.gov/test/elements-of-an-accessibility-test-report/" },
    { label: "Section508.gov — ACR overview", href: "https://www.section508.gov/sell/acr/" },
    { label: "ADA Title II Web Rule overview", href: "https://www.ada.gov/resources/2024-03-08-web-rule/" }
  ];
  return (
    <section className="section banded" aria-labelledby="trust-title">
      <div className="container">
        <h2 id="trust-title">Grounded in real accessibility workflows</h2>
        <div className="card-grid two">
          <ul className="bare check-list">
            {points.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <div>
            <h3 className="h-quiet">Reference sources</h3>
            <ul className="bare">
              {links.map((l) => <li key={l.href}><a href={l.href} rel="noreferrer">{l.label}</a></li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ ROADMAP --------------------------------- */

function Roadmap() {
  const cols = [
    { title: "Now", items: ["HTML / Markdown scanning", "DOCX / PPTX preflight checks", "PDF metadata / tagging checks", "Markdown / JSON / CSV reports", "Sample 508 Evidence Pack"] },
    { title: "Next", items: ["Drag-and-drop folder scanning", "Better PDF structure analysis", "Alt text register builder", "Project-level remediation tracker", "GitHub Action PR comments"] },
    { title: "Future", items: ["Browser extension", "Google Docs / Drive workflow", "Microsoft Office add-in", "AI-assisted alt text drafts with human approval", "Client portal", "ACR / VPAT evidence support (not a replacement)"] }
  ];
  return (
    <section className="section" id="roadmap" aria-labelledby="roadmap-title">
      <div className="container">
        <h2 id="roadmap-title">Roadmap</h2>
        <div className="card-grid three">
          {cols.map((c) => (
            <article className="feature-card" key={c.title}>
              <h3>{c.title}</h3>
              <ul className="bare">{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FOOTER --------------------------------- */

function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-row">
        <div>
          <strong>AccessReady</strong>
          <p className="muted small">MIT licensed. Not legal compliance certification.</p>
        </div>
        <nav aria-label="Footer">
          <a href="https://github.com/SubchiBeats/accessready">GitHub</a>
          <a href="https://github.com/SubchiBeats/accessready/blob/main/docs/CASE_STUDY.md">Case study</a>
          <a href="https://github.com/SubchiBeats/accessready/issues">Report an issue</a>
        </nav>
      </div>
    </footer>
  );
}

/* ------------------------------ HELPERS --------------------------------- */

function flattenFindings(report: ProjectReport): { file: string; finding: A11yFinding }[] {
  const rank: Record<Severity, number> = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
  const out: { file: string; finding: A11yFinding }[] = [];
  for (const r of report.results) for (const f of r.findings) out.push({ file: r.fileName, finding: f });
  out.sort((a, b) => rank[b.finding.severity] - rank[a.finding.severity]);
  return out;
}

function countStatuses(
  findings: { finding: A11yFinding }[],
  statuses: Record<string, FindingStatus>
): Record<FindingStatus, number> {
  const counts: Record<FindingStatus, number> = { "open": 0, "in-progress": 0, "fixed": 0, "manual": 0 };
  for (const { finding } of findings) {
    const s = statuses[finding.id] ?? (finding.manualCheck ? "manual" : "open");
    counts[s] += 1;
  }
  return counts;
}

function loadStatuses(): Record<string, FindingStatus> {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STATUS_KEY) : null;
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function downloadText(fileName: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = fileName; a.click();
  URL.revokeObjectURL(url);
}

// Tiny helper so each section can accept a ref without the React.forwardRef boilerplate.
function forwardable<T, P>(render: (props: P, ref: Ref<T>) => JSX.Element) {
  return forwardRef<T, P>(render as any);
}
