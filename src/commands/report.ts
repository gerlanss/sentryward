// SEMA-GOVERNED: module sentryward.scanner; report command follows contratos/sentryward_scanner.sema.
import { resolve } from "node:path";
import pc from "picocolors";
import type { Language, Translator } from "../types/index.js";
import { writeHtmlReport, writeJsonReport } from "../core/reportEngine.js";
import { scanProject } from "../core/scanner.js";

export async function runReportCommand(options: {
  t: Translator;
  lang: Language;
  root?: string;
  html?: boolean;
  json?: boolean;
}): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const result = await scanProject({ root, lang: options.lang });
  const files: string[] = [];
  if (options.json) {
    files.push(await writeJsonReport(root, result));
  }
  if (options.html || !options.json) {
    files.push(await writeHtmlReport(root, result, options.t));
  }
  for (const file of files) {
    console.log(pc.green(options.t("report.wrote", { file })));
  }
}
