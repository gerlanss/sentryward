// SEMA-GOVERNED: module sentryward.scanner; database guard detects unsafe local query patterns.
import type { Finding, Guard } from "../../types/index.js";
import { createFinding } from "../../core/finding.js";
import { scanPatterns } from "../utils.js";

function missingWhereFindings(files: Parameters<Guard["run"]>[0], context: Parameters<Guard["run"]>[1]): Finding[] {
  const findings: Finding[] = [];
  for (const file of files) {
    if (!/\.sql$/i.test(file.relativePath)) {
      continue;
    }
    for (const statement of file.content.split(";")) {
      const dmlMatch = statement.match(/^\s*(UPDATE\s+[\w".]+|DELETE\s+FROM\s+[\w".]+)\b/im);
      if (!dmlMatch || /\bWHERE\b/i.test(statement)) {
        continue;
      }
      const index = file.content.indexOf(statement);
      const before = index >= 0 ? file.content.slice(0, index) : "";
      findings.push(
        createFinding(context.t, {
          ruleId: "SW-DB-003",
          category: "database",
          severity: "high",
          confidence: 0.78,
          file: file.relativePath,
          line: before.split(/\r?\n/).length + Math.max(0, statement.slice(0, dmlMatch.index ?? 0).split(/\r?\n/).length - 1),
          evidence: dmlMatch[0],
          tags: ["missing-where"],
        }),
      );
    }
  }
  return findings;
}

export const databaseGuard: Guard = {
  name: "database",
  run(files, context) {
    return [
      ...scanPatterns(files, context, [
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
        ruleId: "SW-DB-004",
        category: "database",
        severity: "high",
        confidence: 0.82,
        pattern: /ALTER\s+TABLE\s+[\w".]+\s+DISABLE\s+ROW\s+LEVEL\s+SECURITY/gi,
        path: /\.(sql)$/i,
        tags: ["rls"],
      },
      ]),
      ...missingWhereFindings(files, context),
    ];
  },
};
