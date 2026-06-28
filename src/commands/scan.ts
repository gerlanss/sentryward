// SEMA-GOVERNED: module sentryward.scanner; scan command follows contratos/sentryward_scanner.sema.
import { resolve } from "node:path";
import type { Language, Translator } from "../types/index.js";
import { printScanDashboard } from "../core/logger.js";
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
  printScanDashboard(options.t, result);
  process.exitCode = hasHighOrCritical(result.findings) ? 1 : 0;
}
