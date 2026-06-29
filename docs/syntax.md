# Syntax

## Scope

Use this file when a change touches Sema-related docs, contracts, governance naming, or generated guidance that references `.sema` syntax.

## Rules

- Do not invent `.sema` syntax from memory.
- Read the applicable contract before editing implementation.
- Use official examples before creating or changing a `.sema` contract.
- Keep Sema vocabulary clear in human text: contract, drift, impact, gate, constraint, validation, and optional complement.
- Do not translate commands, file paths, route names, package names, or DSL keywords.

## SentryWard Usage

SentryWard documentation and UI may mention Sema as an optional companion. The product must not say Sema is required for normal scan, watch, report, or finding review flows.

When strict governance is requested, explain that a missing applicable contract blocks governed fixes, not the entire scanner.

## Validation

- Contract files changed in a task must pass `sema validar`.
- Implementation linked to contracts must pass `sema drift`.
- Public docs must match implemented command names and UI controls.

## Rollback

Revert syntax or governance wording if it describes commands that do not exist, turns optional Sema use into a mandatory dependency, or weakens the fail-closed contract workflow for governed fixes.
