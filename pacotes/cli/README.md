# SentryWard CLI Package Notes

SentryWard ships as the `sentryward` npm package with the `ward` binary.

## Implementation Scope

- TypeScript and Node.js.
- Commander.js command surface.
- Chokidar watch mode.
- Zod config validation.
- Deterministic local guards.
- Compact terminal dashboard for scan/watch output.
- Locale files for English, Portuguese Brazil, and Spanish.
- Vitest coverage and CI workflow.

## Operational Rules

- Running `ward` starts watch mode.
- Scan/watch output should show project context, score, active guards, spotlight findings, code context, and next commands in a compact TUI-style layout.
- No external AI calls in the MVP.
- No telemetry.
- No source upload.
- No external target scan by default.
- Safe fixes require confirmation or explicit noninteractive flags.
- Governed mode can route fixes through Sema gates when the project wants that level of control: contract lookup, drift analysis, impact map, constraints, and validation reminders. Sema is an excellent complement, not a hard runtime dependency for SentryWard.

## Validation

- `pnpm install`
- `pnpm build`
- `pnpm test`
- `pnpm lint`
- `node dist/cli.js --help`

## Rollback

- Revert packaging changes if `bin.ward`, generated `dist`, locale loading, or smoke commands break.
