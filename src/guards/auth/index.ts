// SEMA-GOVERNED: module sentryward.scanner; auth guard detects bypasses and missing role checks.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const authGuard: Guard = {
  name: "auth",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-AUTH-001",
        category: "auth",
        severity: "high",
        confidence: 0.9,
        pattern: /isAdmin\s*[:=]\s*(?:async\s*)?(?:function\s*)?\(?[^=\n]*\)?\s*=>?\s*(?:true|Promise\.resolve\(true\))|function\s+isAdmin[\s\S]{0,120}return\s+true/gi,
        tags: ["admin", "bypass"],
      },
      {
        ruleId: "SW-AUTH-002",
        category: "auth",
        severity: "high",
        confidence: 0.82,
        pattern: /(TODO|FIXME|HACK).{0,40}(auth|authentication|authorization|role|permission).{0,40}(later|soon|before prod)?/gi,
        tags: ["todo-auth"],
      },
      {
        ruleId: "SW-AUTH-003",
        category: "auth",
        severity: "high",
        confidence: 0.78,
        pattern: /(localStorage|sessionStorage)\.getItem\(["'`](role|isAdmin|permission)["'`]\)|if\s*\([^)]*(role|isAdmin|permission)[^)]*\)\s*{[\s\S]{0,120}(fetch|axios)/gi,
        tags: ["frontend-only-auth"],
      },
      {
        ruleId: "SW-AUTH-004",
        category: "auth",
        severity: "high",
        confidence: 0.7,
        pattern: /(params\.id|req\.params\.id|userId).{0,160}(findUnique|findById|select|where).{0,80}(?!ownerId|tenantId|user\.id|session\.user)/gis,
        excludePath: /(^|\/)(prisma\/seed\.ts|[^/]*seed\.(ts|tsx|js|jsx))$/i,
        tags: ["ownership"],
      },
      {
        ruleId: "SW-AUTH-004",
        category: "auth",
        severity: "info",
        confidence: 0.45,
        pattern: /(params\.id|req\.params\.id|userId).{0,160}(findUnique|findById|select|where).{0,80}(?!ownerId|tenantId|user\.id|session\.user)/gis,
        path: /(^|\/)(prisma\/seed\.ts|[^/]*seed\.(ts|tsx|js|jsx))$/i,
        fixAvailable: false,
        tags: ["ownership", "seed-demo"],
      },
    ]);
  },
};
