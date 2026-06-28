// SEMA-GOVERNED: module sentryward.scanner; CI guard inspects GitHub Actions risk patterns.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const ciGuard: Guard = {
  name: "ci",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-CI-001",
        category: "ci",
        severity: "critical",
        confidence: 0.92,
        pattern: /pull_request_target/gi,
        path: /^\.github\/workflows\/.*\.ya?ml$/i,
        tags: ["pull-request-target"],
      },
      {
        ruleId: "SW-CI-002",
        category: "ci",
        severity: "high",
        confidence: 0.78,
        pattern: /run:\s*.*(echo|printenv|env).*\$\{\{\s*secrets\./gi,
        path: /^\.github\/workflows\/.*\.ya?ml$/i,
        tags: ["secrets-log"],
      },
      {
        ruleId: "SW-CI-003",
        category: "ci",
        severity: "medium",
        confidence: 0.7,
        pattern: /uses:\s+[^@\s]+\/[^@\s]+@(main|master|HEAD|v\d+)$/gim,
        path: /^\.github\/workflows\/.*\.ya?ml$/i,
        tags: ["unpinned-action"],
      },
    ]);
  },
};
