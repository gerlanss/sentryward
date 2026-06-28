// SEMA-GOVERNED: module sentryward.cli; local storage paths follow contratos/sentryward_cli.sema.
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Finding, ScanResult } from "../types/index.js";

export function sentryWardDir(root: string): string {
  return resolve(root, ".sentryward");
}

export function findingsPath(root: string): string {
  return resolve(sentryWardDir(root), "findings.json");
}

export function cachePath(root: string): string {
  return resolve(sentryWardDir(root), "cache.json");
}

export async function ensureStorage(root: string): Promise<void> {
  await mkdir(sentryWardDir(root), { recursive: true });
  if (!existsSync(findingsPath(root))) {
    await writeFile(findingsPath(root), JSON.stringify({ findings: [], score: 100 }, null, 2), "utf8");
  }
  if (!existsSync(cachePath(root))) {
    await writeFile(cachePath(root), JSON.stringify({ version: 1 }, null, 2), "utf8");
  }
}

export async function writeScanResult(root: string, result: ScanResult): Promise<void> {
  await ensureStorage(root);
  await writeFile(findingsPath(root), `${JSON.stringify(result, null, 2)}\n`, "utf8");
}

export async function readScanResult(root: string): Promise<ScanResult | undefined> {
  const path = findingsPath(root);
  if (!existsSync(path)) {
    return undefined;
  }
  const parsed = JSON.parse(await readFile(path, "utf8")) as Partial<ScanResult>;
  if (!Array.isArray(parsed.findings)) {
    return undefined;
  }
  return parsed as ScanResult;
}

export async function readFindings(root: string): Promise<Finding[]> {
  return (await readScanResult(root))?.findings ?? [];
}

export async function writeSentryWardIgnore(root: string): Promise<void> {
  const path = resolve(root, ".sentrywardignore");
  if (existsSync(path)) {
    return;
  }

  await writeFile(
    path,
    [
      "# SentryWard ignore file",
      "node_modules/",
      ".git/",
      "dist/",
      "build/",
      "coverage/",
      ".next/",
      ".venv/",
      "vendor/",
      "",
    ].join("\n"),
    "utf8",
  );
}
