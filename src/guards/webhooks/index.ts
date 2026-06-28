// SEMA-GOVERNED: module sentryward.scanner; webhook guard checks signature verification evidence.
import type { Finding, Guard } from "../../types/index.js";
import { createFinding } from "../../core/finding.js";
import { hasSignatureVerification } from "../utils.js";

export const webhooksGuard: Guard = {
  name: "webhooks",
  run(files, context) {
    const findings: Finding[] = [];
    for (const file of files) {
      const isWebhook =
        /webhook/i.test(file.relativePath) ||
        (/webhook/i.test(file.content) && /(POST|handler|route|req|Request)/i.test(file.content));
      if (!isWebhook || hasSignatureVerification(file.content)) {
        continue;
      }
      findings.push(
        createFinding(context.t, {
          ruleId: "SW-WEBHOOK-001",
          category: "webhooks",
          severity: "high",
          confidence: 0.84,
          file: file.relativePath,
          line: Math.max(1, file.lines.findIndex((line) => /webhook|POST|handler|stripe/i.test(line)) + 1),
          evidence: context.t("evidence.webhookNoSignature"),
          tags: ["webhook", "signature"],
        }),
      );
    }
    return findings;
  },
};
