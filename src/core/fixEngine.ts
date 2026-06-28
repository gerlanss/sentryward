// SEMA-GOVERNED: module sentryward.cli; fix planning follows contratos/sentryward_cli.sema.
import type { Finding, FixPlan, SemaGateResult, Translator } from "../types/index.js";

function planForFinding(t: Translator, finding: Finding): string[] {
  if (finding.category === "auth" || finding.category === "routes") {
    return [
      t("fix.plan.useAuthMiddleware"),
      t("fix.plan.addAdminRole"),
      t("fix.plan.preserveResponse"),
      t("fix.plan.addAudit"),
      t("fix.plan.rerunScan"),
    ];
  }
  if (finding.category === "secrets" || finding.category === "browserExposure") {
    return [
      t("fix.plan.moveSecretBackend"),
      t("fix.plan.addEnvExample"),
      t("fix.plan.rotateSecret"),
      t("fix.plan.rerunScan"),
    ];
  }
  if (finding.category === "database") {
    return [t("fix.plan.parameterizeQuery"), t("fix.plan.addOwnership"), t("fix.plan.rerunScan")];
  }
  return [t("fix.plan.reviewCode"), t("fix.plan.applyMinimalPatch"), t("fix.plan.rerunScan")];
}

export function createFixPlan(t: Translator, finding: Finding, gate: SemaGateResult): FixPlan {
  const blocked = gate.enabled && gate.gate === "blocked";
  const files = [finding.file];
  if (gate.applicableContract) {
    files.push(gate.applicableContract);
  }

  return {
    finding,
    gate,
    plan: blocked ? [gate.reason ?? t("sema.reason.blocked")] : planForFinding(t, finding),
    filesToChange: files,
    canApply: !blocked && finding.autoFixSafe,
    manualSteps: finding.category === "secrets" ? [t("fix.manual.rotate")] : [t("fix.manual.verify")],
  };
}

export function renderFixPlan(t: Translator, plan: FixPlan): string {
  const lines = [
    t("fix.title"),
    "",
    `${t("fix.finding")}:`,
    `${plan.finding.id} · ${plan.finding.title}`,
    "",
    `${t("fix.semaGate")}: ${plan.gate.enabled ? plan.gate.gate.toUpperCase() : t("sema.notRequested")}`,
    "",
    `${t("fix.plan")}:`,
    ...plan.plan.map((step, index) => `${index + 1}. ${step}`),
    "",
    `${t("fix.files")}:`,
    ...plan.filesToChange.map((file) => `- ${file}`),
    "",
    `${t("fix.manual")}:`,
    ...plan.manualSteps.map((step) => `- ${step}`),
  ];

  if (!plan.canApply) {
    lines.push("", t("fix.noAutoApply"));
  }

  return lines.join("\n");
}
