// SEMA-GOVERNED: module sentryward.cli; watch behavior follows contratos/sentryward_cli.sema.
import { resolve } from "node:path";
import chokidar from "chokidar";
import pc from "picocolors";
import { loadConfig, resolveLanguage } from "./config.js";
import { loadTranslator } from "./i18n.js";
import { printScanDashboard, printWatchIntro } from "./logger.js";
import { detectProject } from "./projectDetector.js";
import { severityAtLeast } from "./severity.js";
import { scanProject } from "./scanner.js";
import type { Language } from "../types/index.js";

export interface WatchSession {
  close(): Promise<void>;
}

export async function startWatcher(rootInput: string, options: { sema?: boolean; governed?: boolean; lang?: Language } = {}) {
  const root = resolve(rootInput);
  const config = await loadConfig(root);
  const lang = resolveLanguage(config, options.lang);
  const t = loadTranslator(lang);
  const seen = new Set<string>();

  console.log(pc.green(`$ ward`));
  printWatchIntro(t, await detectProject(root), options);
  console.log(`${t("sema.governance")}: ${options.sema || options.governed ? t("common.enabled") : t("common.disabled")}`);

  const watcher = chokidar.watch(root, {
    ignored: /(^|[\\/])(\.git|\.sentryward|node_modules|dist|build|coverage|\.next|\.venv|vendor)([\\/]|$)/,
    ignoreInitial: true,
  });

  let timer: NodeJS.Timeout | undefined;
  const changed = new Set<string>();
  let closed = false;

  async function flush() {
    if (closed) return;
    const files = [...changed];
    changed.clear();
    const result = await scanProject({
      root,
      changedFiles: files,
      lang,
      contractCheck: Boolean(options.sema || options.governed),
    });
    if (closed) return;
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
    printScanDashboard(t, { ...result, findings: newAlerts });
  }

  watcher.on("all", (_event, filePath) => {
    if (closed) return;
    changed.add(filePath);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void flush().catch((error) => console.error(error)), config.watch.debounceMs);
  });

  return {
    async close() {
      closed = true;
      if (timer) clearTimeout(timer);
      changed.clear();
      await watcher.close();
    },
  };
}
