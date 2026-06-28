// SEMA-GOVERNED: module sentryward.scanner; prompt injection guard detects unsafe LLM wiring patterns.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const promptInjectionGuard: Guard = {
  name: "promptInjection",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-PROMPT-001",
        category: "promptInjection",
        severity: "high",
        confidence: 0.78,
        pattern: /(system|developer)\s*:\s*`[^`]*\$\{(user|document|input|content)[^}]*\}/gi,
        tags: ["prompt-priority"],
      },
      {
        ruleId: "SW-PROMPT-002",
        category: "promptInjection",
        severity: "medium",
        confidence: 0.74,
        pattern: /follow the instructions in (this|the) (document|file|content)|treat .* as system instructions/gi,
        tags: ["untrusted-instructions"],
      },
      {
        ruleId: "SW-PROMPT-003",
        category: "promptInjection",
        severity: "critical",
        confidence: 0.86,
        pattern: /(exec|spawn|eval|Function)\s*\(\s*(llm|model|completion|response)\./gi,
        tags: ["llm-code-exec"],
      },
      {
        ruleId: "SW-PROMPT-004",
        category: "promptInjection",
        severity: "critical",
        confidence: 0.82,
        pattern: /(OPENAI_API_KEY|STRIPE_SECRET|DATABASE_URL|SUPABASE_SERVICE_ROLE_KEY)[\s\S]{0,120}(prompt|messages|system)/gi,
        tags: ["secret-in-prompt"],
      },
    ]);
  },
};
