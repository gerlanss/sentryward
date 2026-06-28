// SEMA-GOVERNED: module sentryward.scanner; scoring and severity policy follow contracts/sentryward_scanner.sema.
import type { Finding, Severity } from "../types/index.js";

export const severityWeight: Record<Severity, number> = {
  critical: 20,
  high: 10,
  medium: 4,
  low: 1,
  info: 0,
};

export const severityRank: Record<Severity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

export function calculateScore(findings: Finding[]): number {
  const penalty = findings.reduce((sum, finding) => sum + severityWeight[finding.severity], 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

export function hasHighOrCritical(findings: Finding[]): boolean {
  return findings.some((finding) => finding.severity === "critical" || finding.severity === "high");
}

export function severityAtLeast(severity: Severity, threshold: Severity): boolean {
  return severityRank[severity] >= severityRank[threshold];
}

export function countBySeverity(findings: Finding[]): Record<Severity, number> {
  return findings.reduce<Record<Severity, number>>(
    (counts, finding) => {
      counts[finding.severity] += 1;
      return counts;
    },
    { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
  );
}
