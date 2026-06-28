// SEMA-GOVERNED: module sentryward.scanner; Docker guard inspects local infra files.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const dockerGuard: Guard = {
  name: "docker",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-DOCKER-001",
        category: "docker",
        severity: "medium",
        confidence: 0.8,
        pattern: /^FROM\s+\S+:latest\b/gim,
        path: /(^|\/)(Dockerfile|.*\.Dockerfile)$/i,
        tags: ["latest"],
      },
      {
        ruleId: "SW-DOCKER-002",
        category: "docker",
        severity: "high",
        confidence: 0.82,
        pattern: /COPY\s+\.env|ADD\s+\.env/gi,
        path: /(^|\/)(Dockerfile|.*\.Dockerfile)$/i,
        tags: ["env"],
      },
      {
        ruleId: "SW-DOCKER-003",
        category: "docker",
        severity: "medium",
        confidence: 0.74,
        pattern: /^(?!.*USER\s+).*(?:CMD|ENTRYPOINT)/gim,
        path: /(^|\/)(Dockerfile|.*\.Dockerfile)$/i,
        tags: ["root"],
      },
      {
        ruleId: "SW-DOCKER-004",
        category: "docker",
        severity: "critical",
        confidence: 0.9,
        pattern: /privileged\s*:\s*true|network_mode\s*:\s*host|\/var\/run\/docker\.sock/gi,
        path: /docker-compose\.(ya?ml)$/i,
        tags: ["compose"],
      },
      {
        ruleId: "SW-DOCKER-005",
        category: "docker",
        severity: "medium",
        confidence: 0.74,
        pattern: /["']?(5432|3306|6379|27017):\1["']?/g,
        path: /docker-compose\.(ya?ml)$/i,
        tags: ["public-db-port"],
      },
    ]);
  },
};
