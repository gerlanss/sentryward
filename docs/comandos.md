<!-- sema:agent-entrypoint:start -->
# Catalogo de comandos Sema

Use este arquivo quando a IA nao souber qual comando chamar. Comando Sema e gate operacional; nao substitua por relatorio Markdown.

## Fluxo minimo local

```bash
sema --version
sema preflight resumo --json
sema resumo
sema docs-impacto --intencao "<acao>" --json
```

Depois leia as docs obrigatorias retornadas por `docs-impacto`.

## Contrato e descoberta

- `sema iniciar --template <template>`: cria projeto Sema novo com contrato, docs, exemplos e kit IA.
- `sema validar <arquivo-ou-pasta> --json`: valida contrato `.sema`.
- `sema diagnosticos <arquivo.sema> --json`: detalha erros e avisos.
- `sema formatar <arquivo-ou-pasta>`: formata contrato.
- `sema inspecionar <arquivo-ou-pasta> --json`: mostra modulos, tasks, routes, entidades, vinculos e arquivos esperados.
- `sema ast <arquivo.sema> --json`: mostra AST para depurar sintaxe.
- `sema ir <arquivo.sema> --json`: mostra a IR que os gates e geradores enxergam.

## Mudanca e fechamento

- `sema docs-impacto --intencao "<acao>" --json`: descobre docs obrigatorias e bloqueios documentais.
- `sema drift <arquivo-ou-pasta> --escopo modulo --json`: compara contrato e implementacao.
- `sema impacto <arquivo-ou-pasta> --alvo <token> --mudanca "<descricao>" --json`: mapeia impacto antes de alterar comportamento.
- `sema verificar <arquivo-ou-pasta> --json`: verificacao final agregada.
- `sema finalizar-mudanca --intencao "<acao>" --doc-lida <arquivo> --json`: comprova leitura documental antes de concluir.

Fechamento honesto: trate o JSON do drift como fonte de verdade. `sucesso:false`, `vinculos_quebrados`, `rotas_divergentes` ou impls quebradas significam que a mudanca ainda nao esta concluida. Nao relate "drift limpo" sem esse JSON verde.

## Sema Codigo

- `sema compilar <arquivo-ou-pasta> --alvo <typescript|python|dart|lua|javascript|html|css> --saida <diretorio>`: gera esqueleto/artefatos de apoio a partir do contrato.
- `sema testar <arquivo.sema> --alvo <alvo> --saida <diretorio-temporario>`: gera e executa testes locais quando o alvo suporta.
- `sema importar <fonte> <diretorio> --saida <diretorio> --json`: importa projeto legado para contratos iniciais.
- `sema renomear-semantico <arquivo-ou-pasta> --de <nome> --para <nome> --json`: ajuda a renomear simbolos semanticamente.

Regra de `--saida`: a pasta informada em `sema compilar --saida` e saida gerada. Ela nao e entrega final por si so. A entrega final sao os arquivos alvo/vinculos declarados no contrato. Se o contrato pede `index.html`, `css/styles.css` e `js/app.js`, criar apenas `saida/controle_despesas.ts` nao conclui a tarefa.

Regra de rastreabilidade do Sema Codigo: os artefatos gerados devem apontar o modulo/contrato de origem e preservar que um mesmo arquivo final pode ser governado por varios contratos `.sema` via `vinculos`. Nao force relacao 1:1 contrato-arquivo e nao trate `saida/` como projeto final.

Regra de UI pronta: se a tarefa gerar app, site, dashboard, formulario ou HTML estatico, rode validacao visual desktop/mobile quando a superficie permitir. Em mobile estreito (ex. 390px), `scrollWidth <= clientWidth` precisa passar; layout que empilha mas estoura horizontalmente nao e responsivo.

## Listas canonicas de sintaxe

- Origens de `use` e `impl`: `ts/typescript`, `js/javascript`, `py/python`, `dart`, `lua`, `cs/dotnet`, `java`, `go`, `rust`, `cpp`.
- Categorias frequentes de `effects`: `persistencia`, `consulta`, `evento`, `auditoria`, `db.write`, `queue.publish`, `fs.write`, `network.egress`, `secret.read`, `shell.exec`.
- Valores aceitos em `audit.motivo`: `obrigatorio`, `opcional`, `dispensado`.

`sema compilar --alvo javascript` e alvo de geracao. `impl { js: ... }` e origem do codigo vivo. Nao troque um pelo outro.

## IA e contexto

- `sema ajuda-ia`: orientacao curta para agentes.
- `sema starter-ia`: starter de operacao.
- `sema contexto-ia <arquivo.sema> --saida <dir> --json`: pacote de contexto para IA.
- `sema prompt-curto <arquivo-ou-pasta> --json`: prompt compacto.
- `sema sync-ai-entrypoints --json`: sincroniza AGENTS, boot, pack e docs locais.
- `sema instalar-exemplos --json`: instala exemplos oficiais no workspace.
- `sema exemplos-prompt-ia`: mostra exemplos de prompts, nao exemplos `.sema`.

## Profiles e Author

- `sema author iniciar|validar|briefing|revisar-cliches|validar-narrativa|validar-proibicoes`: governa escrita autoral.
- `sema profile validar <software|workflow|ops|game|legal|research|redacao|propostas|conversas> <arquivo> --json`: valida artefato por profile.
- `sema profile capabilities --json`: lista profiles/capacidades.
- `sema rule-packs --profile <profile> --json`: lista pacotes de regras.

## Operacional

- `sema doctor`: diagnostica instalacao local.
- `sema chat doctor --json`: diagnostica Sema Chat/OpenCode local.
- `sema mcp-instalar-chave --stdin --json`: instala chave obtida pelo humano no painel.
- `sema runner validar-remoto --snapshot <arquivo.json|-> --saida <dir> --json`: validacao remota por snapshot.

## Proibido

- Nao usar rota remota, sincronizacao externa ou leitura por espelho para ler workspace local quando `sema --version` funciona.
- Nao procurar `.sema` no disco inteiro para aprender sintaxe; use `exemplos/`, `docs/sintaxe.md` e este catalogo.
- Nao encerrar depois de `sema compilar` se os arquivos alvo do contrato ainda nao existem.
- Nao trocar `sema compilar` por `sema testar` quando o Guard pede Sema Codigo.
- Nao criar relatorio Markdown para fingir que rodou gate.
- Nao dizer que drift passou quando `sema drift --json` retornou `sucesso:false`, vinculo quebrado, rota divergente ou impl quebrada.
- Nao declarar UI responsiva sem prova mobile/desktop; scroll horizontal em 390px bloqueia.

Politica de codigo governado: Arquivos de codigo gerados ou governados pela Sema devem manter cabecalho curto com modulo de origem, contrato .sema aplicavel e descricao humana. Validacao inline prova apenas o payload enviado; o arquivo fisico ainda precisa de SEMA-GOVERNED para orientar a proxima IA. Codigo governado avisa acima de 1000 linhas e bloqueia acima de 2000. Contrato .sema avisa acima de 300 linhas e bloqueia criacao, edicao, drift, finalizacao, geracao e snapshot acima de 500. O split de .sema deve ser por dominio/capacidade, nunca parte_1/parte_2; varios contratos podem governar o mesmo arquivo de codigo via vinculos. Sema Codigo deve preservar essa rastreabilidade em cabecalhos e saidas geradas. Documentacao Markdown nao entra nesse limite de codigo; continua governada por docs-impacto, limite de bytes e verificacao de segredos. Payload inline acima de 262144 caracteres nao e caso de aumentar timeout: divida por responsabilidade ou use anexo/caminho de servidor autorizado.
<!-- sema:agent-entrypoint:end -->
