// SEMA-GOVERNED: module sentryward.scanner; Supabase guard checks service role, RLS and policy risk.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const supabaseGuard: Guard = {
  name: "supabase",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-SUPABASE-001",
        category: "supabase",
        severity: "critical",
        confidence: 0.9,
        pattern: /(service_role|SUPABASE_SERVICE_ROLE_KEY)[\s\S]{0,80}eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/gi,
        tags: ["service-role"],
      },
      {
        ruleId: "SW-SUPABASE-002",
        category: "supabase",
        severity: "high",
        confidence: 0.84,
        pattern: /DISABLE\s+ROW\s+LEVEL\s+SECURITY|ALTER\s+TABLE\s+[\w".]+\s+DISABLE\s+RLS/gi,
        path: /\.(sql)$/i,
        tags: ["rls"],
      },
      {
        ruleId: "SW-SUPABASE-003",
        category: "supabase",
        severity: "high",
        confidence: 0.78,
        pattern: /CREATE\s+POLICY[\s\S]{0,240}(using|with check)\s*\(\s*true\s*\)/gi,
        path: /\.(sql)$/i,
        tags: ["policy"],
      },
    ]);
  },
};
