// SEMA-GOVERNED: module sentryward.scanner; finding model and dedupe follow contracts/sentryward_scanner.sema.
import { createHash } from "node:crypto";
import type { Finding, FindingCategory, Severity, Translator } from "../types/index.js";

interface CreateFindingInput {
  ruleId: string;
  category: FindingCategory;
  severity: Severity;
  confidence: number;
  file: string;
  line: number;
  evidence: string;
  fixAvailable?: boolean;
  autoFixSafe?: boolean;
  references?: string[];
  tags?: string[];
}

export function maskSecret(value: string): string {
  if (value.length <= 10) {
    return "[redacted]";
  }
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export function sanitizeEvidence(evidence: string): string {
  return evidence
    .replace(/sk-(proj-)?[A-Za-z0-9_-]{16,}/g, (match) => maskSecret(match))
    .replace(/sk_(live|test)_[A-Za-z0-9]{12,}/g, (match) => maskSecret(match))
    .replace(/whsec_[A-Za-z0-9]{12,}/g, (match) => maskSecret(match))
    .replace(/gh[pousr]_[A-Za-z0-9_]{16,}/g, (match) => maskSecret(match))
    .replace(/AKIA[0-9A-Z]{16}/g, (match) => maskSecret(match))
    .replace(/APP_USR-[A-Za-z0-9_-]{12,}/g, (match) => maskSecret(match))
    .replace(/postgres(ql)?:\/\/[^@\s]+@/gi, "postgres://[redacted]@")
    .replace(/mysql:\/\/[^@\s]+@/gi, "mysql://[redacted]@")
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, "[private key redacted]");
}

export function createFinding(t: Translator, input: CreateFindingInput): Finding {
  const evidence = sanitizeEvidence(input.evidence.trim());
  const fingerprint = createHash("sha256")
    .update(`${input.ruleId}:${input.file}:${input.line}:${evidence}`)
    .digest("hex")
    .slice(0, 16);
  const localized = (field: "title" | "problem" | "impact" | "recommendation") => {
    const key = `findings.${input.ruleId}.${field}`;
    const value = t(key);
    return value === key ? t(`findings.default.${field}`, { id: input.ruleId }) : value;
  };

  return {
    id: input.ruleId,
    ruleId: input.ruleId,
    title: localized("title"),
    category: input.category,
    severity: input.severity,
    confidence: input.confidence,
    file: input.file,
    line: Math.max(1, input.line),
    evidence,
    problem: localized("problem"),
    impact: localized("impact"),
    recommendation: localized("recommendation"),
    fixAvailable: input.fixAvailable ?? true,
    autoFixSafe: input.autoFixSafe ?? false,
    references: input.references ?? [],
    createdAt: new Date().toISOString(),
    fingerprint,
    tags: input.tags ?? [],
  };
}

export function dedupeFindings(findings: Finding[]): Finding[] {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    if (seen.has(finding.fingerprint)) {
      return false;
    }
    seen.add(finding.fingerprint);
    return true;
  });
}

export function lineNumberForIndex(content: string, index: number): number {
  return content.slice(0, Math.max(0, index)).split(/\r?\n/).length;
}
