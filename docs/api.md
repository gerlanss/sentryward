# API

## Scope

This document covers the local HTTP API served by `ward ui` on `127.0.0.1`.
The API is private to the local browser session and must not upload source code
or call external services by default.

## Routes

- `GET /api/overview`: returns UI version, active project, config, latest scan,
  severity counts, and language.
- `GET /api/directories?path=<path>`: lists local child directories and drives
  for the project folder picker.
- `GET /api/source?file=<relative>&line=<number>`: returns safe source context
  for a finding inside the active project.
- `POST /api/scan`: runs a scan for the active target and may include optional
  Sema contract checks.
- `POST /api/sema`: enables or disables optional Sema governance in the local
  project config. The server also accepts `/api/sema-governance` and
  `/api/governance/sema` as compatibility aliases.
- `POST /api/root`: changes the active local project folder after validating
  that the target directory can be listed.
- `POST /api/language`: updates the local UI language and may refresh the
  stored scan text.

## UI Expectations

- Settings must call a supported route when toggling Sema governance.
- A failed API call must show a human-readable toast and keep the UI usable.
- The folder picker must make navigation and project selection visually
  distinct: clicking a folder row navigates into that folder, while the footer
  action selects the current folder as the active project.

## Validation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Browser smoke check for `/api/sema` toggle and folder-row navigation.
- Mobile viewport check: `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.

## Rollback

Revert API, UI, and contract changes together if the Sema toggle cannot update
config, the folder picker cannot navigate, unknown API route errors appear in a
supported flow, or the browser UI fails to load locally.
