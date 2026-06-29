// SEMA-GOVERNED: module sentryward.ui; browser behavior follows contratos/sentryward_ui.sema.
const severityOrder = ["critical", "high", "medium", "low", "info"];
const languages = ["en", "pt-BR", "es"];

const messages = {
  en: {
    brandTagline: "The ward is watching.",
    project: "Project",
    name: "Name",
    stack: "Stack",
    path: "Path",
    status: "Status",
    settings: "Settings",
    language: "Language",
    localUi: "Local UI",
    title: "SentryWard",
    scan: "Run scan",
    score: "Security score",
    noScan: "No scan loaded yet.",
    noFindings: "No findings in the latest scan.",
    runScan: "Run a scan to populate findings.",
    findings: "Findings",
    total: "total",
    activity: "Activity",
    loaded: "Interface loaded.",
    slashHint: "Type / in the composer to open commands.",
    noSelection: "No finding selected",
    selectFinding: "Select a finding after scanning to inspect impact, recommendation, and code context.",
    prompt: "Type / for commands",
    send: "Run",
    semaEnabled: "Sema governance enabled",
    semaDisabled: "Sema governance disabled",
    scanning: "Scan running...",
    scanDone: "Scan completed.",
    scanFailed: "Scan failed",
    overviewReady: "Project overview ready.",
    statusRefreshed: "Status refreshed.",
    commandMenu: "Command menu",
    commandHint: "Keep typing to filter. Tab completes. Enter runs.",
    noCommand: "No matching command.",
    slashOnly: "This composer runs slash commands for now. Type / to open the menu.",
    missingFinding: "Pass a finding id, for example /explain SW-AUTH-014.",
    findingMissing: "Finding not found in the latest scan.",
    explaining: "Selected finding",
    fixPlan: "Fix plans still run in the CLI",
    closeHint: "Close the browser tab or press Ctrl+C in the terminal to stop SentryWard.",
    languageChanged: "Language changed and saved",
    languageInvalid: "Use /lang en, /lang pt-BR, or /lang es.",
    focusFindings: "Findings panel focused.",
    focusSettings: "Settings focused.",
    home: "Top panel focused.",
    panel: "Diagnostic panel focused.",
    cleared: "Chat cleared.",
    file: "File",
    impact: "Impact",
    problem: "Problem",
    recommendation: "Recommendation",
    evidence: "Evidence",
    code: "Code context",
    autoFix: "Auto-fix",
    yes: "yes",
    no: "no",
    commands: {
      help: "show the command menu",
      scan: "run a scan and keep this interface open",
      status: "refresh project status",
      findings: "focus the findings list",
      explain: "select one finding by id",
      fix: "show where to run a fix plan",
      settings: "focus settings and language options",
      lang: "change and save language",
      home: "return to the top panel",
      panel: "focus the diagnostic panel",
      clear: "clear the chat log",
      quit: "show how to close SentryWard",
    },
  },
  "pt-BR": {
    brandTagline: "A ward est\u00e1 observando.",
    project: "Projeto",
    name: "Nome",
    stack: "Stack",
    path: "Caminho",
    status: "Status",
    settings: "Ajustes",
    language: "Idioma",
    localUi: "Interface local",
    title: "SentryWard",
    scan: "Rodar scan",
    score: "Pontua\u00e7\u00e3o de seguran\u00e7a",
    noScan: "Nenhum scan carregado ainda.",
    noFindings: "Nenhum achado no \u00faltimo scan.",
    runScan: "Rode um scan para preencher achados.",
    findings: "Achados",
    total: "total",
    activity: "Atividade",
    loaded: "Interface carregada.",
    slashHint: "Digite / no compositor para abrir comandos.",
    noSelection: "Nenhum achado selecionado",
    selectFinding: "Selecione um achado depois do scan para inspecionar impacto, recomenda\u00e7\u00e3o e contexto de c\u00f3digo.",
    prompt: "Digite / para comandos",
    send: "Rodar",
    semaEnabled: "Governan\u00e7a Sema ativada",
    semaDisabled: "Governan\u00e7a Sema desativada",
    scanning: "Scan rodando...",
    scanDone: "Scan concluido.",
    scanFailed: "Scan falhou",
    overviewReady: "Resumo do projeto pronto.",
    statusRefreshed: "Status atualizado.",
    commandMenu: "Menu de comandos",
    commandHint: "Continue digitando para filtrar. Tab completa. Enter roda.",
    noCommand: "Nenhum comando encontrado.",
    slashOnly: "Por enquanto este compositor roda comandos slash. Digite / para abrir o menu.",
    missingFinding: "Passe um id de achado, por exemplo /explain SW-AUTH-014.",
    findingMissing: "Achado n\u00e3o encontrado no \u00faltimo scan.",
    explaining: "Achado selecionado",
    fixPlan: "Planos de corre\u00e7\u00e3o ainda rodam na CLI",
    closeHint: "Feche a aba do navegador ou pressione Ctrl+C no terminal para parar o SentryWard.",
    languageChanged: "Idioma alterado e salvo",
    languageInvalid: "Use /lang en, /lang pt-BR ou /lang es.",
    focusFindings: "Painel de achados focado.",
    focusSettings: "Ajustes focados.",
    home: "Painel superior focado.",
    panel: "Painel diagn\u00f3stico focado.",
    cleared: "Chat limpo.",
    file: "Arquivo",
    impact: "Impacto",
    problem: "Problema",
    recommendation: "Recomenda\u00e7\u00e3o",
    evidence: "Evid\u00eancia",
    code: "Contexto de c\u00f3digo",
    autoFix: "Auto-corre\u00e7\u00e3o",
    yes: "sim",
    no: "n\u00e3o",
    commands: {
      help: "mostra o menu de comandos",
      scan: "roda um scan e mant\u00e9m esta interface aberta",
      status: "atualiza o status do projeto",
      findings: "foca a lista de achados",
      explain: "seleciona um achado pelo id",
      fix: "mostra onde rodar um plano de corre\u00e7\u00e3o",
      settings: "foca ajustes e op\u00e7\u00f5es de idioma",
      lang: "muda e salva o idioma",
      home: "volta para o painel superior",
      panel: "foca o painel diagn\u00f3stico",
      clear: "limpa o chat",
      quit: "mostra como fechar o SentryWard",
    },
  },
  es: {
    brandTagline: "La ward est\u00e1 observando.",
    project: "Proyecto",
    name: "Nombre",
    stack: "Stack",
    path: "Ruta",
    status: "Estado",
    settings: "Ajustes",
    language: "Idioma",
    localUi: "Interfaz local",
    title: "SentryWard",
    scan: "Ejecutar scan",
    score: "Puntuaci\u00f3n de seguridad",
    noScan: "No hay scan cargado todav\u00eda.",
    noFindings: "No hay hallazgos en el \u00faltimo scan.",
    runScan: "Ejecuta un scan para llenar hallazgos.",
    findings: "Hallazgos",
    total: "total",
    activity: "Actividad",
    loaded: "Interfaz cargada.",
    slashHint: "Escribe / en el compositor para abrir comandos.",
    noSelection: "Ningun hallazgo seleccionado",
    selectFinding: "Selecciona un hallazgo despu\u00e9s del scan para revisar impacto, recomendaci\u00f3n y contexto de c\u00f3digo.",
    prompt: "Escribe / para comandos",
    send: "Ejecutar",
    semaEnabled: "Gobernanza Sema activada",
    semaDisabled: "Gobernanza Sema desactivada",
    scanning: "Scan en ejecuci\u00f3n...",
    scanDone: "Scan completado.",
    scanFailed: "Scan fall\u00f3",
    overviewReady: "Resumen del proyecto listo.",
    statusRefreshed: "Estado actualizado.",
    commandMenu: "Men\u00fa de comandos",
    commandHint: "Sigue escribiendo para filtrar. Tab completa. Enter ejecuta.",
    noCommand: "No hay comandos coincidentes.",
    slashOnly: "Por ahora este compositor ejecuta comandos slash. Escribe / para abrir el men\u00fa.",
    missingFinding: "Pasa un id de hallazgo, por ejemplo /explain SW-AUTH-014.",
    findingMissing: "Hallazgo no encontrado en el \u00faltimo scan.",
    explaining: "Hallazgo seleccionado",
    fixPlan: "Los planes de correcci\u00f3n todav\u00eda corren en la CLI",
    closeHint: "Cierra la pesta\u00f1a del navegador o presiona Ctrl+C en la terminal para detener SentryWard.",
    languageChanged: "Idioma cambiado y guardado",
    languageInvalid: "Usa /lang en, /lang pt-BR o /lang es.",
    focusFindings: "Panel de hallazgos enfocado.",
    focusSettings: "Ajustes enfocados.",
    home: "Panel superior enfocado.",
    panel: "Panel diagn\u00f3stico enfocado.",
    cleared: "Chat limpio.",
    file: "Archivo",
    impact: "Impacto",
    problem: "Problema",
    recommendation: "Recomendaci\u00f3n",
    evidence: "Evidencia",
    code: "Contexto de c\u00f3digo",
    autoFix: "Auto-correcci\u00f3n",
    yes: "s\u00ed",
    no: "no",
    commands: {
      help: "muestra el men\u00fa de comandos",
      scan: "ejecuta un scan y mantiene esta interfaz abierta",
      status: "actualiza el estado del proyecto",
      findings: "enfoca la lista de hallazgos",
      explain: "selecciona un hallazgo por id",
      fix: "muestra donde ejecutar un plan de correccion",
      settings: "enfoca ajustes y opciones de idioma",
      lang: "cambia y guarda el idioma",
      home: "vuelve al panel superior",
      panel: "enfoca el panel diagn\u00f3stico",
      clear: "limpia el chat",
      quit: "muestra c\u00f3mo cerrar SentryWard",
    },
  },
};

const severityLabels = {
  en: { critical: "Critical", high: "High", medium: "Medium", low: "Low", info: "Info" },
  "pt-BR": { critical: "Cr\u00edtico", high: "Alto", medium: "M\u00e9dio", low: "Baixo", info: "Info" },
  es: { critical: "Cr\u00edtico", high: "Alto", medium: "Medio", low: "Bajo", info: "Info" },
};

const state = {
  language: "en",
  overview: undefined,
  findings: [],
  selectedFindingId: undefined,
  activeCommandIndex: 0,
  chat: [],
  activity: [],
};

const elements = {
  brandTagline: document.querySelector(".brand p"),
  projectHeading: document.querySelector(".side-section:nth-of-type(1) h2"),
  statusHeading: document.querySelector(".side-section:nth-of-type(2) h2"),
  settingsHeading: document.querySelector(".side-section:nth-of-type(3) h2"),
  languageLabel: document.querySelector("label[for='language-select']"),
  projectNameLabel: document.querySelector(".meta-list div:nth-child(1) span"),
  projectStackLabel: document.querySelector(".meta-list div:nth-child(2) span"),
  projectRootLabel: document.querySelector(".meta-list div:nth-child(3) span"),
  projectName: document.querySelector("#project-name"),
  projectStack: document.querySelector("#project-stack"),
  projectRoot: document.querySelector("#project-root"),
  watchState: document.querySelector("#watch-state"),
  semaState: document.querySelector("#sema-state"),
  languageSelect: document.querySelector("#language-select"),
  title: document.querySelector(".topbar h1"),
  eyeline: document.querySelector(".eyeline"),
  scanButton: document.querySelector("#scan-button"),
  settingsButton: document.querySelector("#settings-button"),
  scoreTitle: document.querySelector(".score-panel h2"),
  scoreRing: document.querySelector("#score-ring"),
  scoreValue: document.querySelector("#score-value"),
  scanSummary: document.querySelector("#scan-summary"),
  severityTitle: document.querySelector(".severity-panel h2"),
  activityTitle: document.querySelector(".timeline-panel h2"),
  activityList: document.querySelector("#activity-list"),
  findingListTitle: document.querySelector(".findings-list-panel h2"),
  findingTotal: document.querySelector("#finding-total"),
  findingsList: document.querySelector("#findings-list"),
  findingDetail: document.querySelector("#finding-detail"),
  commandPalette: document.querySelector("#command-palette"),
  commandInput: document.querySelector("#command-input"),
  sendCommand: document.querySelector("#send-command"),
  chatLog: document.querySelector("#chat-log"),
};

function msg() {
  return messages[state.language] ?? messages.en;
}

function severityName(severity) {
  return (severityLabels[state.language] ?? severityLabels.en)[severity] ?? severity;
}

function commands() {
  const text = msg().commands;
  return [
    { usage: "/help", name: "help", description: text.help },
    { usage: "/scan [path]", name: "scan", complete: "/scan ", description: text.scan },
    { usage: "/status", name: "status", description: text.status },
    { usage: "/findings", name: "findings", description: text.findings },
    { usage: "/explain <id>", name: "explain", complete: "/explain ", description: text.explain },
    { usage: "/fix <id>", name: "fix", complete: "/fix ", description: text.fix },
    { usage: "/settings", name: "settings", description: text.settings },
    { usage: "/lang <en|pt-BR|es>", name: "lang", complete: "/lang ", description: text.lang },
    { usage: "/home", name: "home", description: text.home },
    { usage: "/panel", name: "panel", description: text.panel },
    { usage: "/clear", name: "clear", description: text.clear },
    { usage: "/quit", name: "quit", description: text.quit },
  ];
}

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatStack(project) {
  return project?.stack?.length ? project.stack.join(" \u00b7 ") : "unknown";
}

function countsFrom(data) {
  const counts = data?.counts ?? {};
  return Object.fromEntries(severityOrder.map((severity) => [severity, Number(counts[severity] ?? 0)]));
}

function currentScan() {
  return state.overview?.scan;
}

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) {
    throw new Error(data.error ?? `Request failed: ${response.status}`);
  }
  return data;
}

function addActivity(line) {
  state.activity = [line, ...state.activity].slice(0, 6);
  renderActivity();
}

function addChat(line) {
  state.chat = [line, ...state.chat].slice(0, 8);
  renderChat();
}

function renderStaticCopy() {
  const text = msg();
  document.documentElement.lang = state.language;
  setText(elements.brandTagline, text.brandTagline);
  setText(elements.projectHeading, text.project);
  setText(elements.statusHeading, text.status);
  setText(elements.settingsHeading, text.settings);
  setText(elements.languageLabel, text.language);
  setText(elements.projectNameLabel, text.name);
  setText(elements.projectStackLabel, text.stack);
  setText(elements.projectRootLabel, text.path);
  setText(elements.watchState, text.localUi);
  setText(elements.title, text.title);
  setText(elements.eyeline, text.localUi);
  setText(elements.scanButton, text.scan);
  setText(elements.settingsButton, text.settings);
  setText(elements.scoreTitle, text.score);
  setText(elements.severityTitle, text.findings);
  setText(elements.activityTitle, text.activity);
  setText(elements.findingListTitle, text.findings);
  setText(elements.sendCommand, text.send);
  elements.commandInput.placeholder = text.prompt;
  for (const severity of severityOrder) {
    const label = document.querySelector(`.severity-row.${severity} span`);
    setText(label, severityName(severity));
  }
}

function renderActivity() {
  const text = msg();
  const items = state.activity.length ? state.activity : [text.loaded, text.slashHint];
  elements.activityList.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderChat() {
  elements.chatLog.innerHTML = state.chat.map((item) => `<div class="chat-line">${escapeHtml(item)}</div>`).join("");
}

function renderOverview() {
  const text = msg();
  const overview = state.overview;
  const project = overview?.project;
  const scan = currentScan();
  const counts = countsFrom(overview);

  state.language = overview?.language ?? state.language;
  elements.languageSelect.value = state.language;
  renderStaticCopy();

  setText(elements.projectName, project?.name ?? "unknown");
  setText(elements.projectStack, formatStack(project));
  setText(elements.projectRoot, project?.root ?? "");
  setText(elements.semaState, overview?.config?.sema?.enabled ? text.semaEnabled : text.semaDisabled);
  elements.semaState.classList.toggle("safe", Boolean(overview?.config?.sema?.enabled));

  const score = Number(scan?.score ?? 100);
  elements.scoreRing.style.setProperty("--score", String(score));
  setText(elements.scoreValue, String(score));
  setText(
    elements.scanSummary,
    scan ? `${scan.scannedFiles} files scanned \u00b7 ${scan.findings.length} ${text.findings.toLowerCase()}` : text.noScan,
  );

  for (const severity of severityOrder) {
    setText(document.querySelector(`#count-${severity}`), String(counts[severity]));
  }

  state.findings = Array.isArray(scan?.findings) ? scan.findings : [];
  renderFindings();
}

function renderFindings() {
  const text = msg();
  const findings = [...state.findings].sort((a, b) => {
    const rank = severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
    return rank || a.id.localeCompare(b.id);
  });
  const selectedExists = findings.some((finding) => finding.id === state.selectedFindingId);
  if (!selectedExists) {
    state.selectedFindingId = findings[0]?.id;
  }

  setText(elements.findingTotal, `${findings.length} ${text.total}`);
  if (findings.length === 0) {
    elements.findingsList.className = "findings-list empty";
    elements.findingsList.textContent = currentScan() ? text.noFindings : text.runScan;
    renderFindingDetail(undefined);
    return;
  }

  elements.findingsList.className = "findings-list";
  elements.findingsList.innerHTML = findings
    .map(
      (finding) => `
        <button class="finding-row ${finding.id === state.selectedFindingId ? "active" : ""}" type="button" data-finding-id="${escapeHtml(finding.id)}">
          <span class="severity-badge ${escapeHtml(finding.severity)}">${escapeHtml(severityName(finding.severity))}</span>
          <span>
            <span class="finding-id">${escapeHtml(finding.id)}</span>
            <strong>${escapeHtml(finding.title)}</strong>
            <small>${escapeHtml(finding.file)}:${escapeHtml(finding.line)}</small>
          </span>
        </button>
      `,
    )
    .join("");
  for (const row of elements.findingsList.querySelectorAll("[data-finding-id]")) {
    row.addEventListener("click", () => {
      state.selectedFindingId = row.getAttribute("data-finding-id");
      renderFindings();
    });
  }
  renderFindingDetail(findings.find((finding) => finding.id === state.selectedFindingId));
}

function renderFindingDetail(finding) {
  const text = msg();
  if (!finding) {
    elements.findingDetail.className = "finding-detail empty";
    elements.findingDetail.innerHTML = `<h2>${escapeHtml(text.noSelection)}</h2><p>${escapeHtml(text.selectFinding)}</p>`;
    return;
  }

  elements.findingDetail.className = "finding-detail";
  elements.findingDetail.innerHTML = `
    <span class="severity-badge ${escapeHtml(finding.severity)}">${escapeHtml(severityName(finding.severity))}</span>
    <h2>${escapeHtml(finding.title)}</h2>
    <p>${escapeHtml(finding.id)} \u00b7 ${escapeHtml(finding.ruleId ?? finding.category)}</p>
    <dl>
      <div><dt>${escapeHtml(text.file)}</dt><dd>${escapeHtml(finding.file)}:${escapeHtml(finding.line)}</dd></div>
      <div><dt>${escapeHtml(text.problem)}</dt><dd>${escapeHtml(finding.problem)}</dd></div>
      <div><dt>${escapeHtml(text.impact)}</dt><dd>${escapeHtml(finding.impact)}</dd></div>
      <div><dt>${escapeHtml(text.recommendation)}</dt><dd>${escapeHtml(finding.recommendation)}</dd></div>
      <div><dt>${escapeHtml(text.evidence)}</dt><dd>${escapeHtml(finding.evidence)}</dd></div>
      <div><dt>${escapeHtml(text.autoFix)}</dt><dd>${finding.autoFixSafe ? text.yes : text.no}</dd></div>
    </dl>
    <code class="code-snippet">${escapeHtml(finding.evidence)}</code>
  `;
}

function filterCommands(inputValue) {
  const raw = inputValue.trim();
  if (!raw.startsWith("/")) {
    return [];
  }
  const query = raw.slice(1).toLowerCase();
  return commands().filter((command) => {
    const usage = command.usage.slice(1).toLowerCase();
    return !query || usage.startsWith(query) || command.description.toLowerCase().includes(query);
  });
}

function showPalette(inputValue) {
  const text = msg();
  const matches = filterCommands(inputValue);
  state.activeCommandIndex = Math.min(state.activeCommandIndex, Math.max(0, matches.length - 1));

  if (!inputValue.startsWith("/")) {
    elements.commandPalette.hidden = true;
    return matches;
  }

  elements.commandPalette.hidden = false;
  const content = matches.length
    ? matches
        .map(
          (command, index) => `
            <div class="command-item ${index === state.activeCommandIndex ? "active" : ""}" data-command-index="${index}">
              <code>${escapeHtml(command.usage)}</code>
              <span>${escapeHtml(command.description)}</span>
            </div>
          `,
        )
        .join("")
    : `<div class="command-item active"><code>/help</code><span>${escapeHtml(text.noCommand)}</span></div>`;

  elements.commandPalette.innerHTML = `
    <div class="palette-heading">
      <strong>${escapeHtml(text.commandMenu)}</strong>
      <span>${escapeHtml(text.commandHint)}</span>
    </div>
    ${content}
  `;
  for (const item of elements.commandPalette.querySelectorAll("[data-command-index]")) {
    item.addEventListener("mousedown", (event) => {
      event.preventDefault();
      completeCommand(matches[Number(item.getAttribute("data-command-index"))]);
    });
  }
  return matches;
}

function completeCommand(command) {
  if (!command) {
    return;
  }
  const value = command.complete ?? command.usage.split(" ")[0];
  elements.commandInput.value = value;
  elements.commandInput.focus();
  showPalette(value);
}

async function loadOverview() {
  state.overview = await requestJson("/api/overview");
  state.language = state.overview.language ?? state.language;
  addActivity(msg().overviewReady);
  renderOverview();
}

async function runScan(target) {
  const text = msg();
  elements.scanButton.disabled = true;
  addActivity(text.scanning);
  try {
    const data = await requestJson("/api/scan", {
      method: "POST",
      body: JSON.stringify({ target: target || "." }),
    });
    state.overview = {
      ...(state.overview ?? {}),
      scan: data.scan,
      counts: data.counts,
      project: data.scan.project,
      generatedAt: data.scan.generatedAt,
    };
    addActivity(text.scanDone);
    addChat(`${text.scanDone} ${data.scan.findings.length} ${text.findings.toLowerCase()}.`);
    renderOverview();
  } catch (error) {
    addActivity(`${text.scanFailed}: ${error.message}`);
    addChat(`${text.scanFailed}: ${error.message}`);
  } finally {
    elements.scanButton.disabled = false;
  }
}

async function changeLanguage(language) {
  const text = msg();
  if (!languages.includes(language)) {
    addChat(text.languageInvalid);
    return;
  }
  const data = await requestJson("/api/language", {
    method: "POST",
    body: JSON.stringify({ language }),
  });
  state.overview = data.overview;
  state.language = data.language;
  addChat(`${messages[state.language].languageChanged}: ${state.language}`);
  renderOverview();
}

function selectFindingById(id) {
  const normalizedId = id?.trim();
  if (!normalizedId) {
    addChat(msg().missingFinding);
    return undefined;
  }
  const finding = state.findings.find((item) => item.id.toLowerCase() === normalizedId.toLowerCase());
  if (!finding) {
    addChat(msg().findingMissing);
    return undefined;
  }
  state.selectedFindingId = finding.id;
  renderFindings();
  elements.findingDetail.scrollIntoView({ block: "center", behavior: "smooth" });
  return finding;
}

async function runCommand(rawValue) {
  const value = rawValue.trim();
  elements.commandInput.value = "";
  elements.commandPalette.hidden = true;

  if (!value) {
    return;
  }
  if (!value.startsWith("/")) {
    addChat(msg().slashOnly);
    return;
  }

  const [commandName, ...args] = value.slice(1).split(/\s+/);
  const command = commandName.toLowerCase();
  if (command === "help") {
    elements.commandInput.value = "/";
    showPalette("/");
    return;
  }
  if (command === "scan") {
    await runScan(args.join(" ").trim() || ".");
    return;
  }
  if (command === "status") {
    await loadOverview();
    addChat(msg().statusRefreshed);
    return;
  }
  if (command === "findings") {
    document.querySelector(".findings-list-panel").scrollIntoView({ block: "start", behavior: "smooth" });
    addChat(msg().focusFindings);
    return;
  }
  if (command === "explain") {
    const finding = selectFindingById(args[0]);
    if (finding) {
      addChat(`${msg().explaining}: ${finding.id}`);
    }
    return;
  }
  if (command === "fix") {
    const finding = selectFindingById(args[0]);
    if (finding) {
      addChat(`${msg().fixPlan}: ward fix ${finding.id}`);
    }
    return;
  }
  if (command === "settings") {
    elements.languageSelect.focus();
    elements.languageSelect.scrollIntoView({ block: "center", behavior: "smooth" });
    addChat(msg().focusSettings);
    return;
  }
  if (command === "lang") {
    await changeLanguage(args[0]);
    return;
  }
  if (command === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    addChat(msg().home);
    return;
  }
  if (command === "panel") {
    document.querySelector(".dashboard-grid").scrollIntoView({ block: "start", behavior: "smooth" });
    addChat(msg().panel);
    return;
  }
  if (command === "clear") {
    state.chat = [];
    renderChat();
    addActivity(msg().cleared);
    return;
  }
  if (command === "quit") {
    addChat(msg().closeHint);
    return;
  }

  addChat(msg().noCommand);
}

elements.commandInput.addEventListener("input", () => {
  state.activeCommandIndex = 0;
  showPalette(elements.commandInput.value);
});

elements.commandInput.addEventListener("keydown", (event) => {
  const matches = filterCommands(elements.commandInput.value);
  if (!elements.commandPalette.hidden && event.key === "ArrowDown") {
    event.preventDefault();
    state.activeCommandIndex = matches.length ? (state.activeCommandIndex + 1) % matches.length : 0;
    showPalette(elements.commandInput.value);
    return;
  }
  if (!elements.commandPalette.hidden && event.key === "ArrowUp") {
    event.preventDefault();
    state.activeCommandIndex = matches.length ? (state.activeCommandIndex + matches.length - 1) % matches.length : 0;
    showPalette(elements.commandInput.value);
    return;
  }
  if (event.key === "Tab" && elements.commandInput.value.startsWith("/")) {
    event.preventDefault();
    completeCommand(matches[state.activeCommandIndex]);
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    void runCommand(elements.commandInput.value);
  }
});

elements.sendCommand.addEventListener("click", () => {
  void runCommand(elements.commandInput.value);
});

elements.scanButton.addEventListener("click", () => {
  void runScan(".");
});

elements.settingsButton.addEventListener("click", () => {
  void runCommand("/settings");
});

elements.languageSelect.addEventListener("change", () => {
  void changeLanguage(elements.languageSelect.value);
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".composer-shell")) {
    elements.commandPalette.hidden = true;
  }
});

renderStaticCopy();
renderActivity();
renderChat();
void loadOverview().catch((error) => {
  addActivity(error.message);
  addChat(error.message);
});
