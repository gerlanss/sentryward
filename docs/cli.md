# CLI

## English

The binary is `ward`. Running `ward` starts the interactive watch console by default. Commands must be concise, local-first, deterministic, and useful in normal terminals and CI.

## Portugues

O binario e `ward`. Rodar `ward` inicia o console interativo de watch por padrao. Os comandos devem ser concisos, local-first, deterministicos e uteis em terminais normais e CI.

## Espanol

El binario es `ward`. Ejecutar `ward` inicia la consola interactiva de watch por defecto. Los comandos deben ser concisos, local-first, deterministas y utiles en terminales normales y CI.

## Commands

- `ward` and `ward watch`: open the interactive watch console, watch changed files, and alert only on new High/Critical findings.
- `ward scan <path>`: full deterministic scan.
- `ward init`: create `.sentryward/config.json`, `.sentryward/findings.json`, `.sentryward/cache.json`, and `.sentrywardignore`.
- `ward status`: show security health and score.
- `ward findings`: list persisted findings.
- `ward explain <findingId>`: explain one finding.
- `ward fix <findingId>`: show safe fix plan and optional patch/apply flow.
- `ward report --html|--json`: generate localized report files.
- `ward hooks install`: install local pre-commit secret scan.
- `ward ci init`: create `.github/workflows/sentryward.yml`.
- `ward surface [--url <local-url>]`: static browser/frontend exposure scan and optional local URL surface check.
- `ward --governed` and `ward watch --sema`: watch with Sema companion checks when the person or team wants that level of governance. SentryWard still works without Sema.
- `ward fix <findingId> --governed` or `ward fix <findingId> --sema`: ask Sema for contract, drift, and impact context before proposing or applying a patch when the project opted into that flow.
- `ward fix <findingId> --require-contract`: strict mode; block the fix if no applicable `.sema` contract exists.
- `ward sema init`: create optional starter security contracts for projects that want governed fixes.
- `ward sema status`: show whether the project has applicable Sema contracts.
- `ward sema sync`: write SentryWard findings as optional Sema governance events for contract-aware workflows.
- `ward scan --contract-check`: detect security findings and optional governance gaps such as sensitive code without `.sema` coverage.

## UX Direction

- Professional, sharp, compact, and visual.
- Default scan/watch output should feel like a terminal dashboard: project panel, security score, guard status, spotlight finding card, code context, command hints, and compact finding summary.
- Default watch mode must expose a real prompt, not a decorative prompt. It supports `/help`, `/scan`, `/status`, `/findings`, `/explain <findingId>`, `/fix <findingId>`, `/clear`, and `/quit`.
- Arrow-key history comes from the terminal readline prompt.
- Use color, borders, and symbols only to improve status hierarchy and scanability.
- No chatbot-style chatter.
- Do not hardcode user-facing strings outside locale files.
- In governed mode, the terminal must show Sema gate status before fix plans when Sema is available. Missing Sema is a recommendation unless strict contract mode was requested.

## Validation

- `node dist/cli.js --help`
- `node dist/cli.js init`
- `node dist/cli.js scan examples/vulnerable-app`
- `node dist/cli.js scan examples/vulnerable-app --lang pt-BR`
- `node dist/cli.js scan examples/vulnerable-app --lang es`
- `node dist/cli.js report --html`
- `node dist/cli.js report --json`

## Rollback

- Revert command behavior if help breaks, default watch stops working, noninteractive flags hang, or CI cannot run without prompts.
