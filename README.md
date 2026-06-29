# SentryWard

Reveal what generated code tries to hide.

SentryWard is a local-first CLI security sentinel for developers who build software with AI-generated code. Run `ward` or `ward watch`, keep coding, and SentryWard watches for meaningful security risks introduced by generated or manually written code.

SentryWard works without Sema. If a person or team wants semantic governance for fixes, Sema is an excellent optional complement: SentryWard sees the risk, Sema can govern the change, and an AI/coding agent can propose or apply a constrained fix.

Official site: [otimitare.online](https://otimitare.online)  
Support: [suporte@otimitare.online](mailto:suporte@otimitare.online)

## Install

```bash
pnpm install
pnpm build
node dist/cli.js --help
```

When published:

```bash
npm install -g sentryward
ward scan .
```

## Commands

```bash
ward ui                      # local visual interface with dashboard, tabs, buttons, and findings review
ward                         # compact terminal home with slash-command console
ward watch                   # explicit main panel with file watch
ward scan .                  # full local scan
ward scan . --contract-check # security scan plus optional Sema governance gaps
ward init                    # create .sentryward config
ward status                  # current security health
ward findings                # list stored findings
ward explain SW-AUTH-014     # explain a finding
ward fix SW-AUTH-014         # show a safe fix plan
ward fix SW-AUTH-014 --sema  # ask optional Sema companion for context
ward fix SW-AUTH-014 --require-contract
ward report --html
ward report --json
ward hooks install
ward ci init
ward surface
ward sema status
ward sema init
ward sema sync
```

Inside the interactive watch console, use slash commands:

```bash
/
/help
/scan .
/status
/findings
/explain SW-AUTH-014
/fix SW-AUTH-014
/home
/panel
/settings
/lang pt-BR
/quit
```

Typing `/` opens the command menu inside the chat-style input. Press `Tab` to complete a command and `Enter` to run it. The default `ward` view is a compact home with useful status; run `/panel` when you want the full diagnostic dashboard.

If `ward` is opened from the Windows user home or another folder without project markers, it starts in panel mode instead of watching protected system/user folders. Use `/scan <path>` or run `ward` inside a project folder to arm filesystem watch.

## Local Visual Interface

Use `ward ui` when you want the main visual experience instead of a terminal panel:

```bash
ward ui
ward ui . --port 7331
ward ui C:\GitHub\my-app --no-open
```

The UI is served only on `127.0.0.1` by the local CLI process. It shows project context, Sema complement status, score, scan mode, findings, settings, local folder selection, exact code context, copy buttons, multi-select, and ignored/restored findings. By default the visual UI scans when you click Run scan; turn on continuous rescan in the dashboard when you want the browser panel to keep itself fresh. The terminal `ward` / `ward watch` flow remains the event-driven filesystem watch mode. Open Settings to enable or disable optional Sema governance for contract coverage checks. The browser UI is click-first; slash commands stay in the terminal watch console.

## Language

SentryWard supports English, Portuguese Brazil, and Spanish.

```bash
ward scan examples/vulnerable-app --lang pt-BR
ward scan examples/vulnerable-app --lang es
SENTRYWARD_LANG=pt-BR ward status
```

Inside the interactive console, use `/settings` to see preferences and `/lang en`, `/lang pt-BR`, or `/lang es` to change and save the project language.

## Architecture

- `src/commands`: Commander command handlers.
- `src/core`: scanner, watcher, config, storage, i18n, scoring, reports, optional Sema companion.
- `src/guards`: deterministic local guard modules.
- `src/locales`: CLI, finding, report, and help text.
- `examples`: vulnerable and safe local apps.
- `test`: Vitest coverage.

The MVP is deterministic and local-only. It does not upload source code, call external AI APIs, or scan third-party systems.

## Guards

The MVP includes guards for secrets, browser exposure, routes, auth, database, uploads, CORS/CSRF, sessions, webhooks, Docker/infra, CI, dependencies, prompt injection, Supabase, and Firebase.

## Reports

```bash
ward report --html
ward report --json
```

Reports include project stack, score, findings by severity, affected files, evidence, impact, suggested fixes, language, and generation timestamp.

## Sema Complement

Sema is optional. In normal mode, SentryWard scans and reports on its own.

When a project wants governed fixes, Sema can add contract lookup, drift analysis, impact mapping, constraints, and validation reminders:

```bash
ward --governed
ward fix SW-AUTH-014 --sema
ward fix SW-AUTH-014 --require-contract
```

In `ward ui`, use Settings to turn optional Sema governance on for the active local project. When enabled, scans include optional contract coverage findings; when disabled, the scanner keeps working normally without Sema.

If strict contract mode is requested and no applicable `.sema` contract exists, SentryWard blocks the fix. Otherwise it continues with the standard safe flow and recommends Sema as a complement.

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
node dist/cli.js scan examples/vulnerable-app
```

## Publish

If GitHub CLI is authenticated:

```bash
gh repo create sentryward --public --source=. --remote=origin --push
```

Without GitHub CLI:

```bash
git remote add origin git@github.com:<you>/sentryward.git
git push -u origin main
```

## License

MIT
