# Agentes por capacidade

Sema deve funcionar em agentes fortes, médios e fracos. A diferença não é só tamanho de contexto; é disciplina operacional.

## Políticas da Plataforma

O Sema governa contrato, escopo, drift, evidência e qualidade do projeto. Ele não pede, não autoriza e não contorna políticas da plataforma, termos de uso, permissões, segurança ou leis.

- Escopo: Contrato primeiro, documentação obrigatória, rastreabilidade, auditoria de drift, orçamento semântico, idioma humano, design quando houver UI e evidência de fechamento.
- Se houver alerta externo: Se um cliente, modelo ou classificador bloquear a mensagem, trate como bloqueio externo ou falso positivo possível: explique de forma neutra, preserve a intenção legítima de governança e não tente burlar filtros.
- Fraca: Se aparecer alerta de política, pare. Diga que Sema é governança de projeto, não bypass; peça reformulação segura ou contexto permitido.
- Média: Separe bloqueio da plataforma de erro do Sema. Reformule em linguagem neutra quando permitido e mantenha os gates; não tente contornar filtro.
- Forte: Registre evidência, reduza ambiguidade e continue apenas no escopo permitido pela plataforma. Governança Sema nunca substitui política externa.
- Proibido: contornar_politica_da_plataforma, apresentar_sema_como_bypass_de_seguranca, insistir_em_conteudo_bloqueado, confundir_governanca_com_permissao_para_acao_proibida.

## Código Governado

Arquivos gerados ou governados pela Sema devem manter o marcador `SEMA-GOVERNED`.
Orçamento semântico é regra: código governado com 1000+ linhas exige plano de divisão e 2000+ bloqueia. Contrato .sema avisa acima de 300 linhas e bloqueia acima de 500. Markdown documental não entra nesse limite de código.
Contratos .sema devem ser divididos por domínio/capacidade real, nunca parte_1/parte_2; vários contratos podem governar o mesmo arquivo via vinculos.
Validação inline 100/100 não remove essa obrigação: ela comprova aquele payload, mas o arquivo físico ainda precisa avisar a próxima IA que existe contrato.

- Fraca: Se abrir codigo com SEMA-GOVERNED, pare, leia SEMA_SMALL_MODEL.md e chame Sema antes de editar. Nao crie codigo acima de 2000 linhas nem contrato .sema acima de 500; divida .sema por capacidade, nunca em parte_1/parte_2.
- Média: Se abrir codigo com SEMA-GOVERNED, rode docs-impacto e drift antes de alterar comportamento. Trate codigo 1000+ e contrato .sema 300+ como refatoracao provavel; se o payload inline passar de 262144 caracteres, separe HTML, estilos, estado, renderizacao, calculo e dados antes de sincronizar.
- Forte: Se abrir codigo com SEMA-GOVERNED, pode inspecionar AST/IR e codigo completo, mas mantem contrato primeiro, drift, codigo ate 2000, .sema ate 500 e finalizar-mudanca. Contexto grande nao autoriza monolito nem payload inline acima de 262144 caracteres.

## Payload e Transporte

Payload inline em `arquivos_codigo.conteudo` ou `conteudo` tem limite de 262144 caracteres. Esse limite é de transporte e validação de entrada; não é timeout operacional.

- Fraca: se aparecer `too_big`, payload grande ou arquivo grande, pare e divida por responsabilidade antes de chamar Sema de novo. Não aumente timeout para tentar empurrar o mesmo payload.
- Média: em HTML/app estático, modularize em `index.html`, `styles/*.css`, `js/state.js`, `js/render/*.js` e `data/*.json`, cada arquivo governado com cabeçalho quando aplicável.
- Forte: escolha o transporte correto: inline só até o limite; acima disso use anexo, caminho de servidor autorizado, manifesto/índice ou arquivos lógicos separados. Diagnostique reset/timeout como transporte/performance, não como permissão para monólito.
- Proibido: resolver limite de transporte com `index_p1.html`/`index_p2.html`, aumentar timeout para passar `too_big`, ou remover dados essenciais só para a validação inline caber.

## Divisão por Responsabilidade

Sema não manda quebrar HTML em pedaços artificiais. Ele manda manter arquivos pequenos, coesos e governáveis.

- Fraca: se um arquivo crescer, pare e peça/execute divisão por responsabilidade antes de continuar.
- Média: em projeto web, prefira `index.html`, `styles/*.css`, `js/state.js`, `js/calc.js`, `js/render/*.js` e `data/*.json`.
- Forte: preserve arquitetura e experiência de uso, mas não use contexto grande como desculpa para monólito.
- Proibido: `index_p1.html`, `index_p2.html` ou nomes semelhantes quando eles só escondem um arquivo gigante sem fronteira semântica.

## Sinal vs Ritual

Score composto, `achados[]` e `decisaoAgente` são bons sinais operacionais. Abaixo de 80 bloqueia; alvo evolui 0.5 ponto até 100; vira teatro se a IA só coloca palavra-chave para passar.

- Fraca: achado atendido precisa de evidência simples e visível.
- Média: conecte cada regra a contrato, arquivo e comportamento esperado.
- Forte: trate regex/palavra-chave como triagem, não como prova final de substância.
- Drift: `sucesso:false`, `vinculos_quebrados`, `rotas_divergentes` ou impl quebrada bloqueiam conclusão mesmo que testes unitários tenham passado.
- UI: responsividade real exige prova mobile/desktop; viewport estreito como 390px não pode ter `scrollWidth` maior que `clientWidth`.
- Terminal/CLI/TUI: ergonomia real exige saída hierárquica, status, erros claros, ajuda e smoke check quando aplicável.
- Caminho de servidor ou espelho governado não é o checkout local do usuário.

## Acabamento Visual E Terminal

Quando a tarefa envolve site, sistema, app, interface, dashboard, painel, formulário, landing, jogo, terminal, CLI/TUI ou qualquer artefato voltado ao usuário, o Sema governa também acabamento, modernidade e adequação ao domínio. Beleza funcional, identidade, criatividade útil, tecnologia adequada, estados, responsividade e evidência não são extras opcionais.

- Fraca: Use um padrão moderno seguro e contextual: hierarquia clara, espaçamento consistente, paleta com contraste, componentes coerentes com o domínio, estados básicos, responsivo mobile/desktop e nada de formulário cinza genérico. Em terminal, entregue saída organizada com status e erro claros. Se não conseguir validar o resultado, pare e peça revisão.
  Evidência: descrever padrão visual escolhido, explicar como o domínio aparece na interface ou terminal, confirmar responsividade básica, provar mobile sem overflow horizontal com scrollWidth <= clientWidth, listar estados essenciais.
- Média: Defina intenção de experiência antes de codar: público, domínio, workflow real, densidade, tokens, componentes, tecnologia/biblioteca/efeitos adequados, estados, responsividade e anti-2010. O domínio manda na solução: agro, finanças, saúde, game e e-commerce não podem compartilhar a mesma casca. Rode ou peça screenshot/browser check quando houver UI e smoke check quando for terminal.
  Evidência: registrar tokens e componentes usados, registrar bibliotecas, APIs ou efeitos escolhidos e por que combinam com o pedido, validar desktop e mobile, testar viewport estreito como 390px sem scroll horizontal, corrigir texto sobreposto, rodar smoke check de CLI/TUI quando aplicável.
- Forte: Crie direção específica e ambiciosa do domínio, use bibliotecas, APIs, assets, microinterações e efeitos atuais quando fizerem sentido, refine o fluxo principal até parecer produto real e faça verificação visual/terminal com evidência. Inovação precisa servir ao uso, não virar enfeite.
  Evidência: screenshot desktop/mobile, browser check com scrollWidth <= clientWidth em desktop/mobile, verificação de assets e renderização, auditoria de contraste, hierarquia e estado vazio, evidência de fluxo principal polido, evidência de saída terminal com status, erro e ajuda quando aplicável.
- Proibido: interface_generica_2010, formularios_sem_hierarquia_visual, cards_cinzas_sem_identidade, layout_sem_responsividade_real, texto_estourando_ou_sobreposto, sem_estados_de_hover_focus_loading_erro_vazio, sem_assets_quando_o_dominio_pede_visual, mesma_estetica_para_dominios_diferentes, painel_agrono_com_cara_de_ecommerce_generico, terminal_sem_hierarquia_status_ou_feedback, ignorar_bibliotecas_atuais_quando_disponiveis, efeitos_gratuitos_sem_proposito, copiar_estetica_do_contrato_para_ui, declarar_responsivo_sem_prova_mobile, fechar_ui_com_scrollwidth_maior_que_clientwidth.
- Critérios mínimos: não parecer template de 2010, não reciclar a mesma estética para domínios diferentes, domínio e público moldam layout, linguagem, componentes e interação, hierarquia visual clara, paleta com contraste e identidade do domínio, tecnologia, biblioteca ou efeito escolhido combina com pedido e stack existente, responsividade mobile e desktop, evidencia mobile sem overflow horizontal (scrollWidth <= clientWidth), estados de hover, focus, loading, erro e vazio quando aplicáveis, texto sem overlap ou estouro, texto visivel com acentos e cedilha quando o idioma exigir, componentes coerentes com o workflow real, terminal/CLI com hierarquia, status, erro, ajuda e confirmações quando aplicável.

## Fraca

Use para Copilot em modo simples, Cline/Roo com pouco contexto, modelos locais pequenos e agentes que ignoram instrução longa.

- Entrada: `SEMA_BOOT.md` -> `SEMA_SMALL_MODEL.md` -> `SEMA_BRIEF.micro.txt`.
- Não abrir AST/IR completos no começo.
- Não editar se Sema não respondeu.
- Não pedir para ferramenta remota ler pasta local.
- Não criar código governado acima de 2000 linhas nem contrato .sema acima de 500.
- Não fatiar código ou contrato grande em partes artificiais; divida por responsabilidade real. Para .sema, use domínio/capacidade, nunca parte_1/parte_2.
- Não aceitar score ou achado como prova sem evidência concreta.

## Média

Use para agentes com bom contexto, mas sem garantia de seguir todos os gates.

- Entrada: `SEMA_BOOT.md` -> `AGENT_CONTEXT_PACK.json` -> `SEMA_BRIEF.curto.txt` -> `SEMA_INDEX.json`.
- Rodar docs-impacto antes de agir.
- Validar drift e contrato no fechamento.
- Tratar 1000+ linhas em código como sinal de refatoração e 2000+ como bloqueio. Para .sema, tratar 300+ como diagnóstico e 500+ como bloqueio.
- Em UI ou HTML estático, separar estrutura, estilos, estado, cálculo, renderização e dados antes de sincronizar.
- Verificar se score, achados e decisão correspondem a regra real, não só termo copiado.

## Forte

Use para Codex, Claude e agentes com tool use confiável.

- Entrada: `SEMA_BOOT.md` -> `AGENT_CONTEXT_PACK.json` -> `SEMA_BRIEF.md` -> `SEMA_INDEX.json`.
- Pode consumir AST/IR/drift completos.
- Ainda deve respeitar contrato primeiro e falha fechada.
- Não usar contexto grande como desculpa para monólito: IA forte também respeita 2000 linhas para código e 500 para .sema.
- Se validar inline, ainda preparar o arquivo físico para a próxima IA com cabeçalho governado e descrição humana.
- Se o MCP usar caminho Linux, tratar como espelho remoto autorizado, não como leitura local do usuário.

## Timeout e Retry

Timeout definido pelo agente não é falha do Sema. Se `sema resumo`, `inspecionar`, `drift` ou `sync-ai-entrypoints` estourar por timeout local, aumente o timeout e tente de novo com escopo menor quando possível.

- Timeout inicial para resumo de projeto inteiro: 120s.
- Escalonamento recomendado: 120s -> 300s -> 600s.
- Fraca: Se `resumo . --micro` estourar, tente `resumo <arquivo.sema> --micro`, depois repita com timeout maior. Timeout não autoriza editar.
- Média: Prefira resumo escopado; se um gate Sema estourar, aumente timeout e repita antes de concluir falha.
- Forte: Pode rodar projeto inteiro com timeout alto, mas deve distinguir lentidão de falha real e registrar evidência.
- Tente de novo com timeouts maiores enquanto houver execução disponível; se o ambiente impedir continuar, pare bloqueado e não avance com código sem Sema.

## Idioma

A linguagem humana da resposta deve seguir o idioma do usuário e preservar acentos, cedilha, pontuação e símbolos esperados. Em PT-BR, use vocabulário Sema canônico: pontuação, desvio semântico, trava, pré-checagem, ambiente de execução e perfil. A DSL .sema pode ter palavras-chave ASCII; isso não autoriza PT-BR sem acentos.

A gramática Sema pode ter palavras-chave ASCII. Isso não autoriza resposta humana sem acentos.

## Clientes

- copilot: .github/copilot-instructions.md, AGENTS.md, SEMA_BOOT.md. Capacidade padrão: media. VS Code/Copilot deve receber uma instrução curta e repetida no arquivo próprio, sem depender só do AGENTS.md.
- cline: .clinerules/00-sema.md, .clinerules, SEMA_BOOT.md. Capacidade padrão: fraca. Cline costuma obedecer melhor quando o gate Sema vem em arquivo curto; se .clinerules for arquivo legado, o Sema atualiza esse fallback.
- roo: .roo/rules/00-sema.md, AGENTS.md, SEMA_BOOT.md. Capacidade padrão: fraca. Roo Code deve começar por uma regra dedicada em .roo/rules antes de abrir arquivos longos.
- opencode: .opencode/instructions.md, AGENTS.md, SEMA_BOOT.md. Capacidade padrão: media. OpenCode deve receber a mesma regra curta em instructions.md quando a pasta .opencode já existir.
- cursor: .cursor/rules/sema.mdc, AGENTS.md, SEMA_BOOT.md. Capacidade padrão: media. Cursor deve receber uma regra curta própria para não depender de leitura completa do AGENTS.md.
- claude: .claude/CLAUDE.md, AGENTS.md, SEMA_BOOT.md. Capacidade padrão: forte. Claude costuma seguir gates longos, mas ainda precisa de entrypoint explícito e repetido no workspace.
- windsurf: .windsurf/rules.md, AGENTS.md, SEMA_BOOT.md. Capacidade padrão: media. Windsurf deve receber regra curta dedicada para evitar cair direto no código sem Sema.
- generico: SEMA_BOOT.md, SEMA_SMALL_MODEL.md, AGENT_CONTEXT_PACK.json. Capacidade padrão: fraca. Qualquer agente sem integração específica começa pelo boot card e só sobe contexto se passar pelos gates.
