// SEMA-GOVERNED: module sentryward.ui; local UI server follows contratos/sentryward_ui.sema.
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultConfig, loadConfig, resolveLanguage, updateConfig } from "./config.js";
import { normalizeLanguage } from "./i18n.js";
import { detectProject } from "./projectDetector.js";
import { scanProject } from "./scanner.js";
import { countBySeverity } from "./severity.js";
import { readScanResult } from "./storage.js";
import type { Language, ScanResult, Severity } from "../types/index.js";

const UI_VERSION = "0.1.5";
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
  root: string,
  language: Language,
): Promise<Language> {
  if (request.method === "GET" && requestUrl.pathname === "/api/overview") {
    writeJson(response, 200, await overview(root, language));
    return language;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/scan") {
    const body = await readBody(request);
    const target = typeof body.target === "string" && body.target.trim() ? resolve(root, body.target) : root;
    const result = await scanProject({
      target,
      storageRoot: root,
      lang: language,
      contractCheck: Boolean(body.contractCheck),
    });
    writeJson(response, 200, { ok: true, scan: result, counts: severityCounts(result) });
    return language;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/language") {
    const body = await readBody(request);
    const requested = typeof body.language === "string" ? body.language : undefined;
    const normalizedLanguage = normalizeLanguage(requested);
    if (!normalizedLanguage) {
      writeError(response, 400, "Unsupported language. Use en, pt-BR, or es.");
      return language;
    }
    const nextConfig = await updateConfig(root, (config) => ({
      ...config,
      language: normalizedLanguage,
    }));
    const nextLanguage = nextConfig.language;
    writeJson(response, 200, { ok: true, language: nextLanguage, overview: await overview(root, nextLanguage) });
    return nextLanguage;
  }

  writeError(response, 404, "Unknown API route");
  return language;
}

export async function createUiServer(options: UiServerOptions): Promise<UiServerHandle> {
  const root = resolve(options.root);
  const config = await loadConfig(root).catch(() => defaultConfig);
  let language = resolveLanguage(config, options.lang);
  const requestedPort = normalizePort(options.port);

  const server = createServer((request, response) => {
    void (async () => {
      try {
        const requestUrl = new URL(request.url ?? "/", `http://${HOST}`);
        if (requestUrl.pathname.startsWith("/api/")) {
          language = await handleApi(request, response, requestUrl, root, language);
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
