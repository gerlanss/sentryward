// SEMA-GOVERNED: module sentryward.cli; watch behavior follows contratos/sentryward_cli.sema.
import { resolve } from "node:path";
import chokidar from "chokidar";
import pc from "picocolors";
import { loadConfig, resolveLanguage } from "./config.js";
import { loadTranslator } from "./i18n.js";
import { printFinding, printScanSummary } from "./logger.js";
import { severityAtLeast } from "./severity.js";
import { scanProject } from "./scanner.js";

export async function startWatcher(rootInput: string, options: { sema?: boolean; governed?: boolean } = {}) {
  const root = resolve(rootInput);
  const config = await loadConfig(root);
  const t = loadTranslator(resolveLanguage(config));
  const seen = new Set<string>();

  console.log(pc.green(`$ ward`));
  console.log("");
  console.log(pc.bold("SentryWard"));
  console.log(t("watch.started"));
  console.log("");
  console.log(`${t("sema.governance")}: ${options.sema || options.governed ? t("common.enabled") : t("common.disabled")}`);
  console.log(`${t("sema.contractMode")}: ${config.sema.contractMode}`);
  console.log(`${t("sema.driftCheck")}: ${config.sema.driftCheck ? t("common.enabled") : t("common.disabled")}`);
  console.log(`${t("sema.impactMap")}: ${config.sema.impactMap ? t("common.enabled") : t("common.disabled")}`);

  const watcher = chokidar.watch(root, {
    ignored: /(^|[\\/])(\.git|node_modules|dist|build|coverage|\.next|\.venv|vendor)([\\/]|$)/,
    ignoreInitial: true,
  });

  let timer: NodeJS.Timeout | undefined;
  const changed = new Set<string>();

  async function flush() {
    const files = [...changed];
    changed.clear();
    const result = await scanProject({
      root,
      changedFiles: files,
      contractCheck: Boolean(options.sema || options.governed),
    });
    const newAlerts = result.findings.filter(
      (finding) => !seen.has(finding.fingerprint) && severityAtLeast(finding.severity, config.watch.alertThreshold),
    );
    for (const finding of result.findings) {
      seen.add(finding.fingerprint);
    }
    if (newAlerts.length === 0) {
      console.log(pc.green(t("watch.noNewIssues")));
      return;
    }
    printScanSummary(t, result.project, result.findings, result.score);
    for (const alert of newAlerts) {
      printFinding(t, alert);
    }
  }

  watcher.on("all", (_event, filePath) => {
    changed.add(filePath);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void flush().catch((error) => console.error(error)), config.watch.debounceMs);
  });

  return watcher;
}
