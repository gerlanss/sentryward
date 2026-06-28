# SentryWard

SentryWard observa tu código mientras construyes. Es local-first, determinista y enfocado en hallazgos de seguridad relevantes.

## Inicio Rápido

```bash
pnpm install
pnpm build
node dist/cli.js scan examples/vulnerable-app --lang es
```

## Comandos

Usa `ward`, `ward watch`, `ward scan`, `ward init`, `ward status`, `ward findings`, `ward explain`, `ward fix`, `ward report`, `ward hooks install`, `ward ci init`, `ward surface` y, si la persona quiere gobernanza semántica, los comandos opcionales `ward sema`.

## Complemento Opcional Sema

SentryWard funciona sin Sema. Las personas o los equipos que quieren gobernanza semántica pueden usar Sema para revisar contratos, drift, impacto y restricciones antes de correcciones.

## Seguridad

Sin telemetría, sin subida de código fuente, sin llamadas externas de IA y sin escaneo externo por defecto.
