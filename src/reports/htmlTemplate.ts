// SEMA-GOVERNED: module sentryward.scanner; HTML report rendering follows contratos/sentryward_scanner.sema.
import type { ScanResult, Translator } from "../types/index.js";
import { countBySeverity } from "../core/severity.js";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderHtmlReport(t: Translator, result: ScanResult): string {
  const counts = countBySeverity(result.findings);
  const findings = result.findings
    .map(
      (finding) => `
        <article class="finding ${finding.severity}">
          <div class="meta">${escapeHtml(finding.severity.toUpperCase())} · ${escapeHtml(finding.id)}</div>
          <h2>${escapeHtml(finding.title)}</h2>
          <p><strong>${escapeHtml(t("finding.file"))}:</strong> ${escapeHtml(finding.file)}:${finding.line}</p>
          <p><strong>${escapeHtml(t("finding.evidence"))}:</strong> ${escapeHtml(finding.evidence)}</p>
          <p><strong>${escapeHtml(t("report.impact"))}:</strong> ${escapeHtml(finding.impact)}</p>
          <p><strong>${escapeHtml(t("finding.recommendation"))}:</strong> ${escapeHtml(finding.recommendation)}</p>
        </article>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SentryWard Report</title>
  <style>
    body { margin: 0; font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #e5e7eb; background: #09090b; }
    main { max-width: 1040px; margin: 0 auto; padding: 40px 20px; }
    h1 { font-size: 40px; margin: 0 0 8px; }
    .tagline { color: #c084fc; margin-bottom: 28px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 24px 0; }
    .metric, .finding { border: 1px solid #27272a; border-radius: 8px; padding: 16px; background: #111113; }
    .metric strong { display: block; font-size: 26px; }
    .finding { margin: 14px 0; }
    .meta { color: #a78bfa; font-weight: 700; letter-spacing: 0; }
    .critical .meta { color: #f87171; }
    .high .meta { color: #fbbf24; }
    .medium .meta { color: #c084fc; }
    .low .meta { color: #60a5fa; }
  </style>
</head>
<body>
  <main>
    <h1>SentryWard</h1>
    <div class="tagline">${escapeHtml(t("tagline"))}</div>
    <section class="summary">
      <div class="metric"><span>${escapeHtml(t("summary.project"))}</span><strong>${escapeHtml(result.project.name)}</strong></div>
      <div class="metric"><span>${escapeHtml(t("summary.score"))}</span><strong>${result.score}/100</strong></div>
      <div class="metric"><span>${escapeHtml(t("severity.critical"))}</span><strong>${counts.critical}</strong></div>
      <div class="metric"><span>${escapeHtml(t("severity.high"))}</span><strong>${counts.high}</strong></div>
    </section>
    <p>${escapeHtml(t("report.generated"))}: ${escapeHtml(result.generatedAt)}</p>
    <p>${escapeHtml(t("summary.stack"))}: ${escapeHtml(result.project.stack.join(" · ") || t("summary.unknown"))}</p>
    <section>${findings || `<p>${escapeHtml(t("watch.nothing"))}</p>`}</section>
  </main>
</body>
</html>`;
}
