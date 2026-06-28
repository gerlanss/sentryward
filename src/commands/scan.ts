// SEMA-GOVERNED: module sentryward.scanner; scan command follows contratos/sentryward_scanner.sema.
import { resolve } from "node:path";
import type { Language, Translator } from "../types/index.js";
import { printFinding, printScanSummary } from "../core/logger.js";
import { scanProject } from "../core/scanner.js";
import { hasHighOrCritical } from "../core/severity.js";

export async function runScanCommand(
  target: string,
  options: { lang: Language; t: Translator; contractCheck?: boolean },
): Promise<void> {
  const result = await scanProject({
    target: resolve(target),
    storageRoot: process.cwd(),
    lang: options.lang,
    contractCheck: Boolean(options.contractCheck),
  });
  printScanSummary(options.t, result.project, result.findings, result.score);
  for (const finding of result.findings) {
    printFinding(options.t, finding);
  }
  process.exitCode = hasHighOrCritical(result.findings) ? 1 : 0;
}
