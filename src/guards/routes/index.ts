// SEMA-GOVERNED: module sentryward.scanner; route guard inspects local API surfaces.
import type { Finding, Guard } from "../../types/index.js";
import { createFinding } from "../../core/finding.js";
import { hasBackendAuth } from "../utils.js";

const sensitiveRoute = /(\/api\/admin|\/admin|\/internal|\/debug|\/dev|\/test|\/seed|\/users|\/billing|\/payments|\/delete|\/reset|\/export|\/recalculate)/i;
const routeFile = /(^|\/)(api|routes|controllers|app|pages)(\/|$)|\.(route|controller)\.(ts|js|py|php)$/i;

export const routesGuard: Guard = {
  name: "routes",
  run(files, context) {
    const findings: Finding[] = [];
    for (const file of files) {
      if (!routeFile.test(file.relativePath)) {
        continue;
      }
      if (!sensitiveRoute.test(file.relativePath) && !sensitiveRoute.test(file.content)) {
        continue;
      }
      if (!hasBackendAuth(file.content)) {
        findings.push(
          createFinding(context.t, {
            ruleId: "SW-AUTH-014",
            category: "auth",
            severity: "critical",
            confidence: 0.86,
            file: file.relativePath,
            line: Math.max(1, file.lines.findIndex((line) => /export async function|router\.|app\./i.test(line)) + 1),
            evidence: file.lines.find((line) => /export async function|router\.|app\./i.test(line)) ?? file.relativePath,
            tags: ["auth", "admin-route"],
          }),
        );
      }
      if (/cookie|session/i.test(file.content) && !/csrf|sameSite|SameSite|xsrf/i.test(file.content)) {
        findings.push(
          createFinding(context.t, {
            ruleId: "SW-ROUTES-002",
            category: "routes",
            severity: "medium",
            confidence: 0.7,
            file: file.relativePath,
            line: 1,
            evidence: context.t("evidence.cookieRouteNoCsrf"),
            tags: ["csrf"],
          }),
        );
      }
      if (!/rateLimit|rateLimiter|limiter|slowDown/i.test(file.content) && /login|reset|delete|webhook|admin/i.test(file.content)) {
        findings.push(
          createFinding(context.t, {
            ruleId: "SW-ROUTES-003",
            category: "routes",
            severity: "low",
            confidence: 0.64,
            file: file.relativePath,
            line: 1,
            evidence: context.t("evidence.sensitiveRouteNoRateLimit"),
            tags: ["rate-limit"],
          }),
        );
      }
    }
    return findings;
  },
};
