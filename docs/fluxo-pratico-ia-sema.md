<!-- sema:agent-entrypoint:start -->
# Fluxo Pratico IA + Sema

Este e o fluxo minimo para agentes em workspace local.

1. Leia `SEMA_BOOT.md`.
2. Rode `sema --version`.
3. Rode `sema preflight resumo --json` e continue apenas se retornar `use_cli_local`.
4. Rode `sema resumo`.
5. Rode `sema docs-impacto --intencao "<acao>" --json`.
6. Leia a documentacao obrigatoria retornada.
7. Antes de escolher comando ou interpretar `--saida`, leia `docs/comandos.md`.
8. Antes de criar ou editar contrato, use `exemplos/` e `docs/sintaxe.md`.
9. Antes de editar codigo existente, rode `sema drift` e `sema impacto`.
10. Depois de alterar `.sema`, rode `sema formatar` e `sema validar`.
11. Antes de concluir, rode `sema finalizar-mudanca` com as docs lidas.

Regra de edicao de contrato: `.sema` tem limite proprio. Acima de 300 linhas, planeje split por dominio/capacidade; acima de 500, nao crie nem edite antes de dividir. Nao use parte_1/parte_2 e nao force relacao 1:1 entre contrato e arquivo; varios contratos podem governar o mesmo arquivo por `vinculos`.

Regra de fechamento: `sema drift --json` precisa retornar `sucesso:true`. Se houver `sucesso:false`, `vinculos_quebrados`, `rotas_divergentes` ou impl quebrada, a tarefa ainda esta bloqueada. Teste unitario verde nao substitui drift verde.

Regra de UI: se a tarefa envolve interface, a evidencia minima inclui desktop e mobile. Em viewport estreito como 390px, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` precisa passar; scroll horizontal bloqueia a conclusao.

## Capacidade

- IA fraca: `SEMA_SMALL_MODEL.md`, `SEMA_BRIEF.micro.txt`, `AGENT_CONTEXT_PACK.json`, `SEMA_INDEX.json`.
- IA media: `SEMA_BOOT.md`, `AGENT_CONTEXT_PACK.json`, `SEMA_BRIEF.curto.txt`, `SEMA_INDEX.json`, `AGENTS.md`.
- IA forte: `SEMA_BOOT.md`, `AGENT_CONTEXT_PACK.json`, `SEMA_BRIEF.md`, `SEMA_INDEX.json`, AST, IR, drift e impacto.

## Quando gerar codigo

Se a entrega inclui codigo derivado do contrato, rode `sema compilar`.

```bash
sema compilar contratos/pedidos.sema --alvo javascript --saida ./generated/javascript
```

Troque `javascript` por `typescript`, `python`, `dart`, `lua`, `html` ou `css` quando fizer sentido.

## Falha fechada

- Se não conseguir chamar Sema, pare e declare bloqueio em vez de editar código ou contrato.
- Se não houver contrato aplicável ou vínculo semântico do arquivo, inspecione o arquivo, descubra ou crie o .sema aplicável e vincule antes do código.
- Em IDE local, rode sema --version; se falhar, pare. A IA não acessa o painel Sema: peça ao humano para instalar a CLI pelo painel. Depois rode sema preflight <comando> --json; só continue com use_cli_local; não use rota remota, sincronização externa ou leitura por espelho para workspace local.
- Se não houver workspace local em disco, pare bloqueado e peça o fluxo apropriado; não invente caminho nem substitua a CLI local por ferramenta paralela.
- Se arquivos_codigo.conteudo ou conteudo inline passar de 262144 caracteres, não aumente timeout para forçar: divida por responsabilidade ou use anexo/caminho de servidor autorizado.
- Se for criar ou corrigir .sema, use sema_exemplos antes de escrever sintaxe.
- Se a resposta humana estiver em PT-BR, use vocabulário Sema canônico e preserve acentos mesmo que a DSL use ASCII.
- Se um arquivo de código tiver SEMA-GOVERNED, consulte Sema e o contrato aplicável antes de editar.
- Se codigo governado passar de 1000 linhas, planeje divisao; se passar de 2000, pare e divida antes de concluir. Documentacao Markdown nao entra nesse limite de codigo.
- Se contrato .sema passar de 300 linhas, planeje split por dominio/capacidade; acima de 500, criacao e edicao ficam bloqueadas. Nao use parte_1/parte_2 e nao remova guarantees, tests ou vinculos so para caber.
- Um mesmo arquivo de codigo pode ser governado por varios contratos .sema via vinculos; Sema Codigo deve preservar essa rastreabilidade.
- Se score, achados ou decisaoAgente parecerem bons, trate como sinal de triagem e confira evidência concreta no contrato e no código.
- Se validar artefato inline com 100/100, ainda preserve cabeçalho SEMA-GOVERNED no arquivo físico sincronizado.
- Se `sema drift` retornar sucesso:false, `vinculos_quebrados`, `rotas_divergentes` ou impls quebradas, a mudanca nao pode ser declarada concluida; corrija contrato/codigo e rode drift de novo.
- Se a tarefa tiver site, sistema, app, UI, painel, jogo, CLI/TUI ou terminal, nao conclua sem acabamento moderno, contextual e evidenciado; em UI mobile estreita (ex. 390px), `document.documentElement.scrollWidth <= document.documentElement.clientWidth` precisa ser verdadeiro.
- Se texto visivel PT-BR perder acento ou cedilha em termos como descricao, lancamentos, saude ou alimentacao, trate como defeito bloqueante quando houver i18n/idioma declarado.
- Se aparecer caminho de servidor como /srv/sema/projetos, trate como espelho governado, não como pasta local do usuário.
- Se uma chamada Sema estourar por timeout local, aumente o timeout e tente de novo; timeout do agente não libera ação sem Sema.
- Se a plataforma bloquear ou alertar política, trate como bloqueio externo ou falso positivo possível; explique sem tentar contornar filtro.
- Se a tarefa tiver experiência de uso e você não conseguir garantir padrão moderno, contextual e não genérico, pare e peça revisão em vez de entregar coisa engessada.
<!-- sema:agent-entrypoint:end -->
