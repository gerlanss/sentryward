// SEMA-GOVERNED: module sentryward.cli; status command follows contratos/sentryward_cli.sema.
import { resolve } from "node:path";
import pc from "picocolors";
import type { Translator } from "../types/index.js";
import { readScanResult } from "../core/storage.js";
import { printScanSummary } from "../core/logger.js";

export async function runStatusCommand(options: { t: Translator; root?: string }): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const result = await readScanResult(root);
  if (!result) {
    console.log(pc.yellow(options.t("status.noScan")));
    return;
  }
  printScanSummary(options.t, result.project, result.findings, result.score);
}
