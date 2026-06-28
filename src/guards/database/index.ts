// SEMA-GOVERNED: module sentryward.scanner; database guard detects unsafe local query patterns.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const databaseGuard: Guard = {
  name: "database",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-DB-001",
        category: "database",
        severity: "critical",
        confidence: 0.86,
        pattern: /(query|execute|rawQuery)\s*\(\s*`[^`]*(SELECT|UPDATE|DELETE|INSERT)[^`]*\$\{/gi,
        tags: ["sql-injection"],
      },
      {
        ruleId: "SW-DB-002",
        category: "database",
        severity: "critical",
        confidence: 0.82,
        pattern: /\$queryRawUnsafe|executeRawUnsafe|raw\s*\(\s*["'`][^"'`]*(SELECT|UPDATE|DELETE|INSERT)[^"'`]*\s*\+/gi,
        tags: ["unsafe-raw-query"],
      },
      {
        ruleId: "SW-DB-003",
        category: "database",
        severity: "high",
        confidence: 0.78,
        pattern: /\b(DELETE|UPDATE)\s+[\w".]+\s*;?\s*(?:$|--)/gim,
        path: /\.(sql)$/i,
        tags: ["missing-where"],
      },
      {
        ruleId: "SW-DB-004",
        category: "database",
        severity: "high",
        confidence: 0.82,
        pattern: /ALTER\s+TABLE\s+[\w".]+\s+DISABLE\s+ROW\s+LEVEL\s+SECURITY/gi,
        path: /\.(sql)$/i,
        tags: ["rls"],
      },
    ]);
  },
};
