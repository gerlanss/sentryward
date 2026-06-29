# Frontend

## Intention

Create and maintain the local SentryWard interface opened by `ward ui`.

## Scope

- Local-only web interface served from the CLI process.
- Visual project dashboard, security summary, findings list, settings, and chat-style command composer.
- No external hosting, no source upload, no telemetry, and no remote target scanning.
- The terminal `ward` workflow remains available for quick CLI usage.

## Required Reading Before Action

- Read `AGENTS.md`, `SEMA_BOOT.md`, `SEMA_INDEX.json`, `README.md`, `docs/README.md`, `docs/cli.md`, and `pacotes/cli/README.md`.
- Read the applicable `.sema` contract before editing implementation.

## Procedure

1. Run Sema gates for the declared interface change.
2. Update or create the applicable `.sema` contract before implementation.
3. Keep the interface local-first and bind the server to `127.0.0.1` by default.
4. Use structured JSON endpoints for UI actions instead of parsing terminal output.
5. Keep user-facing strings in locale files when they are shared with CLI output.
6. Preserve the existing CLI scan, watch, explain, fix, report, and Sema companion behavior.

## Validation

- `corepack pnpm build`
- `corepack pnpm lint`
- `corepack pnpm test`
- `node dist/cli.js ui --no-open --port <free-port>`
- HTTP smoke check for the UI HTML and API endpoints.
- Browser smoke check when practical to confirm the dashboard renders and the command composer is usable.

## Rollback

- Revert the `ward ui` command, UI server, UI assets, docs, and contract changes together if the local server fails to start, binds outside localhost by default, breaks CLI startup, exposes source code, or blocks existing scan/watch commands.

## Documentation Update

- Update `README.md`, `docs/cli.md`, and `pacotes/cli/README.md` whenever the UI command surface changes.
