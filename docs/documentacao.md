# Documentacao

## English

Documentation must describe implemented behavior honestly. Planned capabilities are allowed only when clearly marked as planned.

## Portugues

A documentacao deve descrever comportamento implementado de forma honesta. Capacidades planejadas sao permitidas apenas quando marcadas claramente como planejadas.

## Espanol

La documentacion debe describir comportamiento implementado de forma honesta. Las capacidades planificadas se permiten solo cuando estan claramente marcadas como planificadas.

## Scope

- Root README, localized docs, package README, security policy, contribution guide, issue templates, workflow docs, examples, and generated reports.

## Procedure

- Keep CLI command docs synchronized with Commander definitions.
- Keep finding descriptions in locale files and reference the same keys from code.
- Update examples when guard behavior changes.
- Do not claim web dashboard support in the MVP.

## Validation

- `pnpm build` must copy locale files for runtime use.
- `node dist/cli.js --help` must match README commands.
- Portuguese and Spanish docs must include installation, usage, commands, examples, architecture, localization, contributing, and security policy pointers.

## Rollback

- Revert docs that overstate capabilities, hide manual remediation steps, or imply telemetry/AI provider behavior exists in the MVP.
