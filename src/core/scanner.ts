// SEMA-GOVERNED: module sentryward.scanner; scan execution follows contratos/sentryward_scanner.sema.
import { resolve } from "node:path";
import type { Language, ScanResult } from "../types/index.js";
import { defaultConfig, loadConfig, resolveLanguage } from "./config.js";
import { collectFiles } from "./fileCollector.js";
import { loadTranslator } from "./i18n.js";
import { detectProject } from "./projectDetector.js";
import { runGuards } from "./ruleEngine.js";
import { calculateScore } from "./severity.js";
import { writeScanResult } from "./storage.js";
import { allGuards } from "../guards/index.js";
import { findGovernanceFindings, listSemaContracts } from "./semaGovernance.js";

export interface ScanOptions {
  root?: string;
  target?: string;
  storageRoot?: string;
  lang?: Language;
  changedFiles?: string[];
  persist?: boolean;
  contractCheck?: boolean;
}

export async function scanProject(options: ScanOptions = {}): Promise<ScanResult> {
  const root = resolve(options.target ?? options.root ?? process.cwd());
  const storageRoot = resolve(options.storageRoot ?? root);
  const config = await loadConfig(root).catch(() => defaultConfig);
  const language = resolveLanguage(config, options.lang);
  const t = loadTranslator(language);
  const [project, files, semaContracts] = await Promise.all([
    detectProject(root),
    collectFiles(root, options.changedFiles),
    listSemaContracts(root),
  ]);

  const context = {
    root,
    language,
    t,
    semaContracts,
    contractCheck: options.contractCheck ?? false,
  };

  const securityFindings = runGuards(allGuards, files, context, config);
  const governanceFindings = await findGovernanceFindings(files, context);
  const findings = [...securityFindings, ...governanceFindings];
  const result: ScanResult = {
    project,
    findings,
    score: calculateScore(findings),
    generatedAt: new Date().toISOString(),
    scannedFiles: files.length,
  };

  if (options.persist ?? true) {
    await writeScanResult(storageRoot, result);
  }

  return result;
}
