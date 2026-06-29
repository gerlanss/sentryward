import { afterEach, describe, expect, it } from "vitest";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createUiServer, type UiServerHandle } from "../src/core/uiServer.js";

const tempRoots: string[] = [];
const servers: UiServerHandle[] = [];

async function json(response: Response) {
  expect(response.ok).toBe(true);
  return response.json() as Promise<Record<string, any>>;
}

async function copyVulnerableApp(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "sentryward-ui-"));
  tempRoots.push(root);
  await cp(resolve("examples/vulnerable-app"), root, { recursive: true });
  return root;
}

describe("SentryWard UI server", () => {
  afterEach(async () => {
    await Promise.all(servers.splice(0).map((server) => server.close()));
    await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
  });

  it("refreshes persisted findings when the UI language changes", async () => {
    const root = await copyVulnerableApp();
    const server = await createUiServer({ root, port: 0, lang: "pt-BR" });
    servers.push(server);

    const scan = await json(
      await fetch(`${server.url}api/scan`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ target: "." }),
      }),
    );
    const ptFinding = (scan.scan as any).findings.find((finding: any) => finding.id === "SW-AUTH-014");
    expect(ptFinding.title).toContain("Rota admin sem autentica\u00e7\u00e3o");

    const changed = await json(
      await fetch(`${server.url}api/language`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ language: "en", refreshScan: true }),
      }),
    );
    const enFinding = (changed.overview as any).scan.findings.find((finding: any) => finding.id === "SW-AUTH-014");
    expect(changed.refreshedScan).toBe(true);
    expect(enFinding.title).toContain("Admin route without authentication");
    expect(enFinding.problem).not.toContain("autentica\u00e7\u00e3o");
  });
});
