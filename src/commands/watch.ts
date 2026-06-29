// SEMA-GOVERNED: module sentryward.cli; watch command follows contratos/sentryward_cli.sema.
import { stdin as input, stdout as output } from "node:process";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import pc from "picocolors";
import type { Language, Translator } from "../types/index.js";
import { printScanDashboard, printWatchConsoleHelp } from "../core/logger.js";
import { scanProject } from "../core/scanner.js";
import { startWatcher, type WatchSession } from "../core/watcher.js";
import { runExplainCommand } from "./explain.js";
import { runFindingsCommand } from "./findings.js";
import { runFixCommand } from "./fix.js";
import { runStatusCommand } from "./status.js";

interface WatchCommandOptions {
  root?: string;
  sema?: boolean;
  governed?: boolean;
  lang: Language;
  t: Translator;
}

function splitInput(raw: string): { command: string; args: string[] } {
  const parts = raw.trim().slice(1).split(/\s+/).filter(Boolean);
  const [command = "", ...args] = parts;
  return { command: command.toLowerCase(), args };
}

function printMissingFindingId(t: Translator): void {
  console.log(pc.yellow(t("console.missingFindingId")));
}

async function runSlashCommand(raw: string, root: string, options: WatchCommandOptions): Promise<boolean> {
  const value = raw.trim();
  if (!value) {
    return true;
  }

  if (!value.startsWith("/")) {
    console.log(pc.yellow(options.t("console.unknown")));
    return true;
  }

  const { command, args } = splitInput(value);
  switch (command) {
    case "help":
    case "?":
      printWatchConsoleHelp(options.t);
      return true;
    case "scan": {
      const target = resolve(root, args[0] ?? ".");
      console.log(pc.magenta(options.t("console.scanRunning")));
      const result = await scanProject({
        target,
        storageRoot: root,
        lang: options.lang,
        contractCheck: Boolean(options.sema || options.governed),
      });
      printScanDashboard(options.t, result);
      process.exitCode = 0;
      return true;
    }
    case "status":
      await runStatusCommand({ t: options.t, root });
      process.exitCode = 0;
      return true;
    case "findings":
      await runFindingsCommand({ t: options.t, root });
      process.exitCode = 0;
      return true;
    case "explain":
      if (!args[0]) {
        printMissingFindingId(options.t);
        return true;
      }
      await runExplainCommand(args[0], { t: options.t, root });
      process.exitCode = 0;
      return true;
    case "fix":
      if (!args[0]) {
        printMissingFindingId(options.t);
        return true;
      }
      await runFixCommand(args[0], {
        t: options.t,
        lang: options.lang,
        root,
        sema: options.sema,
        governed: options.governed,
      });
      process.exitCode = 0;
      return true;
    case "clear":
      console.clear();
      printWatchConsoleHelp(options.t);
      return true;
    case "quit":
    case "exit":
      return false;
    default:
      console.log(pc.yellow(options.t("console.unknown")));
      return true;
  }
}

async function openConsole(root: string, options: WatchCommandOptions, watcher: WatchSession): Promise<void> {
  const rl = createInterface({ input, output, prompt: pc.green("ward> ") });

  rl.on("SIGINT", () => {
    rl.close();
  });

  rl.prompt();
  for await (const line of rl) {
    try {
      const keepOpen = await runSlashCommand(line, root, options);
      if (!keepOpen) {
        rl.close();
        break;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(pc.red(message));
    }
    rl.prompt();
  }

  await watcher.close();
  console.log(pc.green(options.t("console.bye")));
}

export async function runWatchCommand(options: WatchCommandOptions): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const watcher = await startWatcher(root, options);
  await openConsole(root, options, watcher);
}
