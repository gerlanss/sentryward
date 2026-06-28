# Security Policy

SentryWard is defensive local tooling.

## Reporting Vulnerabilities

Open a private security advisory or contact the maintainers with:

- affected version or commit,
- reproduction steps,
- expected impact,
- whether secrets or private data were exposed.

## Scope

In scope:

- local rule bypasses,
- false negatives for documented guards,
- secret exposure in SentryWard output,
- unsafe fix behavior,
- CI or hook behavior that leaks credentials.

Out of scope:

- scanning third-party systems without authorization,
- exploit automation requests,
- issues caused by intentionally vulnerable examples.

## Privacy

The MVP is local-first. No telemetry, no source upload, and no external AI API calls.
