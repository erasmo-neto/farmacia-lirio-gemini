# Schema Real Atual — Supabase
## Farmácia Solidária Lírio dos Vales

**Estado da verificação:** consultas 01–25 concluídas  
**Fonte:** resultados reais executados no SQL Editor do Supabase  
**Data da consolidação:** 23/09/2026

> Este documento registra o estado real observado no banco no momento da verificação.
> Requisitos da arquitetura futura são mantidos como requisitos futuros e não são tratados como existentes no banco sem evidência.

---

# 1. Tabelas principais confirmadas

As cinco tabelas principais existem no schema `public`:

| Tabela | Tipo |
|---|---|
| `beneficiarios` | BASE TABLE |
| `estoque_lotes` | BASE TABLE |
| `medicamentos` | BASE TABLE |
| `movimentacoes_estoque` | BASE TABLE |
| `solicitacoes` | BASE TABLE |

---

# 2. Estrutura real das tabelas

## 2.1 `beneficiarios`

| # | Coluna | Tipo | Nullable | Default |
|---:|---|---|---|---|
| 1 | `id` | `uuid` | NÃO | `gen_random_uuid()` |
| 2 | `cpf` | `text` | NÃO | — |
| 3 | `nome` | `text` | NÃO | — |
| 4 | `whatsapp` | `text` | NÃO | — |
| 5 | `endereco` | `text` | NÃO | — |
| 6 | `created_at` | `timestamptz` | SIM | `now()` |
| 7 | `updated_at` | `timestamptz` | SIM | `now()` |

## 2.2 `estoque_lotes`

| # | Coluna | Tipo | Nullable | Default |
|---:|---|---|---|---|
| 1 | `id` | `uuid` | NÃO | `gen_random_uuid()` |
| 2 | `medicamento_id` | `uuid` | SIM | — |
| 3 | `numero_lote` | `text` | NÃO | — |
| 4 | `data_validade` | `date` | NÃO | — |
| 5 | `qtd_caixas` | `integer` | SIM | `0` |
| 6 | `unidades_por_caixa` | `integer` | SIM | `1` |
| 7 | `qtd_total_unidades` | `integer` | SIM | `0` |
| 8 | `data_entrada` | `date` | SIM | `CURRENT_DATE` |
| 9 | `parceiro_doador` | `text` | SIM | — |
| 10 | `created_at` | `timestamptz` | SIM | `now()` |
| 11 | `apresentacao` | `text` | SIM | — |

## 2.3 `medicamentos`

| # | Coluna | Tipo | Nullable | Default |
|---:|---|---|---|---|
| 1 | `id` | `uuid` | NÃO | `gen_random_uuid()` |
| 2 | `nome_comercial` | `text` | NÃO | — |
| 3 | `principio_ativo` | `text` | NÃO | — |
| 4 | `dosagem` | `text` | SIM | — |
| 5 | `forma_farmaceutica` | `text` | SIM | — |
| 6 | `tipo_validade_receita` | `text` | SIM | `'geral_180'::text` |
| 7 | `created_at` | `timestamptz` | SIM | `now()` |
| 8 | `categoria` | `text` | SIM | — |

**Importante:** a consulta 17 não encontrou nenhuma das colunas de restrição procuradas (`controlado`, `manipulado`, `termolabil`/`termolábil`, `exige_receita`, `estoque_minimo`, `ativo`). Portanto, elas **não estão confirmadas como existentes no schema atual**.

## 2.4 `movimentacoes_estoque`

| # | Coluna | Tipo | Nullable | Default |
|---:|---|---|---|---|
| 1 | `id` | `uuid` | NÃO | `gen_random_uuid()` |
| 2 | `lote_id` | `uuid` | SIM | — |
| 3 | `tipo` | `text` | NÃO | — |
| 4 | `quantidade_unidades` | `integer` | NÃO | — |
| 5 | `solicitacao_id` | `uuid` | SIM | — |
| 6 | `realizado_por` | `uuid` | SIM | — |
| 7 | `observacao` | `text` | SIM | — |
| 8 | `created_at` | `timestamptz` | SIM | `now()` |

## 2.5 `solicitacoes`

| # | Coluna | Tipo | Nullable | Default |
|---:|---|---|---|---|
| 1 | `id` | `uuid` | NÃO | `gen_random_uuid()` |
| 2 | `protocolo` | `integer` | NÃO | `nextval('solicitacoes_protocolo_seq'::regclass)` |
| 3 | `beneficiario_id` | `uuid` | SIM | — |
| 4 | `medicamento_id` | `uuid` | SIM | — |
| 5 | `lote_id` | `uuid` | SIM | — |
| 6 | `qtd_solicitada` | `integer` | SIM | `1` |
| 7 | `qtd_atendida` | `integer` | SIM | `0` |
| 8 | `data_emissao_receita` | `date` | SIM | — |
| 9 | `url_receita` | `text` | SIM | — |
| 10 | `tipo_entrega` | `text` | SIM | `'retirada'::text` |
| 11 | `justificativa_domicilio` | `text` | SIM | — |
| 12 | `status` | `text` | SIM | `'pendente'::text` |
| 13 | `observacoes_admin` | `text` | SIM | — |
| 14 | `analisado_por` | `uuid` | SIM | — |
| 15 | `data_analise` | `timestamptz` | SIM | — |
| 16 | `data_entrega` | `timestamptz` | SIM | — |
| 17 | `created_at` | `timestamptz` | SIM | `now()` |
| 18 | `tratamento` | `text` | SIM | — |
| 19 | `receita_url` | `text` | SIM | — |
| 20 | `consentimento_lgpd` | `boolean` | SIM | `false` |

**Observação:** existem simultaneamente `url_receita` e `receita_url`. A decisão de manter/unificar/aposentar uma delas fica para a reconciliação entre banco, código e especificação.

---

# 3. Chaves primárias

Todas as cinco tabelas possuem chave primária simples em `id`:

- `beneficiarios.id`
- `estoque_lotes.id`
- `medicamentos.id`
- `movimentacoes_estoque.id`
- `solicitacoes.id`

---

# 4. Constraints e Foreign Keys

## 4.1 UNIQUE

Foi confirmada:

| Tabela | Constraint | Coluna |
|---|---|---|
| `beneficiarios` | `beneficiarios_cpf_key` | `cpf` |

## 4.2 NOT NULL / CHECK observados

A consulta 04 retornou constraints com nomes do tipo `2200_..._not_null` para colunas obrigatórias. Essas são as representações de NOT NULL observadas no resultado.

A consulta 05, específica para `CHECK` constraints em `pg_constraint`, retornou **nenhuma linha**.

## 4.3 Foreign Keys

| Tabela/coluna | Referência | ON UPDATE | ON DELETE |
|---|---|---|---|
| `estoque_lotes.medicamento_id` | `medicamentos.id` | `NO ACTION` | `CASCADE` |
| `movimentacoes_estoque.lote_id` | `estoque_lotes.id` | `NO ACTION` | `CASCADE` |
| `movimentacoes_estoque.realizado_por` | `perfis.id` | `NO ACTION` | `NO ACTION` |
| `movimentacoes_estoque.solicitacao_id` | `solicitacoes.id` | `NO ACTION` | `NO ACTION` |
| `solicitacoes.analisado_por` | `perfis.id` | `NO ACTION` | `NO ACTION` |
| `solicitacoes.beneficiario_id` | `beneficiarios.id` | `CASCADE` | `RESTRICT` |
| `solicitacoes.lote_id` | `estoque_lotes.id` | `NO ACTION` | `NO ACTION` |
| `solicitacoes.medicamento_id` | `medicamentos.id` | `NO ACTION` | `NO ACTION` |

### Observação sobre `perfis`

As FKs confirmam referências a `perfis.id`. A tabela `perfis` não está entre as cinco tabelas principais do inventário e deve ser investigada como parte da autenticação/admin.

---

# 5. Índices

## `beneficiarios`

- `beneficiarios_cpf_key` — UNIQUE BTREE (`cpf`)
- `beneficiarios_pkey` — UNIQUE BTREE (`id`)

## `estoque_lotes`

- `estoque_lotes_pkey` — UNIQUE BTREE (`id`)

## `medicamentos`

- `idx_medicamentos_nome` — GIN com `to_tsvector('portuguese', nome_comercial)`
- `idx_medicamentos_principio` — GIN com `to_tsvector('portuguese', principio_ativo)`
- `medicamentos_pkey` — UNIQUE BTREE (`id`)

## `movimentacoes_estoque`

- `movimentacoes_estoque_pkey` — UNIQUE BTREE (`id`)

## `solicitacoes`

- `solicitacoes_pkey` — UNIQUE BTREE (`id`)

Nenhum outro índice foi retornado pela consulta 07.

---

# 6. RLS

| Tabela | RLS | FORCE RLS |
|---|---:|---:|
| `beneficiarios` | `false` | `false` |
| `estoque_lotes` | `true` | `false` |
| `medicamentos` | `true` | `false` |
| `movimentacoes_estoque` | `true` | `false` |
| `solicitacoes` | `false` | `false` |

---

# 7. Policies RLS

Foram encontradas duas policies nas cinco tabelas principais:

| Tabela | Policy | Role | Comando | USING |
|---|---|---|---|---|
| `medicamentos` | `Enable read access for all users` | `public` | `SELECT` | `true` |
| `solicitacoes` | `Enable read access for all users` | `public` | `SELECT` | `true` |

## Achado de segurança

No estado verificado:

- `beneficiarios` está com RLS desabilitado;
- `solicitacoes` está com RLS desabilitado;
- `solicitacoes` possui `SELECT` público pela policy acima.

Esse é um **achado do estado atual**. Não fazer alterações ainda; ele será comparado com os requisitos de segurança e LGPD na etapa de reconciliação.

---

# 8. Triggers

A consulta 10 retornou:

**Success. No rows returned**

Não foram encontradas triggers nas cinco tabelas principais pela consulta realizada.

---

# 9. Views

## Consulta 11

**Success. No rows returned**

Não foram encontradas views no schema `public` pela consulta executada.

## Consulta 12

**Success. No rows returned**

Não foram encontradas definições de views no schema `public`.

**Consequência:** a view `alertas_validade` mencionada na documentação de destino **não está confirmada no banco atual**.

---

# 10. Funções / RPCs

## Consulta 13

**Success. No rows returned**

Não foram encontradas funções no schema `public` pela consulta executada.

Portanto, não há RPC/função pública em `public` confirmada por esse inventário.

---

# 11. ENUMs

## Consulta 14

**Success. No rows returned**

Não foram encontrados ENUMs no schema `public`.

Isso indica que, pelo menos nas consultas realizadas, os campos de domínio como `status` e `tipo` estão usando tipos como `text`, e não ENUMs PostgreSQL.

---

# 12. Valores atuais de `solicitacoes.status`

## Consulta 15

| Status | Quantidade |
|---|---:|
| `APROVADO` | 1 |
| `REJEITADO` | 1 |

Total de solicitações observadas por essa consulta: **2**.

**Observação:** o default do campo é `'pendente'::text`, mas os dois registros existentes no momento da consulta estavam em `APROVADO` e `REJEITADO`.

---

# 13. Valores de `movimentacoes_estoque.tipo`

## Consulta 16

**Success. No rows returned**

Não existem registros em `movimentacoes_estoque` no momento da verificação; portanto, não houve nenhum valor de `tipo` a listar.

Isso é coerente com a contagem da consulta 24, que retornou **0 movimentações**.

---

# 14. Campos de restrição em `medicamentos`

## Consulta 17

**Success. No rows returned**

Nenhuma destas colunas foi encontrada:

- `controlado`
- `manipulado`
- `termolabil`
- `termolábil`
- `exige_receita`
- `estoque_minimo`
- `ativo`

Esses campos pertencem, portanto, ao **modelo futuro/documentado**, não ao schema atual confirmado.

---

# 15. Campos verificados de `estoque_lotes`

A consulta 18 confirmou:

- `id`
- `medicamento_id`
- `numero_lote`
- `data_validade`
- `qtd_caixas`
- `unidades_por_caixa`
- `qtd_total_unidades`
- `data_entrada`
- `parceiro_doador`
- `created_at`
- `apresentacao`

Não foram encontrados, nessa consulta, campos alternativos como `lote`, `validade`, `quantidade`, `doador` ou `status`.

---

# 16. Estrutura de `solicitacoes`

A consulta 19 confirmou as 20 colunas listadas na seção 2.5.

---

# 17. Estrutura de `movimentacoes_estoque`

A consulta 20 confirmou as 8 colunas listadas na seção 2.4.

---

# 18. Storage — bucket `receitas`

## Consulta 21

Foi confirmado:

| Campo | Valor |
|---|---|
| `id` | `receitas` |
| `name` | `receitas` |
| `public` | `false` |
| `created_at` | `2026-09-22 19:31:28.757784+00` |
| `updated_at` | `2026-09-22 19:31:28.757784+00` |

Portanto, o bucket `receitas` existe e está configurado como **privado**.

## Consulta 22 — Storage policies

Foi encontrada:

| Schema | Tabela | Policy | Role | Comando | WITH CHECK |
|---|---|---|---|---|---|
| `storage` | `objects` | `Permitir upload de receitas` | `public` | `INSERT` | `(bucket_id = 'receitas'::text)` |

### Achado de segurança

O bucket está privado, mas existe uma policy de **INSERT para `public`** permitindo upload quando o `bucket_id` é `receitas`.

Isso precisa ser tratado na reconciliação de segurança porque o requisito de destino prevê controle server-side para upload de receitas.

Não alterar essa policy nesta etapa de inventário.

---

# 19. FK específica `solicitacoes → beneficiarios`

## Consulta 23

Confirmada:

| Tabela | Coluna | Referência | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `solicitacoes` | `beneficiario_id` | `beneficiarios.id` | `CASCADE` | `RESTRICT` |

---

# 20. Contagem atual das tabelas

## Consulta 24

| Tabela | Registros |
|---|---:|
| `beneficiarios` | 1 |
| `estoque_lotes` | 67 |
| `medicamentos` | 53 |
| `movimentacoes_estoque` | 0 |
| `solicitacoes` | 2 |

Essas contagens são um retrato do momento em que a consulta foi executada.

---

# 21. Sanidade agregada do estoque

## Consulta 25

| Métrica | Valor |
|---|---:|
| Lotes | 67 |
| Soma `qtd_caixas` | 198 |
| Soma `qtd_total_unidades` | 1322 |

Esses valores representam uma fotografia agregada do estoque no momento da consulta.

---

# 22. Resumo das consultas 01–25

| Consulta | Resultado |
|---|---|
| 01 — Tabelas | ✅ 5 tabelas |
| 02 — Colunas | ✅ confirmado |
| 03 — PKs | ✅ confirmado |
| 04 — Constraints | ✅ confirmado |
| 05 — CHECK | ✅ nenhum resultado |
| 06 — FKs + ações | ✅ confirmado |
| 07 — Índices | ✅ confirmado |
| 08 — RLS | ✅ confirmado |
| 09 — Policies | ✅ confirmado |
| 10 — Triggers | ✅ nenhum resultado |
| 11 — Views | ✅ nenhuma encontrada |
| 12 — Definição de views | ✅ nenhuma encontrada |
| 13 — Funções/RPCs | ✅ nenhuma encontrada |
| 14 — ENUMs | ✅ nenhum encontrado |
| 15 — Status de solicitações | ✅ 2 registros |
| 16 — Tipos de movimentação | ✅ nenhum valor; tabela sem registros |
| 17 — Restrições de medicamentos | ✅ nenhuma das colunas procuradas |
| 18 — Campos de lotes | ✅ confirmado |
| 19 — Campos de solicitações | ✅ confirmado |
| 20 — Campos de movimentações | ✅ confirmado |
| 21 — Storage buckets | ✅ `receitas`, privado |
| 22 — Storage policies | ✅ 1 policy de INSERT pública |
| 23 — FK beneficiário | ✅ confirmado |
| 24 — Contagens | ✅ confirmado |
| 25 — Sanidade de estoque | ✅ confirmado |

**Inventário 01–25: CONCLUÍDO.**

---

# 23. Principais divergências a levar para a reconciliação

## Banco atual × arquitetura futura

1. `beneficiarios` sem RLS.
2. `solicitacoes` sem RLS e com `SELECT` público.
3. Upload público permitido no bucket `receitas`.
4. Não há views confirmadas.
5. Não há RPCs/funções confirmadas no `public`.
6. Não há ENUMs confirmados.
7. Não há triggers nas cinco tabelas principais.
8. `medicamentos` não possui os campos de restrição previstos no modelo futuro.
9. `solicitacoes` possui duas colunas para receita.
10. A tabela `movimentacoes_estoque` está vazia.
11. Existem FKs para `perfis.id`, cuja estrutura ainda precisa ser inventariada.

---

# 24. O que este documento NÃO autoriza fazer

Este documento é um inventário.

Ele não deve ser usado isoladamente para:
- alterar RLS;
- excluir policies;
- criar migrations;
- criar colunas;
- renomear campos;
- criar RPCs;
- mudar regras de estoque;
- alterar Storage;
- apagar dados.

Essas ações dependem da reconciliação com:
1. especificações do projeto;
2. decisões consolidadas;
3. código Vite atual;
4. arquitetura Next.js de destino;
5. requisitos LGPD/segurança.

---

# 25. Próxima etapa

Com as consultas 01–25 concluídas, a próxima etapa recomendada é a **reconciliação arquitetural final**:

```text
DOCUMENTAÇÃO
      +
CÓDIGO VITE REAL
      +
BANCO REAL
      ↓
DIVERGÊNCIAS CONFIRMADAS
      ↓
DECISÕES DE MIGRAÇÃO
      ↓
FASE 0-M.3
```

Antes disso, permanece útil investigar especificamente a tabela `perfis`, porque ela é referenciada pelas FKs `analisado_por` e `realizado_por`.

---

# 26. Tabela `public.perfis`

## 26.1 Existência

| Item | Estado |
|---|---|
| `public.perfis` | ✅ existe |
| Tipo | `BASE TABLE` |
| Registros | `0` |

## 26.2 Colunas confirmadas

| # | Coluna | Tipo | Nullable | Default |
|---:|---|---|---|---|
| 1 | `id` | `uuid` | NÃO | — |
| 2 | `nome_completo` | `text` | NÃO | — |
| 3 | `cpf` | `text` | NÃO | — |
| 4 | `whatsapp` | `text` | NÃO | — |
| 5 | `endereco` | `text` | NÃO | — |
| 6 | `role` | `text` | SIM | `'beneficiario'::text` |
| 7 | `aceitou_lgpd` | `boolean` | SIM | `false` |
| 8 | `data_aceite_lgpd` | `timestamptz` | SIM | — |
| 9 | `created_at` | `timestamptz` | SIM | `now()` |

## 26.3 Constraints confirmadas

| Constraint | Tipo | Coluna | Referência |
|---|---|---|---|
| `perfis_pkey` | PRIMARY KEY | `id` | — |
| `perfis_cpf_key` | UNIQUE | `cpf` | — |
| `2200_17687_1_not_null` | CHECK/NOT NULL | — | — |
| `2200_17687_2_not_null` | CHECK/NOT NULL | — | — |
| `2200_17687_3_not_null` | CHECK/NOT NULL | — | — |
| `2200_17687_4_not_null` | CHECK/NOT NULL | — | — |
| `2200_17687_5_not_null` | CHECK/NOT NULL | — | — |
| `perfis_id_fkey` | FOREIGN KEY | `id` | **não identificado pelo levantamento atual** |

### Observação sobre `perfis_id_fkey`

A FK foi confirmada como:

| Origem | Referência | ON UPDATE | ON DELETE |
|---|---|---|---|
| `public.perfis.id` | `auth.users.id` | `NO ACTION` | `CASCADE` |

Portanto, `public.perfis.id` está diretamente relacionado ao usuário correspondente em `auth.users.id`.

## 26.4 RLS

| Tabela | RLS | FORCE RLS |
|---|---:|---:|
| `perfis` | `true` | `false` |

## 26.5 Policies

A consulta de policies retornou:

**Success. No rows returned**

Portanto, nenhuma policy RLS foi encontrada para `public.perfis`.

## 26.6 Relação com as tabelas principais

As tabelas principais já possuem estas referências para `perfis.id`:

| Origem | Coluna | Destino |
|---|---|---|
| `solicitacoes` | `analisado_por` | `perfis.id` |
| `movimentacoes_estoque` | `realizado_por` | `perfis.id` |

No momento da verificação, `public.perfis` possui **0 registros**, portanto não existem registros atuais que preencham essas referências.

## 26.7 Interpretação para a migração

A existência de `public.perfis` indica que o banco já possui uma estrutura destinada a identidade/participantes do sistema, incluindo `role` e consentimento LGPD.

Entretanto:

- a tabela está vazia;
- não há policies RLS para ela;
- o alvo da FK `perfis_id_fkey` ainda não foi identificado;
- não devemos presumir que `public.perfis` já esteja integrada ao Supabase Auth.

Esses pontos precisam ser esclarecidos antes de definir o modelo final de autenticação administrativa.

---

---

# 27. FK `perfis_id_fkey` — confirmação final

Consulta complementar executada com sucesso.

| Constraint | Origem | Referência | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `perfis_id_fkey` | `public.perfis.id` | `auth.users.id` | `NO ACTION` | `CASCADE` |

## Consequência para a arquitetura

A tabela `public.perfis` possui vínculo estrutural com o Supabase Auth:

```text
auth.users.id
      │
      ▼
public.perfis.id
```

Isso é relevante para o modelo administrativo planejado, mas **não significa que já existam administradores cadastrados**, pois a contagem de `public.perfis` foi confirmada como `0`.

---

# 28. Inventário do banco — estado final

Com as consultas 01–25 e a verificação complementar de `public.perfis`, o inventário estrutural necessário para a próxima etapa está concluído.

Não há mais necessidade de executar consultas adicionais antes da reconciliação, salvo se uma divergência específica identificada posteriormente exigir evidência complementar.
