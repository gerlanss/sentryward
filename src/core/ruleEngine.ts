// SEMA-GOVERNED: module sentryward.scanner; guard orchestration follows contratos/sentryward_scanner.sema.
import type { FileContext, Finding, Guard, GuardContext, WardConfig } from "../types/index.js";
import { dedupeFindings } from "./finding.js";

export function runGuards(
  guards: Guard[],
  files: FileContext[],
  context: GuardContext,
  config: WardConfig,
): Finding[] {
  const findings = guards.flatMap((guard) => {
    if (!config.guards[guard.name]) {
      return [];
    }
    return guard.run(files, context);
  });

  return dedupeFindings(findings).sort((a, b) => {
    const severityOrder = ["critical", "high", "medium", "low", "info"];
    return severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
  });
}
