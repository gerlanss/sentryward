// SEMA-GOVERNED: module sentryward.scanner; Firebase guard checks service accounts and public rules.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const firebaseGuard: Guard = {
  name: "firebase",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-FIREBASE-001",
        category: "firebase",
        severity: "critical",
        confidence: 0.95,
        pattern: /"type"\s*:\s*"service_account"[\s\S]{0,600}"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----/gi,
        tags: ["service-account"],
      },
      {
        ruleId: "SW-FIREBASE-002",
        category: "firebase",
        severity: "critical",
        confidence: 0.88,
        pattern: /allow\s+(read|write|read,\s*write)\s*:\s*if\s+true\s*;/gi,
        path: /\.(rules|firebaserules)$/i,
        tags: ["public-rules"],
      },
    ]);
  },
};
