#!/usr/bin/env node
// SEMA-GOVERNED: module sentryward.cli; binary command surface follows contratos/sentryward_cli.sema.
import { Command } from "commander";
import pc from "picocolors";
import { defaultConfig } from "./core/config.js";
import { loadTranslator, normalizeLanguage } from "./core/i18n.js";
import { runCiInitCommand } from "./commands/ci.js";
import { runExplainCommand } from "./commands/explain.js";
import { runFindingsCommand } from "./commands/findings.js";
import { runFixCommand } from "./commands/fix.js";
import { runHooksInstallCommand } from "./commands/hooks.js";
import { runInitCommand } from "./commands/init.js";
import { runReportCommand } from "./commands/report.js";
import { runScanCommand } from "./commands/scan.js";
import { runSemaInitCommand, runSemaStatusCommand, runSemaSyncCommand } from "./commands/sema.js";
import { runStatusCommand } from "./commands/status.js";
import { runSurfaceCommand } from "./commands/surface.js";
import { runWatchCommand } from "./commands/watch.js";
import type { Language } from "./types/index.js";

function languageFromArgv(): Language {
  const index = process.argv.findIndex((arg) => arg === "--lang");
  const inline = process.argv.find((arg) => arg.startsWith("--lang="));
  return (
    normalizeLanguage(index >= 0 ? process.argv[index + 1] : undefined) ??
    normalizeLanguage(inline?.split("=")[1]) ??
    normalizeLanguage(process.env.SENTRYWARD_LANG) ??
    defaultConfig.language
  );
}

const lang = languageFromArgv();
const t = loadTranslator(lang);

const program = new Command();
program
  .name("ward")
  .description(t("cli.description"))
  .version("0.1.0")
  .option("--lang <language>", t("cli.options.lang"))
  .option("--governed", t("cli.options.governed"))
  .option("--sema", t("cli.options.sema"));

program
  .command("watch")
  .description(t("commands.watch"))
  .option("--sema", t("cli.options.sema"))
  .option("--governed", t("cli.options.governed"))
  .action(async (options) =>
    runWatchCommand({
      lang,
      t,
      sema: Boolean(options.sema || program.opts().sema),
      governed: Boolean(options.governed || program.opts().governed),
    }),
  );

program
  .command("init")
  .description(t("commands.init"))
  .action(async () => runInitCommand({ lang, t }));

program
  .command("scan")
  .description(t("commands.scan"))
  .argument("[path]", t("commands.path"), ".")
  .option("--contract-check", t("cli.options.contractCheck"))
  .action(async (path, options) => runScanCommand(path, { lang, t, contractCheck: options.contractCheck }));

program
  .command("status")
  .description(t("commands.status"))
  .action(async () => runStatusCommand({ t }));

program
  .command("findings")
  .description(t("commands.findings"))
  .action(async () => runFindingsCommand({ t }));

program
  .command("explain")
  .description(t("commands.explain"))
  .argument("<findingId>", t("commands.findingId"))
  .action(async (findingId) => runExplainCommand(findingId, { t }));

program
  .command("fix")
  .description(t("commands.fix"))
  .argument("<findingId>", t("commands.findingId"))
  .option("--governed", t("cli.options.governed"))
  .option("--sema", t("cli.options.sema"))
  .option("--require-contract", t("cli.options.requireContract"))
  .option("--apply", t("cli.options.apply"))
  .option("--yes", t("cli.options.yes"))
  .option("--patch", t("cli.options.patch"))
  .action(async (findingId, options) =>
    runFixCommand(findingId, {
      t,
      lang,
      governed: Boolean(options.governed || program.opts().governed),
      sema: Boolean(options.sema || program.opts().sema),
      requireContract: options.requireContract,
      apply: options.apply,
      yes: options.yes,
      patch: options.patch,
    }),
  );

program
  .command("report")
  .description(t("commands.report"))
  .option("--html", t("cli.options.html"))
  .option("--json", t("cli.options.json"))
  .action(async (options) => runReportCommand({ t, lang, html: options.html, json: options.json }));

program
  .command("surface")
  .description(t("commands.surface"))
  .option("--url <url>", t("cli.options.url"))
  .action(async (options) => runSurfaceCommand({ t, lang, url: options.url }));

const hooks = program.command("hooks").description(t("commands.hooks"));
hooks.command("install").description(t("commands.hooksInstall")).action(async () => runHooksInstallCommand({ t }));

const ci = program.command("ci").description(t("commands.ci"));
ci.command("init").description(t("commands.ciInit")).action(async () => runCiInitCommand({ t }));

const sema = program.command("sema").description(t("commands.sema"));
sema.command("status").description(t("commands.semaStatus")).action(async () => runSemaStatusCommand({ t }));
sema.command("init").description(t("commands.semaInit")).action(async () => runSemaInitCommand({ t }));
sema.command("sync").description(t("commands.semaSync")).action(async () => runSemaSyncCommand({ t }));

program.action(async (options) => runWatchCommand({ lang, t, sema: options.sema, governed: options.governed }));

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(pc.red(message));
  process.exitCode = 2;
});
