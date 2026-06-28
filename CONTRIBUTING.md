# Contributing

Thanks for improving SentryWard.

## Local Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

## Guard Changes

- Add or update a fixture before changing detection logic.
- Keep rules deterministic and local-first.
- Do not add telemetry, source uploads, or offensive exploit automation.
- Finding text must live in `src/locales`.

## Sema

Sema is optional for SentryWard users, but this repository is Sema-governed. Contributors using this workspace should follow `AGENTS.md` before changing contracts or governed code.
