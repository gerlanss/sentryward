# Frontend

## Intention

Create and maintain the local SentryWard interface opened by `ward ui`.

## Scope

- Local-only web interface served from the CLI process.
- Visual project dashboard, security summary, findings list, settings, folder picker, source context, copy actions, and ignore/restore controls.
- Dashboard scan mode is explicit: manual scan by default, optional continuous browser rescan when the operator turns it on, and terminal `ward watch` remains the filesystem event watch flow.
- Language switching refreshes the active scan so finding titles, impact, recommendations, evidence, and details match the selected locale.
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
- Browser smoke check when practical to confirm the dashboard renders, folder picker works, findings can be selected, code context appears, and action buttons respond.
- Dashboard smoke check must confirm scan mode text, continuous rescan toggle state, and folder picker action labels.

## Rollback

- Revert the `ward ui` command, UI server, UI assets, docs, and contract changes together if the local server fails to start, binds outside localhost by default, breaks CLI startup, exposes source code, or blocks existing scan/watch commands.

## Documentation Update

- Update `README.md`, `docs/cli.md`, and `pacotes/cli/README.md` whenever the UI command surface changes.
