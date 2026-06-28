# SentryWard

SentryWard observa seu código enquanto você constrói. É local-first, determinístico e focado em achados de segurança relevantes.

## Início Rápido

```bash
pnpm install
pnpm build
node dist/cli.js scan examples/vulnerable-app --lang pt-BR
```

## Comandos

Use `ward`, `ward watch`, `ward scan`, `ward init`, `ward status`, `ward findings`, `ward explain`, `ward fix`, `ward report`, `ward hooks install`, `ward ci init`, `ward surface` e, se a pessoa quiser governança semântica, os comandos opcionais `ward sema`.

## Complemento Opcional Sema

SentryWard funciona sem Sema. Pessoas ou times que querem governança semântica podem usar Sema para checar contratos, drift, impacto e restrições antes das correções.

## Segurança

Sem telemetria, sem upload de código-fonte, sem chamadas externas de IA e sem scan externo por padrão.
