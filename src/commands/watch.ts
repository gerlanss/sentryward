// SEMA-GOVERNED: module sentryward.cli; watch command follows contratos/sentryward_cli.sema.
import { stdin as input, stdout as output } from "node:process";
import { resolve } from "node:path";
import { emitKeypressEvents } from "node:readline";
import { createInterface } from "node:readline/promises";
import pc from "picocolors";
import type { Language, Translator } from "../types/index.js";
import {
  printScanDashboard,
  printWatchChatInput,
  printWatchCommandSuggestions,
  printWatchConsoleHelp,
  printWatchIntro,
  type WatchCommandSuggestion,
} from "../core/logger.js";
import { detectProject } from "../core/projectDetector.js";
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

interface SlashCommandDefinition {
  command: string;
  usage: string;
  descriptionKey: string;
}

const SLASH_COMMANDS: SlashCommandDefinition[] = [
  { command: "/help", usage: "/help", descriptionKey: "console.suggest.help" },
  { command: "/scan", usage: "/scan [path]", descriptionKey: "console.suggest.scan" },
  { command: "/status", usage: "/status", descriptionKey: "console.suggest.status" },
  { command: "/findings", usage: "/findings", descriptionKey: "console.suggest.findings" },
  { command: "/explain", usage: "/explain <id>", descriptionKey: "console.suggest.explain" },
  { command: "/fix", usage: "/fix <id>", descriptionKey: "console.suggest.fix" },
  { command: "/panel", usage: "/panel", descriptionKey: "console.suggest.panel" },
  { command: "/clear", usage: "/clear", descriptionKey: "console.suggest.clear" },
  { command: "/quit", usage: "/quit", descriptionKey: "console.suggest.quit" },
];

function splitInput(raw: string): { command: string; args: string[] } {
  const parts = raw.trim().slice(1).split(/\s+/).filter(Boolean);
  const [command = "", ...args] = parts;
  return { command: command.toLowerCase(), args };
}

function slashFilter(raw: string): string {
  return raw.trim().replace(/^\//, "").split(/\s+/)[0]?.toLowerCase() ?? "";
}

function matchingSlashCommands(t: Translator, filter = ""): WatchCommandSuggestion[] {
  const normalized = filter.toLowerCase();
  return SLASH_COMMANDS.filter((command) => command.command.slice(1).startsWith(normalized)).map((command) => ({
    usage: command.usage,
    description: t(command.descriptionKey),
  }));
}

function completeSlashCommand(line: string): [string[], string] {
  if (!line.startsWith("/")) {
    return [[], line];
  }
  const filter = slashFilter(line);
  const hits = SLASH_COMMANDS.filter((command) => command.command.slice(1).startsWith(filter)).map((command) => command.command);
  return [hits.length > 0 ? hits : SLASH_COMMANDS.map((command) => command.command), line];
}

function printMissingFindingId(t: Translator): void {
  console.log(pc.yellow(t("console.missingFindingId")));
}

function printSlashMenu(t: Translator, filter = ""): void {
  printWatchCommandSuggestions(t, matchingSlashCommands(t, filter), filter);
}

async function renderPanel(root: string, options: WatchCommandOptions, watcher: WatchSession): Promise<void> {
  const project = await detectProject(root);
  printWatchIntro(options.t, project, {
    sema: options.sema,
    governed: options.governed,
    watchEnabled: watcher.watchEnabled,
    root,
  });
}

async function runSlashCommand(
  raw: string,
  root: string,
  options: WatchCommandOptions,
  watcher: WatchSession,
): Promise<boolean> {
  const value = raw.trim();
  if (!value) {
    return true;
  }

  if (!value.startsWith("/")) {
    console.log(pc.yellow(options.t("console.chatCommandOnly")));
    return true;
  }

  if (value === "/") {
    printSlashMenu(options.t);
    return true;
  }

  const { command, args } = splitInput(value);
  switch (command) {
    case "help":
    case "?":
      printWatchConsoleHelp(options.t);
      return true;
    case "panel":
    case "dashboard":
      await renderPanel(root, options, watcher);
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
      await renderPanel(root, options, watcher);
      return true;
    case "quit":
    case "exit":
      return false;
    default:
      console.log(pc.yellow(options.t("console.unknown")));
      printSlashMenu(options.t, command);
      return true;
  }
}

function installSlashMenuPreview(
  rl: ReturnType<typeof createInterface>,
  options: WatchCommandOptions,
): () => void {
  if (!input.isTTY) {
    return () => undefined;
  }

  emitKeypressEvents(input, rl);
  let shownForLine = "";
  const onKeypress = () => {
    setTimeout(() => {
      const line = rl.line;
      if (line === "/" && shownForLine !== line) {
        shownForLine = line;
        output.write("\n");
        printSlashMenu(options.t);
        rl.prompt(true);
        return;
      }
      if (!line.startsWith("/")) {
        shownForLine = "";
      }
    }, 0);
  };

  input.on("keypress", onKeypress);
  return () => {
    input.off("keypress", onKeypress);
  };
}

async function openConsole(root: string, options: WatchCommandOptions, watcher: WatchSession): Promise<void> {
  const rl = createInterface({
    input,
    output,
    prompt: pc.green(`${options.t("console.prompt")} `),
    completer: completeSlashCommand,
  });
  const uninstallSlashMenuPreview = installSlashMenuPreview(rl, options);

  rl.on("SIGINT", () => {
    rl.close();
  });

  printWatchChatInput(options.t);
  rl.prompt();
  for await (const line of rl) {
    try {
      const keepOpen = await runSlashCommand(line, root, options, watcher);
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

  uninstallSlashMenuPreview();
  await watcher.close();
  console.log(pc.green(options.t("console.bye")));
}

export async function runWatchCommand(options: WatchCommandOptions): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const watcher = await startWatcher(root, options);
  await openConsole(root, options, watcher);
}
