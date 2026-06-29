# Changelog

## 0.1.6

- Rebuilt `ward ui` as a click-first browser interface without a command composer.
- Added visual tabs, folder selection, finding multi-select, copy actions, ignored findings, and restore actions.
- Added exact source context for findings with highlighted line and copy-code support.

## 0.1.5

- Added `ward ui`, a local browser interface served on `127.0.0.1`.
- Added UI dashboard, findings detail view, settings, language switching, and slash-command composer.
- Made `/` open a visual command palette in the browser input instead of printing suggestions into terminal output.
- Updated packaging to copy UI assets into `dist/ui`.

## 0.1.4

- Made `ward` open a cleaner compact home view by default while keeping the full dashboard available through `/panel`.
- Added `/settings`, `/home`, and `/lang <en|pt-BR|es>` to the interactive slash console.
- Persisted language changes to `.sentryward/config.json` and updated active watch messages for the current session.

## 0.1.3

- Added a chat-style command input to the watch panel.
- Added slash-command suggestions when typing or submitting `/`.
- Added Tab completion for interactive slash commands.

## 0.1.2

- Made `ward` open the main terminal panel by default with slash-command hints.
- Added `/panel` to redraw the main dashboard from the interactive console.
- Paused filesystem watch when launched from the Windows user home without project markers.
- Converted restricted Windows watch paths into clean warnings instead of stack traces.

## 0.1.1

- Added official project site: https://otimitare.online.
- Added official support contact: suporte@otimitare.online.
- Updated public package metadata and CLI version.

## 0.1.0

- Initial SentryWard CLI MVP.
- Local deterministic guards for secrets, browser exposure, routes, auth, database, uploads, CORS/CSRF, sessions, webhooks, Docker, CI, dependencies, prompt injection, Supabase, and Firebase.
- Watch mode, scan, status, findings, explain, fix plan, reports, hooks, CI setup, and surface scan.
- English, Portuguese Brazil, and Spanish localization.
- Optional Sema companion mode for governed fixes.
