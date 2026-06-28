// SEMA-GOVERNED: module sentryward.cli; configuration is governed by contratos/sentryward_cli.sema.
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";
import type { FindingCategory, Language, WardConfig } from "../types/index.js";
import { normalizeLanguage } from "./i18n.js";

const severitySchema = z.enum(["critical", "high", "medium", "low", "info"]);
const languageSchema = z.enum(["en", "pt-BR", "es"]);

const guardKeys: FindingCategory[] = [
  "secrets",
  "browserExposure",
  "routes",
  "auth",
  "database",
  "uploads",
  "cors",
  "sessions",
  "webhooks",
  "docker",
  "ci",
  "dependencies",
  "promptInjection",
  "supabase",
  "firebase",
  "sema",
];

const guardsSchema = z.object(
  Object.fromEntries(guardKeys.map((key) => [key, z.boolean().default(true)])) as Record<
    FindingCategory,
    z.ZodDefault<z.ZodBoolean>
  >,
);

export const wardConfigSchema = z.object({
  version: z.literal(1),
  language: languageSchema.default("en"),
  watch: z.object({
    enabled: z.boolean().default(true),
    alertThreshold: severitySchema.default("high"),
    debounceMs: z.number().int().min(100).max(10_000).default(600),
  }),
  guards: guardsSchema,
  report: z.object({
    defaultFormat: z.enum(["html", "json"]).default("html"),
  }),
  sema: z.object({
    enabled: z.boolean().default(false),
    contractMode: z.enum(["optional", "required"]).default("optional"),
    driftCheck: z.boolean().default(true),
    impactMap: z.boolean().default(true),
  }),
});

export const defaultConfig: WardConfig = {
  version: 1,
  language: "en",
  watch: {
    enabled: true,
    alertThreshold: "high",
    debounceMs: 600,
  },
  guards: {
    secrets: true,
    browserExposure: true,
    routes: true,
    auth: true,
    database: true,
    uploads: true,
    cors: true,
    sessions: true,
    webhooks: true,
    docker: true,
    ci: true,
    dependencies: true,
    promptInjection: true,
    supabase: true,
    firebase: true,
    sema: true,
  },
  report: {
    defaultFormat: "html",
  },
  sema: {
    enabled: false,
    contractMode: "optional",
    driftCheck: true,
    impactMap: true,
  },
};

export function configPath(root: string): string {
  return resolve(root, ".sentryward", "config.json");
}

export async function loadConfig(root: string): Promise<WardConfig> {
  const path = configPath(root);
  if (!existsSync(path)) {
    return defaultConfig;
  }

  const parsed = JSON.parse(await readFile(path, "utf8")) as unknown;
  return wardConfigSchema.parse({
    ...defaultConfig,
    ...(parsed as Record<string, unknown>),
    watch: { ...defaultConfig.watch, ...((parsed as WardConfig).watch ?? {}) },
    guards: { ...defaultConfig.guards, ...((parsed as WardConfig).guards ?? {}) },
    report: { ...defaultConfig.report, ...((parsed as WardConfig).report ?? {}) },
    sema: { ...defaultConfig.sema, ...((parsed as WardConfig).sema ?? {}) },
  });
}

export async function writeDefaultConfig(root: string, language: Language): Promise<WardConfig> {
  const config: WardConfig = {
    ...defaultConfig,
    language,
  };
  const dir = resolve(root, ".sentryward");
  await mkdir(dir, { recursive: true });
  await writeFile(configPath(root), `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return config;
}

export function resolveLanguage(config: WardConfig, requested?: string): Language {
  return (
    normalizeLanguage(requested) ??
    normalizeLanguage(process.env.SENTRYWARD_LANG) ??
    config.language ??
    "en"
  );
}

export const defaultIgnore = [
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".next",
  ".venv",
  "vendor",
  ".sentryward",
  ".sentryward/**",
];
