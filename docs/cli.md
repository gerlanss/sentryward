# CLI

## English

The binary is `ward`. Running `ward` opens a compact terminal home with a slash-command console by default. Running `ward ui` opens the local visual interface in a browser. The full terminal diagnostic panel stays available with `/panel`. Commands must be concise, local-first, deterministic, and useful in normal terminals and CI.

## Portugues

O binario e `ward`. Rodar `ward` abre uma home compacta no terminal com console de comandos slash por padrao. Rodar `ward ui` abre a interface visual local no navegador. O painel diagnostico completo do terminal continua disponivel com `/panel`. Os comandos devem ser concisos, local-first, deterministicos e uteis em terminais normais e CI.

## Espanol

El binario es `ward`. Ejecutar `ward` abre una vista compacta en el terminal con consola de comandos slash por defecto. Ejecutar `ward ui` abre la interfaz visual local en el navegador. El panel diagnostico completo del terminal sigue disponible con `/panel`. Los comandos deben ser concisos, local-first, deterministas y utiles en terminales normales y CI.

## Commands

- `ward` and `ward watch`: open the compact home and chat-style slash-command console; when run inside a project, watch changed files and alert only on new High/Critical findings.
- `ward ui [path] [--port <port>] [--no-open]`: start the local browser interface on `127.0.0.1` with dashboard, explicit scan mode, optional continuous rescan, visual tabs, folder picker, findings review, source context, copy buttons, and ignore/restore controls.
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

When `ward` starts outside a detected project, such as directly in the Windows user home, it stays in panel mode and does not try to watch protected system/user folders. Use `/scan <path>` or run `ward` from the project folder to arm watch mode.

Interactive slash commands include `/help`, `/scan`, `/status`, `/findings`, `/explain <findingId>`, `/fix <findingId>`, `/home`, `/panel`, `/settings`, `/lang <en|pt-BR|es>`, `/clear`, and `/quit`.

The browser UI does not use a command composer. It is operated through buttons, tabs, selectors, finding rows, multi-select, copy actions, and settings controls. Slash commands remain a terminal-only interaction model.

## UX Direction

- Professional, sharp, compact, and visual.
- Default scan output should feel like a terminal dashboard: project panel, security score, guard status, spotlight finding card, code context, command hints, and compact finding summary.
- Default watch output should open with a compact home: project, stack, mode, language, Sema state, guard count, root, watch state, and command hints.
- Default watch mode must expose a real chat-style prompt, not a decorative prompt. It supports `/help`, `/scan`, `/status`, `/findings`, `/explain <findingId>`, `/fix <findingId>`, `/home`, `/panel`, `/settings`, `/lang <en|pt-BR|es>`, `/clear`, and `/quit`.
- Browser UI must be click-first and must not expose a command input as its main workflow.
- Browser UI must explain that manual scan is the default visual flow, optional continuous rescan keeps the browser panel fresh, and terminal `ward watch` remains the filesystem event watch flow.
- Browser UI findings must show exact source context, highlight the affected line, support copy finding, copy code, select all, Ctrl multi-select, ignore, and restore.
- Browser UI folder selection must distinguish entering a folder from selecting it as the active project.
- `/settings` must show language, mode, watch, Sema state, project, root, and language commands. `/lang` must update the current session and persist the project preference.
- Typing `/` in the interactive prompt must show command suggestions, and Tab completion must work for slash commands.
- Arrow-key history comes from the terminal readline prompt.
- Use color, borders, and symbols only to improve status hierarchy and scanability.
- No chatbot-style chatter.
- Do not hardcode user-facing strings outside locale files.
- In governed mode, the terminal must show Sema gate status before fix plans when Sema is available. Missing Sema is a recommendation unless strict contract mode was requested.

## Validation

- `node dist/cli.js --help`
- `node dist/cli.js ui --no-open --port 7331`
- `node dist/cli.js init`
- `node dist/cli.js scan examples/vulnerable-app`
- `node dist/cli.js scan examples/vulnerable-app --lang pt-BR`
- `node dist/cli.js scan examples/vulnerable-app --lang es`
- `node dist/cli.js report --html`
- `node dist/cli.js report --json`

## Rollback

- Revert command behavior if help breaks, default watch stops working, noninteractive flags hang, or CI cannot run without prompts.
