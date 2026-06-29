// SEMA-GOVERNED: module sentryward.scanner; shared guard helpers keep rules deterministic.
import type { FileContext, Finding, FindingCategory, GuardContext, Severity } from "../types/index.js";
import { createFinding, lineNumberForIndex } from "../core/finding.js";

export interface PatternRule {
  ruleId: string;
  category: FindingCategory;
  severity: Severity;
  confidence: number;
  pattern: RegExp;
  path?: RegExp;
  excludePath?: RegExp;
  fixAvailable?: boolean;
  autoFixSafe?: boolean;
  tags?: string[];
}

export function scanPatterns(files: FileContext[], context: GuardContext, rules: PatternRule[]): Finding[] {
  const findings: Finding[] = [];

  for (const file of files) {
    for (const rule of rules) {
      if (rule.path && !rule.path.test(file.relativePath)) {
        continue;
      }
      if (rule.excludePath?.test(file.relativePath)) {
        continue;
      }
      for (const match of file.content.matchAll(rule.pattern)) {
        findings.push(
          createFinding(context.t, {
            ruleId: rule.ruleId,
            category: rule.category,
            severity: rule.severity,
            confidence: rule.confidence,
            file: file.relativePath,
            line: lineNumberForIndex(file.content, match.index ?? 0),
            evidence: match[0],
            fixAvailable: rule.fixAvailable ?? true,
            autoFixSafe: rule.autoFixSafe ?? false,
            tags: rule.tags,
          }),
        );
      }
    }
  }

  return findings;
}

export function isFrontendFile(path: string): boolean {
  return /(^|\/)(app|pages|src|components|client|public|frontend|web)(\/|$)/.test(path) &&
    /\.(tsx?|jsx?|vue|svelte|html)$/.test(path)
    ? true
    : false;
}

export function isGeneratedArtifactPath(path: string): boolean {
  return /(^|\/)(output|outputs|playwright-report|test-results|coverage|dist|build|\.next)(\/|$)/i.test(path);
}

export function isDocumentationPath(path: string): boolean {
  return /\.(md|mdx|txt)$/i.test(path);
}

export function isTestPath(path: string): boolean {
  return /(^|\/)(__tests__|test|tests|spec)(\/|$)|\.(test|spec)\.(tsx?|jsx?)$/i.test(path);
}

export function isFrontendRouteFile(path: string): boolean {
  return (
    isFrontendFile(path) &&
    !/(^|\/)(api|server|servers|backend|functions|supabase\/functions)(\/|$)|\.(route|controller)\.(ts|js)$/i.test(path)
  );
}

export function hasProjectAdminProtection(files: FileContext[]): boolean {
  const runtimeFiles = files.filter((file) => !isTestPath(file.relativePath) && !isGeneratedArtifactPath(file.relativePath));
  const hasProtectedAdminRoute = runtimeFiles.some((file) => {
    if (!isFrontendRouteFile(file.relativePath)) {
      return false;
    }
    return (
      /path\s*=\s*["'`]\/admin(?:\/\*)?["'`][\s\S]{0,400}ProtectedRoute/i.test(file.content) ||
      /ProtectedRoute[\s\S]{0,400}path\s*=\s*["'`]\/admin(?:\/\*)?["'`]/i.test(file.content) ||
      /\/admin[\s\S]{0,240}<ProtectedRoute/i.test(file.content)
    );
  });

  const hasAdminRoleEvidence = runtimeFiles.some((file) =>
    /has_role\s*\(|is_otimitare_admin\s*\(|requireRole\s*\(\s*["'`]admin["'`]|requireAdmin|isAdmin|role\s*[=:]\s*["'`]admin["'`]/i.test(
      file.content,
    ),
  );

  return hasProtectedAdminRoute && hasAdminRoleEvidence;
}

export function hasBackendAuth(content: string): boolean {
  return /requireAuth|withAuth|authMiddleware|getServerSession|verifyToken|jwt\.verify|requireRole|isAdmin|authorize|auth\s*\(/i.test(
    content,
  );
}

export function hasSignatureVerification(content: string): boolean {
  return /constructEvent|signature|stripe-signature|svix-signature|webhookSecret|verifyWebhook|validateSignature|x-hub-signature|x-signature|mercadopago.*signature|new\s+Webhook\s*\(/i.test(
    content,
  );
}
