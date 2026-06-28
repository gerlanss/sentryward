# SEMA_BRIEF

Sema e IA-first. Este arquivo existe para IA achar o ponto de entrada do projeto sem varrer o repo inteiro no escuro.

- Gerado em: `2026-06-28T21:52:40.632Z`
- Modulos: `1`

## Entrada canonica para IA

- Ordem minima: SEMA_BOOT.md -> llms.txt -> AGENT_CONTEXT_PACK.json -> SEMA_SMALL_MODEL.md -> SEMA_BRIEF.md -> SEMA_INDEX.json -> AGENTS.md -> README.md -> llms-full.txt
- IA fraca: SEMA_BOOT.md -> SEMA_SMALL_MODEL.md -> llms.txt -> AGENT_CONTEXT_PACK.json -> SEMA_BRIEF.micro.txt -> SEMA_INDEX.json -> AGENTS.md
- IA média: SEMA_BOOT.md -> llms.txt -> AGENT_CONTEXT_PACK.json -> SEMA_BRIEF.curto.txt -> SEMA_INDEX.json -> AGENTS.md -> README.md
- IA forte: SEMA_BOOT.md -> llms-full.txt -> AGENT_CONTEXT_PACK.json -> SEMA_BRIEF.md -> SEMA_INDEX.json -> AGENTS.md -> README.md
- Aliases: pequena -> fraca; grande -> forte

## Agent Context Pack

- Arquivo: `AGENT_CONTEXT_PACK.json`
- Objetivo: Dar a agentes IA uma entrada curta, estruturada e auditável antes de abrir código cru ou inventar contexto.
- Regras: Contrato vem antes da ação. | Leia SEMA_BOOT.md antes de qualquer outro artefato de IA. | Leia AGENTS.md antes de editar código, contrato, docs operacionais, release ou deploy. | Leia docs/comandos.md antes de escolher comando Sema, interpretar bloqueio do Guard ou usar --saida de sema compilar.
- Fontes brutas sob demanda: SEMA_BOOT.md, SEMA_SMALL_MODEL.md, llms.txt, AGENT_CONTEXT_PACK.json, SEMA_BRIEF.micro.txt, SEMA_BRIEF.curto.txt, SEMA_INDEX.json

## Políticas da plataforma

- Regra: O Sema governa contrato, escopo, drift, evidência e qualidade do projeto. Ele não pede, não autoriza e não contorna políticas da plataforma, termos de uso, permissões, segurança ou leis.
- IA fraca: Se aparecer alerta de política, pare. Diga que Sema é governança de projeto, não bypass; peça reformulação segura ou contexto permitido.
- IA média: Separe bloqueio da plataforma de erro do Sema. Reformule em linguagem neutra quando permitido e mantenha os gates; não tente contornar filtro.
- IA forte: Registre evidência, reduza ambiguidade e continue apenas no escopo permitido pela plataforma. Governança Sema nunca substitui política externa.
- Se houver alerta externo: Se um cliente, modelo ou classificador bloquear a mensagem, trate como bloqueio externo ou falso positivo possível: explique de forma neutra, preserve a intenção legítima de governança e não tente burlar filtros.

## Código governado

- Marcador: `SEMA-GOVERNED`
- Regra: Arquivos de codigo gerados ou governados pela Sema devem manter cabecalho curto com modulo de origem, contrato .sema aplicavel e descricao humana. Validacao inline prova apenas o payload enviado; o arquivo fisico ainda precisa de SEMA-GOVERNED para orientar a proxima IA. Codigo governado avisa acima de 1000 linhas e bloqueia acima de 2000. Contrato .sema avisa acima de 300 linhas e bloqueia criacao, edicao, drift, finalizacao, geracao e snapshot acima de 500. O split de .sema deve ser por dominio/capacidade, nunca parte_1/parte_2; varios contratos podem governar o mesmo arquivo de codigo via vinculos. Sema Codigo deve preservar essa rastreabilidade em cabecalhos e saidas geradas. Documentacao Markdown nao entra nesse limite de codigo; continua governada por docs-impacto, limite de bytes e verificacao de segredos. Payload inline acima de 262144 caracteres nao e caso de aumentar timeout: divida por responsabilidade ou use anexo/caminho de servidor autorizado.
- IA fraca: Se abrir codigo com SEMA-GOVERNED, pare, leia SEMA_SMALL_MODEL.md e chame Sema antes de editar. Nao crie codigo acima de 2000 linhas nem contrato .sema acima de 500; divida .sema por capacidade, nunca em parte_1/parte_2.
- IA média: Se abrir codigo com SEMA-GOVERNED, rode docs-impacto e drift antes de alterar comportamento. Trate codigo 1000+ e contrato .sema 300+ como refatoracao provavel; se o payload inline passar de 262144 caracteres, separe HTML, estilos, estado, renderizacao, calculo e dados antes de sincronizar.
- IA forte: Se abrir codigo com SEMA-GOVERNED, pode inspecionar AST/IR e codigo completo, mas mantem contrato primeiro, drift, codigo ate 2000, .sema ate 500 e finalizar-mudanca. Contexto grande nao autoriza monolito nem payload inline acima de 262144 caracteres.

## Design visual

- Regra: Quando a tarefa envolve site, sistema, app, interface, dashboard, painel, formulário, landing, jogo, terminal, CLI/TUI ou qualquer artefato voltado ao usuário, o Sema governa também acabamento, modernidade e adequação ao domínio. Beleza funcional, identidade, criatividade útil, tecnologia adequada, estados, responsividade e evidência não são extras opcionais.
- Aplicar quando: site, sistema, app, dashboard, painel, admin, onboarding, formulário, modal, jogo, material visual, CLI, TUI, terminal, relatório interativo ou qualquer entrega com experiência de uso.
- IA fraca: Use um padrão moderno seguro e contextual: hierarquia clara, espaçamento consistente, paleta com contraste, componentes coerentes com o domínio, estados básicos, responsivo mobile/desktop e nada de formulário cinza genérico. Em terminal, entregue saída organizada com status e erro claros. Se não conseguir validar o resultado, pare e peça revisão.
- IA média: Defina intenção de experiência antes de codar: público, domínio, workflow real, densidade, tokens, componentes, tecnologia/biblioteca/efeitos adequados, estados, responsividade e anti-2010. O domínio manda na solução: agro, finanças, saúde, game e e-commerce não podem compartilhar a mesma casca. Rode ou peça screenshot/browser check quando houver UI e smoke check quando for terminal.
- IA forte: Crie direção específica e ambiciosa do domínio, use bibliotecas, APIs, assets, microinterações e efeitos atuais quando fizerem sentido, refine o fluxo principal até parecer produto real e faça verificação visual/terminal com evidência. Inovação precisa servir ao uso, não virar enfeite.
- Proibido: interface_generica_2010, formularios_sem_hierarquia_visual, cards_cinzas_sem_identidade, layout_sem_responsividade_real, texto_estourando_ou_sobreposto

## Timeout e retry

- Regra: Timeout definido pelo agente não é falha do Sema. Se `sema resumo`, `inspecionar`, `drift` ou `sync-ai-entrypoints` estourar por timeout local, aumente o timeout e tente de novo com escopo menor quando possível.
- Timeout inicial para projeto inteiro: 120s
- Escalonamento: 120s -> 300s -> 600s
- Bloqueio: Tente de novo com timeouts maiores enquanto houver execução disponível; se o ambiente impedir continuar, pare bloqueado e não avance com código sem Sema.

## Guia por capacidade

- fraca: IA fraca, gratuita, local pequena ou com disciplina baixa. Leia o boot card, pare cedo e chame Sema antes de agir. Artefatos: SEMA_BOOT.md, SEMA_SMALL_MODEL.md, agent-context-pack.json, resumo.micro.txt, briefing.min.json, prompt-curto.txt.
- media: IA média. Aguenta boot, resumo expandido, briefing mínimo, drift e documentação curta. Artefatos: SEMA_BOOT.md, agent-context-pack.json, resumo.curto.txt, briefing.min.json, drift.json, prompt-curto.txt.
- forte: IA forte, com tool use bom e contexto grande. Pode consumir o pacote completo, mas ainda deve começar pelo boot e pelos gates Sema. Artefatos: SEMA_BOOT.md, agent-context-pack.json, README.md, resumo.md, briefing.json, drift.json, ir.json, ast.json.

## Modulos

### app.pedidos
- Faz: governa 1 rota(s), 1 task(s) com foco em criar pedido publico
- Publico: POST /pedidos
- Tocar: nenhum
- Score: 50 | Confianca: baixa | Risco: alto
- Lacunas: audit_ausente, auth_ausente, authz_frouxa, dados_nao_classificados (+2)
