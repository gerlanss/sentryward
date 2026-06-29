import { describe, expect, it } from "vitest";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { scanProject } from "../src/core/scanner.js";
import { loadTranslator } from "../src/core/i18n.js";

const vulnerableRoot = resolve("examples/vulnerable-app");

async function ruleIds() {
  const result = await scanProject({ root: vulnerableRoot, persist: false, contractCheck: true });
  return new Set(result.findings.map((finding) => finding.id));
}

describe("SentryWard scanner", () => {
  it("detects required MVP guard findings in the vulnerable app", async () => {
    const ids = await ruleIds();
    expect(ids.has("SW-SECRETS-001")).toBe(true);
    expect(ids.has("SW-SECRETS-002")).toBe(true);
    expect(ids.has("SW-SECRETS-003")).toBe(true);
    expect(ids.has("SW-SECRETS-006")).toBe(true);
    expect(ids.has("SW-SECRETS-008")).toBe(true);
    expect(ids.has("SW-BROWSER-001")).toBe(true);
    expect(ids.has("SW-BROWSER-002")).toBe(true);
    expect(ids.has("SW-BROWSER-003")).toBe(true);
    expect(ids.has("SW-BROWSER-004")).toBe(true);
    expect(ids.has("SW-AUTH-014")).toBe(true);
    expect(ids.has("SW-AUTH-001")).toBe(true);
    expect(ids.has("SW-AUTH-002")).toBe(true);
    expect(ids.has("SW-DB-001")).toBe(true);
    expect(ids.has("SW-DB-002")).toBe(true);
    expect(ids.has("SW-UPLOAD-001")).toBe(true);
    expect(ids.has("SW-CORS-001")).toBe(true);
    expect(ids.has("SW-CORS-002")).toBe(true);
    expect(ids.has("SW-SESSION-001")).toBe(true);
    expect(ids.has("SW-SESSION-002")).toBe(true);
    expect(ids.has("SW-WEBHOOK-001")).toBe(true);
    expect(ids.has("SW-DOCKER-002")).toBe(true);
    expect(ids.has("SW-DOCKER-003")).toBe(true);
    expect(ids.has("SW-DOCKER-004")).toBe(true);
    expect(ids.has("SW-CI-001")).toBe(true);
    expect(ids.has("SW-PROMPT-001")).toBe(true);
    expect(ids.has("SW-PROMPT-003")).toBe(true);
    expect(ids.has("SW-FIREBASE-001")).toBe(true);
    expect(ids.has("SW-FIREBASE-002")).toBe(true);
    expect(ids.has("SW-SUPABASE-002")).toBe(true);
    expect(ids.has("SW-SEMA-001")).toBe(true);
  });

  it("masks secret evidence", async () => {
    const result = await scanProject({ root: vulnerableRoot, persist: false });
    const stripe = result.findings.find((finding) => finding.id === "SW-SECRETS-001");
    expect(stripe?.evidence).toContain("...");
    expect(stripe?.evidence).not.toContain("abcdefghijklmnop");
  });

  it("returns localized finding text", async () => {
    const pt = loadTranslator("pt-BR");
    const es = loadTranslator("es");
    expect(pt("tagline")).toContain("código");
    expect(es("tagline")).toContain("código");
  });

  it("does not need Sema to scan", async () => {
    const result = await scanProject({ root: vulnerableRoot, persist: false, contractCheck: false });
    expect(result.findings.length).toBeGreaterThan(10);
    expect(result.score).toBeLessThan(100);
  });

  it("returns actionable SW-AUTH-004 ownership diagnostics", async () => {
    const root = await mkdtemp(resolve(tmpdir(), "sentryward-auth-"));
    try {
      await mkdir(resolve(root, "src"), { recursive: true });
      await mkdir(resolve(root, "prisma"), { recursive: true });
      const riskyAction = "export async function loadCustomer(userId: string) { return prisma.customer.findUnique({ where: { id: userId } }); }";
      await writeFile(resolve(root, "src/actions.ts"), riskyAction, "utf8");
      await writeFile(resolve(root, "prisma/seed.ts"), riskyAction, "utf8");

      const result = await scanProject({ root, persist: false, lang: "pt-BR" });
      const runtime = result.findings.find((finding) => finding.id === "SW-AUTH-004" && finding.file === "src/actions.ts");
      const seed = result.findings.find((finding) => finding.id === "SW-AUTH-004" && finding.file === "prisma/seed.ts");

      expect(runtime?.severity).toBe("high");
      expect(runtime?.title).toContain("ownership");
      expect(runtime?.problem).toContain("restri\u00e7\u00e3o");
      expect(runtime?.problem).not.toContain("regra local determin\u00edstica");
      expect(seed?.severity).toBe("info");
      expect(seed?.fixAvailable).toBe(false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
