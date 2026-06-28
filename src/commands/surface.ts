// SEMA-GOVERNED: module sentryward.scanner; surface command follows contratos/sentryward_scanner.sema.
import { resolve } from "node:path";
import pc from "picocolors";
import type { Language, Translator } from "../types/index.js";
import { printFinding, printScanSummary } from "../core/logger.js";
import { scanProject } from "../core/scanner.js";

function isLocalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

export async function runSurfaceCommand(
  options: { t: Translator; lang: Language; root?: string; url?: string },
): Promise<void> {
  if (options.url && !isLocalUrl(options.url)) {
    console.log(pc.red(options.t("surface.remoteBlocked")));
    process.exitCode = 2;
    return;
  }
  const root = resolve(options.root ?? process.cwd());
  const result = await scanProject({ root, lang: options.lang });
  const findings = result.findings.filter((finding) =>
    ["browserExposure", "routes", "cors", "sessions"].includes(finding.category),
  );
  printScanSummary(options.t, result.project, findings, result.score);
  for (const finding of findings) {
    printFinding(options.t, finding);
  }
  if (options.url) {
    console.log(pc.green(options.t("surface.localChecked", { url: options.url })));
  }
}
