// SEMA-GOVERNED: module sentryward.cli; watch behavior follows contratos/sentryward_cli.sema.
import { homedir } from "node:os";
import { resolve } from "node:path";
import chokidar from "chokidar";
import pc from "picocolors";
import { loadConfig, resolveLanguage } from "./config.js";
import { loadTranslator } from "./i18n.js";
import { printScanDashboard, printWatchHome } from "./logger.js";
import { detectProject } from "./projectDetector.js";
import { severityAtLeast } from "./severity.js";
import { scanProject } from "./scanner.js";
import type { Language, ProjectInfo } from "../types/index.js";

export interface WatchSession {
  watchEnabled: boolean;
  setLanguage(language: Language): void;
  close(): Promise<void>;
}

const IGNORED_WATCH_SEGMENTS = new Set([
  ".git",
  ".sentryward",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".venv",
  "vendor",
]);

const RESTRICTED_WINDOWS_PATH_PARTS = [
  "$recycle.bin",
  "ambiente de impressão",
  "ambiente de rede",
  "application data",
  "configurações locais",
  "cookies",
  "dados de aplicativos",
  "documents and settings",
  "local settings",
  "menu iniciar",
  "meus documentos",
  "modelos",
  "nethood",
  "printhood",
  "recent",
  "sendto",
  "start menu",
  "system volume information",
  "templates",
];

function isSamePath(left: string, right: string): boolean {
  return resolve(left).toLowerCase() === resolve(right).toLowerCase();
}

function isIgnoredWatchPath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/").toLowerCase();
  const segments = normalized.split("/").filter(Boolean);
  return (
    segments.some((segment) => IGNORED_WATCH_SEGMENTS.has(segment)) ||
    RESTRICTED_WINDOWS_PATH_PARTS.some((part) => normalized.includes(part))
  );
}

function shouldStartFilesystemWatch(root: string, project: ProjectInfo, configEnabled: boolean): boolean {
  if (!configEnabled) {
    return false;
  }
  return !(isSamePath(root, homedir()) && project.stack.length === 0);
}

function watchErrorCode(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const value = (error as Record<string, unknown>).code;
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return "WATCH";
}

function watchErrorPath(error: unknown): string {
  if (typeof error === "object" && error !== null && "path" in error) {
    const value = (error as Record<string, unknown>).path;
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/\s+/g, " ").slice(0, 140);
}

export async function startWatcher(rootInput: string, options: { sema?: boolean; governed?: boolean; lang?: Language } = {}) {
  const root = resolve(rootInput);
  const config = await loadConfig(root);
  let activeLang = resolveLanguage(config, options.lang);
  let activeT = loadTranslator(activeLang);
  const project = await detectProject(root);
  const watchEnabled = shouldStartFilesystemWatch(root, project, config.watch.enabled);
  const seen = new Set<string>();

  console.log(pc.green(`$ ward`));
  printWatchHome(activeT, project, { ...options, watchEnabled, root, language: activeLang });

  if (!watchEnabled) {
    return {
      watchEnabled,
      setLanguage(language: Language) {
        activeLang = language;
        activeT = loadTranslator(language);
      },
      async close() {
        await Promise.resolve();
      },
    };
  }

  const watcher = chokidar.watch(root, {
    ignored: (filePath) => isIgnoredWatchPath(filePath),
    ignoreInitial: true,
  });

  let timer: NodeJS.Timeout | undefined;
  const changed = new Set<string>();
  const warnedWatchErrors = new Set<string>();
  let closed = false;

  async function flush() {
    if (closed) return;
    const files = [...changed];
    changed.clear();
    const result = await scanProject({
      root,
      changedFiles: files,
      lang: activeLang,
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
      console.log(pc.green(activeT("watch.noNewIssues")));
      return;
    }
    printScanDashboard(activeT, { ...result, findings: newAlerts });
  }

  watcher.on("all", (_event, filePath) => {
    if (closed) return;
    changed.add(filePath);
    if (timer) clearTimeout(timer);
    timer = setTimeout(
      () => void flush().catch((error) => console.error(pc.red(error instanceof Error ? error.message : String(error)))),
      config.watch.debounceMs,
    );
  });

  watcher.on("error", (error) => {
    if (closed) return;
    const code = watchErrorCode(error);
    const path = watchErrorPath(error);
    const key = `${code}:${path}`;
    if (warnedWatchErrors.has(key)) return;
    warnedWatchErrors.add(key);
    console.log(pc.yellow(activeT("watch.permissionSkipped", { code, path })));
  });

  return {
    watchEnabled,
    setLanguage(language: Language) {
      activeLang = language;
      activeT = loadTranslator(language);
    },
    async close() {
      closed = true;
      if (timer) clearTimeout(timer);
      changed.clear();
      await watcher.close();
    },
  };
}
