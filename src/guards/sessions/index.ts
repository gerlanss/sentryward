// SEMA-GOVERNED: module sentryward.scanner; session guard detects insecure local session patterns.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const sessionsGuard: Guard = {
  name: "sessions",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-SESSION-001",
        category: "sessions",
        severity: "high",
        confidence: 0.86,
        pattern: /(localStorage|sessionStorage)\.setItem\(["'`](token|jwt|accessToken|idToken)["'`]/gi,
        tags: ["jwt-storage"],
      },
      {
        ruleId: "SW-SESSION-002",
        category: "sessions",
        severity: "medium",
        confidence: 0.78,
        pattern: /jwt\.sign\([^)]*,\s*[^)]*\)(?![\s\S]{0,80}expiresIn)/gi,
        tags: ["jwt-expiration"],
      },
      {
        ruleId: "SW-SESSION-003",
        category: "sessions",
        severity: "high",
        confidence: 0.82,
        pattern: /setCookie|cookies\.set|res\.cookie/gi,
        tags: ["cookie-settings"],
      },
      {
        ruleId: "SW-SESSION-004",
        category: "sessions",
        severity: "medium",
        confidence: 0.82,
        pattern: /console\.(log|debug|info)\s*\([^)]*(token|jwt|authorization|session)/gi,
        tags: ["token-log"],
      },
    ]).filter((finding) => {
      if (finding.ruleId !== "SW-SESSION-003") return true;
      const file = files.find((candidate) => candidate.relativePath === finding.file);
      return file ? !/httpOnly\s*:\s*true[\s\S]{0,120}secure\s*:\s*true[\s\S]{0,120}sameSite/i.test(file.content) : true;
    });
  },
};
