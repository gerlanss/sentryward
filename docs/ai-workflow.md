# AI Workflow

## Scope

This document defines how SentryWard output should guide humans and coding agents when a finding is pasted into an AI chat or passed into an automated fix flow.

## Finding Quality

A pasted finding should be understandable without opening the scanner source. It should provide:

- severity and stable finding id
- affected file and line
- specific rule name, not only a generic risk sentence
- the security invariant that appears broken
- likely impact in concrete terms
- recommended smallest safe correction
- evidence snippet with sensitive values masked
- whether Sema governance is available, optional, required, or unavailable for the next step

Generic text such as "a deterministic rule found a risky pattern" is only acceptable as a fallback when the rule has no localized metadata yet.

## Agent Workflow

1. Read the finding id and affected file.
2. Inspect the local code around the evidence before proposing a patch.
3. If Sema governance is enabled or strict, check the applicable contract, drift, and impact before suggesting or applying a fix.
4. For auth findings, verify whether the code is runtime behavior, seed/demo data, test setup, or intended admin bootstrap before claiming exposure.
5. Prefer the smallest safe change and preserve project architecture, role model, response shape, audit behavior, and public route behavior.

## Validation

- Scan examples must produce actionable finding text.
- UI copy/copy-all output must preserve the actionable fields.
- Agent-facing output must not require hidden knowledge of SentryWard internals.

## Rollback

Revert workflow changes if they make findings harder to paste into an AI chat, obscure the next action, or encourage fixes without checking contract and code context.
