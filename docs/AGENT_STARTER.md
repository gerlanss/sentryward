<!-- sema:agent-entrypoint:start -->
# Agent Starter

Voce esta em um projeto governado por Sema.

Leia nesta ordem:

1. `SEMA_BOOT.md`
2. `AGENT_CONTEXT_PACK.json`
3. `SEMA_INDEX.json`
4. `AGENTS.md`
5. `docs/comandos.md`
6. `docs/sintaxe.md`
7. `exemplos/`

Comandos basicos:

```bash
sema --version
sema preflight resumo --json
sema resumo
sema docs-impacto --intencao "<acao>" --json
sema validar contratos/pedidos.sema --json
sema drift contratos/pedidos.sema --escopo modulo --json
sema compilar contratos/pedidos.sema --alvo javascript --saida ./generated/javascript
```

Nao substitua esses gates por busca local, chute pelo nome do arquivo ou leitura aleatoria de contratos fora do projeto.

Fechamento nao e opiniao: `sema drift --json` precisa estar verde. `sucesso:false`, `vinculos_quebrados`, `rotas_divergentes` ou impls quebradas bloqueiam conclusao.

UI pronta exige prova: desktop/mobile e viewport estreito sem overflow horizontal (`scrollWidth <= clientWidth`).

Arquivos de codigo gerados ou governados pela Sema devem manter cabecalho curto com modulo de origem, contrato .sema aplicavel e descricao humana. Validacao inline prova apenas o payload enviado; o arquivo fisico ainda precisa de SEMA-GOVERNED para orientar a proxima IA. Codigo governado avisa acima de 1000 linhas e bloqueia acima de 2000. Contrato .sema avisa acima de 300 linhas e bloqueia criacao, edicao, drift, finalizacao, geracao e snapshot acima de 500. O split de .sema deve ser por dominio/capacidade, nunca parte_1/parte_2; varios contratos podem governar o mesmo arquivo de codigo via vinculos. Sema Codigo deve preservar essa rastreabilidade em cabecalhos e saidas geradas. Documentacao Markdown nao entra nesse limite de codigo; continua governada por docs-impacto, limite de bytes e verificacao de segredos. Payload inline acima de 262144 caracteres nao e caso de aumentar timeout: divida por responsabilidade ou use anexo/caminho de servidor autorizado.
<!-- sema:agent-entrypoint:end -->
