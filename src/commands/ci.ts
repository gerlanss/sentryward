// SEMA-GOVERNED: module sentryward.cli; CI workflow generation follows contratos/sentryward_cli.sema.
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import pc from "picocolors";
import type { Translator } from "../types/index.js";

export async function runCiInitCommand(options: { t: Translator; root?: string }): Promise<void> {
  const root = resolve(options.root ?? process.cwd());
  const workflowDir = resolve(root, ".github", "workflows");
  await mkdir(workflowDir, { recursive: true });
  const path = resolve(workflowDir, "sentryward.yml");
  await writeFile(
    path,
    `name: SentryWard

on:
  pull_request:
  push:
    branches: [main]

jobs:
  sentryward:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: node dist/cli.js scan . --contract-check
      - run: node dist/cli.js report --json --html
        if: always()
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: sentryward-report
          path: |
            sentryward-report.json
            sentryward-report.html
`,
    "utf8",
  );
  console.log(pc.green(options.t("ci.created", { file: path })));
}
