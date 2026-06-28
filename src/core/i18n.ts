// SEMA-GOVERNED: module sentryward.cli; all CLI-facing strings must resolve through locale files.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Language, Translator } from "../types/index.js";

const allowedLanguages: Language[] = ["en", "pt-BR", "es"];

function localePath(language: Language): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, "..", "locales", `${language}.json`);
}

function lookup(obj: unknown, key: string): string | undefined {
  if (typeof obj === "object" && obj !== null && key in obj) {
    return (obj as Record<string, string>)[key];
  }
  const [head, ...tail] = key.split(".");
  if (!head || tail.length === 0 || typeof obj !== "object" || obj === null || !(head in obj)) {
    return undefined;
  }
  return lookup((obj as Record<string, unknown>)[head], tail.join("."));
}

export function normalizeLanguage(value?: string): Language | undefined {
  if (!value) {
    return undefined;
  }
  return allowedLanguages.find((language) => language.toLowerCase() === value.toLowerCase());
}

export function loadTranslator(language: Language): Translator {
  const fallback = JSON.parse(readFileSync(localePath("en"), "utf8")) as Record<string, unknown>;
  const selected =
    language === "en" ? fallback : (JSON.parse(readFileSync(localePath(language), "utf8")) as Record<string, unknown>);

  return (key, params = {}) => {
    const template = lookup(selected, key) ?? lookup(fallback, key) ?? key;
    return Object.entries(params).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      template,
    );
  };
}
