# SentryWard Docs

This directory contains operational and user-facing documentation for the SentryWard CLI.

## Core Docs

- `cli.md`: command contract and terminal behavior.
- `auth.md`: auth and authorization analysis policy.
- `seguranca.md`: security boundary, privacy, and defensive-use policy.
- `testes.md`: test strategy and required guard coverage.
- `documentacao.md`: documentation maintenance policy.
- `en/`, `pt-BR/`, `es/`: public localized documentation.

## Required Reading For Changes

- Read `AGENTS.md`, `SEMA_BOOT.md`, `docs/comandos.md`, and `docs/sintaxe.md`.
- Run `sema docs-impacto --intencao "<acao>" --json`.
- Read every doc returned by the command before implementation.

## Validation

- Public docs must match implemented behavior.
- Planned features must be labeled planned, not described as complete.
- Portuguese and Spanish docs must be complete, not placeholders.
