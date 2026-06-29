/* global localStorage, navigator */
// SEMA-GOVERNED: module sentryward.ui; browser behavior follows contratos/sentryward_ui.sema.
const severityOrder = ["critical", "high", "medium", "low", "info"];
const languages = ["en", "pt-BR", "es"];
const autoScanIntervalMs = 15000;

const messages = {
  en: {
    brandTagline: "The ward is watching.",
    dashboard: "Dashboard",
    findings: "Findings",
    ignored: "Ignored",
    settings: "Settings",
    project: "Project",
    name: "Name",
    stack: "Stack",
    path: "Path",
    chooseFolder: "Choose folder",
    status: "Status",
    language: "Language",
    localUi: "Local UI",
    title: "SentryWard",
    scan: "Run scan",
    scanNow: "Run now",
    scanMode: "Scan mode",
    manualMode: "Manual scan",
    continuousMode: "Continuous scan",
    startContinuous: "Start continuous scan",
    stopContinuous: "Stop continuous scan",
    manualModeCopy: "This visual UI scans when you click Run scan. Terminal ward watch is still the file-event watch mode.",
    continuousModeCopy: "This browser panel rescans every {seconds}s while it stays open.",
    continuousStarted: "Continuous scan enabled.",
    continuousStopped: "Continuous scan stopped.",
    activeProject: "Active project",
    projectCardCopy: "Choose the folder that SentryWard should inspect.",
    changeFolder: "Change folder",
    lastScan: "Last scan",
    never: "Never",
    lastScanDetail: "Use Run scan or enable continuous scan.",
    scannedAt: "Scanned at {time}",
    copySelected: "Copy selected",
    copyAll: "Copy all findings",
    reviewFindings: "Review findings",
    selectAll: "Select all",
    clear: "Clear",
    ignoreSelected: "Ignore selected",
    restoreSelected: "Restore selected",
    restoreAll: "Restore all",
    score: "Security score",
    noScan: "No scan loaded yet.",
    scanSummary: "{files} files scanned · {findings} active findings · {ignored} ignored",
    noFindings: "No active findings.",
    runScan: "Run a scan to populate findings.",
    noIgnored: "No ignored findings.",
    total: "total",
    ignoredTotal: "ignored",
    activity: "Activity",
    loaded: "Interface loaded.",
    overviewReady: "Project overview ready.",
    scanning: "Scan running...",
    scanDone: "Scan completed.",
    findingsRefreshed: "Findings refreshed for the selected language.",
    scanFailed: "Scan failed",
    semaEnabled: "Sema governance enabled",
    semaDisabled: "Sema governance disabled",
    semaEnableAction: "Enable Sema",
    semaDisableAction: "Disable Sema",
    semaToggleFailed: "Could not update Sema governance",
    governanceTitle: "Sema governance",
    contractCheckActive: "Sema contract checks will run with each scan.",
    contractCheckInactive: "Scans run without Sema contract checks until you enable governance.",
    ignoredCount: "{count} ignored",
    noSelection: "No finding selected",
    selectFinding: "Select a finding to inspect impact, recommendation, and exact code context.",
    codeEmpty: "Code context appears here.",
    codeLoading: "Loading code context...",
    codeUnavailable: "Code context unavailable.",
    file: "File",
    impact: "Impact",
    problem: "Problem",
    recommendation: "Recommendation",
    evidence: "Evidence",
    autoFix: "Auto-fix",
    yes: "yes",
    no: "no",
    copyFinding: "Copy finding",
    copyCode: "Copy code",
    ignore: "Ignore",
    restore: "Restore",
    copied: "Copied to clipboard.",
    selectedCopied: "Selected findings copied.",
    ignoredDone: "Finding hidden. You can restore it in Ignored.",
    restoredDone: "Finding restored.",
    useCtrl: "Tip: hold Ctrl while clicking to select more than one.",
    folderTitle: "Choose project folder",
    folderHelp: "Click a folder row to enter it, then select the current folder as the active project.",
    folderOpen: "Open {name}",
    folderGoAction: "Go to path",
    folderParent: "Back",
    folderUse: "Select project",
    folderChanged: "Project folder changed.",
    folderFailed: "Could not open folder",
    folderEmpty: "No child folders here.",
    languageCopy: "Change the local UI language.",
    projectCopy: "Switch the active local project without restarting SentryWard.",
    governanceCopy: "Sema remains optional. Turn it on when this project wants semantic contract governance.",
    languageChanged: "Language changed and saved.",
  },
  "pt-BR": {
    brandTagline: "A ward est\u00e1 observando.",
    dashboard: "Dashboard",
    findings: "Achados",
    ignored: "Ignorados",
    settings: "Ajustes",
    project: "Projeto",
    name: "Nome",
    stack: "Stack",
    path: "Caminho",
    chooseFolder: "Escolher pasta",
    status: "Status",
    language: "Idioma",
    localUi: "Interface local",
    title: "SentryWard",
    scan: "Rodar scan",
    scanNow: "Rodar agora",
    scanMode: "Modo de scan",
    manualMode: "Scan manual",
    continuousMode: "Varredura contínua",
    startContinuous: "Ativar varredura contínua",
    stopContinuous: "Parar varredura contínua",
    manualModeCopy: "Esta interface visual escaneia quando você clica em Rodar scan. O ward watch do terminal continua sendo o watch por evento de arquivo.",
    continuousModeCopy: "Este painel do navegador reescaneia a cada {seconds}s enquanto ficar aberto.",
    continuousStarted: "Varredura contínua ativada.",
    continuousStopped: "Varredura contínua parada.",
    activeProject: "Projeto ativo",
    projectCardCopy: "Escolha a pasta que o SentryWard deve inspecionar.",
    changeFolder: "Trocar pasta",
    lastScan: "Último scan",
    never: "Nunca",
    lastScanDetail: "Use Rodar scan ou ative a varredura contínua.",
    scannedAt: "Escaneado às {time}",
    copySelected: "Copiar selecionados",
    copyAll: "Copiar todos os achados",
    reviewFindings: "Revisar achados",
    selectAll: "Selecionar todos",
    clear: "Limpar",
    ignoreSelected: "Ignorar selecionados",
    restoreSelected: "Restaurar selecionados",
    restoreAll: "Restaurar todos",
    score: "Pontua\u00e7\u00e3o de seguran\u00e7a",
    noScan: "Nenhum scan carregado ainda.",
    scanSummary: "{files} arquivos analisados · {findings} achados ativos · {ignored} ignorados",
    noFindings: "Nenhum achado ativo.",
    runScan: "Rode um scan para preencher achados.",
    noIgnored: "Nenhum achado ignorado.",
    total: "total",
    ignoredTotal: "ignorados",
    activity: "Atividade",
    loaded: "Interface carregada.",
    overviewReady: "Resumo do projeto pronto.",
    scanning: "Scan rodando...",
    scanDone: "Scan conclu\u00eddo.",
    findingsRefreshed: "Achados atualizados para o idioma selecionado.",
    scanFailed: "Scan falhou",
    semaEnabled: "Governan\u00e7a Sema ativada",
    semaDisabled: "Governan\u00e7a Sema desativada",
    semaEnableAction: "Ativar Sema",
    semaDisableAction: "Desativar Sema",
    semaToggleFailed: "N\u00e3o foi poss\u00edvel atualizar a governan\u00e7a Sema",
    governanceTitle: "Governan\u00e7a Sema",
    contractCheckActive: "Checks de contrato Sema v\u00e3o rodar junto com cada scan.",
    contractCheckInactive: "Os scans rodam sem checks de contrato Sema at\u00e9 voc\u00ea ativar a governan\u00e7a.",
    ignoredCount: "{count} ignorados",
    noSelection: "Nenhum achado selecionado",
    selectFinding: "Selecione um achado para inspecionar impacto, recomenda\u00e7\u00e3o e contexto exato do c\u00f3digo.",
    codeEmpty: "O contexto de c\u00f3digo aparece aqui.",
    codeLoading: "Carregando contexto de c\u00f3digo...",
    codeUnavailable: "Contexto de c\u00f3digo indispon\u00edvel.",
    file: "Arquivo",
    impact: "Impacto",
    problem: "Problema",
    recommendation: "Recomenda\u00e7\u00e3o",
    evidence: "Evid\u00eancia",
    autoFix: "Auto-corre\u00e7\u00e3o",
    yes: "sim",
    no: "n\u00e3o",
    copyFinding: "Copiar achado",
    copyCode: "Copiar c\u00f3digo",
    ignore: "Ignorar",
    restore: "Restaurar",
    copied: "Copiado para a \u00e1rea de transfer\u00eancia.",
    selectedCopied: "Achados selecionados copiados.",
    ignoredDone: "Achado ocultado. D\u00e1 para restaurar em Ignorados.",
    restoredDone: "Achado restaurado.",
    useCtrl: "Dica: segure Ctrl ao clicar para selecionar mais de um.",
    folderTitle: "Escolher pasta do projeto",
    folderHelp: "Clique em uma pasta para entrar nela e depois selecione a pasta atual como projeto ativo.",
    folderOpen: "Abrir {name}",
    folderGoAction: "Ir para caminho",
    folderParent: "Voltar",
    folderUse: "Selecionar projeto",
    folderChanged: "Pasta do projeto alterada.",
    folderFailed: "N\u00e3o foi poss\u00edvel abrir a pasta",
    folderEmpty: "N\u00e3o h\u00e1 subpastas aqui.",
    languageCopy: "Altere o idioma da interface local.",
    projectCopy: "Troque o projeto local ativo sem reiniciar o SentryWard.",
    governanceCopy: "Sema continua opcional. Ative quando este projeto quiser governan\u00e7a por contrato sem\u00e2ntico.",
    languageChanged: "Idioma alterado e salvo.",
  },
  es: {
    brandTagline: "La ward est\u00e1 observando.",
    dashboard: "Dashboard",
    findings: "Hallazgos",
    ignored: "Ignorados",
    settings: "Ajustes",
    project: "Proyecto",
    name: "Nombre",
    stack: "Stack",
    path: "Ruta",
    chooseFolder: "Elegir carpeta",
    status: "Estado",
    language: "Idioma",
    localUi: "Interfaz local",
    title: "SentryWard",
    scan: "Ejecutar scan",
    scanNow: "Ejecutar ahora",
    scanMode: "Modo de scan",
    manualMode: "Scan manual",
    continuousMode: "Scan continuo",
    startContinuous: "Activar scan continuo",
    stopContinuous: "Detener scan continuo",
    manualModeCopy: "Esta interfaz visual escanea cuando haces clic en Ejecutar scan. ward watch en terminal sigue siendo el watch por evento de archivo.",
    continuousModeCopy: "Este panel del navegador reescanea cada {seconds}s mientras esté abierto.",
    continuousStarted: "Scan continuo activado.",
    continuousStopped: "Scan continuo detenido.",
    activeProject: "Proyecto activo",
    projectCardCopy: "Elige la carpeta que SentryWard debe inspeccionar.",
    changeFolder: "Cambiar carpeta",
    lastScan: "Último scan",
    never: "Nunca",
    lastScanDetail: "Usa Ejecutar scan o activa el scan continuo.",
    scannedAt: "Escaneado a las {time}",
    copySelected: "Copiar seleccionados",
    copyAll: "Copiar todos los hallazgos",
    reviewFindings: "Revisar hallazgos",
    selectAll: "Seleccionar todos",
    clear: "Limpiar",
    ignoreSelected: "Ignorar seleccionados",
    restoreSelected: "Restaurar seleccionados",
    restoreAll: "Restaurar todos",
    score: "Puntuaci\u00f3n de seguridad",
    noScan: "No hay scan cargado todav\u00eda.",
    scanSummary: "{files} archivos analizados · {findings} hallazgos activos · {ignored} ignorados",
    noFindings: "No hay hallazgos activos.",
    runScan: "Ejecuta un scan para llenar hallazgos.",
    noIgnored: "No hay hallazgos ignorados.",
    total: "total",
    ignoredTotal: "ignorados",
    activity: "Actividad",
    loaded: "Interfaz cargada.",
    overviewReady: "Resumen del proyecto listo.",
    scanning: "Scan en ejecuci\u00f3n...",
    scanDone: "Scan completado.",
    findingsRefreshed: "Hallazgos actualizados para el idioma seleccionado.",
    scanFailed: "Scan fall\u00f3",
    semaEnabled: "Gobernanza Sema activada",
    semaDisabled: "Gobernanza Sema desactivada",
    semaEnableAction: "Activar Sema",
    semaDisableAction: "Desactivar Sema",
    semaToggleFailed: "No se pudo actualizar la gobernanza Sema",
    governanceTitle: "Gobernanza Sema",
    contractCheckActive: "Los checks de contrato Sema se ejecutar\u00e1n con cada scan.",
    contractCheckInactive: "Los scans se ejecutan sin checks de contrato Sema hasta que actives la gobernanza.",
    ignoredCount: "{count} ignorados",
    noSelection: "Ningun hallazgo seleccionado",
    selectFinding: "Selecciona un hallazgo para revisar impacto, recomendaci\u00f3n y contexto exacto del c\u00f3digo.",
    codeEmpty: "El contexto de c\u00f3digo aparece aqu\u00ed.",
    codeLoading: "Cargando contexto de c\u00f3digo...",
    codeUnavailable: "Contexto de c\u00f3digo no disponible.",
    file: "Archivo",
    impact: "Impacto",
    problem: "Problema",
    recommendation: "Recomendaci\u00f3n",
    evidence: "Evidencia",
    autoFix: "Auto-correcci\u00f3n",
    yes: "s\u00ed",
    no: "no",
    copyFinding: "Copiar hallazgo",
    copyCode: "Copiar c\u00f3digo",
    ignore: "Ignorar",
    restore: "Restaurar",
    copied: "Copiado al portapapeles.",
    selectedCopied: "Hallazgos seleccionados copiados.",
    ignoredDone: "Hallazgo ocultado. Puedes restaurarlo en Ignorados.",
    restoredDone: "Hallazgo restaurado.",
    useCtrl: "Tip: mant\u00e9n Ctrl al hacer clic para seleccionar m\u00e1s de uno.",
    folderTitle: "Elegir carpeta del proyecto",
    folderHelp: "Haz clic en una carpeta para entrar y luego selecciona la carpeta actual como proyecto activo.",
    folderOpen: "Abrir {name}",
    folderGoAction: "Ir a ruta",
    folderParent: "Volver",
    folderUse: "Seleccionar proyecto",
    folderChanged: "Carpeta del proyecto cambiada.",
    folderFailed: "No se pudo abrir la carpeta",
    folderEmpty: "No hay subcarpetas aqu\u00ed.",
    languageCopy: "Cambia el idioma de la interfaz local.",
    projectCopy: "Cambia el proyecto local activo sin reiniciar SentryWard.",
    governanceCopy: "Sema sigue opcional. Act\u00edvalo cuando este proyecto quiera gobernanza por contrato sem\u00e1ntico.",
    languageChanged: "Idioma cambiado y guardado.",
  },
};

const severityLabels = {
  en: { critical: "Critical", high: "High", medium: "Medium", low: "Low", info: "Info" },
  "pt-BR": { critical: "Cr\u00edtico", high: "Alto", medium: "M\u00e9dio", low: "Baixo", info: "Info" },
  es: { critical: "Cr\u00edtico", high: "Alto", medium: "Medio", low: "Bajo", info: "Info" },
};

const state = {
  language: "en",
  activeTab: "dashboard",
  overview: undefined,
  findings: [],
  selectedFindingKey: undefined,
  selectedIds: new Set(),
  ignoredKeys: new Set(),
  activity: [],
  source: undefined,
  folder: undefined,
  autoScanEnabled: false,
  autoScanTimer: undefined,
  scanRunning: false,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  navTabs: $$(".nav-tab"),
  brandTagline: $("#brand-tagline"),
  projectHeading: $("#project-heading"),
  projectNameLabel: $("#project-name-label"),
  projectStackLabel: $("#project-stack-label"),
  projectRootLabel: $("#project-root-label"),
  projectName: $("#project-name"),
  projectStack: $("#project-stack"),
  projectRoot: $("#project-root"),
  folderButton: $("#folder-button"),
  statusHeading: $("#status-heading"),
  watchState: $("#watch-state"),
  semaState: $("#sema-state"),
  ignoredState: $("#ignored-state"),
  settingsHeading: $("#settings-heading"),
  languageLabel: $("#language-label"),
  languageSelect: $("#language-select"),
  settingsLanguageSelect: $("#settings-language-select"),
  pageTitle: $("#page-title"),
  eyeline: $("#eyeline"),
  scanButton: $("#scan-button"),
  autoScanToggle: $("#auto-scan-toggle"),
  scanModeTitle: $("#scan-mode-title"),
  scanModeValue: $("#scan-mode-value"),
  scanModeCopy: $("#scan-mode-copy"),
  projectCardTitle: $("#project-card-title"),
  projectCardPath: $("#project-card-path"),
  projectCardCopy: $("#project-card-copy"),
  projectCardFolderButton: $("#project-card-folder-button"),
  lastScanTitle: $("#last-scan-title"),
  lastScanValue: $("#last-scan-value"),
  lastScanDetail: $("#last-scan-detail"),
  copySelectedButton: $("#copy-selected-button"),
  settingsButton: $("#settings-button"),
  scoreTitle: $("#score-title"),
  scoreRing: $("#score-ring"),
  scoreValue: $("#score-value"),
  scanSummary: $("#scan-summary"),
  severityTitle: $("#severity-title"),
  activityTitle: $("#activity-title"),
  activityList: $("#activity-list"),
  findingsTitle: $("#findings-title"),
  findingTotal: $("#finding-total"),
  findingsList: $("#findings-list"),
  findingDetail: $("#finding-detail"),
  codePanel: $("#code-panel"),
  selectVisibleButton: $("#select-visible-button"),
  clearSelectionButton: $("#clear-selection-button"),
  ignoreSelectedButton: $("#ignore-selected-button"),
  copyFindingButton: $("#copy-finding-button"),
  copyCodeButton: $("#copy-code-button"),
  ignoreCurrentButton: $("#ignore-current-button"),
  ignoredTitle: $("#ignored-title"),
  ignoredTotal: $("#ignored-total"),
  ignoredList: $("#ignored-list"),
  restoreSelectedButton: $("#restore-selected-button"),
  restoreAllButton: $("#restore-all-button"),
  settingsLanguageTitle: $("#settings-language-title"),
  settingsLanguageCopy: $("#settings-language-copy"),
  settingsProjectTitle: $("#settings-project-title"),
  settingsProjectCopy: $("#settings-project-copy"),
  settingsFolderButton: $("#settings-folder-button"),
  settingsGovernanceTitle: $("#settings-governance-title"),
  settingsGovernanceCopy: $("#settings-governance-copy"),
  settingsSemaState: $("#settings-sema-state"),
  settingsSemaDetail: $("#settings-sema-detail"),
  settingsSemaToggle: $("#settings-sema-toggle"),
  folderModal: $("#folder-modal"),
  folderTitle: $("#folder-title"),
  folderCurrent: $("#folder-current"),
  folderHelp: $("#folder-help"),
  folderClose: $("#folder-close"),
  folderPathInput: $("#folder-path-input"),
  folderGo: $("#folder-go"),
  folderDrives: $("#folder-drives"),
  folderError: $("#folder-error"),
  folderList: $("#folder-list"),
  folderUp: $("#folder-up"),
  folderSelect: $("#folder-select"),
  toast: $("#toast"),
};

function msg() {
  return messages[state.language] ?? messages.en;
}

function t(key, params = {}) {
  const template = msg()[key] ?? messages.en[key] ?? key;
  return Object.entries(params).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), template);
}

function severityName(severity) {
  return (severityLabels[state.language] ?? severityLabels.en)[severity] ?? severity;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setText(element, value) {
  if (element) element.textContent = value;
}

function formatStack(project) {
  return project?.stack?.length ? project.stack.join(" · ") : "unknown";
}

function currentScan() {
  return state.overview?.scan;
}

function projectRoot() {
  return state.overview?.project?.root ?? "";
}

function findingKey(finding) {
  if (!finding) return undefined;
  return finding?.fingerprint || `${finding?.id}:${finding?.file}:${finding?.line}`;
}

function ignoredStorageKey() {
  return `sentryward.ignored.v2.${projectRoot()}`;
}

function loadIgnoredState() {
  try {
    state.ignoredKeys = new Set(JSON.parse(localStorage.getItem(ignoredStorageKey()) ?? "[]"));
  } catch {
    state.ignoredKeys = new Set();
  }
}

function saveIgnoredState() {
  localStorage.setItem(ignoredStorageKey(), JSON.stringify([...state.ignoredKeys]));
}

function activeFindings() {
  return state.findings.filter((finding) => !state.ignoredKeys.has(findingKey(finding)));
}

function ignoredFindings() {
  return state.findings.filter((finding) => state.ignoredKeys.has(findingKey(finding)));
}

function sortedFindings(findings) {
  return [...findings].sort((a, b) => {
    const rank = severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
    return rank || a.id.localeCompare(b.id) || a.file.localeCompare(b.file);
  });
}

function countsFrom(findings) {
  return Object.fromEntries(severityOrder.map((severity) => [severity, findings.filter((item) => item.severity === severity).length]));
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

function toast(message) {
  setText(elements.toast, message);
  elements.toast.hidden = false;
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 2600);
}

function addActivity(line) {
  state.activity = [line, ...state.activity].slice(0, 6);
  renderActivity();
}

function formatTime(value) {
  if (!value) return t("never");
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function renderScanMode() {
  const continuous = state.autoScanEnabled;
  setText(elements.scanModeValue, continuous ? t("continuousMode") : t("manualMode"));
  setText(
    elements.scanModeCopy,
    continuous ? t("continuousModeCopy", { seconds: autoScanIntervalMs / 1000 }) : t("manualModeCopy"),
  );
  setText(elements.autoScanToggle, continuous ? t("stopContinuous") : t("startContinuous"));
  elements.autoScanToggle.setAttribute("aria-pressed", String(continuous));
  elements.autoScanToggle.classList.toggle("danger", continuous);
  setText(elements.watchState, continuous ? t("continuousMode") : t("localUi"));
}

function renderStaticCopy() {
  document.documentElement.lang = state.language;
  setText(elements.brandTagline, t("brandTagline"));
  elements.navTabs.forEach((tab) => setText(tab, t(tab.dataset.tab)));
  setText(elements.projectHeading, t("project"));
  setText(elements.projectNameLabel, t("name"));
  setText(elements.projectStackLabel, t("stack"));
  setText(elements.projectRootLabel, t("path"));
  setText(elements.folderButton, t("chooseFolder"));
  setText(elements.statusHeading, t("status"));
  setText(elements.watchState, t("localUi"));
  setText(elements.settingsHeading, t("settings"));
  setText(elements.languageLabel, t("language"));
  setText(elements.pageTitle, t("title"));
  setText(elements.eyeline, t("localUi"));
  setText(elements.scanButton, t("scan"));
  setText(elements.scanModeTitle, t("scanMode"));
  setText(elements.projectCardTitle, t("activeProject"));
  setText(elements.projectCardCopy, t("projectCardCopy"));
  setText(elements.projectCardFolderButton, t("changeFolder"));
  setText(elements.lastScanTitle, t("lastScan"));
  setText(elements.copySelectedButton, t("copySelected"));
  setText(elements.settingsButton, t("settings"));
  setText(elements.scoreTitle, t("score"));
  setText(elements.severityTitle, t("findings"));
  setText(elements.activityTitle, t("activity"));
  setText(elements.findingsTitle, t("findings"));
  setText(elements.selectVisibleButton, t("selectAll"));
  setText(elements.clearSelectionButton, t("clear"));
  setText(elements.ignoreSelectedButton, t("ignoreSelected"));
  setText(elements.copyFindingButton, t("copyFinding"));
  setText(elements.copyCodeButton, t("copyCode"));
  setText(elements.ignoredTitle, t("ignored"));
  setText(elements.restoreSelectedButton, t("restoreSelected"));
  setText(elements.restoreAllButton, t("restoreAll"));
  setText(elements.settingsLanguageTitle, t("language"));
  setText(elements.settingsLanguageCopy, t("languageCopy"));
  setText(elements.settingsProjectTitle, t("chooseFolder"));
  setText(elements.settingsProjectCopy, t("projectCopy"));
  setText(elements.settingsFolderButton, t("chooseFolder"));
  setText(elements.settingsGovernanceTitle, t("governanceTitle"));
  setText(elements.settingsGovernanceCopy, t("governanceCopy"));
  setText(elements.folderTitle, t("folderTitle"));
  setText(elements.folderHelp, t("folderHelp"));
  setText(elements.folderGo, t("folderGoAction"));
  setText(elements.folderUp, t("folderParent"));
  setText(elements.folderSelect, t("folderUse"));
  $$("[data-tab-target='findings']").forEach((button) => setText(button, t("reviewFindings")));
  $$("[data-action='copy-all']").forEach((button) => setText(button, t("copyAll")));
  $$("[data-action='select-all']").forEach((button) => setText(button, t("selectAll")));
  severityOrder.forEach((severity) => setText($(`.severity-row.${severity} span`), severityName(severity)));
}

function renderActivity() {
  const items = state.activity.length ? state.activity : [t("loaded")];
  elements.activityList.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderTabs() {
  elements.navTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === state.activeTab));
  $$("[data-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === state.activeTab));
}

function setActiveTab(tab) {
  state.activeTab = tab;
  renderTabs();
}

function syncSelectionToExistingFindings() {
  const existing = new Set(state.findings.map(findingKey));
  state.selectedIds = new Set([...state.selectedIds].filter((id) => existing.has(id)));
  if (!existing.has(state.selectedFindingKey)) {
    state.selectedFindingKey = findingKey(activeFindings()[0] ?? ignoredFindings()[0]);
  }
}

function renderOverview() {
  const overview = state.overview;
  const project = overview?.project;
  const scan = currentScan();
  state.language = overview?.language ?? state.language;
  elements.languageSelect.value = state.language;
  elements.settingsLanguageSelect.value = state.language;
  renderStaticCopy();

  setText(elements.projectName, project?.name ?? "unknown");
  setText(elements.projectStack, formatStack(project));
  setText(elements.projectRoot, project?.root ?? "");
  setText(elements.projectCardPath, project?.root ?? "");
  renderScanMode();

  const semaEnabled = Boolean(overview?.config?.sema?.enabled);
  const semaText = semaEnabled ? t("semaEnabled") : t("semaDisabled");
  setText(elements.semaState, semaText);
  setText(elements.settingsSemaState, semaText);
  setText(elements.settingsSemaDetail, semaEnabled ? t("contractCheckActive") : t("contractCheckInactive"));
  setText(elements.settingsSemaToggle, semaEnabled ? t("semaDisableAction") : t("semaEnableAction"));
  elements.settingsSemaToggle.setAttribute("aria-pressed", String(semaEnabled));
  elements.settingsSemaToggle.classList.toggle("danger", semaEnabled);
  elements.semaState.classList.toggle("safe", semaEnabled);
  elements.settingsSemaState.classList.toggle("safe", semaEnabled);

  const active = activeFindings();
  const ignored = ignoredFindings();
  const counts = countsFrom(active);
  const score = Number(scan?.score ?? 100);
  elements.scoreRing.style.setProperty("--score", String(score));
  setText(elements.scoreValue, String(score));
  setText(
    elements.scanSummary,
    scan ? t("scanSummary", { files: scan.scannedFiles, findings: active.length, ignored: ignored.length }) : t("noScan"),
  );
  setText(elements.lastScanValue, scan ? t("scannedAt", { time: formatTime(scan.generatedAt) }) : t("never"));
  setText(elements.lastScanDetail, state.autoScanEnabled ? t("continuousModeCopy", { seconds: autoScanIntervalMs / 1000 }) : t("lastScanDetail"));
  setText(elements.ignoredState, t("ignoredCount", { count: ignored.length }));
  severityOrder.forEach((severity) => setText($(`#count-${severity}`), String(counts[severity])));

  syncSelectionToExistingFindings();
  renderFindings();
  renderIgnored();
  renderSelectionActions();
}

function renderSelectionActions() {
  const selectedCount = state.selectedIds.size;
  elements.copySelectedButton.disabled = selectedCount === 0;
  elements.ignoreSelectedButton.disabled = selectedCount === 0;
  elements.restoreSelectedButton.disabled = selectedCount === 0;
  elements.clearSelectionButton.disabled = selectedCount === 0;
}

function findingByKey(key) {
  return state.findings.find((finding) => findingKey(finding) === key);
}

function renderFindingRow(finding, ignored = false) {
  const key = findingKey(finding);
  const checked = state.selectedIds.has(key) ? "checked" : "";
  const active = key === state.selectedFindingKey ? "active" : "";
  const selected = state.selectedIds.has(key) ? "selected" : "";
  return `
    <button class="finding-row ${active} ${selected}" type="button" data-finding-key="${escapeHtml(key)}" data-ignored="${ignored ? "1" : "0"}">
      <input type="checkbox" ${checked} aria-label="Select ${escapeHtml(finding.id)}" />
      <span class="severity-badge ${escapeHtml(finding.severity)}">${escapeHtml(severityName(finding.severity))}</span>
      <span>
        <span class="finding-id">${escapeHtml(finding.id)}</span>
        <strong>${escapeHtml(finding.title)}</strong>
        <small>${escapeHtml(finding.file)}:${escapeHtml(finding.line)}</small>
      </span>
    </button>
  `;
}

function bindFindingRows(container) {
  container.querySelectorAll("[data-finding-key]").forEach((row) => {
    const key = row.getAttribute("data-finding-key");
    const checkbox = row.querySelector("input");
    checkbox.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleSelection(key, true);
    });
    row.addEventListener("click", (event) => {
      selectFinding(key, event.ctrlKey || event.metaKey);
    });
  });
}

function renderFindings() {
  const findings = sortedFindings(activeFindings());
  setText(elements.findingTotal, `${findings.length} ${t("total")} · ${t("useCtrl")}`);
  if (findings.length === 0) {
    elements.findingsList.className = "findings-list empty";
    elements.findingsList.textContent = currentScan() ? t("noFindings") : t("runScan");
    renderFindingDetail(undefined);
    return;
  }

  if (!state.selectedFindingKey || state.ignoredKeys.has(state.selectedFindingKey)) {
    state.selectedFindingKey = findingKey(findings[0]);
  }
  elements.findingsList.className = "findings-list";
  elements.findingsList.innerHTML = findings.map((finding) => renderFindingRow(finding)).join("");
  bindFindingRows(elements.findingsList);
  renderFindingDetail(findingByKey(state.selectedFindingKey));
}

function renderIgnored() {
  const findings = sortedFindings(ignoredFindings());
  setText(elements.ignoredTotal, `${findings.length} ${t("ignoredTotal")}`);
  if (findings.length === 0) {
    elements.ignoredList.className = "findings-list empty";
    elements.ignoredList.textContent = t("noIgnored");
    return;
  }
  elements.ignoredList.className = "findings-list";
  elements.ignoredList.innerHTML = findings.map((finding) => renderFindingRow(finding, true)).join("");
  bindFindingRows(elements.ignoredList);
}

function renderFindingDetail(finding) {
  if (!finding) {
    elements.findingDetail.className = "finding-detail empty";
    elements.findingDetail.innerHTML = `<h2>${escapeHtml(t("noSelection"))}</h2><p>${escapeHtml(t("selectFinding"))}</p>`;
    elements.codePanel.className = "code-panel empty";
    elements.codePanel.textContent = t("codeEmpty");
    elements.copyFindingButton.disabled = true;
    elements.copyCodeButton.disabled = true;
    elements.ignoreCurrentButton.disabled = true;
    return;
  }

  elements.copyFindingButton.disabled = false;
  elements.copyCodeButton.disabled = !state.source;
  elements.ignoreCurrentButton.disabled = false;
  setText(elements.ignoreCurrentButton, state.ignoredKeys.has(findingKey(finding)) ? t("restore") : t("ignore"));
  elements.findingDetail.className = "finding-detail";
  elements.findingDetail.innerHTML = `
    <span class="severity-badge ${escapeHtml(finding.severity)}">${escapeHtml(severityName(finding.severity))}</span>
    <h2>${escapeHtml(finding.title)}</h2>
    <p>${escapeHtml(finding.id)} · ${escapeHtml(finding.ruleId ?? finding.category)}</p>
    <dl>
      <div><dt>${escapeHtml(t("file"))}</dt><dd>${escapeHtml(finding.file)}:${escapeHtml(finding.line)}</dd></div>
      <div><dt>${escapeHtml(t("problem"))}</dt><dd>${escapeHtml(finding.problem)}</dd></div>
      <div><dt>${escapeHtml(t("impact"))}</dt><dd>${escapeHtml(finding.impact)}</dd></div>
      <div><dt>${escapeHtml(t("recommendation"))}</dt><dd>${escapeHtml(finding.recommendation)}</dd></div>
      <div><dt>${escapeHtml(t("evidence"))}</dt><dd>${escapeHtml(finding.evidence)}</dd></div>
      <div><dt>${escapeHtml(t("autoFix"))}</dt><dd>${finding.autoFixSafe ? t("yes") : t("no")}</dd></div>
    </dl>
  `;
  void loadSource(finding);
}

function renderCodePanel() {
  const source = state.source;
  if (!source) {
    elements.codePanel.className = "code-panel empty";
    elements.codePanel.textContent = t("codeEmpty");
    elements.copyCodeButton.disabled = true;
    return;
  }
  elements.codePanel.className = "code-panel";
  elements.codePanel.innerHTML = source.lines
    .map(
      (line) => `
        <div class="code-line ${line.hit ? "hit" : ""}">
          <span class="code-line-number">${line.number}</span>
          <span class="code-line-text">${escapeHtml(line.text || " ")}</span>
        </div>
      `,
    )
    .join("");
  elements.copyCodeButton.disabled = false;
}

async function loadSource(finding) {
  state.source = undefined;
  elements.codePanel.className = "code-panel empty";
  elements.codePanel.textContent = t("codeLoading");
  elements.copyCodeButton.disabled = true;
  try {
    const data = await requestJson(`/api/source?file=${encodeURIComponent(finding.file)}&line=${encodeURIComponent(finding.line)}`);
    if (state.selectedFindingKey === findingKey(finding)) {
      state.source = data.source;
      renderCodePanel();
    }
  } catch (error) {
    elements.codePanel.className = "code-panel empty";
    elements.codePanel.textContent = `${t("codeUnavailable")} ${error.message}`;
  }
}

function toggleSelection(key, additive) {
  if (!additive) state.selectedIds = new Set();
  if (state.selectedIds.has(key)) {
    state.selectedIds.delete(key);
  } else {
    state.selectedIds.add(key);
  }
  state.selectedFindingKey = key;
  state.source = undefined;
  renderOverview();
}

function selectFinding(key, additive = false) {
  if (additive) {
    toggleSelection(key, true);
    return;
  }
  state.selectedIds = new Set([key]);
  state.selectedFindingKey = key;
  state.source = undefined;
  renderOverview();
}

function selectAllVisible() {
  activeFindings().forEach((finding) => state.selectedIds.add(findingKey(finding)));
  state.selectedFindingKey = [...state.selectedIds][0] ?? state.selectedFindingKey;
  renderOverview();
}

function clearSelection() {
  state.selectedIds.clear();
  renderOverview();
}

function ignoreSelected() {
  const keys = state.selectedIds.size ? [...state.selectedIds] : state.selectedFindingKey ? [state.selectedFindingKey] : [];
  keys.forEach((key) => state.ignoredKeys.add(key));
  state.selectedIds.clear();
  saveIgnoredState();
  state.selectedFindingKey = findingKey(activeFindings()[0]);
  addActivity(t("ignoredDone"));
  toast(t("ignoredDone"));
  renderOverview();
}

function restoreSelected(all = false) {
  const keys = all ? [...state.ignoredKeys] : state.selectedIds.size ? [...state.selectedIds] : state.selectedFindingKey ? [state.selectedFindingKey] : [];
  keys.forEach((key) => state.ignoredKeys.delete(key));
  state.selectedIds.clear();
  saveIgnoredState();
  state.selectedFindingKey = keys[0] ?? findingKey(activeFindings()[0]);
  addActivity(t("restoredDone"));
  toast(t("restoredDone"));
  renderOverview();
}

async function writeClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function sourceText() {
  return state.source?.lines.map((line) => `${String(line.number).padStart(4, " ")} | ${line.text}`).join("\n") ?? "";
}

function formatFinding(finding, includeCode = true) {
  const lines = [
    `${finding.severity.toUpperCase()} ${finding.id} · ${finding.title}`,
    `${t("file")}: ${finding.file}:${finding.line}`,
    `${t("problem")}: ${finding.problem}`,
    `${t("impact")}: ${finding.impact}`,
    `${t("recommendation")}: ${finding.recommendation}`,
    `${t("evidence")}: ${finding.evidence}`,
  ];
  if (includeCode && state.selectedFindingKey === findingKey(finding) && state.source) {
    lines.push("", sourceText());
  }
  return lines.join("\n");
}

async function copyCurrentFinding() {
  const finding = findingByKey(state.selectedFindingKey);
  if (!finding) return;
  await writeClipboard(formatFinding(finding));
  toast(t("copied"));
}

async function copyCurrentCode() {
  if (!state.source) return;
  await writeClipboard(sourceText());
  toast(t("copied"));
}

async function copySelectedFindings(all = false) {
  const keys = all ? activeFindings().map(findingKey) : [...state.selectedIds];
  const findings = keys.map(findingByKey).filter(Boolean);
  if (findings.length === 0) return;
  await writeClipboard(findings.map((finding) => formatFinding(finding, false)).join("\n\n---\n\n"));
  toast(all ? t("copyAll") : t("selectedCopied"));
}

async function loadOverview() {
  state.overview = await requestJson("/api/overview");
  state.language = state.overview.language ?? state.language;
  state.findings = Array.isArray(state.overview.scan?.findings) ? state.overview.scan.findings : [];
  loadIgnoredState();
  addActivity(t("overviewReady"));
  renderOverview();
}

async function runScan() {
  if (state.scanRunning) return;
  state.scanRunning = true;
  elements.scanButton.disabled = true;
  elements.autoScanToggle.disabled = true;
  addActivity(t("scanning"));
  try {
    const data = await requestJson("/api/scan", {
      method: "POST",
      body: JSON.stringify({ target: ".", contractCheck: Boolean(state.overview?.config?.sema?.enabled) }),
    });
    state.overview = {
      ...(state.overview ?? {}),
      scan: data.scan,
      counts: data.counts,
      project: data.scan.project,
      generatedAt: data.scan.generatedAt,
    };
    state.findings = data.scan.findings;
    addActivity(`${t("scanDone")} ${data.scan.findings.length} ${t("findings").toLowerCase()}.`);
    renderOverview();
  } catch (error) {
    addActivity(`${t("scanFailed")}: ${error.message}`);
    toast(`${t("scanFailed")}: ${error.message}`);
  } finally {
    state.scanRunning = false;
    elements.scanButton.disabled = false;
    elements.autoScanToggle.disabled = false;
    renderScanMode();
  }
}

function stopAutoScan(showMessage = true) {
  if (state.autoScanTimer) {
    window.clearInterval(state.autoScanTimer);
    state.autoScanTimer = undefined;
  }
  state.autoScanEnabled = false;
  if (showMessage) {
    addActivity(t("continuousStopped"));
    toast(t("continuousStopped"));
  }
  renderOverview();
}

function startAutoScan() {
  if (state.autoScanTimer) {
    window.clearInterval(state.autoScanTimer);
  }
  state.autoScanEnabled = true;
  state.autoScanTimer = window.setInterval(() => void runScan(), autoScanIntervalMs);
  addActivity(t("continuousStarted"));
  toast(t("continuousStarted"));
  renderOverview();
  void runScan();
}

function toggleAutoScan() {
  if (state.autoScanEnabled) {
    stopAutoScan();
    return;
  }
  startAutoScan();
}

async function changeLanguage(language) {
  if (!languages.includes(language)) return;
  const hadScan = Boolean(currentScan());
  elements.languageSelect.disabled = true;
  try {
    const data = await requestJson("/api/language", {
      method: "POST",
      body: JSON.stringify({ language, refreshScan: hadScan }),
    });
    state.overview = data.overview;
    state.language = data.language;
    state.findings = Array.isArray(state.overview.scan?.findings) ? state.overview.scan.findings : [];
    state.selectedIds = new Set([...state.selectedIds].filter((key) => state.findings.some((finding) => findingKey(finding) === key)));
    if (data.refreshedScan) {
      addActivity(t("findingsRefreshed"));
    }
    toast(t("languageChanged"));
    renderOverview();
  } catch (error) {
    toast(`${t("scanFailed")}: ${error.message}`);
  } finally {
    elements.languageSelect.disabled = false;
  }
}

async function toggleSemaGovernance() {
  const enabled = !state.overview?.config?.sema?.enabled;
  elements.settingsSemaToggle.disabled = true;
  try {
    const data = await requestJson("/api/sema", {
      method: "POST",
      body: JSON.stringify({ enabled }),
    });
    state.overview = data.overview;
    state.findings = Array.isArray(state.overview.scan?.findings) ? state.overview.scan.findings : [];
    addActivity(enabled ? t("semaEnabled") : t("semaDisabled"));
    toast(enabled ? t("semaEnabled") : t("semaDisabled"));
    renderOverview();
  } catch (error) {
    toast(`${t("semaToggleFailed")}: ${error.message}`);
  } finally {
    elements.settingsSemaToggle.disabled = false;
  }
}

function showFolderError(message) {
  elements.folderError.hidden = false;
  setText(elements.folderError, message);
}

async function loadDirectories(path) {
  elements.folderError.hidden = true;
  elements.folderGo.disabled = true;
  elements.folderPathInput.disabled = true;
  try {
    const query = path ? `?path=${encodeURIComponent(path)}` : "";
    const data = await requestJson(`/api/directories${query}`);
    state.folder = data.directory;
    renderFolderDialog();
  } catch (error) {
    showFolderError(`${t("folderFailed")}: ${error.message}`);
  } finally {
    elements.folderGo.disabled = false;
    elements.folderPathInput.disabled = false;
    elements.folderPathInput.focus();
  }
}

function renderFolderDialog() {
  const folder = state.folder;
  if (!folder) return;
  setText(elements.folderCurrent, folder.current);
  elements.folderPathInput.value = folder.current;
  elements.folderUp.disabled = !folder.parent;
  elements.folderDrives.innerHTML = folder.drives
    .map((drive) => `<button type="button" class="secondary" data-drive="${escapeHtml(drive)}">${escapeHtml(drive)}</button>`)
    .join("");
  elements.folderList.innerHTML = folder.entries.length
    ? folder.entries
        .map(
          (entry) => `
            <button type="button" class="folder-row" data-folder="${escapeHtml(entry.path)}" aria-label="${escapeHtml(t("folderOpen", { name: entry.name }))}">
              <strong>${escapeHtml(entry.name)}</strong>
              <span class="folder-row-action" aria-hidden="true">&gt;</span>
            </button>
          `,
        )
        .join("")
    : `<div class="panel-empty">${escapeHtml(t("folderEmpty"))}</div>`;
  elements.folderDrives.querySelectorAll("[data-drive]").forEach((button) => {
    button.addEventListener("click", () => void loadDirectories(button.getAttribute("data-drive")));
  });
  elements.folderList.querySelectorAll("[data-folder]").forEach((button) => {
    button.addEventListener("click", () => void loadDirectories(button.getAttribute("data-folder")));
  });
}

async function openFolderDialog() {
  elements.folderModal.hidden = false;
  await loadDirectories(projectRoot());
}

async function selectFolder() {
  if (!state.folder?.current) return;
  try {
    const data = await requestJson("/api/root", { method: "POST", body: JSON.stringify({ path: state.folder.current }) });
    state.overview = data.overview;
    state.findings = Array.isArray(state.overview.scan?.findings) ? state.overview.scan.findings : [];
    state.selectedIds.clear();
    state.selectedFindingKey = undefined;
    loadIgnoredState();
    elements.folderModal.hidden = true;
    addActivity(t("folderChanged"));
    toast(t("folderChanged"));
    renderOverview();
    if (state.autoScanEnabled) {
      void runScan();
    }
  } catch (error) {
    showFolderError(`${t("folderFailed")}: ${error.message}`);
  }
}

function bindEvents() {
  elements.navTabs.forEach((tab) => tab.addEventListener("click", () => setActiveTab(tab.dataset.tab)));
  $$("[data-tab-target]").forEach((button) => button.addEventListener("click", () => setActiveTab(button.dataset.tabTarget)));
  $$("[data-action='copy-all']").forEach((button) => button.addEventListener("click", () => void copySelectedFindings(true)));
  $$("[data-action='select-all']").forEach((button) => button.addEventListener("click", selectAllVisible));
  elements.scanButton.addEventListener("click", () => void runScan());
  elements.autoScanToggle.addEventListener("click", toggleAutoScan);
  elements.copySelectedButton.addEventListener("click", () => void copySelectedFindings());
  elements.settingsButton.addEventListener("click", () => setActiveTab("settings"));
  elements.selectVisibleButton.addEventListener("click", selectAllVisible);
  elements.clearSelectionButton.addEventListener("click", clearSelection);
  elements.ignoreSelectedButton.addEventListener("click", ignoreSelected);
  elements.restoreSelectedButton.addEventListener("click", () => restoreSelected(false));
  elements.restoreAllButton.addEventListener("click", () => restoreSelected(true));
  elements.copyFindingButton.addEventListener("click", () => void copyCurrentFinding());
  elements.copyCodeButton.addEventListener("click", () => void copyCurrentCode());
  elements.ignoreCurrentButton.addEventListener("click", () => {
    if (state.ignoredKeys.has(state.selectedFindingKey)) restoreSelected(false);
    else ignoreSelected();
  });
  elements.folderButton.addEventListener("click", () => void openFolderDialog());
  elements.settingsFolderButton.addEventListener("click", () => void openFolderDialog());
  elements.projectCardFolderButton.addEventListener("click", () => void openFolderDialog());
  elements.folderClose.addEventListener("click", () => {
    elements.folderModal.hidden = true;
  });
  elements.folderGo.addEventListener("click", () => void loadDirectories(elements.folderPathInput.value));
  elements.folderPathInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") void loadDirectories(elements.folderPathInput.value);
  });
  elements.folderUp.addEventListener("click", () => void loadDirectories(state.folder?.parent));
  elements.folderSelect.addEventListener("click", () => void selectFolder());
  elements.languageSelect.addEventListener("change", () => void changeLanguage(elements.languageSelect.value));
  elements.settingsLanguageSelect.addEventListener("change", () => void changeLanguage(elements.settingsLanguageSelect.value));
  elements.settingsSemaToggle.addEventListener("click", () => void toggleSemaGovernance());
  window.addEventListener("beforeunload", () => stopAutoScan(false));
}

bindEvents();
renderStaticCopy();
renderTabs();
renderActivity();
void loadOverview().catch((error) => {
  addActivity(error.message);
  toast(error.message);
});
