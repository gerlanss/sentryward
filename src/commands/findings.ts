// SEMA-GOVERNED: module sentryward.cli; findings command follows contratos/sentryward_cli.sema.
import { resolve } from "node:path";
import pc from "picocolors";
import type { Translator } from "../types/index.js";
import { printFinding } from "../core/logger.js";
import { readFindings } from "../core/storage.js";

export async function runFindingsCommand(options: { t: Translator; root?: string }): Promise<void> {
  const findings = await readFindings(resolve(options.root ?? process.cwd()));
  if (findings.length === 0) {
    console.log(pc.green(options.t("watch.nothing")));
    return;
  }
  for (const finding of findings) {
    printFinding(options.t, finding);
  }
}
