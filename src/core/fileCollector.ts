// SEMA-GOVERNED: module sentryward.scanner; local file collection follows contratos/sentryward_scanner.sema.
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import fg from "fast-glob";
import ignore from "ignore";
import type { FileContext } from "../types/index.js";
import { defaultIgnore } from "./config.js";

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".env",
  ".yaml",
  ".yml",
  ".toml",
  ".sql",
  ".py",
  ".php",
  ".rb",
  ".go",
  ".java",
  ".cs",
  ".dart",
  ".md",
  ".txt",
  ".rules",
  ".html",
  ".css",
  ".scss",
  ".dockerfile",
  "",
]);

function extension(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith("dockerfile")) {
    return ".dockerfile";
  }
  const dot = lower.lastIndexOf(".");
  return dot === -1 ? "" : lower.slice(dot);
}

async function loadIgnore(root: string) {
  const ig = ignore();
  ig.add(defaultIgnore);

  for (const file of [".gitignore", ".sentrywardignore"]) {
    const path = resolve(root, file);
    if (existsSync(path)) {
      ig.add(await readFile(path, "utf8"));
    }
  }

  return ig;
}

export async function collectFiles(root: string, changedFiles?: string[]): Promise<FileContext[]> {
  const absoluteRoot = resolve(root);
  const ig = await loadIgnore(absoluteRoot);
  const entries =
    changedFiles && changedFiles.length > 0
      ? changedFiles.map((file) => relative(absoluteRoot, resolve(file)).replace(/\\/g, "/"))
      : await fg(["**/*"], {
          cwd: absoluteRoot,
          dot: true,
          onlyFiles: true,
          followSymbolicLinks: false,
        });

  const files: FileContext[] = [];

  for (const entry of entries) {
    const normalized = entry.replace(/\\/g, "/");
    if (ig.ignores(normalized) || !textExtensions.has(extension(normalized))) {
      continue;
    }

    const path = resolve(absoluteRoot, normalized);
    try {
      const content = await readFile(path, "utf8");
      if (content.includes("\u0000")) {
        continue;
      }
      files.push({
        path,
        relativePath: normalized,
        content,
        lines: content.split(/\r?\n/),
      });
    } catch {
      // Files can vanish during watch mode. Ignore and let the next event settle.
    }
  }

  return files;
}
