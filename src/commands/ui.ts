// SEMA-GOVERNED: module sentryward.ui; UI command follows contratos/sentryward_ui.sema.
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import pc from "picocolors";
import { createUiServer } from "../core/uiServer.js";
import type { Language, Translator } from "../types/index.js";

function openLocalUrl(url: string): void {
  const command = process.platform === "win32" ? "cmd" : process.platform === "darwin" ? "open" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(command, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.unref();
}

export async function runUiCommand(options: {
  t: Translator;
  lang?: Language;
  root?: string;
  port?: number;
  open?: boolean;
}): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const handle = await createUiServer({ root, lang: options.lang, port: options.port });

  console.log(pc.green(options.t("ui.started", { url: handle.url })));
  console.log(pc.gray(options.t("ui.stop")));

  if (options.open ?? true) {
    try {
      openLocalUrl(handle.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(pc.yellow(options.t("ui.openFailed", { message })));
    }
  }
}
