# 001 — Decisões Consolidadas da v1

**Projeto:** Site Institucional + Farmácia Solidária Lírio dos Vales  
**Igreja:** Igreja Presbiteriana Lírio dos Vales — Tatuí/SP  
**Status:** Decisões travadas para a v1  
**Objetivo:** Registrar as principais decisões de produto, técnica, segurança e operação para evitar mudanças involuntárias durante a implementação.

---

## 1. Escopo geral da v1

A v1 será desenvolvida como um único projeto Next.js, com um único repositório, um único deploy e três zonas principais:

```txt
1. Site institucional da igreja
2. Área pública da Farmácia Solidária
3. Painel administrativo protegido
```

A estrutura principal será:

```txt
/                         → Landing page institucional
/farmacia                 → Apresentação pública da Farmácia Solidária
/farmacia/estoque         → Consulta pública de disponibilidade
/farmacia/solicitar       → Formulário de solicitação
/farmacia/doar            → Orientações para doação
/admin/*                  → Área administrativa protegida
/api/*                    → Rotas server-side
```

---

## 2. Nível único de admin

Na v1, o painel administrativo terá **nível único de admin**.

Essa decisão foi mantida porque:

```txt
- apenas 3 ou 4 pessoas terão acesso inicialmente;
- a equipe está bem alinhada quanto à função de cada um;
- a operação inicial precisa ser simples;
- múltiplos níveis de permissão aumentariam a complexidade da v1.
```

Fica para v2:

```txt
Admin geral
Farmacêutico
Voluntário
Permissões diferenciadas por função
```

---

## 3. Consulta pública de medicamentos

A consulta pública será feita por:

```txt
GET /api/medicamentos
```

Essa rota será uma API Route server-side.

Não haverá SELECT público direto nas tabelas:

```txt
medicamentos
lotes
```

O retorno público será limitado a:

```ts
{
  id: string,
  nome_comercial: string,
  principio_ativo: string,
  dosagem: string,
  forma_farmaceutica: string,
  disponivel: boolean
}
```

A consulta pública nunca deve retornar:

```txt
quantidade
número do lote
validade
doador
CPF
dados de beneficiário
dados de solicitação
```

Medicamentos com:

```txt
controlado = true
```

não aparecem na consulta pública.

---

## 4. Cálculo de disponibilidade

A disponibilidade pública deve considerar:

```txt
lotes ativos
validade >= hoje
quantidade - reservas_ativas > 0
```

Regra:

```txt
Disponível = existe pelo menos um lote ativo, dentro da validade, com saldo disponível após descontar reservas ativas.
```

Se todas as unidades estiverem reservadas, o medicamento deve aparecer como:

```txt
Indisponível
```

mesmo antes da entrega física.

---

## 5. Fluxo público de solicitação

O fluxo público deve seguir esta ordem:

```txt
/farmacia
→ card "Solicitar medicamento"
→ /farmacia/estoque
→ usuário pesquisa medicamento
→ se disponível, clica em "Solicitar"
→ /farmacia/solicitar?medicamentoId=...
```

Quando o medicamento não for encontrado:

```txt
/farmacia/estoque
→ "Não encontrei o medicamento"
→ "Enviar mesmo assim"
→ /farmacia/solicitar?livre=true
```

O card **Solicitar medicamento** em `/farmacia` nunca deve levar diretamente para `/farmacia/solicitar`.

A consulta de disponibilidade é etapa obrigatória do fluxo público, exceto quando houver acesso interno direto controlado.

---

## 6. Reconhecimento do beneficiário por CPF

Não haverá endpoint público:

```txt
GET /api/beneficiarios?cpf=...
```

Também não haverá endpoint público que retorne nome, WhatsApp, endereço ou dados sensíveis apenas com CPF.

A rota correta será:

```txt
POST /api/beneficiarios/verificar
```

Ela receberá:

```txt
CPF
últimos 4 dígitos do WhatsApp
```

Essa regra será chamada de:

```txt
confirmação adicional
```

Não usar:

```txt
verificação em 2 fatores
2FA
segundo fator de autenticação
```

Motivo: CPF + últimos 4 dígitos do WhatsApp não é autenticação de dois fatores em sentido técnico.

---

## 7. Resposta segura na confirmação por CPF

Se houver confirmação positiva, o sistema pode exibir os dados do beneficiário para revisão e atualização.

Se não houver correspondência ou se o CPF não existir, o sistema deve exibir o formulário completo.

A mensagem pública deve ser genérica e não revelar se o CPF existe.

Mensagem padrão:

```txt
Não conseguimos confirmar um cadastro anterior com esses dados. Preencha ou atualize suas informações para continuar.
```

Evitar mensagens como:

```txt
CPF não encontrado
CPF já cadastrado
Últimos 4 dígitos incorretos para este CPF
Encontramos seu cadastro
```

---

## 8. Dados pessoais e LGPD

O sistema coleta dados pessoais e dados sensíveis relacionados à saúde.

O formulário público deve exigir consentimento explícito antes do envio.

O campo abaixo deve ser gravado como verdadeiro:

```txt
consentimento_lgpd = true
```

Sem consentimento, o envio da solicitação deve permanecer bloqueado.

A finalidade dos dados é única e específica:

```txt
analisar, aprovar, recusar e atender solicitações de medicamentos pela Farmácia Solidária Lírio dos Vales.
```

Os dados não devem ser usados para fins comerciais nem para comunicações não relacionadas à solicitação.

---

## 9. Receitas médicas

As receitas médicas devem ficar no bucket privado:

```txt
receitas
```

O bucket deve ter:

```txt
acesso público desabilitado
```

Receitas não podem ser acessadas por URL pública.

O acesso administrativo deve ocorrer apenas por URL assinada gerada por API Route autenticada.

A URL assinada deve expirar em:

```txt
60 minutos
```

Toda visualização de receita deve gerar log:

```txt
visualizou_receita
```

---

## 10. Retenção de receitas médicas

Política da v1:

```txt
Solicitações entregues:
manter receita por 12 meses após a entrega.

Solicitações recusadas ou canceladas:
excluir receita após 90 dias.
```

Na v1, a exclusão será manual.

Na v2, poderá ser implementado job automático.

Toda exclusão manual de receita deve gerar log de auditoria.

---

## 11. Service Role Key

A chave:

```txt
SUPABASE_SERVICE_ROLE_KEY
```

nunca deve ir para o frontend.

Também não pode ser prefixada com:

```txt
NEXT_PUBLIC_
```

O arquivo:

```txt
lib/supabase/admin.ts
```

deve ser usado somente em:

```txt
API Routes server-side
jobs do n8n
scripts confiáveis
```

Ele nunca deve ser importado em Client Components.

---

## 12. Supabase clients

O projeto terá três clients separados:

```txt
lib/supabase/client.ts
→ browser
→ anon key
→ usado no client-side

lib/supabase/server.ts
→ server session client
→ anon key + cookies
→ usado em Server Components, middleware e rotas com sessão

lib/supabase/admin.ts
→ service_role
→ usado somente em API Routes, jobs e scripts confiáveis
```

Essa separação é obrigatória para evitar vazamento acidental da service role.

---

## 13. RLS

As tabelas sensíveis não devem ter SELECT público direto.

Decisão da v1:

```txt
medicamentos:
sem SELECT público direto, salvo view pública segura ou API Route

lotes:
sem SELECT público direto

beneficiarios:
sem SELECT público

solicitacoes:
sem SELECT público

estoque_movimentacoes:
sem acesso público

configuracoes:
sem acesso público

logs_auditoria:
sem acesso público
```

O frontend público envia dados para API Routes.

As API Routes validam os dados e gravam no banco server-side usando:

```txt
lib/supabase/admin.ts
```

O frontend público nunca escreve diretamente nas tabelas sensíveis usando anon key.

---

## 14. Doação de medicamentos

A página pública `/farmacia/doar` deve informar claramente o que não é aceito.

Não são aceitos:

```txt
medicamentos de uso controlado
medicamentos manipulados
medicamentos termolábeis
medicamentos vencidos
medicamentos com embalagem violada
```

No painel administrativo, o cadastro de lote deve bloquear entrada de medicamentos:

```txt
controlado = true
manipulado = true
termolabil = true
```

---

## 15. Validade de lotes

Regra da v1:

```txt
lote vencido → bloqueia cadastro
lote próximo do vencimento → exibe alerta e permite confirmação consciente
```

Mensagem obrigatória para lote vencido:

```txt
Este lote está vencido e não pode ser cadastrado no estoque da Farmácia Solidária.
```

---

## 16. Movimentações de estoque

Toda alteração relevante no estoque deve gerar movimentação.

Tipos principais:

```txt
entrada
reserva
cancelamento_reserva
saida
descarte
ajuste
```

Regra operacional:

```txt
Aprovação cria reserva.
Entrega cria saída.
A quantidade física só diminui na entrega.
Recusa ou cancelamento libera reserva, se houver, com cancelamento_reserva.
```

---

## 17. FEFO

A aprovação deve sugerir lote pela regra FEFO:

```txt
First Expired, First Out
```

Ou seja, o sistema sugere primeiro o lote válido com vencimento mais próximo.

O admin pode selecionar outro lote, se necessário.

---

## 18. Webhooks e WhatsApp

As integrações com WhatsApp serão feitas via:

```txt
n8n + Evolution API
```

Os webhooks devem ser protegidos por:

```txt
Authorization: Bearer {N8N_WEBHOOK_SECRET}
```

Webhook sem token correto deve retornar:

```txt
HTTP 401
```

Tokens e URLs de webhook não devem aparecer no frontend nem em logs públicos.

Mensagens de WhatsApp não devem incluir dados sensíveis desnecessários, como:

```txt
CPF
endereço completo sem necessidade
dados de terceiros
dados clínicos desnecessários
```

---

## 19. Alertas de validade

Na v1, a view SQL:

```txt
alertas_validade
```

pode usar prazos fixos de 30/60 dias para simplificar.

O frontend pode usar:

```txt
configuracoes.alerta_laranja_dias
configuracoes.alerta_amarelo_dias
```

para colorir e filtrar alertas.

Isso é uma decisão consciente da v1, não um bug.

Na v2, a view pode ser substituída por função SQL dinâmica que lê `configuracoes`.

---

## 20. Auditoria

Ações críticas devem gerar logs em:

```txt
logs_auditoria
```

Ações mínimas registradas:

```txt
visualizou_receita
aprovou_solicitacao
recusou_solicitacao
cancelou_solicitacao
marcou_entregue
registrou_entrada_lote
descartou_lote
alterou_medicamento
alterou_configuracao
excluiu_receita
```

Logs devem conter:

```txt
usuario_id
acao
entidade
entidade_id
dados_anteriores, quando aplicável
dados_novos, quando aplicável
created_at
```

Admins comuns não devem editar nem apagar logs.

---

## 21. Fora do escopo da v1

Ficam para v2 ou posterior:

```txt
múltiplos níveis de permissão admin
histórico completo por beneficiário
relatórios exportáveis em PDF/Excel
painel público de transparência
leitura automática de receita por IA/OCR
múltiplas unidades
app mobile nativo
integração com sistemas de saúde externos
job automático de exclusão de receitas
função SQL dinâmica para alertas de validade
```

---

## 22. Regra para agentes de IA

Ao implementar o projeto, agentes de IA devem respeitar estas decisões.

Qualquer proposta que contradiga este arquivo deve ser rejeitada ou enviada para revisão humana antes de ser implementada.

Regra de execução:

```txt
Uma fase por sessão.
Uma tarefa por vez.
Não avançar sem confirmação humana.
```

Documentos principais de referência:

```txt
01-product-spec.md
02-ux-spec-rotas-e-fluxos.md
03-technical-spec.md
04-implementation-plan.md
05-backlog.md
06-acceptance-criteria.md
07-lgpd-e-seguranca.md
```

---

## 23. Status

```txt
Status: decisões consolidadas da v1.
Uso: este arquivo deve ser lido antes de qualquer implementação.
Próxima etapa: Fase 0 — Setup do projeto Next.js.
```
