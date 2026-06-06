export type SupportedFileType = "html" | "markdown" | "docx" | "pptx" | "pdf" | "unknown";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type Confidence = "high" | "medium" | "low";

export interface ScanOptions {
  projectName?: string;
  includeManualChecks?: boolean;
  standardProfile?: "section-508-wcag-aa-preflight" | "wcag-2.1-aa" | "wcag-2.2-aa";
}

export interface FileInput {
  fileName: string;
  content: string | ArrayBuffer | Uint8Array;
  mimeType?: string;
}

export interface A11yFinding {
  id: string;
  ruleId: string;
  title: string;
  severity: Severity;
  wcag: readonly string[];
  section508: readonly string[];
  location: string;
  message: string;
  whyItMatters: string;
  howToFix: string;
  exampleFix?: string;
  confidence: Confidence;
  manualCheck: boolean;
  snippet?: string;
}

export interface ManualCheck {
  id: string;
  title: string;
  reason: string;
  suggestedMethod: string;
  appliesTo: SupportedFileType[];
}

export interface ScanSummary {
  totalFindings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  manualChecks: number;
  passedAutomatedChecks: boolean;
}

export interface ScanResult {
  fileName: string;
  fileType: SupportedFileType;
  scannedAt: string;
  standardProfile: string;
  summary: ScanSummary;
  findings: A11yFinding[];
  manualChecks: ManualCheck[];
}

export interface ProjectReport {
  projectName: string;
  generatedAt: string;
  standardProfile: string;
  totals: ScanSummary;
  results: ScanResult[];
}
