// SEMA-GOVERNED: module sentryward.cli; init command follows contratos/sentryward_cli.sema.
import { resolve } from "node:path";
import pc from "picocolors";
import type { Language, Translator } from "../types/index.js";
import { writeDefaultConfig } from "../core/config.js";
import { ensureStorage, writeSentryWardIgnore } from "../core/storage.js";

export async function runInitCommand(options: { lang: Language; t: Translator; root?: string }): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  await writeDefaultConfig(root, options.lang);
  await ensureStorage(root);
  await writeSentryWardIgnore(root);
  console.log(pc.green(options.t("init.created")));
  console.log(".sentryward/config.json");
  console.log(".sentryward/findings.json");
  console.log(".sentryward/cache.json");
  console.log(".sentrywardignore");
}
