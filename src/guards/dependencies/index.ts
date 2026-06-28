// SEMA-GOVERNED: module sentryward.scanner; dependency guard is offline and heuristic.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const dependenciesGuard: Guard = {
  name: "dependencies",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-DEPS-001",
        category: "dependencies",
        severity: "medium",
        confidence: 0.78,
        pattern: /"(preinstall|install|postinstall)"\s*:\s*"[^"]+"/gi,
        path: /package\.json$/i,
        tags: ["install-script"],
      },
      {
        ruleId: "SW-DEPS-002",
        category: "dependencies",
        severity: "medium",
        confidence: 0.72,
        pattern: /"(?:dependencies|devDependencies)"\s*:\s*\{[\s\S]*"(react-domm|lodahs|expres|nextjs|strpie|supabse)"\s*:/gi,
        path: /package\.json$/i,
        tags: ["typosquat"],
      },
      {
        ruleId: "SW-DEPS-003",
        category: "dependencies",
        severity: "medium",
        confidence: 0.74,
        pattern: /"(?:git\+https?|github:|file:|link:)/gi,
        path: /package\.json$/i,
        tags: ["non-registry"],
      },
    ]);
  },
};
