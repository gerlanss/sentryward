# Security

## Scope

This document governs SentryWard changes that affect security findings, auth/authorization diagnostics, Sema governance controls, and local UI actions that can influence scan or fix behavior.

SentryWard remains local-first: it must not upload source code, call external AI APIs, run exploit automation, or scan third-party systems by default. Sema is an optional governance complement for projects that want contract, drift, and impact gates.

## Procedure

1. Run the local Sema preflight before changing code or contracts.
2. Keep finding text actionable: name the violated security invariant, explain the likely risk, identify the affected file and line, and recommend the smallest safe verification or fix.
3. Do not expose raw secrets in evidence, logs, copied finding text, reports, UI details, or tests.
4. Treat seed/demo files differently from runtime application code when the rule semantics allow it; do not imply production auth exposure from intentional seed actors without saying so.
5. When adding Sema controls, make the state explicit: disabled, enabled, unavailable, or strict. Do not imply Sema is mandatory for normal SentryWard usage.
6. Keep all UI actions local to `127.0.0.1` and project files on disk.

## Validation

- `corepack pnpm build`
- `corepack pnpm lint`
- `corepack pnpm test`
- Sema `validar`, `drift`, `verificar`, and `finalizar-mudanca`
- Browser smoke for UI changes, including desktop and narrow mobile when layout changes
- CLI smoke for changed command output or finding text

## Rollback

Revert the finding, scan, UI, docs, and contract changes together if findings become less precise, raw sensitive data is printed, Sema appears mandatory in normal mode, the UI cannot start locally, or scan/watch/fix commands regress.
