// SEMA-GOVERNED: module sentryward.ui; local UI server follows contratos/sentryward_ui.sema.
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { dirname, extname, isAbsolute, parse, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultConfig, loadConfig, resolveLanguage, updateConfig } from "./config.js";
import { normalizeLanguage } from "./i18n.js";
import { detectProject } from "./projectDetector.js";
import { scanProject } from "./scanner.js";
import { countBySeverity } from "./severity.js";
import { readScanResult } from "./storage.js";
import type { Language, ScanResult, Severity } from "../types/index.js";

const UI_VERSION = "0.1.7";
const DEFAULT_PORT = 7331;
const HOST = "127.0.0.1";

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

export interface UiServerOptions {
  root: string;
  lang?: Language;
  port?: number;
}

export interface UiServerHandle {
  server: Server;
  url: string;
  close(): Promise<void>;
}

export interface LocalDirectoryEntry {
  name: string;
  path: string;
}

export interface LocalDirectoryListing {
  current: string;
  parent?: string;
  entries: LocalDirectoryEntry[];
  drives: string[];
}

export interface SourceContextLine {
  number: number;
  text: string;
  hit: boolean;
}

export interface SourceContext {
  file: string;
  line: number;
  start: number;
  end: number;
  lines: SourceContextLine[];
}

interface UiRuntimeState {
  root: string;
  language: Language;
}

function uiRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), "..", "ui");
}

function normalizePort(port?: number): number {
  if (port === undefined || Number.isNaN(port) || port < 0 || port > 65_535) {
    return DEFAULT_PORT;
  }
  return Math.trunc(port);
}

function isAddressInUse(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "EADDRINUSE",
  );
}

function writeJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(`${JSON.stringify(payload)}\n`);
}

function writeError(response: ServerResponse, status: number, message: string): void {
  writeJson(response, status, { ok: false, error: message });
}

async function readBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) {
    return {};
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

function resolveLocalPath(input: unknown, fallback: string): string {
  const raw = typeof input === "string" && input.trim() ? input.trim() : fallback;
  return isAbsolute(raw) ? resolve(raw) : resolve(fallback, raw);
}

function resolveProjectFile(root: string, relativePath: string): string {
  if (!relativePath || isAbsolute(relativePath)) {
    throw new Error("Use a relative file path inside the active project.");
  }
  const projectRoot = resolve(root);
  const filePath = resolve(projectRoot, relativePath);
  const boundary = projectRoot.endsWith(sep) ? projectRoot : `${projectRoot}${sep}`;
  if (!(filePath === projectRoot || filePath.startsWith(boundary))) {
    throw new Error("File is outside the active project.");
  }
  return filePath;
}

function windowsDrives(): string[] {
  if (process.platform !== "win32") {
    const root = parse(process.cwd()).root;
    return root ? [root] : [];
  }
  const drives: string[] = [];
  for (let code = 65; code <= 90; code += 1) {
    const drive = `${String.fromCharCode(code)}:\\`;
    if (existsSync(drive)) {
      drives.push(drive);
    }
  }
  return drives;
}

export async function listLocalDirectories(basePath: string): Promise<LocalDirectoryListing> {
  const current = resolve(basePath);
  const entries = await readdir(current, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ name: entry.name, path: resolve(current, entry.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const parent = dirname(current);
  return {
    current,
    parent: parent === current ? undefined : parent,
    entries: directories,
    drives: windowsDrives(),
  };
}

export async function readSourceContext(
  root: string,
  relativePath: string,
  line: number,
  radius = 5,
): Promise<SourceContext> {
  const filePath = resolveProjectFile(root, relativePath);
  const safeLine = Math.max(1, Math.trunc(Number.isFinite(line) ? line : 1));
  const safeRadius = Math.max(2, Math.min(12, Math.trunc(radius)));
  const source = (await readFile(filePath, "utf8")).split(/\r?\n/);
  const start = Math.max(1, safeLine - safeRadius);
  const end = Math.min(source.length, safeLine + safeRadius);
  const lines = [];
  for (let lineNumber = start; lineNumber <= end; lineNumber += 1) {
    lines.push({
      number: lineNumber,
      text: source[lineNumber - 1] ?? "",
      hit: lineNumber === safeLine,
    });
  }
  return { file: relativePath, line: safeLine, start, end, lines };
}

function severityCounts(result: ScanResult | undefined): Record<Severity, number> {
  return countBySeverity(result?.findings ?? []);
}

async function overview(root: string, language: Language): Promise<Record<string, unknown>> {
  const [config, project, scan] = await Promise.all([
    loadConfig(root).catch(() => defaultConfig),
    detectProject(root),
    readScanResult(root),
  ]);
  const activeLanguage = resolveLanguage(config, language);
  return {
    ok: true,
    version: UI_VERSION,
    language: activeLanguage,
    project,
    config,
    scan,
    counts: severityCounts(scan),
    generatedAt: new Date().toISOString(),
  };
}

async function serveStatic(requestUrl: URL, response: ServerResponse): Promise<void> {
  const root = uiRoot();
  const pathname = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  const relativePath = pathname.replace(/^\/+/, "");
  const filePath = resolve(root, relativePath);
  const rootBoundary = root.endsWith(sep) ? root : `${root}${sep}`;

  if (!(filePath === root || filePath.startsWith(rootBoundary)) || !existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  response.end(await readFile(filePath));
}

async function handleApi(
  request: IncomingMessage,
  response: ServerResponse,
  requestUrl: URL,
  state: UiRuntimeState,
): Promise<void> {
  if (request.method === "GET" && requestUrl.pathname === "/api/overview") {
    writeJson(response, 200, await overview(state.root, state.language));
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/api/directories") {
    const target = resolveLocalPath(requestUrl.searchParams.get("path"), state.root);
    writeJson(response, 200, { ok: true, directory: await listLocalDirectories(target) });
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/api/source") {
    const file = requestUrl.searchParams.get("file");
    if (!file) {
      writeError(response, 400, "Missing file parameter.");
      return;
    }
    const line = Number(requestUrl.searchParams.get("line") ?? 1);
    writeJson(response, 200, { ok: true, source: await readSourceContext(state.root, file, line) });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/scan") {
    const body = await readBody(request);
    const target = resolveLocalPath(body.target, state.root);
    const result = await scanProject({
      target,
      storageRoot: state.root,
      lang: state.language,
      contractCheck: Boolean(body.contractCheck),
    });
    writeJson(response, 200, { ok: true, scan: result, counts: severityCounts(result) });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/root") {
    const body = await readBody(request);
    const nextRoot = resolveLocalPath(body.path, state.root);
    await listLocalDirectories(nextRoot);
    state.root = nextRoot;
    writeJson(response, 200, { ok: true, root: state.root, overview: await overview(state.root, state.language) });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/language") {
    const body = await readBody(request);
    const requested = typeof body.language === "string" ? body.language : undefined;
    const normalizedLanguage = normalizeLanguage(requested);
    if (!normalizedLanguage) {
      writeError(response, 400, "Unsupported language. Use en, pt-BR, or es.");
      return;
    }
    const nextConfig = await updateConfig(state.root, (config) => ({
      ...config,
      language: normalizedLanguage,
    }));
    state.language = nextConfig.language;
    let refreshedScan = false;
    if (body.refreshScan === true && (await readScanResult(state.root))) {
      await scanProject({ target: state.root, storageRoot: state.root, lang: state.language });
      refreshedScan = true;
    }
    writeJson(response, 200, {
      ok: true,
      language: state.language,
      refreshedScan,
      overview: await overview(state.root, state.language),
    });
    return;
  }

  writeError(response, 404, "Unknown API route");
}

export async function createUiServer(options: UiServerOptions): Promise<UiServerHandle> {
  const root = resolve(options.root);
  const config = await loadConfig(root).catch(() => defaultConfig);
  const state: UiRuntimeState = {
    root,
    language: resolveLanguage(config, options.lang),
  };
  const requestedPort = normalizePort(options.port);

  const server = createServer((request, response) => {
    void (async () => {
      try {
        const requestUrl = new URL(request.url ?? "/", `http://${HOST}`);
        if (requestUrl.pathname.startsWith("/api/")) {
          await handleApi(request, response, requestUrl, state);
          return;
        }
        await serveStatic(requestUrl, response);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        writeError(response, 500, message);
      }
    })();
  });

  async function listen(port: number): Promise<void> {
    await new Promise<void>((resolveListen, rejectListen) => {
      server.once("error", rejectListen);
      server.listen(port, HOST, () => {
        server.off("error", rejectListen);
        resolveListen();
      });
    });
  }

  try {
    await listen(requestedPort);
  } catch (error) {
    if (!isAddressInUse(error) || requestedPort === 0) {
      throw error;
    }
    await listen(0);
  }

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : requestedPort;
  const url = `http://${HOST}:${port}/`;

  return {
    server,
    url,
    close() {
      return new Promise((resolveClose, rejectClose) => {
        server.close((error) => (error ? rejectClose(error) : resolveClose()));
      });
    },
  };
}
