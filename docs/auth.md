# Auth

## English

SentryWard is a local-first CLI. It does not authenticate users, create remote accounts, or call third-party APIs in the MVP. Auth-related behavior is limited to static analysis of project code, route handlers, middleware, sessions, tokens, cookies, frontend storage, and configuration files.

## Portugues

SentryWard e uma CLI local-first. Ela nao autentica usuarios, nao cria contas remotas e nao chama APIs externas no MVP. O comportamento ligado a autenticacao fica restrito a analise estatica de codigo local, rotas, middlewares, sessoes, tokens, cookies, storage de frontend e configuracoes.

## Espanol

SentryWard es una CLI local-first. No autentica usuarios, no crea cuentas remotas y no llama APIs externas en el MVP. El comportamiento de autenticacion se limita al analisis estatico de codigo local, rutas, middlewares, sesiones, tokens, cookies, storage de frontend y configuraciones.

## Scope

- CLI commands: `ward`, `ward watch`, `ward scan`, `ward status`, `ward findings`, `ward explain`, `ward fix`, `ward report`, `ward hooks`, `ward ci`, and `ward surface`.
- Guards that inspect auth risk: routes, auth, browser exposure, sessions, webhooks, CORS/CSRF, Supabase, Firebase, and prompt injection.
- No remote target scanning by default. A `--url` surface check is allowed only for explicit local development URLs.

## Procedure

- Treat route visibility as evidence, not automatic vulnerability.
- Raise severity when sensitive routes lack backend-side auth, role checks, ownership checks, CSRF protections, rate limits, or audit logging.
- Never print raw secrets in CLI output, reports, logs, fix plans, or tests.
- Finding text must come from locale files.

## Validation

- `pnpm test` must cover auth bypass, missing admin checks, frontend-only checks, token storage, and webhook signature cases.
- `node dist/cli.js scan examples/vulnerable-app` must produce real findings.
- `node dist/cli.js explain <findingId>` must explain evidence, impact, safe fix, and manual verification.

## Rollback

- Revert CLI or guard changes if a scan prints raw credentials, performs external exploitation, or claims auth is fixed when manual rotation or backend changes are still required.
