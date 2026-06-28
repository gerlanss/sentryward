<!-- sema:agent-entrypoint:start -->
# Sintaxe Sema Para IA

Use este arquivo como referencia curta antes de criar ou corrigir contratos `.sema`.

## Regra de ouro

Contrato vem antes de codigo. Antes de escrever `.sema`, consulte os exemplos locais em `exemplos/`.

## Exemplo minimo

```sema
module app.exemplo {
  entity Item {
    fields {
      id: Id
      nome: Texto
      ativo: Booleano
    }
  }

  task criar_item {
    input {
      nome: Texto required
    }
    output {
      item: Item
    }
    rules {
      nome deve_ser preenchido
    }
    effects {
      persistencia Item
      auditoria item_criado
    }
    guarantees {
      item existe
    }
    tests {
      caso "cria item valido" {
        given { nome: "Item" }
        expect { sucesso: verdadeiro }
      }
    }
  }
}
```

## Blocos mais usados

- `docs`: resumo e notas do modulo.
- `entity`: modelo de dominio.
- `task`: operacao governada.
- `input` e `output`: contrato de entrada e saida.
- `rules`: validacoes e regras de negocio.
- `effects`: persistencia, consulta, evento, auditoria e chamadas externas.
- `guarantees`: o que a task precisa entregar se tiver sucesso.
- `error`: erros nomeados e mensagens.
- `tests`: casos minimos de comportamento.
- `route`: superficie publica vinculada a uma task.
- `impl` e `vinculos`: ligacao entre contrato e codigo real.

## Origens canonicas de `use` e `impl`

Use estas origens em contratos antes de inventar palavra nova:

- `ts` ou `typescript`
- `js` ou `javascript`
- `py` ou `python`
- `dart`
- `lua`
- `cs` ou `dotnet`
- `java`
- `go`
- `rust`
- `cpp`

Exemplos:

```sema
use javascript app.web.despesas

impl {
  js: src.app.salvarDespesa
}
```

`sema compilar --alvo javascript` define o alvo de geracao. `impl { js: ... }` define a origem do codigo vivo ligado ao contrato. Sao camadas diferentes e ambas sao validas.

## Listas canonicas pequenas

- `effects`: `persistencia`, `consulta`, `evento`, `auditoria`, `db.write`, `queue.publish`, `fs.write`, `network.egress`, `secret.read`, `shell.exec`.
- `audit.motivo`: `obrigatorio`, `opcional`, `dispensado`.

## Tamanho de contrato .sema

- ate 300 linhas: saudavel
- 301-500 linhas: diagnostico, planeje split
- acima de 500: bloqueia criacao, edicao, drift, finalizacao, geracao e snapshot
- divida por dominio/capacidade real, como `despesas_cadastro.sema`, `despesas_totais.sema`, `despesas_persistencia.sema`
- nunca use `parte_1`, `parte_2`, `part_3` ou nomes equivalentes
- nao remova `guarantees`, `tests`, `authz`, `dados` ou `vinculos` so para caber no limite
- varios contratos `.sema` podem governar o mesmo arquivo de codigo via `vinculos`; isso e esperado

## JavaScript existe

A CLI suporta geracao JavaScript. Use:

```bash
sema compilar contratos/pedidos.sema --alvo javascript --saida ./generated/javascript
```

O projeto tambem pode gerar TypeScript, Python, Dart, Lua, HTML e CSS quando esses alvos estiverem em `sema.config.json`.

## Arquivos de apoio

- `AGENTS.md`: regras obrigatorias do agente.
- `SEMA_BOOT.md`: primeira leitura para qualquer IA.
- `SEMA_SMALL_MODEL.md`: versao curta para IA fraca.
- `AGENT_CONTEXT_PACK.json`: pacote estruturado para agentes.
- `SEMA_INDEX.json`: indice do projeto.
- `docs/comandos.md`: catalogo de comandos, gates e regra de `--saida`.
- `exemplos/`: exemplos oficiais da DSL.

Se a IA nao souber qual forma usar, ela deve abrir `exemplos/calculadora.sema`, `exemplos/crud_simples.sema`, `exemplos/pagamento.sema` ou `exemplos/tratamento_erro.sema` antes de inventar sintaxe.

Politica de plataforma: O Sema governa contrato, escopo, drift, evidência e qualidade do projeto. Ele não pede, não autoriza e não contorna políticas da plataforma, termos de uso, permissões, segurança ou leis.
<!-- sema:agent-entrypoint:end -->
