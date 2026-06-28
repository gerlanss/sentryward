// SEMA-GOVERNED: module sentryward.cli; optional Sema companion commands.
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import pc from "picocolors";
import type { Translator } from "../types/index.js";
import { hasSemaProject, listSemaContracts, writeSemaEvent } from "../core/semaGovernance.js";
import { readFindings } from "../core/storage.js";

export async function runSemaStatusCommand(options: { t: Translator; root?: string }): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const contracts = await listSemaContracts(root);
  console.log(`${options.t("sema.status.available")}: ${hasSemaProject(root) ? options.t("common.yes") : options.t("common.no")}`);
  console.log(`${options.t("sema.status.contracts")}: ${contracts.length}`);
  for (const contract of contracts) {
    console.log(`- ${contract}`);
  }
}

export async function runSemaInitCommand(options: { t: Translator; root?: string }): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const dir = resolve(root, "contracts");
  await mkdir(dir, { recursive: true });
  const path = resolve(dir, "sentryward.security.sema");
  if (existsSync(path)) {
    console.log(pc.yellow(options.t("sema.init.exists", { file: path })));
    return;
  }
  await writeFile(
    path,
    `module sentryward.security {
  docs {
    resumo: "Optional starter contract for SentryWard governed security fixes."
  }

  task govern_security_fix {
    input {
      finding_id: Texto required
      arquivo: Texto required
      risco: Texto required
    }
    output {
      permitido: Booleano
      constraints: Lista
    }
    authz { escopo: security.fix.govern tenant: opcional }
    dados { classificacao_padrao: interno redacao_log: obrigatoria }
    audit {
      evento: sentryward.security.fix.governed
      ator: operador.local
      correlacao: processo_cli
      retencao: "30d"
      motivo: obrigatorio
    }
    forbidden { pular_drift pular_impacto log.segredo retorno.credencial }
    rules {
      finding_id deve_ser preenchido
      arquivo deve_ser preenchido
      risco deve_ser preenchido
    }
    effects {
      auditoria sentryward_fix criticidade = alta
    }
    guarantees {
      permitido existe
      constraints existe
    }
    tests {
      caso "governa fix critico" {
        given { finding_id: "SW-AUTH-014" arquivo: "src/api/admin/users.ts" risco: "admin_route_without_auth" }
        expect { sucesso: verdadeiro permitido: verdadeiro }
      }
    }
  }
}
`,
    "utf8",
  );
  console.log(pc.green(options.t("sema.init.created", { file: path })));
}

export async function runSemaSyncCommand(options: { t: Translator; root?: string }): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const findings = await readFindings(root);
  let count = 0;
  for (const finding of findings) {
    await writeSemaEvent(root, finding);
    count += 1;
  }
  console.log(pc.green(options.t("sema.sync.done", { count })));
}
