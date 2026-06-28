// SEMA-GOVERNED: module sentryward.scanner; report generation follows contratos/sentryward_scanner.sema.
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { ScanResult, Translator } from "../types/index.js";
import { renderHtmlReport } from "../reports/htmlTemplate.js";

export async function writeJsonReport(root: string, result: ScanResult): Promise<string> {
  const path = resolve(root, "sentryward-report.json");
  await writeFile(path, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  return path;
}

export async function writeHtmlReport(root: string, result: ScanResult, t: Translator): Promise<string> {
  const path = resolve(root, "sentryward-report.html");
  await writeFile(path, renderHtmlReport(t, result), "utf8");
  return path;
}
