// SEMA-GOVERNED: modules sentryward.cli and sentryward.scanner; optional Sema companion flow.
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import fg from "fast-glob";
import type { FileContext, Finding, GuardContext, SemaGateResult, Translator } from "../types/index.js";
import { createFinding } from "./finding.js";

export async function listSemaContracts(root: string): Promise<string[]> {
  return fg(["**/*.sema"], {
    cwd: root,
    dot: true,
    absolute: false,
    onlyFiles: true,
    ignore: ["node_modules/**", ".git/**", "dist/**", "build/**", "coverage/**", "exemplos/**"],
  });
}

async function readContracts(root: string, contracts: string[]): Promise<Array<{ path: string; content: string }>> {
  const loaded = [];
  for (const contract of contracts) {
    try {
      loaded.push({ path: contract, content: await readFile(resolve(root, contract), "utf8") });
    } catch {
      // Contract can disappear during watch mode; ignore this pass.
    }
  }
  return loaded;
}

function fileTokens(file: string): string[] {
  return file
    .toLowerCase()
    .split(/[\\/._-]+/)
    .filter((token) => token.length > 2);
}

export async function findApplicableContract(
  root: string,
  contracts: string[],
  finding?: Pick<Finding, "file" | "category" | "tags">,
): Promise<string | undefined> {
  if (contracts.length === 0) {
    return undefined;
  }

  const loaded = await readContracts(root, contracts);
  const tokens = finding ? [finding.category, ...(finding.tags ?? []), ...fileTokens(finding.file)] : [];
  const direct = loaded.find((contract) => contract.content.includes(finding?.file ?? ""));
  if (direct) {
    return direct.path;
  }

  const scored = loaded
    .map((contract) => ({
      path: contract.path,
      score: tokens.reduce(
        (score, token) => score + (contract.content.toLowerCase().includes(token.toLowerCase()) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score ? scored[0].path : undefined;
}

function runSemaJson(root: string, args: string[]): unknown | undefined {
  try {
    const output = execFileSync("sema", args, {
      cwd: root,
      encoding: "utf8",
      timeout: 15_000,
      windowsHide: true,
    });
    return JSON.parse(output) as unknown;
  } catch {
    return undefined;
  }
}

function constraintsForFinding(t: Translator, finding: Finding): string[] {
  const base = [t("sema.constraint.preserveBehavior"), t("sema.constraint.updateContract")];
  if (finding.category === "auth" || finding.category === "routes") {
    return [
      t("sema.constraint.useExistingAuth"),
      t("sema.constraint.preserveRoles"),
      t("sema.constraint.preservePublicRoutes"),
      t("sema.constraint.addAudit"),
      ...base,
    ];
  }
  if (finding.category === "secrets" || finding.category === "browserExposure") {
    return [t("sema.constraint.noSecretReturn"), t("sema.constraint.rotateManually"), ...base];
  }
  if (finding.category === "database") {
    return [t("sema.constraint.preserveOwnership"), t("sema.constraint.noRawSql"), ...base];
  }
  return base;
}

export async function evaluateSemaGateForFinding(options: {
  root: string;
  finding: Finding;
  enabled: boolean;
  contractMode: "optional" | "required";
  driftCheck: boolean;
  impactMap: boolean;
  t: Translator;
}): Promise<SemaGateResult> {
  const { root, finding, enabled, contractMode, driftCheck, impactMap, t } = options;

  if (!enabled) {
    return {
      enabled: false,
      gate: "not_requested",
      contractMode,
      projectContextLoaded: false,
      driftCompleted: false,
      impactCompleted: false,
      constraints: [],
    };
  }

  const contracts = await listSemaContracts(root);
  const applicableContract = await findApplicableContract(root, contracts, finding);
  const projectContextLoaded = contracts.length > 0;

  if (!applicableContract) {
    return {
      enabled: true,
      gate: contractMode === "required" ? "blocked" : "unavailable",
      contractMode,
      projectContextLoaded,
      driftCompleted: false,
      impactCompleted: false,
      constraints:
        contractMode === "required"
          ? [t("sema.constraint.createContractFirst")]
          : [t("sema.constraint.recommendedComplement")],
      reason:
        contractMode === "required"
          ? t("sema.reason.noContractRequired")
          : t("sema.reason.noContractOptional"),
    };
  }

  const drift = driftCheck ? runSemaJson(root, ["drift", "contratos", "--escopo", "modulo", "--json"]) : undefined;
  const impact = impactMap
    ? runSemaJson(root, [
        "impacto",
        "contratos",
        "--alvo",
        finding.category,
        "--mudanca",
        `${finding.id} ${finding.title}`,
        "--escopo",
        "modulo",
        "--json",
      ])
    : undefined;

  return {
    enabled: true,
    gate: "passed_with_constraints",
    contractMode,
    applicableContract,
    projectContextLoaded,
    driftCompleted: !driftCheck || Boolean(drift),
    impactCompleted: !impactMap || Boolean(impact),
    constraints: constraintsForFinding(t, finding),
    raw: { drift, impact },
  };
}

function sensitiveNeedsContract(file: FileContext): boolean {
  const path = file.relativePath.toLowerCase();
  const content = file.content.toLowerCase();
  return (
    /(^|\/)(api|routes|controllers|middleware|auth|admin)(\/|$)/.test(path) ||
    /admin|delete|reset|payment|billing|webhook|requireauth|isadmin|authorization/.test(content)
  );
}

export async function findGovernanceFindings(
  files: FileContext[],
  context: GuardContext,
): Promise<Finding[]> {
  if (!context.contractCheck) {
    return [];
  }

  const contracts = context.semaContracts;
  const findings: Finding[] = [];
  for (const file of files) {
    if (!sensitiveNeedsContract(file)) {
      continue;
    }
    const applicable = await findApplicableContract(context.root, contracts, {
      file: file.relativePath,
      category: "sema",
      tags: ["auth", "route", "security", "admin"],
    });
    if (!applicable) {
      findings.push(
        createFinding(context.t, {
          ruleId: "SW-SEMA-001",
          category: "sema",
          severity: "medium",
          confidence: 0.78,
          file: file.relativePath,
          line: 1,
          evidence: context.t("sema.evidence.noContract", { file: file.relativePath }),
          fixAvailable: true,
          autoFixSafe: false,
          tags: ["contract-check"],
        }),
      );
    }
  }
  return findings;
}

export async function writeSemaEvent(root: string, finding: Finding): Promise<string> {
  const dir = resolve(root, ".sentryward", "sema-events");
  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir(dir, { recursive: true });
  const path = resolve(dir, `${finding.fingerprint}.json`);
  const event = {
    source: "sentryward",
    type: "security_finding",
    severity: finding.severity,
    findingId: finding.id,
    file: finding.file,
    risk: finding.ruleId,
    requiresContract: ["critical", "high"].includes(finding.severity),
    requiresDriftCheck: true,
  };
  await writeFile(path, `${JSON.stringify(event, null, 2)}\n`, "utf8");
  return path;
}

export function hasSemaProject(root: string): boolean {
  return existsSync(resolve(root, "sema.config.json")) || existsSync(resolve(root, "SEMA_INDEX.json"));
}
