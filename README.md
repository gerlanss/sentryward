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
ward                         # interactive watch console by default
ward watch                   # explicit interactive watch console
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
/help
/scan .
/status
/findings
/explain SW-AUTH-014
/fix SW-AUTH-014
/quit
```

## Language

SentryWard supports English, Portuguese Brazil, and Spanish.

```bash
ward scan examples/vulnerable-app --lang pt-BR
ward scan examples/vulnerable-app --lang es
SENTRYWARD_LANG=pt-BR ward status
```

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
