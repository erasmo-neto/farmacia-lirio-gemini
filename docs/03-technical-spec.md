# 03 — Technical Spec
## Site Institucional + Farmácia Solidária Lírio dos Vales
**Igreja Presbiteriana Lírio dos Vales — Tatuí/SP**
Versão: 1.0 | Data: 2026-05-19

---

## Stack oficial

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR + client components, middleware de auth, API Routes |
| Linguagem | TypeScript | Segurança de tipos no modelo de dados e nas API Routes |
| Estilização | Tailwind CSS + shadcn/ui | Velocidade de desenvolvimento + componentes acessíveis |
| Banco de dados | Supabase (Postgres) | Relacional, RLS nativo, Auth e Storage integrados |
| Autenticação | Supabase Auth | Login admin sem infraestrutura extra |
| Storage | Supabase Storage | Receitas médicas com acesso controlado |
| Notificações | n8n + Evolution API | Stack já existente na IP Lírio dos Vales — sem custo adicional |
| Hospedagem | Vercel | Deploy automático via Git, CDN global, zero config para Next.js |
| Repositório | GitHub | Controle de versão, CI/CD |

---

## Arquitetura geral

Um único projeto Next.js com três zonas de responsabilidade:

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (CDN + Edge)                   │
├─────────────────┬───────────────────┬───────────────────┤
│  /              │  /farmacia/*      │  /admin/*         │
│  Site inst.     │  Área pública     │  Painel admin      │
│  (static/SSR)   │  (SSR + API)      │  (SSR + auth)     │
└────────┬────────┴────────┬──────────┴────────┬──────────┘
         │                 │                    │
         └─────────────────▼────────────────────┘
                    Supabase (Postgres + Auth + Storage)
                           ▲
                     n8n ──┘  (webhooks + Evolution API)
```

**Princípios arquiteturais:**
- Nenhuma `service_role` key do Supabase vai pro client — apenas em API Routes server-side
- `anon` key usada apenas onde RLS garante acesso restrito
- Área `/admin/*` protegida por middleware Next.js — sem sessão válida, redireciona para login
- Webhooks do n8n autenticados por token secreto no header `Authorization`

---

## Estrutura de Supabase clients

| Arquivo | Contexto de uso | Chave usada | Regra |
|---|---|---|---|
| `lib/supabase/client.ts` | Browser (Client Components) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Nunca usa `service_role`; respeita RLS |
| `lib/supabase/server.ts` | Server Components, middleware | `NEXT_PUBLIC_SUPABASE_ANON_KEY` + cookies | Lê sessão do usuário; não usa `service_role` |
| `lib/supabase/admin.ts` | API Routes server-side, jobs, scripts | `SUPABASE_SERVICE_ROLE_KEY` | Nunca importado em Client Components; contorna RLS onde necessário |

> `admin.ts` deve ser importado **apenas** em arquivos dentro de `app/api/` ou scripts de manutenção. Qualquer importação em componentes client-side ou em `lib/supabase/client.ts` é um erro de segurança.

---

## Estrutura de pastas (Next.js App Router)

```
/
├── app/
│   ├── layout.tsx                          → Root layout (fonte, meta tags globais)
│   ├── page.tsx                            → Landing page institucional
│   │
│   ├── farmacia/
│   │   ├── page.tsx                        → /farmacia — apresentação + cards
│   │   ├── estoque/
│   │   │   └── page.tsx                    → /farmacia/estoque — consulta pública
│   │   ├── solicitar/
│   │   │   └── page.tsx                    → /farmacia/solicitar — formulário
│   │   └── doar/
│   │       └── page.tsx                    → /farmacia/doar — orientações
│   │
│   ├── admin/
│   │   ├── layout.tsx                      → Layout admin (sidebar + auth guard via middleware)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── estoque/
│   │   │   ├── page.tsx
│   │   │   └── [medicamentoId]/
│   │   │       └── page.tsx
│   │   ├── solicitacoes/
│   │   │   ├── page.tsx
│   │   │   └── [solicitacaoId]/
│   │   │       └── page.tsx
│   │   ├── relatorios/
│   │   │   └── page.tsx
│   │   └── configuracoes/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── beneficiarios/
│       │   ├── route.ts                    → POST criação/atualização de beneficiário via fluxo de solicitação
│       │   └── verificar/
│       │       └── route.ts                → POST confirmação adicional por CPF + últimos 4 dígitos do WhatsApp
│       ├── medicamentos/
│       │   └── route.ts                    → GET público (disponibilidade)
│       ├── solicitacoes/
│       │   └── route.ts                    → POST nova solicitação
│       ├── receitas/
│       │   └── [solicitacaoId]/
│       │       └── route.ts                → GET URL assinada (admin only)
│       └── webhooks/
│           └── n8n/
│               └── route.ts               → POST recebe callbacks n8n
│
├── components/
│   ├── ui/                                 → shadcn/ui (button, input, card, etc.)
│   ├── landing/                            → Header, Hero, Sobre, Cremos, Horarios,
│   │                                         Localizacao, Contato, Footer
│   ├── farmacia/                           → CardAcao, BuscaMedicamento,
│   │                                         ResultadoMedicamento, FormSolicitacao,
│   │                                         StepCPF, StepDadosPessoais, StepMedicamento
│   └── admin/                              → Sidebar, CardResumo, AlertasValidade,
│                                             TabelaMedicamentos, LotesMedicamento,
│                                             ModalEntradaLote, TabelaSolicitacoes,
│                                             DetalheSolicitacao, GraficoBarras,
│                                             GraficoRosca, RankingMedicamentos,
│                                             FeedAtividade
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       → createBrowserClient (anon key — browser only)
│   │   ├── server.ts                       → createServerClient (anon key + cookies — Server Components e middleware)
│   │   └── admin.ts                        → createClient com service_role — somente API Routes server-side e jobs
│   ├── auditoria.ts                        → helper logAuditoria()
│   └── utils.ts
│
├── middleware.ts                           → Proteção de /admin/* via Supabase Auth
└── supabase/
    ├── migrations/
    │   ├── 001_initial_schema.sql
    │   ├── 002_rls_policies.sql
    │   └── 003_views_and_functions.sql
    └── seed.sql
```

---

## Modelo de dados Supabase

### Tabela `medicamentos` — cadastro base (uma vez por medicamento)

```sql
CREATE TABLE medicamentos (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_comercial      TEXT NOT NULL,
  principio_ativo     TEXT NOT NULL,
  dosagem             TEXT NOT NULL,
  unidade             TEXT NOT NULL,           -- "cx c/10 cp", "comprimido", "ml"
  categoria           TEXT,                    -- "anti-hipertensivo", "analgésico"
  forma_farmaceutica  TEXT,                    -- "comprimido", "xarope", "pomada"
  exige_receita       BOOLEAN DEFAULT FALSE,
  controlado          BOOLEAN DEFAULT FALSE,   -- bloqueia solicitação + doação
  manipulado          BOOLEAN DEFAULT FALSE,   -- bloqueia doação
  termolabil          BOOLEAN DEFAULT FALSE,   -- bloqueia doação
  estoque_minimo      INT DEFAULT 0,
  ativo               BOOLEAN DEFAULT TRUE,
  observacoes         TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela `lotes` — entradas vinculadas ao medicamento base

```sql
CREATE TABLE lotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicamento_id  UUID NOT NULL REFERENCES medicamentos(id),
  lote            TEXT NOT NULL,
  validade        DATE NOT NULL,
  quantidade      INT NOT NULL CHECK (quantidade >= 0),
  data_entrada    DATE NOT NULL DEFAULT CURRENT_DATE,
  parceiro_doador TEXT,
  status          TEXT DEFAULT 'ativo'
                  CHECK (status IN ('ativo','vencido','descartado','bloqueado')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

> Separação intencional: `medicamentos` é cadastrado uma vez. Cada nova doação cria um `lote` vinculado, reduzindo o trabalho de entrada num volume alto de doações.

### Tabela `beneficiarios` — cadastro identificado por CPF

```sql
CREATE TABLE beneficiarios (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpf         TEXT UNIQUE NOT NULL,
  nome        TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  endereco    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

> CPF é a chave de reconhecimento. O sistema nunca retorna dados pessoais completos com base apenas no CPF. A rota `POST /api/beneficiarios/verificar` exige CPF + últimos 4 dígitos do WhatsApp como confirmação adicional — se a confirmação bater, os dados podem ser exibidos para revisão e atualização. Se não bater ou se o CPF não existir, o formulário completo é exibido sem revelar o estado do cadastro.

### Tabela `solicitacoes`

```sql
CREATE TABLE solicitacoes (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiario_id    UUID NOT NULL REFERENCES beneficiarios(id),
  tratamento         TEXT NOT NULL,
  medicamento_id     UUID REFERENCES medicamentos(id),  -- null se campo livre
  medicamento_livre  TEXT,                              -- quando não encontrou no estoque
  receita_url        TEXT,                              -- path no Supabase Storage
  status             TEXT DEFAULT 'pendente'
                     CHECK (status IN (
                       'pendente', 'em_analise', 'aguardando_receita',
                       'aprovada', 'reservada', 'entregue', 'recusada', 'cancelada'
                     )),
  lote_id            UUID REFERENCES lotes(id),         -- definido na aprovação (FEFO)
  observacao_admin   TEXT,
  responsavel_id     UUID,                              -- admin que processou
  consentimento_lgpd BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela `estoque_movimentacoes` — rastreabilidade completa

```sql
CREATE TABLE estoque_movimentacoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id         UUID NOT NULL REFERENCES lotes(id),
  tipo            TEXT NOT NULL
                  CHECK (tipo IN (
                    'entrada', 'saida', 'reserva',
                    'cancelamento_reserva', 'descarte', 'ajuste'
                  )),
  quantidade      INT NOT NULL,
  motivo          TEXT,
  solicitacao_id  UUID REFERENCES solicitacoes(id),
  responsavel_id  UUID,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela `configuracoes` — parâmetros ajustáveis sem alterar código

```sql
CREATE TABLE configuracoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave       TEXT UNIQUE NOT NULL,
  valor       TEXT NOT NULL,
  descricao   TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Seed inicial:**

| Chave | Valor padrão | Descrição |
|---|---|---|
| alerta_vermelho_dias | 0 | Vencido |
| alerta_laranja_dias | 30 | Vence em até 30 dias |
| alerta_amarelo_dias | 60 | Vence em até 60 dias |
| endereco_retirada | (vazio) | Exibido na mensagem de aprovação |
| horario_retirada | (vazio) | Horário de atendimento |
| whatsapp_admin | (vazio) | Recebe notificações |
| mensagem_aprovacao | (vazio) | Texto base para WhatsApp de aprovação |
| mensagem_recusa | (vazio) | Texto base para WhatsApp de recusa |

### Tabela `logs_auditoria`

```sql
CREATE TABLE logs_auditoria (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id       UUID,
  acao             TEXT NOT NULL,
  entidade         TEXT NOT NULL,
  entidade_id      UUID,
  dados_anteriores JSONB,
  dados_novos      JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

**Ações que geram log:**
- `visualizou_receita`
- `aprovou_solicitacao`
- `recusou_solicitacao`
- `marcou_entregue`
- `registrou_entrada_lote`
- `descartou_lote`
- `alterou_medicamento`
- `alterou_configuracao`

### View `alertas_validade` (calculada — não tabela)

```sql
CREATE VIEW alertas_validade AS
SELECT
  l.id,
  l.lote,
  l.validade,
  l.quantidade,
  l.parceiro_doador,
  m.nome_comercial,
  m.principio_ativo,
  m.dosagem,
  CASE
    WHEN l.validade < CURRENT_DATE              THEN 'vencido'
    WHEN l.validade <= CURRENT_DATE + 30        THEN 'critico'
    WHEN l.validade <= CURRENT_DATE + 60        THEN 'atencao'
  END AS criticidade
FROM lotes l
JOIN medicamentos m ON m.id = l.medicamento_id
WHERE l.status = 'ativo'
  AND l.validade <= CURRENT_DATE + 60
ORDER BY l.validade ASC;
```

> Na v2, os prazos 30 e 60 podem ser lidos dinamicamente da tabela `configuracoes`.

---

## Supabase Auth

- Provedor: email + senha (nenhum OAuth necessário na v1)
- Apenas admins têm conta — usuários criados manualmente via dashboard Supabase ou script
- Nível único de acesso na v1 — adequado para uma equipe de 3 a 4 pessoas alinhadas
- Proteção de `/admin/*` via `middleware.ts`:

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // verifica sessão
    // sem sessão: redireciona para /admin/login
  }
}
```

---

## Supabase Storage

```
Bucket: receitas
  Acesso público: DESABILITADO
  Upload: somente via API Route server-side — usa lib/supabase/admin.ts (service_role nunca exposta ao client)
  Path: receitas/{solicitacao_id}/{timestamp}_{filename}
  Tipos aceitos: image/jpeg, image/png, application/pdf
  Tamanho máximo: 10MB
  URL assinada: expira em 60 minutos, gerada sob demanda pelo admin
  Retenção:
    - Solicitações entregues: manter receita por 12 meses após a entrega
    - Solicitações recusadas ou canceladas: excluir receita após 90 dias
    - v1: exclusão manual pela equipe
    - v2: job automático
```

---

## Middleware de proteção do admin

O `middleware.ts` intercepta toda requisição para `/admin/*`.
Se não houver sessão Supabase Auth válida: redireciona para `/admin/login`.
Não há nenhuma referência ao endpoint `/admin` no menu público.

---

## API Routes (Next.js)

| Rota | Método | Auth | Descrição |
|---|---|---|---|
| /api/medicamentos | GET | anon | Disponibilidade pública (sem qtd, sem lote) |
| /api/beneficiarios/verificar | POST | público sem login | Confirmação adicional por CPF + últimos 4 dígitos do WhatsApp |
| /api/beneficiarios | POST | público sem login | Criação/atualização de beneficiário via fluxo de solicitação |
| /api/solicitacoes | POST | público sem login | Nova solicitação + upload receita |
| /api/receitas/[id] | GET | admin | Gera URL assinada temporária |
| /api/webhooks/n8n | POST | token | Recebe callbacks do n8n |

---

## Webhooks n8n

Todos os webhooks são autenticados via header:
```
Authorization: Bearer {N8N_WEBHOOK_SECRET}
```

O Next.js valida o token antes de processar qualquer payload.

### Workflow 1 — Nova solicitação → WhatsApp admin
```
Trigger: POST /api/webhooks/n8n com { tipo: "nova_solicitacao", ... }
Ação n8n: Evolution API → whatsapp_admin
Mensagem: "💊 Nova solicitação de {nome} para {medicamento}. Acesse o painel."
```

### Workflow 2 — Aprovação → WhatsApp beneficiário
```
Trigger: POST /api/webhooks/n8n com { tipo: "aprovada", ... }
Ação n8n: Evolution API → beneficiario.whatsapp
Mensagem: mensagem_aprovacao + endereco_retirada + horario_retirada
```

### Workflow 3 — Recusa → WhatsApp beneficiário
```
Trigger: POST /api/webhooks/n8n com { tipo: "recusada", ... }
Ação n8n: Evolution API → beneficiario.whatsapp
Mensagem: mensagem_recusa + observacao_admin
```

### Workflow 4 — Job diário de vencimento
```
Trigger: Cron — todos os dias às 8h
Ação: Consulta view alertas_validade WHERE criticidade IN ('vencido','critico')
Se houver resultados: Evolution API → whatsapp_admin com lista formatada
```

---

## Regras de segurança (Row Level Security)

| Tabela | SELECT público | INSERT/UPDATE/DELETE |
|---|---|---|
| medicamentos | nenhum SELECT público direto — consulta pública via API Route ou view pública segura (somente campos básicos) | somente admin |
| lotes | nenhum SELECT público direto | somente admin / service_role |
| beneficiarios | nenhum | escrita somente via API Route server-side usando service_role (admin.ts) |
| solicitacoes | nenhum | escrita somente via API Route server-side usando service_role (admin.ts) |
| estoque_movimentacoes | nenhum | somente admin |
| configuracoes | nenhum | somente admin |
| logs_auditoria | nenhum | somente service_role |

**Regras adicionais:**
- CPF nunca retornado em queries públicas
- Receitas acessíveis somente via API Route com sessão admin ativa
- `service_role` usada apenas em API Routes — nunca exposta no bundle do client

---

## Como a reserva afeta a disponibilidade pública

Quando um admin aprova uma solicitação, o sistema cria uma movimentação do tipo `reserva` — mas **não decrementa imediatamente** a `quantidade` do lote. A quantidade física só é decrementada quando o status muda para `entregue` (movimentação `saida`).

A **disponibilidade pública** é calculada dinamicamente na API `/api/medicamentos` (GET):

```sql
-- Um medicamento aparece como "Disponível" se:
SELECT EXISTS (
  SELECT 1 FROM lotes l
  WHERE l.medicamento_id = $1
    AND l.status = 'ativo'
    AND l.validade >= CURRENT_DATE
    AND (
      l.quantidade - COALESCE(reservas_ativas, 0) > 0
    )
)
```

Onde `reservas_ativas` é a soma das movimentações de `reserva` ainda não convertidas em `saida` ou `cancelamento_reserva`.

**Isso garante que:**
- Um medicamento com todas as unidades reservadas aparece como "Indisponível" para novos beneficiários
- A reserva é automaticamente liberada se a solicitação for recusada ou cancelada (movimentação `cancelamento_reserva`)
- A quantidade física só cai no ato da entrega

---

## Alertas de validade: view SQL vs configurações

**Por que há uma tensão aqui?**

A view `alertas_validade` usa valores fixos de 30 e 60 dias no SQL (`CURRENT_DATE + 30`). A tabela `configuracoes` tem `alerta_laranja_dias` e `alerta_amarelo_dias` como parâmetros editáveis. Isso pode gerar inconsistência se um admin alterar os prazos nas configurações.

**Decisão para a v1:**

A view SQL usa os **valores padrão fixos** (30 e 60 dias) para simplificar. As configurações `alerta_laranja_dias` e `alerta_amarelo_dias` são usadas **apenas no frontend** do dashboard — para colorir os alertas e nos jobs do n8n. A view em si não lê da tabela `configuracoes`.

**Na prática:**

```
View SQL (alertas_validade):
  → Filtra lotes com validade <= CURRENT_DATE + 60 (fixo)
  → Calcula criticidade com 30/60 dias fixos

Frontend /admin/dashboard:
  → Lê configuracoes.alerta_laranja_dias e alerta_amarelo_dias
  → Usa esses valores para colorir e filtrar os alertas vindos da view
  → Se admin mudar para 45 dias, a cor muda, mas a view ainda traz todos até 60

n8n job diário:
  → Lê configuracoes.alerta_laranja_dias para saber quantos dias usar no filtro
  → Consulta Supabase com esse valor dinâmico
```

**Na v2:** a view pode ser substituída por uma função SQL que lê `configuracoes` dinamicamente.

---

## Variáveis de ambiente (detalhadas)

### Next.js / Vercel

```env
# Supabase — expostas ao browser (seguras — anon key tem RLS)
NEXT_PUBLIC_SUPABASE_URL=https://[projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Supabase — somente server-side (NUNCA no bundle do client)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# n8n — somente server-side
N8N_WEBHOOK_SECRET=token-secreto-gerado-aleatoriamente
N8N_NOVA_SOLICITACAO_URL=https://[n8n]/webhook/nova-solicitacao
N8N_APROVACAO_URL=https://[n8n]/webhook/aprovacao
N8N_RECUSA_URL=https://[n8n]/webhook/recusa

# App
NEXT_PUBLIC_APP_URL=https://liriodosvalestatu.com.br
```

> As URLs dos webhooks do n8n são separadas por tipo de evento para facilitar a manutenção dos workflows.

### n8n (variáveis internas dos workflows)

```
EVOLUTION_API_URL=https://[evolution-api]/
EVOLUTION_API_KEY=[chave da instância]
EVOLUTION_INSTANCE_NAME=[nome da instância WhatsApp]
SUPABASE_URL=https://[projeto].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  (para o job diário de vencimento)
WEBHOOK_SECRET=[mesmo token do Next.js]
```

> O job diário do n8n precisa de acesso ao Supabase com `service_role` para consultar a view `alertas_validade` sem restrição de RLS.

---

## Garantias de privacidade dos dados públicos

O sistema **nunca expõe** ao público os seguintes dados, independentemente da rota ou query:

| Dado | Medida de proteção |
|---|---|
| CPF do beneficiário | Não retornado em nenhuma query pública; só acessível por admin |
| Nome e WhatsApp do beneficiário | Tabela `beneficiarios` sem SELECT público no RLS |
| Endereço do beneficiário | Idem acima |
| Receita médica | Somente URL assinada via API Route autenticada |
| Detalhes de solicitações | Tabela `solicitacoes` sem SELECT público |
| Quantidade por lote | API pública retorna apenas `disponivel: boolean` |
| Nome do doador | Não exposto na consulta pública |
| Número do lote | Não exposto na consulta pública |
| Data de validade por lote | Não exposta na consulta pública |

**Consulta pública de medicamentos (`GET /api/medicamentos`):**
```typescript
// O que retorna para o público:
{
  id: string,
  nome_comercial: string,
  principio_ativo: string,
  dosagem: string,
  forma_farmaceutica: string,
  disponivel: boolean  // calculado, não armazenado
}
// Nada mais.
```

---

## Lógica FEFO (First Expire, First Out)

Na tela de aprovação:
1. Busca todos os lotes com `status = 'ativo'` e `quantidade > 0` do medicamento
2. Ordena por `validade ASC`
3. Sugere o primeiro automaticamente
4. Admin pode alterar se necessário
5. Na aprovação: registra `lote_id` na solicitação e cria movimentação `reserva`
6. Na entrega: cria movimentação `saida` e decrementa `quantidade` do lote

---

## Regras de validação

### Entrada de medicamento no estoque
```
controlado = true  → BLOQUEAR + mensagem: "Medicamento controlado não aceito"
manipulado = true  → BLOQUEAR + mensagem: "Medicamentos manipulados não são aceitos"
termolabil = true  → BLOQUEAR + mensagem: "Medicamento termolábil não pode ser armazenado"
validade passada   → BLOQUEAR + mensagem: "Este lote está vencido e não pode ser cadastrado no estoque da Farmácia Solidária."
próximo do venc.   → ALERTA visual (laranja/amarelo) — permite confirmação consciente do admin
```

### Solicitação pública
```
controlado = true         → Medicamento não aparece na consulta pública
exige_receita = true      → Campo de upload obrigatório no formulário
consentimento_lgpd = false → Botão de envio desabilitado
```
