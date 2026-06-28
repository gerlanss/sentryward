// SEMA-GOVERNED: module sentryward.scanner; browser exposure guard follows the "browser can see it" model.
import type { Finding, Guard } from "../../types/index.js";
import { createFinding } from "../../core/finding.js";
import { isFrontendFile, scanPatterns } from "../utils.js";

export const browserExposureGuard: Guard = {
  name: "browserExposure",
  run(files, context) {
    const findings: Finding[] = [];

    findings.push(
      ...scanPatterns(files, context, [
        {
          ruleId: "SW-BROWSER-003",
          category: "browserExposure",
          severity: "medium",
          confidence: 0.82,
          pattern: /productionBrowserSourceMaps\s*:\s*true|sourcemap\s*:\s*true/gi,
          tags: ["source-map"],
        },
        {
          ruleId: "SW-BROWSER-005",
          category: "browserExposure",
          severity: "medium",
          confidence: 0.78,
          pattern: /(NEXT_PUBLIC_|VITE_|PUBLIC_|EXPO_PUBLIC_)[A-Z0-9_]*(SECRET|TOKEN|PRIVATE|SERVICE_ROLE)[A-Z0-9_]*/gi,
          tags: ["public-env"],
        },
      ]),
    );

    for (const file of files.filter((candidate) => isFrontendFile(candidate.relativePath))) {
      for (const [index, line] of file.lines.entries()) {
        if (/sk_(live|test)_|sk-(proj-)?|AKIA|gh[pousr]_|APP_USR-|whsec_/i.test(line)) {
          findings.push(
            createFinding(context.t, {
              ruleId: "SW-BROWSER-001",
              category: "browserExposure",
              severity: "critical",
              confidence: 0.92,
              file: file.relativePath,
              line: index + 1,
              evidence: line,
              tags: ["frontend-secret"],
            }),
          );
        }
        if (/["'`](\/api\/admin|\/admin|\/internal|\/debug|\/dev|\/test|\/seed|\/users|\/billing|\/payments|\/delete|\/reset|\/export|\/recalculate)/i.test(line)) {
          findings.push(
            createFinding(context.t, {
              ruleId: "SW-BROWSER-002",
              category: "browserExposure",
              severity: "medium",
              confidence: 0.74,
              file: file.relativePath,
              line: index + 1,
              evidence: line,
              tags: ["sensitive-route"],
            }),
          );
        }
        if (/console\.(log|debug|info)\s*\([^)]*(token|secret|jwt|password|authorization)/i.test(line)) {
          findings.push(
            createFinding(context.t, {
              ruleId: "SW-BROWSER-004",
              category: "browserExposure",
              severity: "medium",
              confidence: 0.78,
              file: file.relativePath,
              line: index + 1,
              evidence: line,
              tags: ["console-log"],
            }),
          );
        }
      }
    }

    return findings;
  },
};
