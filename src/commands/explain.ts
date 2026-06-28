// SEMA-GOVERNED: module sentryward.cli; explain command follows contratos/sentryward_cli.sema.
import { resolve } from "node:path";
import pc from "picocolors";
import type { Translator } from "../types/index.js";
import { readFindings } from "../core/storage.js";

export async function runExplainCommand(
  findingId: string,
  options: { t: Translator; root?: string },
): Promise<void> {
  const findings = await readFindings(resolve(options.root ?? process.cwd()));
  const finding = findings.find((candidate) => candidate.id === findingId || candidate.fingerprint === findingId);
  if (!finding) {
    console.log(pc.red(options.t("explain.notFound", { id: findingId })));
    process.exitCode = 2;
    return;
  }

  console.log(pc.bold(`${finding.id} · ${finding.title}`));
  console.log("");
  console.log(`${options.t("finding.file")}: ${finding.file}:${finding.line}`);
  console.log(`${options.t("finding.evidence")}: ${finding.evidence}`);
  console.log("");
  console.log(`${options.t("explain.what")}: ${finding.problem}`);
  console.log(`${options.t("report.impact")}: ${finding.impact}`);
  console.log(`${options.t("finding.recommendation")}: ${finding.recommendation}`);
  console.log(`${options.t("explain.autoFix")}: ${finding.autoFixSafe ? options.t("common.yes") : options.t("common.no")}`);
  console.log(`${options.t("explain.verify")}: ${options.t("fix.plan.rerunScan")}`);
}
