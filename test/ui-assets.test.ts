import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("SentryWard UI assets", () => {
  it("renders scan mode and clearer folder picker controls", async () => {
    const html = await readFile("src/ui/index.html", "utf8");
    const app = await readFile("src/ui/app.js", "utf8");

    expect(html).toContain("auto-scan-toggle");
    expect(html).toContain("scan-mode-value");
    expect(html).toContain("project-card-folder-button");
    expect(html).toContain("folder-help");
    expect(app).toContain("class=\"folder-row\"");
    expect(app).toContain("folder-row-action");
    expect(app).toContain("/api/sema");
    expect(app).toContain("Varredura contínua");
    expect(app).toContain("Selecionar projeto");
    expect(app).toContain("ward watch do terminal");
  });
});
