# Testes

## English

The MVP test suite must prove that SentryWard finds real local security issues without internet access, telemetry, or exploit behavior.

## Portugues

A suite de testes do MVP deve provar que o SentryWard encontra riscos reais de seguranca local sem internet, telemetria ou comportamento ofensivo.

## Espanol

La suite de pruebas del MVP debe probar que SentryWard encuentra riesgos reales de seguridad local sin internet, telemetria ni comportamiento ofensivo.

## Required Coverage

- Stripe, OpenAI, Supabase service role, Firebase service account, AWS, GitHub token, Mercado Pago, database URL, and private key detection.
- Frontend secret exposure, sensitive routes in frontend, public source maps, token logging, localStorage/sessionStorage JWT usage.
- Admin route without auth, TODO auth later, frontend-only permission checks, SQL interpolation, unsafe uploads, wildcard CORS, insecure cookies, webhook signature gaps.
- Docker root user, `.env` copied into images, privileged compose services, pull_request_target risk, prompt injection patterns, and Firebase public rules.

## Procedure

- Fixtures live under `test/fixtures` and `examples`.
- Unit tests should call scanner/guard functions directly.
- CLI smoke tests may execute built files after `pnpm build`.

## Validation

- `pnpm test`
- `pnpm lint`
- `pnpm build`
- targeted smoke checks from `docs/cli.md`

## Rollback

- Revert changes that only satisfy snapshots while reducing real detection quality. Add a fixture before changing a guard's behavior.
