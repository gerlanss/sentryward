// SEMA-GOVERNED: module sentryward.scanner; webhook guard checks signature verification evidence.
import type { Finding, Guard } from "../../types/index.js";
import { createFinding } from "../../core/finding.js";
import { hasSignatureVerification, isDocumentationPath, isGeneratedArtifactPath, isTestPath } from "../utils.js";

function isExecutableWebhookEndpoint(path: string, content: string): boolean {
  if (isDocumentationPath(path) || isGeneratedArtifactPath(path) || isTestPath(path)) {
    return false;
  }
  const pathLooksLikeEndpoint =
    /(^|\/)(api|routes|controllers|server|functions|supabase\/functions)(\/|$)|\.(route|controller)\.(ts|js|py|php)$/i.test(path);
  const pathNamesWebhook = /webhook|resend-inbound|stripe|svix/i.test(path);
  const contentLooksLikeHandler =
    /export\s+(?:async\s+)?function\s+(POST|handler)|app\.post\s*\(|router\.post\s*\(|Deno\.serve\s*\(|serve\s*\(|Request|NextResponse|req\.|res\./i.test(
      content,
    );

  return pathNamesWebhook && (pathLooksLikeEndpoint || contentLooksLikeHandler);
}

export const webhooksGuard: Guard = {
  name: "webhooks",
  run(files, context) {
    const findings: Finding[] = [];
    for (const file of files) {
      if (!isExecutableWebhookEndpoint(file.relativePath, file.content) || hasSignatureVerification(file.content)) {
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
