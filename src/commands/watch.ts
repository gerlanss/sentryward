// SEMA-GOVERNED: module sentryward.cli; watch command follows contratos/sentryward_cli.sema.
import { resolve } from "node:path";
import { startWatcher } from "../core/watcher.js";

export async function runWatchCommand(options: { root?: string; sema?: boolean; governed?: boolean }): Promise<void> {
  await startWatcher(resolve(options.root ?? process.cwd()), options);
}
