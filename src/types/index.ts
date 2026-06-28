// SEMA-GOVERNED: module sentryward.cli + sentryward.scanner; contracts/ govern CLI and scanner behavior.
export type Language = "en" | "pt-BR" | "es";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type FindingCategory =
  | "secrets"
  | "browserExposure"
  | "routes"
  | "auth"
  | "database"
  | "uploads"
  | "cors"
  | "sessions"
  | "webhooks"
  | "docker"
  | "ci"
  | "dependencies"
  | "promptInjection"
  | "supabase"
  | "firebase"
  | "sema";

export interface Finding {
  id: string;
  title: string;
  category: FindingCategory;
  severity: Severity;
  confidence: number;
  file: string;
  line: number;
  evidence: string;
  problem: string;
  impact: string;
  recommendation: string;
  fixAvailable: boolean;
  autoFixSafe: boolean;
  references: string[];
  createdAt: string;
  fingerprint: string;
  ruleId: string;
  tags?: string[];
}

export interface FileContext {
  path: string;
  relativePath: string;
  content: string;
  lines: string[];
}

export interface GuardContext {
  root: string;
  language: Language;
  t: Translator;
  semaContracts: string[];
  contractCheck: boolean;
}

export interface Guard {
  name: FindingCategory;
  run(files: FileContext[], context: GuardContext): Finding[];
}

export interface ProjectInfo {
  name: string;
  root: string;
  stack: string[];
}

export interface ScanResult {
  project: ProjectInfo;
  findings: Finding[];
  score: number;
  generatedAt: string;
  scannedFiles: number;
}

export interface WatchConfig {
  enabled: boolean;
  alertThreshold: Severity;
  debounceMs: number;
}

export interface WardConfig {
  version: 1;
  language: Language;
  watch: WatchConfig;
  guards: Record<FindingCategory, boolean>;
  report: {
    defaultFormat: "html" | "json";
  };
  sema: {
    enabled: boolean;
    contractMode: "optional" | "required";
    driftCheck: boolean;
    impactMap: boolean;
  };
}

export interface SemaGateResult {
  enabled: boolean;
  gate: "not_requested" | "passed" | "passed_with_constraints" | "blocked" | "unavailable";
  contractMode: "optional" | "required";
  applicableContract?: string;
  projectContextLoaded: boolean;
  driftCompleted: boolean;
  impactCompleted: boolean;
  constraints: string[];
  reason?: string;
  raw?: {
    drift?: unknown;
    impact?: unknown;
    inspect?: unknown;
  };
}

export interface FixPlan {
  finding: Finding;
  gate: SemaGateResult;
  plan: string[];
  filesToChange: string[];
  patch?: string;
  canApply: boolean;
  manualSteps: string[];
}

export type Translator = (key: string, params?: Record<string, string | number>) => string;

export interface CommandGlobalOptions {
  lang?: Language;
  governed?: boolean;
  sema?: boolean;
  contractCheck?: boolean;
  path?: string;
}
