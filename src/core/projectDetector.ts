// SEMA-GOVERNED: module sentryward.scanner; project detection follows contratos/sentryward_scanner.sema.
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import type { ProjectInfo } from "../types/index.js";

async function readJson(path: string): Promise<Record<string, unknown> | undefined> {
  if (!existsSync(path)) {
    return undefined;
  }
  try {
    return JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

function hasDependency(packageJson: Record<string, unknown> | undefined, name: string): boolean {
  if (!packageJson) {
    return false;
  }
  const dependencies = {
    ...((packageJson.dependencies as Record<string, string> | undefined) ?? {}),
    ...((packageJson.devDependencies as Record<string, string> | undefined) ?? {}),
  };
  return Object.prototype.hasOwnProperty.call(dependencies, name);
}

export async function detectProject(root: string): Promise<ProjectInfo> {
  const packageJson = await readJson(resolve(root, "package.json"));
  const stack = new Set<string>();

  if (packageJson) {
    stack.add("Node.js");
  }
  if (hasDependency(packageJson, "next") || existsSync(resolve(root, "next.config.js"))) {
    stack.add("Next.js");
  }
  if (hasDependency(packageJson, "react")) {
    stack.add("React");
  }
  if (existsSync(resolve(root, "vite.config.ts")) || existsSync(resolve(root, "vite.config.js"))) {
    stack.add("Vite");
  }
  if (hasDependency(packageJson, "express")) {
    stack.add("Express");
  }
  if (hasDependency(packageJson, "stripe")) {
    stack.add("Stripe");
  }
  if (hasDependency(packageJson, "@supabase/supabase-js") || existsSync(resolve(root, "supabase", "config.toml"))) {
    stack.add("Supabase");
  }
  if (existsSync(resolve(root, "firebase.json"))) {
    stack.add("Firebase");
  }
  if (existsSync(resolve(root, "requirements.txt"))) {
    const reqs = await readFile(resolve(root, "requirements.txt"), "utf8");
    if (/flask/i.test(reqs)) stack.add("Flask");
    if (/fastapi/i.test(reqs)) stack.add("FastAPI");
    if (/django/i.test(reqs)) stack.add("Django");
  }
  if (existsSync(resolve(root, "manage.py"))) {
    stack.add("Django");
  }
  if (existsSync(resolve(root, "composer.json"))) {
    stack.add("Laravel");
  }
  if (existsSync(resolve(root, "pubspec.yaml"))) {
    stack.add("Flutter");
  }
  if (existsSync(resolve(root, "Dockerfile")) || existsSync(resolve(root, "docker-compose.yml"))) {
    stack.add("Docker");
  }
  if (existsSync(resolve(root, "pnpm-lock.yaml")) || existsSync(resolve(root, "package-lock.json"))) {
    stack.add("JavaScript dependencies");
  }
  if (stack.has("Supabase") || existsSync(resolve(root, "schema.prisma"))) {
    stack.add("PostgreSQL");
  }
  if (existsSync(resolve(root, "pyproject.toml"))) {
    stack.add("Python");
  }

  const name =
    typeof packageJson?.name === "string" && packageJson.name.length > 0
      ? packageJson.name
      : basename(root);

  return {
    name,
    root,
    stack: [...stack],
  };
}
