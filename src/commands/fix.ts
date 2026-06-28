// SEMA-GOVERNED: module sentryward.cli; fix command follows contratos/sentryward_cli.sema.
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import pc from "picocolors";
import type { Language, Translator } from "../types/index.js";
import { loadConfig } from "../core/config.js";
import { createFixPlan, renderFixPlan } from "../core/fixEngine.js";
import { printGate } from "../core/logger.js";
import { evaluateSemaGateForFinding } from "../core/semaGovernance.js";
import { readFindings } from "../core/storage.js";

export async function runFixCommand(
  findingId: string,
  options: {
    t: Translator;
    lang: Language;
    root?: string;
    governed?: boolean;
    sema?: boolean;
    requireContract?: boolean;
    apply?: boolean;
    yes?: boolean;
    patch?: boolean;
  },
): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const findings = await readFindings(root);
  const finding = findings.find((candidate) => candidate.id === findingId || candidate.fingerprint === findingId);
  if (!finding) {
    console.log(pc.red(options.t("explain.notFound", { id: findingId })));
    process.exitCode = 2;
    return;
  }

  const config = await loadConfig(root);
  const useSema = Boolean(options.governed || options.sema || config.sema.enabled || options.requireContract);
  const gate = await evaluateSemaGateForFinding({
    root,
    finding,
    enabled: useSema,
    contractMode: options.requireContract ? "required" : config.sema.contractMode,
    driftCheck: config.sema.driftCheck,
    impactMap: config.sema.impactMap,
    t: options.t,
  });
  printGate(options.t, gate);

  const plan = createFixPlan(options.t, finding, gate);
  console.log(renderFixPlan(options.t, plan));

  if (gate.gate === "blocked") {
    process.exitCode = 2;
    return;
  }

  if (options.patch) {
    const patchPath = resolve(root, `.sentryward-${finding.id}.patch`);
    await writeFile(patchPath, `# ${options.t("fix.patchPlaceholder")}\n# ${finding.id} ${finding.title}\n`, "utf8");
    console.log(pc.green(options.t("fix.patchCreated", { file: patchPath })));
    return;
  }

  if (options.apply) {
    if (!plan.canApply) {
      console.log(pc.yellow(options.t("fix.noAutoApply")));
      return;
    }
    if (!options.yes) {
      console.log(pc.yellow(options.t("fix.needYes")));
      process.exitCode = 2;
      return;
    }
  }

  console.log("");
  console.log("[1] " + options.t("fix.optionDiff"));
  console.log("[2] " + options.t("fix.optionApply"));
  console.log("[3] " + options.t("fix.optionPatch"));
  console.log("[4] " + options.t("fix.optionCancel"));
}
