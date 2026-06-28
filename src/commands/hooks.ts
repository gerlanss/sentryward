// SEMA-GOVERNED: module sentryward.cli; hook installation follows contratos/sentryward_cli.sema.
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import pc from "picocolors";
import type { Translator } from "../types/index.js";

export async function runHooksInstallCommand(options: { t: Translator; root?: string }): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const hooksDir = resolve(root, ".git", "hooks");
  if (!existsSync(resolve(root, ".git"))) {
    console.log(pc.yellow(options.t("hooks.noGit")));
    process.exitCode = 2;
    return;
  }
  await mkdir(hooksDir, { recursive: true });
  const hookPath = resolve(hooksDir, "pre-commit");
  await writeFile(
    hookPath,
    "#!/bin/sh\nnpx ward scan .\nstatus=$?\nif [ $status -eq 1 ]; then\n  echo \"SentryWard blocked this commit: high or critical findings detected.\"\n  exit 1\nfi\nexit $status\n",
    "utf8",
  );
  console.log(pc.green(options.t("hooks.installed")));
}
