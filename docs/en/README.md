# SentryWard

SentryWard watches your code while you build. It is local-first, deterministic, and focused on meaningful security findings.

## Quick Start

```bash
pnpm install
pnpm build
node dist/cli.js scan examples/vulnerable-app
```

## Commands

Use `ward`, `ward watch`, `ward scan`, `ward init`, `ward status`, `ward findings`, `ward explain`, `ward fix`, `ward report`, `ward hooks install`, `ward ci init`, `ward surface`, and optional `ward sema` commands.

## Optional Sema Companion

SentryWard works without Sema. People or teams that want semantic governance can use Sema to check contracts, drift, impact, and constraints before fixes.

## Security

No telemetry, no source upload, no external AI calls, and no default external target scanning.
