// SEMA-GOVERNED: module sentryward.cli; terminal output follows contratos/sentryward_cli.sema.
import boxen from "boxen";
import pc from "picocolors";
import type { Finding, ProjectInfo, SemaGateResult, Translator } from "../types/index.js";
import { countBySeverity } from "./severity.js";

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
