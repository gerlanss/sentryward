// SEMA-GOVERNED: module sentryward.scanner; secrets guard is deterministic and local-only.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const secretsGuard: Guard = {
  name: "secrets",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-SECRETS-002",
        category: "secrets",
        severity: "critical",
        confidence: 0.98,
        pattern: /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/g,
        tags: ["openai", "secret"],
      },
      {
        ruleId: "SW-SECRETS-001",
        category: "secrets",
        severity: "critical",
        confidence: 0.98,
        pattern: /sk_(?:live|test)_[A-Za-z0-9]{12,}/g,
        tags: ["stripe", "secret"],
      },
      {
        ruleId: "SW-SECRETS-010",
        category: "secrets",
        severity: "high",
        confidence: 0.95,
        pattern: /whsec_[A-Za-z0-9]{12,}/g,
        tags: ["stripe", "webhook"],
      },
      {
        ruleId: "SW-SECRETS-003",
        category: "secrets",
        severity: "critical",
        confidence: 0.9,
        pattern: /(SUPABASE_SERVICE_ROLE_KEY|service_role)[\w\s:=.'"`-]{0,40}(eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,})/gi,
        tags: ["supabase", "service-role"],
      },
      {
        ruleId: "SW-SECRETS-004",
        category: "secrets",
        severity: "critical",
        confidence: 0.9,
        pattern: /AKIA[0-9A-Z]{16}/g,
        tags: ["aws", "secret"],
      },
      {
        ruleId: "SW-SECRETS-005",
        category: "secrets",
        severity: "critical",
        confidence: 0.9,
        pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/g,
        tags: ["github", "token"],
      },
      {
        ruleId: "SW-SECRETS-006",
        category: "secrets",
        severity: "critical",
        confidence: 0.88,
        pattern: /(postgres(?:ql)?|mysql):\/\/[^:\s]+:[^@\s]+@[^/\s]+\/[^\s"'`]+/gi,
        tags: ["database", "url"],
      },
      {
        ruleId: "SW-SECRETS-007",
        category: "secrets",
        severity: "critical",
        confidence: 0.98,
        pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
        tags: ["private-key"],
      },
      {
        ruleId: "SW-SECRETS-008",
        category: "secrets",
        severity: "critical",
        confidence: 0.9,
        pattern: /APP_USR-[A-Za-z0-9_-]{20,}/g,
        tags: ["mercado-pago", "token"],
      },
      {
        ruleId: "SW-SECRETS-011",
        category: "secrets",
        severity: "high",
        confidence: 0.72,
        pattern: /(JWT_SECRET|SESSION_SECRET|TOKEN_SECRET|AUTH_SECRET)[\w\s:=.'"`-]{0,20}[A-Za-z0-9+/=_-]{24,}/gi,
        tags: ["jwt", "secret"],
      },
    ]);
  },
};
