// SEMA-GOVERNED: module sentryward.scanner; CORS and CSRF checks are local static heuristics.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const corsGuard: Guard = {
  name: "cors",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-CORS-001",
        category: "cors",
        severity: "high",
        confidence: 0.86,
        pattern: /(Access-Control-Allow-Origin["']?\s*,\s*["']\*|origin\s*:\s*["']\*["'])/gi,
        tags: ["cors"],
      },
      {
        ruleId: "SW-CORS-002",
        category: "cors",
        severity: "critical",
        confidence: 0.86,
        pattern: /origin\s*:\s*["']\*["'][\s\S]{0,120}credentials\s*:\s*true|credentials\s*:\s*true[\s\S]{0,120}origin\s*:\s*["']\*["']/gi,
        tags: ["cors", "credentials"],
      },
    ]);
  },
};
