// SEMA-GOVERNED: module sentryward.cli; terminal output follows contratos/sentryward_cli.sema.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import boxen from "boxen";
import pc from "picocolors";
import type { Finding, FindingCategory, ProjectInfo, ScanResult, SemaGateResult, Severity, Translator } from "../types/index.js";
import { countBySeverity, severityRank } from "./severity.js";

const VERSION = "v0.1.3";
const ANSI_PATTERN = new RegExp(String.raw`\x1B\[[0-?]*[ -/]*[@-~]`, "g");
const SEVERITIES: Severity[] = ["critical", "high", "medium", "low", "info"];
const CATEGORY_ORDER: FindingCategory[] = [
  "secrets",
  "browserExposure",
  "routes",
  "auth",
  "database",
  "uploads",
  "cors",
  "sessions",
  "webhooks",
  "docker",
  "ci",
  "dependencies",
  "promptInjection",
  "supabase",
  "firebase",
  "sema",
];

interface WatchIntroOptions {
  sema?: boolean;
  governed?: boolean;
  watchEnabled?: boolean;
  root?: string;
}

export interface WatchCommandSuggestion {
  usage: string;
  description: string;
}

function visibleLength(value: string): number {
  return value.replace(ANSI_PATTERN, "").length;
}

function padAnsi(value: string, width: number): string {
  return value + " ".repeat(Math.max(0, width - visibleLength(value)));
}

function truncatePlain(value: string, width: number): string {
  if (value.length <= width) return value;
  if (width <= 1) return value.slice(0, width);
  return `${value.slice(0, width - 1)}…`;
}

function fitAnsi(value: string, width: number): string {
  if (visibleLength(value) <= width) return value;
  return truncatePlain(value.replace(ANSI_PATTERN, ""), width);
}

function terminalWidth(): number {
  return Math.max(84, Math.min(process.stdout.columns ?? 128, 154));
}

function boxed(content: string, width: number, borderColor: "gray" | "magenta" | "red" = "gray"): string {
  return boxen(content, {
    width,
    padding: { top: 0, bottom: 0, left: 1, right: 1 },
    borderColor,
    borderStyle: "single",
  });
}

function combineColumns(left: string, right: string, leftWidth: number): string {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const height = Math.max(leftLines.length, rightLines.length);
  const lines: string[] = [];
  for (let index = 0; index < height; index += 1) {
    lines.push(`${padAnsi(leftLines[index] ?? "", leftWidth)}  ${rightLines[index] ?? ""}`.trimEnd());
  }
  return lines.join("\n");
}

function severityColor(severity: Severity): (value: string) => string {
  if (severity === "critical") return pc.red;
  if (severity === "high") return pc.yellow;
  if (severity === "medium") return pc.magenta;
  if (severity === "low") return pc.blue;
  return pc.gray;
}

function scoreColor(score: number): (value: string) => string {
  if (score < 40) return pc.red;
  if (score < 75) return pc.yellow;
  return pc.green;
}

function scoreMeter(score: number, width: number): string {
  const filled = Math.max(0, Math.min(width, Math.round((score / 100) * width)));
  return `${pc.magenta("█".repeat(filled))}${pc.gray("░".repeat(width - filled))}`;
}

function wrapText(text: string, width: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length > 0 ? lines : [""];
}

function formatStack(stack: string[], width: number): string {
  return truncatePlain(stack.length > 0 ? stack.join(" · ") : "unknown", width);
}

function selectSpotlight(findings: Finding[]): Finding | undefined {
  const adminRoute = findings.find((finding) => finding.id === "SW-AUTH-014");
  if (adminRoute) return adminRoute;
  return [...findings].sort((a, b) => severityRank[b.severity] - severityRank[a.severity] || b.confidence - a.confidence)[0];
}

function makeSnippet(project: ProjectInfo, finding: Finding, width: number): string[] {
  try {
    const filePath = join(project.root, finding.file);
    const source = readFileSync(filePath, "utf8").split(/\r?\n/);
    const start = Math.max(1, finding.line - 2);
    const end = Math.min(source.length, finding.line + 2);
    const numberWidth = String(end).length;
    const codeWidth = Math.max(20, width - numberWidth - 6);
    const lines: string[] = [];
    for (let lineNumber = start; lineNumber <= end; lineNumber += 1) {
      const sourceLine = truncatePlain(source[lineNumber - 1] ?? "", codeWidth);
      const prefix = `${String(lineNumber).padStart(numberWidth, " ")} │ `;
      const rendered = lineNumber === finding.line ? pc.red(`${prefix}${sourceLine}`) : `${pc.gray(prefix)}${sourceLine}`;
      lines.push(rendered);
    }
    return lines;
  } catch {
    return wrapText(finding.evidence, width);
  }
}

function guardLines(t: Translator, findings: Finding[], maxLines: number): string[] {
  const seen = new Set(findings.map((finding) => finding.category));
  const active = CATEGORY_ORDER.filter((category) => seen.has(category));
  const lines = active.slice(0, maxLines).map((category) => `${pc.green("✓")} ${t(`category.${category}`)}`);
  if (active.length > maxLines) {
    lines.push(pc.gray(t("dashboard.moreGuards", { count: active.length - maxLines })));
  }
  return lines.length > 0 ? lines : [pc.gray(t("dashboard.noGuard"))];
}

function buildSidebar(t: Translator, result: ScanResult, width: number): string {
  const counts = countBySeverity(result.findings);
  const score = scoreColor(result.score);
  const content = [
    pc.magenta("       ◆"),
    pc.magenta("    ◇ ◉ ◇"),
    pc.magenta("       ◆"),
    "",
    `${pc.bold("Sentry")}${pc.magenta(pc.bold("Ward"))}`,
    pc.magenta(t("watch.started")),
    "",
    pc.magenta(t("summary.project").toUpperCase()),
    `  ${pc.gray("▣")} ${truncatePlain(result.project.name, width - 8)}`,
    `  ${pc.gray("</>")} ${formatStack(result.project.stack, width - 8)}`,
    "",
    pc.magenta(t("dashboard.status").toUpperCase()),
    `  ${pc.green("●")} ${t("dashboard.scanned")}`,
    `  ${pc.gray(`${t("dashboard.files")}:`)} ${result.scannedFiles}`,
    "",
    pc.magenta(t("summary.score").toUpperCase()),
    `  ${score(pc.bold(String(result.score).padStart(3, " ")))}${pc.gray("/100")}`,
    `  ${scoreMeter(result.score, Math.max(8, width - 8))}`,
    `  ${pc.red("●")} ${t("severity.critical")} ${counts.critical}`,
    `  ${pc.yellow("●")} ${t("severity.high")} ${counts.high}`,
    `  ${pc.magenta("●")} ${t("severity.medium")} ${counts.medium}`,
    `  ${pc.blue("●")} ${t("severity.low")} ${counts.low}`,
    "",
    pc.magenta(t("dashboard.guardsActive").toUpperCase()),
    ...guardLines(t, result.findings, 8).map((line) => `  ${line}`),
  ].join("\n");
  return boxed(content, width, "gray");
}

function buildHero(t: Translator, result: ScanResult, width: number, mode = "scan"): string {
  const inner = Math.max(40, width - 4);
  const valueWidth = Math.max(10, inner - 28);
  const content = [
    `${pc.magenta("◆ ◇ ◉ ◇ ◆")}   ${pc.bold("Sentry")}${pc.magenta(pc.bold("Ward"))} ${pc.gray(VERSION)}`,
    pc.magenta(t("tagline")),
    "",
    `${pc.green("✓")} ${padAnsi(t("dashboard.projectDetected"), 18)} ${truncatePlain(result.project.name, valueWidth)}`,
    `${pc.green("✓")} ${padAnsi(t("dashboard.stackDetected"), 18)} ${formatStack(result.project.stack, valueWidth)}`,
    `${pc.gray("◉")} ${padAnsi(t("dashboard.guardMode"), 18)} ${pc.green(mode)}`,
    `${pc.gray("◷")} ${padAnsi(t("dashboard.generated"), 18)} ${new Date(result.generatedAt).toLocaleTimeString()}`,
  ].join("\n");
  return boxed(content, width, "magenta");
}

function buildFindingCard(t: Translator, result: ScanResult, finding: Finding, width: number): string {
  const inner = Math.max(40, width - 4);
  const color = severityColor(finding.severity);
  const snippetWidth = Math.min(54, Math.max(30, Math.floor(inner * 0.44)));
  const detailWidth = Math.max(36, inner - snippetWidth - 4);
  const details = [
    `${color(pc.bold(finding.severity.toUpperCase()))}  ${finding.id}  ${pc.bold(truncatePlain(finding.title, detailWidth - 20))}`,
    "",
    `${pc.magenta(`${t("finding.file")}:`)} ${truncatePlain(`${finding.file}:${finding.line}`, detailWidth - 8)}`,
    ...wrapText(finding.problem, detailWidth),
    "",
    `${pc.magenta(`${t("report.impact")}:`)} ${truncatePlain(finding.impact, detailWidth - 8)}`,
    "",
    `${pc.magenta(`${t("finding.recommendation")}:`)}`,
    ...wrapText(finding.recommendation, detailWidth),
  ];
  const snippet = [pc.gray(t("dashboard.code")), ...makeSnippet(result.project, finding, snippetWidth)];
  const rows = Math.max(details.length, snippet.length);
  const combined: string[] = [];
  for (let index = 0; index < rows; index += 1) {
    combined.push(`${padAnsi(details[index] ?? "", detailWidth)}  ${pc.gray("│")}  ${snippet[index] ?? ""}`.trimEnd());
  }
  combined.push("");
  combined.push(
    `${pc.red("ⓘ")} ${t("dashboard.run")}: ${pc.bold(`ward explain ${finding.id}`)}  ${pc.gray("│")}  ${pc.red("⌁")} ${pc.bold(
      `ward fix ${finding.id}`,
    )}  ${pc.gray("│")}  ${pc.red("◉")} ward findings`,
  );
  return boxed(combined.join("\n"), width, finding.severity === "critical" ? "red" : "magenta");
}

function buildTimeline(t: Translator, result: ScanResult, width: number): string {
  const spotlight = selectSpotlight(result.findings);
  const content = [
    `${pc.magenta(t("dashboard.scanCompleted"))} ${pc.gray(new Date(result.generatedAt).toLocaleTimeString())}`,
    `[${pc.gray("scan")}] ${t("dashboard.filesAnalyzed", { count: result.scannedFiles })}`,
    spotlight
      ? `[${pc.gray("ward")}] ${pc.red(t("dashboard.wardSpotted"))} ${pc.gray(spotlight.id)}`
      : `[${pc.gray("ward")}] ${pc.green(t("dashboard.noFindings"))}`,
  ].join("\n");
  return boxed(content, width, "gray");
}

function buildFooter(t: Translator, result: ScanResult, width: number): string {
  const counts = countBySeverity(result.findings);
  const summary = SEVERITIES.map((severity) => `${severityColor(severity)(String(counts[severity]))} ${t(`severity.${severity}`)}`);
  const content = `${summary.join("   ")}   ${pc.magenta(`Score: ${result.score}/100`)}`;
  return boxed(fitAnsi(content, width - 4), width, "gray");
}

function buildTopFindings(t: Translator, result: ScanResult, width: number): string {
  const findings = [...result.findings]
    .sort((a, b) => severityRank[b.severity] - severityRank[a.severity] || a.file.localeCompare(b.file))
    .slice(0, 6);
  const lines = findings.map((finding) => {
    const color = severityColor(finding.severity);
    return `${color(finding.severity.toUpperCase().padEnd(8))} ${finding.id.padEnd(16)} ${truncatePlain(finding.title, width - 34)}`;
  });
  if (result.findings.length > findings.length) {
    lines.push(pc.gray(t("dashboard.moreFindings", { count: result.findings.length - findings.length })));
  }
  if (lines.length === 0) lines.push(pc.green(t("dashboard.noFindings")));
  return boxed(lines.join("\n"), width, "gray");
}

export function printScanDashboard(t: Translator, result: ScanResult): void {
  const width = terminalWidth();
  const leftWidth = width >= 112 ? 31 : width;
  const rightWidth = width >= 112 ? width - leftWidth - 2 : width;
  const spotlight = selectSpotlight(result.findings);
  const main = [
    buildHero(t, result, rightWidth),
    buildTimeline(t, result, rightWidth),
    spotlight ? buildFindingCard(t, result, spotlight, rightWidth) : "",
    buildTopFindings(t, result, rightWidth),
    buildFooter(t, result, rightWidth),
  ]
    .filter(Boolean)
    .join("\n");

  if (width >= 112) {
    console.log(combineColumns(buildSidebar(t, result, leftWidth), main, leftWidth));
    return;
  }

  console.log(buildSidebar(t, result, leftWidth));
  console.log(main);
}

function watchGuardLines(t: Translator, maxLines: number): string[] {
  const active = CATEGORY_ORDER.slice(0, maxLines);
  const lines = active.map((category) => `${pc.green("✓")} ${t(`category.${category}`)}`);
  if (CATEGORY_ORDER.length > maxLines) {
    lines.push(pc.gray(t("dashboard.moreGuards", { count: CATEGORY_ORDER.length - maxLines })));
  }
  return lines;
}

function buildWatchSidebar(t: Translator, project: ProjectInfo, width: number, mode: string, watchEnabled: boolean): string {
  const content = [
    pc.magenta("       ◆"),
    pc.magenta("    ◇ ◉ ◇"),
    pc.magenta("       ◆"),
    "",
    `${pc.bold("Sentry")}${pc.magenta(pc.bold("Ward"))}`,
    pc.magenta(t("watch.started")),
    "",
    pc.magenta(t("summary.project").toUpperCase()),
    `  ${pc.gray("▣")} ${truncatePlain(project.name, width - 8)}`,
    `  ${pc.gray("</>")} ${formatStack(project.stack, width - 8)}`,
    "",
    pc.magenta(t("dashboard.status").toUpperCase()),
    `  ${watchEnabled ? pc.green("●") : pc.yellow("●")} ${watchEnabled ? pc.green(mode) : pc.yellow(mode)}`,
    `  ${pc.gray(t("dashboard.started"))}: ${t("dashboard.justNow")}`,
    "",
    pc.magenta(t("summary.score").toUpperCase()),
    `  ${pc.green(pc.bold("100"))}${pc.gray("/100")}`,
    `  ${scoreMeter(100, Math.max(8, width - 8))}`,
    "",
    pc.magenta(t("dashboard.guardsActive").toUpperCase()),
    ...watchGuardLines(t, 8).map((line) => `  ${line}`),
  ].join("\n");
  return boxed(content, width, "gray");
}

function buildWatchTimeline(t: Translator, width: number, watchEnabled: boolean): string {
  const now = new Date().toLocaleTimeString();
  const state = watchEnabled ? pc.green(t("watch.panelArmed")) : pc.yellow(t("watch.panelPaused"));
  const content = [
    `${pc.magenta(t("watch.panelTitle"))} ${pc.gray(now)}`,
    `[${pc.gray(now)}] ${t("watch.panelReady")}`,
    `[${pc.gray(now)}] ${state}`,
  ].join("\n");
  return boxed(content, width, "gray");
}

function buildWatchConsoleCard(t: Translator, width: number): string {
  const content = [
    pc.magenta(t("console.ready")),
    t("console.readyBody"),
    t("console.chatHint"),
    t("console.scanHint"),
    t("console.panelHint"),
    t("console.historyHint"),
  ].join("\n");
  return boxed(content, width, "magenta");
}

function buildWatchCommandBar(t: Translator, width: number): string {
  return boxed(fitAnsi(t("console.commandBar"), width - 4), width, "gray");
}

export function printWatchIntro(t: Translator, project: ProjectInfo, options: WatchIntroOptions = {}): void {
  const width = terminalWidth();
  const watchEnabled = options.watchEnabled ?? true;
  const mode = options.sema || options.governed ? (watchEnabled ? "watching + sema" : "panel + sema") : watchEnabled ? "watching" : "panel";
  const result: ScanResult = {
    project,
    findings: [],
    score: 100,
    generatedAt: new Date().toISOString(),
    scannedFiles: 0,
  };
  const leftWidth = width >= 112 ? 31 : width;
  const rightWidth = width >= 112 ? width - leftWidth - 2 : width;
  const valueWidth = Math.max(10, rightWidth - 32);
  const semaEnabled = options.sema || options.governed;
  const main = [
    buildHero(t, result, rightWidth, mode),
      boxed(
        [
          `${pc.green("✓")} ${padAnsi(t("dashboard.projectDetected"), 18)} ${truncatePlain(project.name, valueWidth)}`,
          `${pc.green("✓")} ${padAnsi(t("dashboard.stackDetected"), 18)} ${formatStack(project.stack, valueWidth)}`,
          `${watchEnabled ? pc.gray("◉") : pc.yellow("◉")} ${padAnsi(t("dashboard.guardMode"), 18)} ${
            watchEnabled ? pc.green(mode) : pc.yellow(mode)
          }`,
          `${pc.gray("◷")} ${padAnsi(t("dashboard.started"), 18)} ${t("dashboard.justNow")}`,
          `${pc.gray("◇")} ${padAnsi(t("sema.governance"), 18)} ${
            semaEnabled ? pc.green(t("common.enabled")) : pc.gray(t("common.disabled"))
          }`,
          `${pc.gray("▣")} ${padAnsi(t("summary.project"), 18)} ${truncatePlain(options.root ?? project.root, valueWidth)}`,
        ].join("\n"),
        rightWidth,
        "gray",
      ),
    buildWatchTimeline(t, rightWidth, watchEnabled),
    buildWatchConsoleCard(t, rightWidth),
    buildWatchCommandBar(t, rightWidth),
  ].join("\n");

  if (width >= 112) {
    console.log(combineColumns(buildWatchSidebar(t, project, leftWidth, mode, watchEnabled), main, leftWidth));
    return;
  }

  console.log(buildWatchSidebar(t, project, leftWidth, mode, watchEnabled));
  console.log(main);
}

export function printWatchConsoleHelp(t: Translator): void {
  const width = terminalWidth();
  const lines = [
    pc.magenta(t("console.helpTitle")),
    t("console.helpScan"),
    t("console.helpStatus"),
    t("console.helpFindings"),
    t("console.helpExplain"),
    t("console.helpFix"),
    t("console.helpPanel"),
    t("console.helpClear"),
    t("console.helpQuit"),
  ];
  console.log(boxed(lines.join("\n"), width, "gray"));
}

export function printWatchChatInput(t: Translator): void {
  const width = terminalWidth();
  console.log(boxed([pc.magenta(t("console.chatTitle")), t("console.chatBody")].join("\n"), width, "magenta"));
}

export function printWatchCommandSuggestions(t: Translator, commands: WatchCommandSuggestion[], filter = ""): void {
  const width = terminalWidth();
  const inner = Math.max(40, width - 4);
  const usageWidth = Math.min(24, Math.max(12, Math.floor(inner * 0.28)));
  const visibleCommands = commands.length > 0 ? commands : [{ usage: "/", description: t("console.noCommandMatch") }];
  const lines = [
    `${pc.magenta(t("console.suggestTitle"))}${filter ? pc.gray(` /${filter}`) : ""}`,
    pc.gray(t("console.suggestHint")),
    "",
    ...visibleCommands.map((command) => `${pc.green(padAnsi(command.usage, usageWidth))} ${truncatePlain(command.description, inner - usageWidth - 1)}`),
  ];
  console.log(boxed(lines.join("\n"), width, "gray"));
}

export function header(t: Translator): string {
  return boxen(`${pc.bold("SentryWard")}\n${pc.magenta(t("tagline"))}`, {
    padding: 1,
    borderColor: "magenta",
  });
}

export function printScanSummary(t: Translator, project: ProjectInfo, findings: Finding[], score: number): void {
  const counts = countBySeverity(findings);
  console.log(header(t));
  console.log(`${pc.green("✓")} ${t("summary.project")}: ${project.name}`);
  console.log(`${pc.green("✓")} ${t("summary.stack")}: ${project.stack.join(" · ") || t("summary.unknown")}`);
  console.log(`${pc.cyan("●")} ${t("summary.score")}: ${score}/100`);
  console.log(
    `${pc.red(String(counts.critical))} ${t("severity.critical")}  ${pc.yellow(String(counts.high))} ${t(
      "severity.high",
    )}  ${pc.magenta(String(counts.medium))} ${t("severity.medium")}  ${pc.blue(String(counts.low))} ${t(
      "severity.low",
    )}  ${String(counts.info)} ${t("severity.info")}`,
  );
}

export function printFinding(t: Translator, finding: Finding): void {
  const color =
    finding.severity === "critical"
      ? pc.red
      : finding.severity === "high"
        ? pc.yellow
        : finding.severity === "medium"
          ? pc.magenta
          : finding.severity === "low"
            ? pc.blue
            : pc.gray;
  console.log("");
  console.log(`${color(finding.severity.toUpperCase())} · ${finding.id}`);
  console.log(pc.bold(finding.title));
  console.log(`${t("finding.file")}: ${finding.file}:${finding.line}`);
  console.log(`${t("finding.evidence")}: ${finding.evidence}`);
  console.log(`${t("finding.recommendation")}: ${finding.recommendation}`);
}

export function printGate(t: Translator, gate: SemaGateResult): void {
  if (!gate.enabled || gate.gate === "not_requested") {
    return;
  }
  console.log("");
  console.log(pc.bold(t("sema.checking")));
  const contract = gate.applicableContract ?? t("sema.noContract");
  console.log(`${gate.projectContextLoaded ? pc.green("✓") : pc.yellow("!")} ${t("sema.projectContext")}`);
  console.log(`${gate.applicableContract ? pc.green("✓") : pc.yellow("!")} ${t("sema.contract")}: ${contract}`);
  console.log(`${gate.driftCompleted ? pc.green("✓") : pc.yellow("!")} ${t("sema.drift")}`);
  console.log(`${gate.impactCompleted ? pc.green("✓") : pc.yellow("!")} ${t("sema.impact")}`);
  console.log(`${t("sema.gate")}: ${gate.gate}`);
  if (gate.reason) {
    console.log(`${t("sema.reason")}: ${gate.reason}`);
  }
  if (gate.constraints.length > 0) {
    console.log(t("sema.constraints"));
    for (const constraint of gate.constraints) {
      console.log(`- ${constraint}`);
    }
  }
}
