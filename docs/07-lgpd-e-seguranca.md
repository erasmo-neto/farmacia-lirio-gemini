# 07 — LGPD e Segurança
## Site Institucional + Farmácia Solidária Lírio dos Vales
**Igreja Presbiteriana Lírio dos Vales — Tatuí/SP**
Versão: 1.0 | Data: 2026-05-19

> Este documento descreve as decisões de privacidade e segurança do sistema, com base na LGPD (Lei nº 13.709/2018) e nas boas práticas de desenvolvimento seguro.

---

## Dados coletados

### Do beneficiário (via formulário público)

| Dado | Categoria LGPD | Finalidade |
|---|---|---|
| Nome completo | Dado pessoal | Identificar o beneficiário na solicitação |
| CPF | Dado pessoal | Identificar o beneficiário e permitir confirmação adicional em futuras solicitações |
| WhatsApp | Dado pessoal | Enviar retorno sobre a solicitação e apoiar a confirmação adicional |
| Endereço | Dado pessoal | Informar ao admin para fins de atendimento |
| Tratamento informado | Dado de saúde (sensível) | Permitir análise técnica pela farmacêutica |
| Receita médica (imagem/PDF) | Dado de saúde (sensível) | Comprovar prescrição quando exigida |
| Medicamento solicitado | Dado de saúde (sensível) | Processar a solicitação |
| Consentimento LGPD | Registro de consentimento | Documentar a manifestação do titular antes do envio |

### Do admin

| Dado | Finalidade |
|---|---|
| Email e senha | Autenticação via Supabase Auth |
| Ações no sistema | Registro em `logs_auditoria` para rastreabilidade |

---

## Finalidade de uso dos dados

Os dados coletados dos beneficiários têm **finalidade única e específica**: viabilizar a análise, aprovação e entrega de medicamentos pela equipe da Farmácia Solidária Lírio dos Vales.

Os dados **não serão**:
- Compartilhados com terceiros (exceto operadores técnicos: Supabase, Vercel, n8n)
- Utilizados para fins comerciais
- Transferidos para outros projetos da igreja sem novo consentimento
- Usados para comunicações não relacionadas à solicitação realizada

---

## Proteção de dados pessoais — confirmação adicional

Para evitar que alguém com apenas o CPF de outra pessoa acesse dados pessoais sensíveis (nome, WhatsApp, endereço), o sistema implementa uma **confirmação adicional** no reconhecimento de beneficiários.

Essa confirmação não é autenticação em dois fatores. Ela é uma medida complementar para reduzir o risco de exposição indevida de dados pessoais no fluxo público.

**Como funciona:**
1. O beneficiário informa, na mesma etapa, o CPF e os **últimos 4 dígitos do WhatsApp**
2. A rota `POST /api/beneficiarios/verificar` recebe os dois dados
3. Se houver correspondência positiva, os dados do beneficiário podem ser exibidos para revisão e atualização
4. Se não houver correspondência ou se o CPF não existir, o formulário completo é exibido
5. A mensagem pública deve ser genérica e **não deve revelar se o CPF existe ou não**

**Mensagem padrão para ausência de confirmação:**

> *"Não conseguimos confirmar um cadastro anterior com esses dados. Preencha ou atualize suas informações para continuar."*

**Base técnica:**
- Endpoint correto: `POST /api/beneficiarios/verificar`
- Payload esperado: `{ cpf, whatsapp_ultimos_4 }`
- Não existe endpoint público `GET /api/beneficiarios?cpf=...`
- Não existe endpoint público que retorne dados pessoais apenas com CPF
- Nenhuma resposta pública deve retornar CPF, endereço ou dados sensíveis indevidos
- Respostas sem correspondência devem ser genéricas

**Proteção adicional:**
- Mesmo que um terceiro tenha o CPF de outra pessoa, não deve conseguir acessar dados pessoais apenas com esse dado
- A confirmação complementar pelos últimos 4 dígitos do WhatsApp reduz exposição indevida
- O fluxo preserva o princípio de segurança e minimização de dados

---

## Consentimento

O formulário de solicitação exige um checkbox de consentimento explícito **antes** do envio:

> *"Declaro que li e concordo com o uso dos meus dados para análise da solicitação pela equipe responsável da Farmácia Solidária Lírio dos Vales."*

O campo `consentimento_lgpd = true` é gravado na tabela `solicitacoes` junto com a solicitação. Sem marcar o checkbox, o botão de envio permanece desabilitado — o sistema **não aceita solicitações sem consentimento registrado**.

Como o projeto trata dados pessoais e dados sensíveis relacionados à saúde, a base legal deve ser validada pela liderança responsável e, se necessário, por orientação jurídica. Para a v1, o sistema exigirá consentimento explícito do titular antes do envio da solicitação e limitará o uso dos dados à análise e atendimento da solicitação.

---

## Acesso administrativo

Na v1, o acesso administrativo é de **nível único**: todas as pessoas autenticadas têm as mesmas permissões. Isso é adequado para a configuração atual (3 a 4 pessoas com funções claras e alinhadas entre si: farmacêutica responsável, pastor e voluntários).

**Autenticação:** Supabase Auth com email e senha. Nenhum OAuth externo.

**Contas admin:** criadas manualmente via dashboard do Supabase ou script. Nenhum formulário de cadastro público para acesso admin.

**Sessão:** gerenciada pelo Supabase Auth via cookies HttpOnly. O middleware Next.js verifica a sessão em cada requisição a rotas `/admin/*`.

**Para a v2:** implementar perfis (Admin geral / Farmacêutico / Voluntário) com permissões diferenciadas. O campo `role` pode ser adicionado à tabela de usuários sem quebrar a v1.

---

## Retenção de receitas médicas

As receitas médicas são armazenadas no bucket `receitas` do Supabase Storage.

**Política de retenção (v1):**
- Receitas de solicitações **entregues**: manter por 12 meses após a data de entrega, depois excluir manualmente
- Receitas de solicitações **recusadas ou canceladas**: excluir após 90 dias
- Na v1, a exclusão é **manual** pela equipe
- Na v2: implementar job automático de exclusão por idade do arquivo

**Regras adicionais:**
- Toda exclusão manual de receita deve gerar log de auditoria
- Receitas excluídas não devem permanecer acessíveis por URL assinada antiga
- URL assinada expirada não deve permitir novo acesso
- Para ver uma receita novamente, é necessário gerar uma nova URL assinada com novo log de auditoria

**Registro de acesso:** toda vez que um admin visualiza uma receita, um log é criado em `logs_auditoria` com `acao = 'visualizou_receita'`, `entidade = 'solicitacoes'` e `entidade_id` correspondente.

---

## Exclusão de dados de beneficiários

A v1 não prevê mecanismo automático de exclusão de dados de beneficiários. Se um beneficiário solicitar a exclusão dos seus dados (direito do titular, Art. 18, VI da LGPD), a equipe deve avaliar o caso antes de executar qualquer remoção.

**Diretriz operacional para a v1:**
1. A equipe avalia a solicitação do titular
2. Quando possível, anonimiza dados pessoais, mantendo registros operacionais mínimos necessários
3. Se a exclusão for necessária, remove também receitas médicas associadas do bucket `receitas`
4. A ação é registrada em `logs_auditoria`
5. A equipe evita exclusões que quebrem integridade referencial sem cuidado técnico

> Para a v2: implementar fluxo de exclusão a pedido dentro do próprio painel admin.

---

## Bucket privado (Supabase Storage)

O bucket `receitas` é configurado com:

```
Acesso público: DESABILITADO
Política: somente service_role pode fazer upload e ler
```

**O que isso significa na prática:**
- Acessar a URL base do arquivo sem autenticação retorna HTTP 403
- Não há URL pública que possa ser compartilhada ou descoberta
- O upload é feito apenas via API Route server-side usando `lib/supabase/admin.ts`
- O único acesso é via **URL assinada temporária**, gerada sob demanda para admin autenticado

---

## URL assinada para receitas

Quando um admin clica em "Ver receita" no detalhe de uma solicitação:

1. O frontend chama `GET /api/receitas/[solicitacaoId]` com sessão admin válida
2. A API Route valida a sessão antes de gerar qualquer URL
3. Usa `service_role` via `lib/supabase/admin.ts` para gerar uma URL assinada com expiração de **60 minutos**
4. Registra log de auditoria: `visualizou_receita`
5. Retorna a URL assinada para o frontend
6. O frontend abre a URL em nova aba

A URL assinada é válida por apenas 60 minutos. Após esse período, ela expira e não pode ser reutilizada. Para ver novamente, é necessário gerar uma nova URL (novo log de auditoria).

---

## Service Role Key do Supabase

A `SUPABASE_SERVICE_ROLE_KEY` tem acesso irrestrito ao banco, ignorando todas as políticas RLS. Por isso:

**Regras invioláveis:**
- A `service_role` key **nunca** vai para o frontend (bundle client-side)
- A `service_role` key **não pode** ser prefixada com `NEXT_PUBLIC_`
- O arquivo `lib/supabase/admin.ts` **nunca** deve ser importado em Client Components
- É usada **somente** em:
  - API Routes do Next.js (server-side)
  - Jobs do n8n (server-side)
  - Scripts confiáveis de manutenção
  - Dashboard administrativo do Supabase (fora do código)
- É armazenada como variável de ambiente no Vercel (não exposta em repositório)
- O arquivo `.env.local` está no `.gitignore` e nunca é commitado

**Como verificar:** abrir o DevTools do browser → aba Network → inspecionar qualquer requisição — a `service_role` key nunca deve aparecer.

---

## Row Level Security (RLS)

O RLS do Supabase reduz o risco de exposição indevida caso uma query seja executada a partir do client. Mesmo assim, a decisão da v1 é evitar leitura pública direta em tabelas sensíveis e centralizar operações públicas em API Routes server-side.

### Políticas por tabela

| Tabela | Leitura pública (anon) | Escrita pública (anon) | Leitura admin | Escrita admin |
|---|---|---|---|---|
| `medicamentos` | ❌ — consulta pública somente via API Route ou view pública segura | ❌ | ✅ | ✅ |
| `lotes` | ❌ | ❌ | ✅ | ✅ |
| `beneficiarios` | ❌ | ❌ — escrita somente via API Route server-side com `admin.ts` | ✅ | ✅ |
| `solicitacoes` | ❌ | ❌ — escrita somente via API Route server-side com `admin.ts` | ✅ | ✅ |
| `estoque_movimentacoes` | ❌ | ❌ | ✅ | ✅ |
| `configuracoes` | ❌ | ❌ | ✅ | ✅ |
| `logs_auditoria` | ❌ | ❌ | ✅ (se houver tela de auditoria) | Somente service_role |

> **Por que `beneficiarios` e `solicitacoes` não têm INSERT público direto?**
> Porque o formulário público envia dados para **API Routes** do Next.js. Essas rotas validam os dados e gravam no banco server-side usando `lib/supabase/admin.ts`. O frontend nunca escreve diretamente com a anon key nessas tabelas.

---

## Consulta pública de medicamentos

A consulta pública de medicamentos é feita pela rota `GET /api/medicamentos`.

**Decisão técnica:**
- A rota é uma API Route server-side
- Não há SELECT público direto nas tabelas `medicamentos` ou `lotes`
- A rota calcula a disponibilidade considerando lotes ativos, validade e reservas ativas
- Medicamentos com `controlado = true` não são retornados

**Retorno permitido:**

```typescript
{
  id: string,
  nome_comercial: string,
  principio_ativo: string,
  dosagem: string,
  forma_farmaceutica: string,
  disponivel: boolean
}
```

**O retorno nunca inclui:**
- quantidade
- número do lote
- validade
- doador
- CPF
- dados de beneficiário
- dados de solicitação

---

## Proteção de webhooks

Os webhooks recebidos do n8n são protegidos por token secreto:

**Fluxo:**
1. n8n envia `POST /api/webhooks/n8n` com header `Authorization: Bearer {N8N_WEBHOOK_SECRET}`
2. A API Route valida o token antes de processar qualquer payload
3. Token inválido ou ausente → retorna HTTP 401 imediatamente
4. Token válido → processa o evento e registra ação

**Configuração:**
- O `N8N_WEBHOOK_SECRET` é gerado aleatoriamente (mínimo 32 caracteres)
- Armazenado como variável de ambiente no Vercel e no n8n
- Nunca commitado no repositório
- URLs e tokens de webhook não aparecem no frontend nem em logs públicos
- Mensagens de WhatsApp não devem incluir CPF, endereço completo ou dados sensíveis desnecessários

---

## Logs de auditoria

A tabela `logs_auditoria` registra todas as ações críticas do sistema.

### Ações registradas

| Ação | Quando ocorre |
|---|---|
| `visualizou_receita` | Admin abre a receita de uma solicitação |
| `aprovou_solicitacao` | Admin aprova uma solicitação |
| `recusou_solicitacao` | Admin recusa uma solicitação |
| `cancelou_solicitacao` | Admin cancela uma solicitação |
| `marcou_entregue` | Admin marca solicitação como entregue |
| `registrou_entrada_lote` | Admin registra novo lote no estoque |
| `descartou_lote` | Admin marca lote como descartado |
| `alterou_medicamento` | Admin edita dados de um medicamento |
| `alterou_configuracao` | Admin altera parâmetros em `/admin/configuracoes` |
| `excluiu_receita` | Admin exclui manualmente uma receita do Storage |

### Dados gravados

```typescript
{
  usuario_id: string,         // ID do admin autenticado
  acao: string,               // nome da ação (ver tabela acima)
  entidade: string,           // nome da tabela envolvida
  entidade_id: string,        // ID do registro afetado
  dados_anteriores: object?,  // estado antes (quando aplicável)
  dados_novos: object?,       // estado depois (quando aplicável)
  created_at: timestamp       // gerado automaticamente
}
```

Os logs **não podem ser editados ou deletados** por admins comuns — apenas via `service_role` ou diretamente no dashboard do Supabase por quem tem acesso técnico ao projeto.

---

## Checklist de verificação pré-deploy

### Dados e acesso

- [ ] `SUPABASE_SERVICE_ROLE_KEY` não aparece no bundle client (DevTools → Network)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` não usa prefixo `NEXT_PUBLIC_`
- [ ] `lib/supabase/admin.ts` não é importado em nenhum Client Component
- [ ] `GET /api/medicamentos` não retorna CPF, lote, validade, quantidade, doador, dados de beneficiário ou dados de solicitação
- [ ] `POST /api/beneficiarios/verificar` com dados sem correspondência retorna mensagem genérica
- [ ] Não existe endpoint `GET /api/beneficiarios?cpf=` que retorne dados com apenas o CPF
- [ ] Acesso direto ao bucket de receitas retorna 403
- [ ] RLS bloqueia SELECT em `beneficiarios` via anon key
- [ ] RLS bloqueia SELECT em `solicitacoes` via anon key
- [ ] RLS bloqueia SELECT em `lotes` via anon key

### Consentimento e LGPD

- [ ] Checkbox de consentimento é obrigatório no formulário
- [ ] `consentimento_lgpd = true` é gravado em todas as solicitações enviadas
- [ ] Não existe solicitação no banco com `consentimento_lgpd = false` (verificar via dashboard Supabase)

### Auditoria

- [ ] Toda aprovação gera log em `logs_auditoria`
- [ ] Toda recusa gera log em `logs_auditoria`
- [ ] Todo cancelamento gera log em `logs_auditoria`
- [ ] Todo acesso a receita gera log em `logs_auditoria`
- [ ] Toda exclusão de receita gera log em `logs_auditoria`
- [ ] Os logs incluem `usuario_id` correto do admin

### Webhooks

- [ ] Webhook sem token retorna 401
- [ ] Webhook com token correto processa normalmente
- [ ] Nenhum token está hardcoded no código (somente em variáveis de ambiente)
- [ ] Tokens e URLs de webhook não aparecem no frontend nem em logs públicos

### Receitas

- [ ] URL assinada expira em 60 minutos
- [ ] URL assinada após expirar retorna erro de acesso
- [ ] Receita salva no path correto: `receitas/{solicitacao_id}/{timestamp}_{filename}`
- [ ] Receita excluída não permanece acessível por URL assinada antiga
