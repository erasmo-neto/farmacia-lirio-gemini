# Implementation Plan: Site Institucional + Farmácia Solidária
**IP Lírio dos Vales — Tatuí/SP**
Versão: 1.0 | Data: 2026-05-19

---

## Princípio de Execução

> **Uma fase por sessão. Uma tarefa por vez.**
> Cada tarefa é autocontida e verificável. Não avance para a próxima sem confirmar
> o critério de sucesso da anterior.
>
> **Protocolo por tarefa:**
> 1. Ler os documentos indicados em "Arquivo de entrada" antes de qualquer código
> 2. Implementar somente o descrito — nada além
> 3. Ao concluir, listar todos os arquivos criados ou alterados
> 4. Informar como o humano pode verificar a entrega (onde acessar, o que conferir)
> 5. Aguardar confirmação explícita antes de avançar
>
> Prompt padrão de início de sessão:
> *"Leia os documentos da pasta /docs. Execute apenas a Fase X, Tarefa Y.
> Não implemente nada além do descrito."*

---

## Visão das Fases

```
Fase 0  — Setup do projeto
Fase 1  — Landing page institucional
Fase 2  — Páginas públicas da farmácia (com dados mockados)
Fase 3  — Schema e banco de dados (Supabase)
Fase 4  — Autenticação admin
Fase 5  — CRUD de medicamentos e lotes
Fase 6  — Fluxo de solicitação pública
Fase 7  — Painel de solicitações e aprovação
Fase 8  — Dashboard e alertas
Fase 9  — Integrações n8n + WhatsApp
Fase 10 — LGPD, auditoria e segurança
Fase 11 — Testes, deploy e treinamento
```

---

## FASE 0 — Setup do Projeto

**Objetivo:** Repositório configurado, dependências instaladas, estrutura de pastas pronta. Zero funcionalidade ainda.

---

### Tarefa 0.1 — Criar projeto Next.js

```
[ ] Tarefa 0.1: Criar projeto Next.js com TypeScript e App Router

O que precisa ser feito:
- npx create-next-app@latest farmacia-lirio --typescript --tailwind --app
- Instalar shadcn/ui e inicializar
- Instalar dependências: @supabase/supabase-js @supabase/ssr
- Criar estrutura de pastas conforme technical spec
- Criar os três clients Supabase:
  - lib/supabase/client.ts  → createBrowserClient com NEXT_PUBLIC_SUPABASE_ANON_KEY (browser only)
  - lib/supabase/server.ts  → createServerClient com anon key + cookies (Server Components e middleware)
  - lib/supabase/admin.ts   → createClient com SUPABASE_SERVICE_ROLE_KEY (somente API Routes, jobs e scripts — nunca importar em componentes client-side)
- Configurar .env.local e .env.example com todas as variáveis abaixo
- Adicionar .env.local ao .gitignore

.env.example:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
N8N_WEBHOOK_SECRET=
N8N_NOVA_SOLICITACAO_URL=
N8N_APROVACAO_URL=
N8N_RECUSA_URL=
NEXT_PUBLIC_APP_URL=

Arquivo de entrada:
- 03-technical-spec.md (seção "Estrutura de pastas" e "Supabase clients")

Arquivo de saída:
- Repositório GitHub criado e com primeiro commit

Como verificar sucesso:
☑ npm run dev roda sem erro
☑ Estrutura de pastas existe conforme spec
☑ lib/supabase/client.ts, server.ts e admin.ts existem e estão corretos
☑ .env.example tem todas as 8 variáveis listadas acima
☑ .env.local não está no repositório
☑ shadcn/ui instalado e funcionando

Estimativa: 1h
```

---

### Tarefa 0.2 — Configurar Tailwind com brand guidelines

```
[ ] Tarefa 0.2: Configurar cores da IP Lírio dos Vales no Tailwind

O que precisa ser feito:
- Adicionar paleta de cores ao tailwind.config.ts:
  dark-teal: #1A3A3A / #1C3D3D
  mid-teal:  #2D5A5A
  accent-teal: #547473
  gold: #B8963E / #C9973E
- Configurar fonte padrão (sugestão: Inter via Google Fonts)
- Criar componente primitivo de teste para validar a paleta

Arquivo de entrada:
- 03-technical-spec.md (seção "Identidade Visual")

Arquivo de saída:
- tailwind.config.ts atualizado
- Componente /components/ui/brand-preview.tsx (só pra validar, pode deletar depois)

Como verificar sucesso:
☑ Classe bg-dark-teal funciona no browser
☑ Classe text-gold funciona no browser
☑ Fonte está carregando corretamente

Estimativa: 30min
```

---

## FASE 1 — Landing Page Institucional

**Objetivo:** Site da igreja funcionando, responsivo, com todas as seções. Sem conexão com banco ainda.

---

### Tarefa 1.1 — Estrutura e header da landing page

```
[ ] Tarefa 1.1: Header com navegação e hero section

O que precisa ser feito:
- Componente Header com logo IP Lírio dos Vales e links âncora
- Hero section com nome da igreja, versículo e CTA
- Responsivo (mobile-first)
- Logo transparente com máscara de pixels escuros → alpha=0

Arquivo de entrada:
- 01-product-spec.md
- 03-technical-spec.md (identidade visual)
- Logo da IP Lírio dos Vales

Arquivo de saída:
- /components/landing/Header.tsx
- /components/landing/Hero.tsx

Como verificar sucesso:
☑ Logo aparece corretamente (sem fundo preto)
☑ Links âncora funcionam no mobile e desktop
☑ Responsividade OK (teste em 375px e 1280px)

Estimativa: 2h
```

---

### Tarefa 1.2 — Seções de conteúdo

```
[ ] Tarefa 1.2: Seções Sobre, Cremos, Horários, Localização e Contato

O que precisa ser feito:
- Seção #sobre: texto "Quem Somos" com foto ou ilustração
- Seção #cremos: lista dos pilares doutrinários
- Seção #horarios: tabela de cultos e encontros
- Seção #localizacao: endereço + embed Google Maps
- Seção #contato: botão WhatsApp + email
- Footer com informações básicas

Arquivo de entrada:
- Conteúdo textual fornecido por Erasmo (a confirmar)
- 01-product-spec.md

Arquivo de saída:
- /components/landing/Sobre.tsx
- /components/landing/Cremos.tsx
- /components/landing/Horarios.tsx
- /components/landing/Localizacao.tsx
- /components/landing/Contato.tsx
- /components/landing/Footer.tsx

Como verificar sucesso:
☑ Todas as seções estão visíveis e com conteúdo
☑ Âncoras de navegação chegam na seção certa
☑ Google Maps carrega no embed
☑ Botão WhatsApp abre wa.me corretamente
☑ Responsivo em mobile

Estimativa: 3h
```

---

## FASE 2 — Páginas Públicas da Farmácia (dados mockados)

**Objetivo:** Todas as páginas públicas da farmácia funcionando com dados estáticos. Sem banco ainda.

---

### Tarefa 2.1 — Página /farmacia com cards

```
[ ] Tarefa 2.1: Página principal da farmácia com cards Solicitar e Doar

O que precisa ser feito:
- Texto de apresentação do projeto Farmácia Solidária
- Dois cards com botão:
  - "Solicitar medicamento" (botão "Ver disponibilidade") → /farmacia/estoque
  - "Doar medicamentos" (botão "Quero doar") → /farmacia/doar
- O card "Solicitar" nunca aponta direto para /farmacia/solicitar — a consulta ao estoque é etapa obrigatória
- Visual alinhado com brand guidelines

Arquivo de entrada:
- 00-design-brainstorming.md (seção consulta pública)
- 01-product-spec.md

Arquivo de saída:
- /app/farmacia/page.tsx
- /components/farmacia/CardAcao.tsx

Como verificar sucesso:
☑ Dois cards visíveis com botões funcionando
☑ Navegação para as rotas corretas
☑ Responsivo

Estimativa: 1h
```

---

### Tarefa 2.2 — Página /farmacia/estoque

```
[ ] Tarefa 2.2: Consulta pública de estoque com dados mockados

O que precisa ser feito:
- Campo de busca por nome ou princípio ativo
- Lista de resultados mostrando apenas: nome + princípio ativo + dosagem + [✅ Disponível / ❌ Indisponível]
- Botão "Solicitar" apenas nos disponíveis → /farmacia/solicitar?medicamentoId=...
- Mensagem "Não encontrei o medicamento" com botão "Enviar mesmo assim" → /farmacia/solicitar?livre=true
- Dados mockados (array estático) — sem Supabase ainda

Arquivo de entrada:
- 00-design-brainstorming.md (seção "Consulta Pública de Estoque")

Arquivo de saída:
- /app/farmacia/estoque/page.tsx
- /components/farmacia/BuscaMedicamento.tsx
- /components/farmacia/ResultadoMedicamento.tsx
- /lib/mocks/medicamentos.ts

Como verificar sucesso:
☑ Busca filtra resultados em tempo real
☑ Mostra apenas disponível/indisponível (sem quantidade)
☑ Botão Solicitar aparece só nos disponíveis e navega para /farmacia/solicitar?medicamentoId=...
☑ Botão "Enviar mesmo assim" navega para /farmacia/solicitar?livre=true
☑ Mensagem de "não encontrei" aparece quando busca não retorna resultado

Estimativa: 2h
```

---

### Tarefa 2.3 — Página /farmacia/solicitar

```
[ ] Tarefa 2.3: Formulário de solicitação (mock — sem envio real)

O que precisa ser feito:
- Passo 1 — Identificação segura: campos CPF + últimos 4 dígitos do WhatsApp, botão "Continuar"
- Passo 2 — Confirmação positiva (mock): dados existentes exibidos para revisão e atualização
  Passo 2 — Confirmação sem correspondência (mock): campos nome, WhatsApp, endereço em branco
  Em ambos os casos o usuário pode preencher ou atualizar livremente — sem expor se o CPF existe
- Campo de medicamento (busca no estoque OU campo livre)
- Upload de receita (obrigatório/opcional conforme mock)
- Checkbox de consentimento LGPD
- Tela de confirmação pós-envio
- Sem envio real para Supabase ainda (só console.log)

Arquivo de entrada:
- 00-design-brainstorming.md (Fluxo 1 — Solicitação pública)
- 03-technical-spec.md (Validações)

Arquivo de saída:
- /app/farmacia/solicitar/page.tsx
- /components/farmacia/FormSolicitacao.tsx
- /components/farmacia/StepCPF.tsx
- /components/farmacia/StepDadosPessoais.tsx
- /components/farmacia/StepMedicamento.tsx

Como verificar sucesso:
☑ Fluxo de 3 passos funciona (CPF → dados → medicamento)
☑ Upload de arquivo funciona (sem enviar ainda)
☑ Checkbox LGPD obrigatório
☑ Tela de confirmação aparece ao submeter
☑ Responsivo — funciona bem no celular

Estimativa: 3h
```

---

### Tarefa 2.4 — Página /farmacia/doar

```
[ ] Tarefa 2.4: Página de orientações para doadores

O que precisa ser feito:
- Explicação do projeto e impacto das doações
- Lista clara do que NÃO é aceito: controlados, manipulados, termolábeis, vencidos, embalagem violada
- Lista do que é aceito: amostras lacradas, caixas lacradas
- Endereço e horário de entrega (dados mockados por enquanto)
- Botão de contato WhatsApp para dúvidas

Arquivo de entrada:
- 00-design-brainstorming.md (Fluxo 5)

Arquivo de saída:
- /app/farmacia/doar/page.tsx

Como verificar sucesso:
☑ Restrições estão explícitas e visíveis
☑ Tom é acolhedor, não burocrático
☑ Responsivo

Estimativa: 1h
```

---

## FASE 3 — Schema e Banco de Dados

**Objetivo:** Supabase configurado com todas as tabelas, RLS e dados de seed.

---

### Tarefa 3.1 — Criar projeto Supabase e migrations

```
[ ] Tarefa 3.1: Setup Supabase e migrations do schema completo

O que precisa ser feito:
- Criar projeto no Supabase
- Criar todas as tabelas conforme 03-technical-spec.md
- Configurar RLS em todas as tabelas com as seguintes políticas:
  - medicamentos: sem SELECT público direto; consulta pública somente via API Route ou view segura que expõe apenas campos básicos
  - lotes: sem SELECT público direto; dados agregados somente via API Route server-side
  - beneficiarios: sem SELECT público; escrita somente via API Route server-side usando lib/supabase/admin.ts
  - solicitacoes: sem SELECT público; escrita somente via API Route server-side usando lib/supabase/admin.ts
  - estoque_movimentacoes, configuracoes, logs_auditoria: sem acesso público
- Criar view alertas_validade
- Inserir seed de configuracoes
- Testar inserção manual de 2-3 medicamentos e lotes

Arquivo de entrada:
- 03-technical-spec.md (Schema completo)

Arquivo de saída:
- /supabase/migrations/001_initial_schema.sql
- /supabase/migrations/002_rls_policies.sql
- /supabase/migrations/003_views.sql
- /supabase/seed.sql

Como verificar sucesso:
☑ Todas as tabelas existem no dashboard Supabase
☑ RLS habilitado em cada tabela
☑ SELECT direto em beneficiarios e solicitacoes com anon key retorna vazio ou erro
☑ View alertas_validade retorna dados corretamente
☑ Insert de medicamento via painel Supabase funciona
☑ Seed de configuracoes inserido

Estimativa: 2h
```

---

### Tarefa 3.2 — Bucket de receitas no Storage

```
[ ] Tarefa 3.2: Configurar Supabase Storage para receitas

O que precisa ser feito:
- Criar bucket "receitas" com acesso público desabilitado
- Configurar política: somente service_role faz upload (via lib/supabase/admin.ts)
- Testar geração de URL assinada via API Route
- Documentar política de retenção:
  - Solicitações entregues: manter receita por 12 meses após a entrega
  - Solicitações recusadas ou canceladas: excluir receita após 90 dias
  - v1: exclusão manual pela equipe
  - v2: job automático

Arquivo de entrada:
- 03-technical-spec.md (seção Storage)

Arquivo de saída:
- /app/api/receitas/[id]/route.ts (gera URL assinada)

Como verificar sucesso:
☑ Bucket existe e é privado
☑ Upload via service_role funciona
☑ URL assinada expira em 60 minutos
☑ Acesso sem URL assinada retorna erro 403

Estimativa: 1h
```

---

## FASE 4 — Autenticação Admin

**Objetivo:** Login admin funcionando com proteção de rota.

---

### Tarefa 4.1 — Middleware de proteção + tela de login

```
[ ] Tarefa 4.1: Auth guard para /admin/* e tela de login

O que precisa ser feito:
- middleware.ts: verifica sessão Supabase em rotas /admin/*
- Sem sessão: redireciona para /admin/login
- /admin/login: formulário email + senha via Supabase Auth
- Layout do admin: sidebar com links de navegação
- Botão de logout

Arquivo de entrada:
- 03-technical-spec.md (seção Auth)

Arquivo de saída:
- /middleware.ts
- /app/admin/login/page.tsx
- /app/admin/layout.tsx
- /components/admin/Sidebar.tsx

Como verificar sucesso:
☑ Acesso a /admin sem login redireciona para /admin/login
☑ Login com email/senha corretos funciona
☑ Login com credenciais erradas mostra erro adequado
☑ Logout limpa sessão e redireciona
☑ Nenhum link de login visível no menu público

Estimativa: 2h
```

---

## FASE 5 — CRUD de Medicamentos e Lotes

**Objetivo:** Admin consegue cadastrar e gerenciar medicamentos e lotes completamente.

---

### Tarefa 5.1 — Listagem e cadastro de medicamentos

```
[ ] Tarefa 5.1: /admin/estoque — listagem e formulário de medicamento

O que precisa ser feito:
- Tabela de medicamentos com busca, filtro por categoria, status ativo/inativo
- Formulário de cadastro com todos os campos do schema
- Formulário de edição
- Toggle ativo/inativo
- Validação: campos obrigatórios, tipos corretos

Arquivo de entrada:
- 03-technical-spec.md (schema medicamentos)

Arquivo de saída:
- /app/admin/estoque/page.tsx
- /components/admin/TabelaMedicamentos.tsx
- /components/admin/FormMedicamento.tsx

Como verificar sucesso:
☑ Medicamento pode ser criado e aparece na lista
☑ Medicamento pode ser editado
☑ Toggle ativo/inativo funciona
☑ Campos controlado/manipulado/termolabil aparecem claramente
☑ Busca filtra em tempo real

Estimativa: 3h
```

---

### Tarefa 5.2 — Cadastro de lotes (entrada rápida)

```
[ ] Tarefa 5.2: Entrada rápida de lote com autocomplete

O que precisa ser feito:
- Botão "Registrar entrada" abre drawer/modal
- Campo de busca com autocomplete de medicamentos existentes
- Se encontrou: formulário reduzido (lote, validade, qtd, doador, data)
- Se não encontrou: formulário completo de medicamento + lote
- Validação: bloqueia cadastro se medicamento for controlado/manipulado/termolábil
- Validação de validade do lote:
  - Lote vencido (validade < hoje): bloqueia cadastro com mensagem "Este lote está vencido e não pode ser cadastrado no estoque da Farmácia Solidária."
  - Lote próximo do vencimento (dentro do prazo de alerta): exibe alerta visual em laranja/amarelo e permite confirmação consciente do admin para prosseguir
- Registra movimentação "entrada" automaticamente

Arquivo de entrada:
- 00-design-brainstorming.md (Fluxo 3)
- 03-technical-spec.md (schema lotes + movimentacoes)

Arquivo de saída:
- /components/admin/ModalEntradaLote.tsx
- /app/api/lotes/route.ts

Como verificar sucesso:
☑ Autocomplete de medicamentos funciona
☑ Formulário reduzido aparece para medicamento existente
☑ Formulário completo aparece para medicamento novo
☑ Medicamento controlado exibe mensagem de bloqueio
☑ Lote vencido bloqueia o cadastro com mensagem definitiva
☑ Lote próximo do vencimento exibe alerta e permite confirmação consciente
☑ Movimentação "entrada" é criada no banco
☑ Entrada rápida leva < 60s para medicamento já cadastrado

Estimativa: 3h
```

---

### Tarefa 5.3 — Visão expandida por lote no admin

```
[ ] Tarefa 5.3: Expandir medicamento para ver lotes individuais

O que precisa ser feito:
- Na tabela de medicamentos, clicar expande linha mostrando lotes
- Cada lote: número, validade, quantidade, doador, status, cor de criticidade
- Ação de descarte para lotes vencidos
- Total do medicamento calculado a partir dos lotes ativos

Arquivo de saída:
- /components/admin/LotesMedicamento.tsx

Como verificar sucesso:
☑ Expand/collapse funciona
☑ Cores de alerta aparecem conforme criticidade (🔴🟠🟡)
☑ Total bate com soma dos lotes ativos
☑ Descarte registra movimentação "descarte" no banco

Estimativa: 2h
```

---

## FASE 6 — Fluxo de Solicitação Pública (com Supabase)

**Objetivo:** Substituir dados mockados por Supabase real. Solicitações chegando no banco.

---

### Tarefa 6.1 — Conectar /farmacia/estoque ao Supabase

```
[ ] Tarefa 6.1: Busca pública de medicamentos via Supabase

O que precisa ser feito:
- Substituir mock por chamada à API Route GET /api/medicamentos
- Retornar apenas: id, nome_comercial, principio_ativo, dosagem, forma_farmaceutica, disponivel (bool)
- Excluir medicamentos com controlado = true da consulta pública
- "Disponível" = tem pelo menos 1 lote ativo, validade >= hoje e (quantidade - reservas_ativas) > 0
- API Route server-side usa lib/supabase/admin.ts — não há SELECT público direto nas tabelas medicamentos ou lotes
- A resposta nunca expõe quantidade, número de lote, validade, doador ou campos sensíveis

Arquivo de entrada:
- 03-technical-spec.md (RLS + schema)

Arquivo de saída:
- /app/api/medicamentos/route.ts (GET público)
- Update em /app/farmacia/estoque/page.tsx

Como verificar sucesso:
☑ Medicamentos com lotes ativos aparecem como Disponível
☑ Medicamentos sem lotes aparecem como Indisponível
☑ Nenhuma quantidade ou detalhe de lote é exposto
☑ Busca funciona por nome e princípio ativo

Estimativa: 1.5h
```

---

### Tarefa 6.2 — Conectar formulário de solicitação ao Supabase

```
[ ] Tarefa 6.2: Envio real de solicitação para o banco

O que precisa ser feito:
- API Route POST /api/beneficiarios/verificar:
  - Recebe CPF + últimos 4 dígitos do WhatsApp
  - Confirmação positiva: retorna dados para revisão e atualização (nome, WhatsApp, endereço)
  - Confirmação sem correspondência: retorna resposta genérica sem revelar se o CPF existe
- API Route POST /api/solicitacoes:
  - Cria ou atualiza beneficiário conforme dados enviados pelo formulário
  - Cria registro em solicitacoes com status "pendente"
  - Upload de receita para bucket se houver arquivo (usa admin.ts)
  - Registra consentimento LGPD
  - Dispara webhook para n8n (notificação admin)
- Feedback visual pós-envio correto

Arquivo de entrada:
- 03-technical-spec.md (schema solicitacoes + storage)
- 00-design-brainstorming.md (Fluxo 1)

Arquivo de saída:
- /app/api/beneficiarios/verificar/route.ts
- /app/api/solicitacoes/route.ts
- Update em /app/farmacia/solicitar/page.tsx

Como verificar sucesso:
☑ Solicitação aparece no banco com status "pendente"
☑ Beneficiário criado ou atualizado conforme dados do formulário
☑ Rota POST /api/beneficiarios/verificar retorna resposta genérica quando confirmação não bate
☑ Receita salva no Storage com path correto
☑ consentimento_lgpd = true no registro
☑ Webhook de nova solicitação dispara e admin recebe mensagem no WhatsApp
☑ Nenhuma resposta pública retorna CPF, endereço ou dados sensíveis do beneficiário

Estimativa: 3h
```

---

## FASE 7 — Painel de Solicitações e Aprovação

**Objetivo:** Admin consegue visualizar, analisar e aprovar/recusar solicitações com baixa automática no estoque.

---

### Tarefa 7.1 — Fila de solicitações

```
[ ] Tarefa 7.1: /admin/solicitacoes — fila com filtros

O que precisa ser feito:
- Tabela de solicitações com filtros por status
- Colunas: data, beneficiário, medicamento, status (com cor)
- Ordenação por data (mais antigas primeiro para pendentes)
- Ação de abrir solicitação

Arquivo de saída:
- /app/admin/solicitacoes/page.tsx
- /components/admin/TabelaSolicitacoes.tsx

Como verificar sucesso:
☑ Filtros por status funcionam
☑ Pendentes aparecem em destaque
☑ Ordenação correta

Estimativa: 2h
```

---

### Tarefa 7.2 — Detalhe de solicitação + aprovação FEFO

```
[ ] Tarefa 7.2: Modal/página de detalhe com aprovação e baixa FEFO

O que precisa ser feito:
- Dados do beneficiário e medicamento
- Visualização de receita via URL assinada (log: "visualizou_receita")
- Seletor de lote: sistema sugere FEFO, admin pode alterar
- Botão Aprovar: muda status → "aprovada", cria movimentação "reserva", dispara webhook — quantidade física não decrementada ainda
- Botão Recusar: campo de observação obrigatório, dispara webhook, libera reserva existente com movimentação "cancelamento_reserva"
- Botão Cancelar solicitação: libera reserva existente com movimentação "cancelamento_reserva" se houver
- Botão Marcar como Entregue: status → "entregue", movimentação "saida" decrementa quantidade física do lote

Arquivo de entrada:
- 00-design-brainstorming.md (Fluxo 2)
- 03-technical-spec.md (FEFO + movimentações)

Arquivo de saída:
- /app/admin/solicitacoes/[id]/page.tsx
- /components/admin/DetalheSolicitacao.tsx

Como verificar sucesso:
☑ Receita abre via URL assinada (não diretamente)
☑ Log de "visualizou_receita" criado
☑ FEFO sugere lote com menor validade
☑ Aprovação cria movimentação "reserva" — quantidade física do lote não muda
☑ Entrega cria movimentação "saida" e decrementa quantidade física do lote
☑ Recusa e cancelamento criam movimentação "cancelamento_reserva" liberando a reserva
☑ WhatsApp dispara na aprovação e na recusa (webhook n8n)

Estimativa: 4h
```

---

## FASE 8 — Dashboard e Alertas

**Objetivo:** Dashboard operacional completo e funcional.

---

### Tarefa 8.1 — Cards de resumo e alertas

```
[ ] Tarefa 8.1: Cards do dashboard e seção de alertas

O que precisa ser feito:
- 6 cards: medicamentos em estoque, pendentes, recebidas 30d, aprovadas 30d, vencidos, vencendo 30d
- Seção de alertas: lista de lotes críticos com cores
- Dados em tempo real via Supabase
- Regra de alertas de validade (decisão consciente da v1):
  - A view SQL alertas_validade usa valores fixos de 30 e 60 dias
  - O frontend lê configuracoes.alerta_laranja_dias e alerta_amarelo_dias para colorir e filtrar os alertas exibidos
  - Se o admin alterar os prazos nas configurações, as cores mudam, mas a view continua trazendo todos os lotes até 60 dias
  - Na v2, a view pode ser substituída por função SQL que lê configuracoes dinamicamente

Arquivo de saída:
- /app/admin/dashboard/page.tsx
- /components/admin/CardResumo.tsx
- /components/admin/AlertasValidade.tsx

Como verificar sucesso:
☑ Todos os 6 cards mostram número correto
☑ Alertas aparecem com cores corretas (🔴🟠🟡)
☑ Dados atualizam ao recarregar

Estimativa: 3h
```

---

### Tarefa 8.2 — Gráficos e feed de atividade

```
[ ] Tarefa 8.2: Gráficos e feed recente

O que precisa ser feito:
- Gráfico de barras: solicitações por mês (últimos 6 meses) — usar recharts
- Ranking: top 10 medicamentos mais solicitados
- Gráfico rosca: solicitações por status
- Feed: últimas 10 solicitações com link direto

Arquivo de saída:
- /components/admin/GraficoSolicitacoesMes.tsx
- /components/admin/RankingMedicamentos.tsx
- /components/admin/GraficoStatus.tsx
- /components/admin/FeedAtividade.tsx

Como verificar sucesso:
☑ Gráficos renderizam corretamente
☑ Feed mostra as 10 solicitações mais recentes
☑ Link no feed abre a solicitação correta

Estimativa: 3h
```

---

## FASE 9 — Integrações n8n + WhatsApp

**Objetivo:** Todas as notificações funcionando via n8n + Evolution API.

---

### Tarefa 9.1 — Workflows n8n

```
[ ] Tarefa 9.1: Criar e testar os 4 workflows n8n

O que precisa ser feito:
- Workflow 1: Webhook → WhatsApp admin (nova solicitação)
- Workflow 2: Webhook → WhatsApp beneficiário (aprovado)
- Workflow 3: Webhook → WhatsApp beneficiário (recusado)
- Workflow 4: Cron 8h → query Supabase → WhatsApp admin (vencimentos)
- Proteger todos os webhooks com Authorization header
- Variáveis no Vercel/Next.js:
  N8N_WEBHOOK_SECRET
  N8N_NOVA_SOLICITACAO_URL
  N8N_APROVACAO_URL
  N8N_RECUSA_URL
- Variáveis no n8n:
  EVOLUTION_API_URL
  EVOLUTION_API_KEY
  EVOLUTION_INSTANCE_NAME
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY  (job diário usa service_role para consultar alertas_validade sem restrição RLS)
  WEBHOOK_SECRET

Arquivo de entrada:
- 03-technical-spec.md (seção Integrações n8n)

Arquivo de saída:
- 4 workflows exportados como JSON em /docs/n8n/

Como verificar sucesso:
☑ Nova solicitação → WhatsApp admin recebe mensagem
☑ Aprovação → beneficiário recebe mensagem com endereço e horário
☑ Recusa → beneficiário recebe mensagem com motivo
☑ Job diário dispara corretamente (testar manualmente)
☑ Webhook sem token correto retorna 401

Estimativa: 3h
```

---

## FASE 10 — LGPD, Auditoria e Segurança

**Objetivo:** Sistema com rastreabilidade e proteção de dados adequada.

---

### Tarefa 10.1 — Logs de auditoria

```
[ ] Tarefa 10.1: Implementar logs de auditoria nas ações críticas

O que precisa ser feito:
- Criar função helper: logAuditoria(acao, entidade, entidade_id, antes?, depois?)
- Aplicar nas ações: visualizou_receita, aprovou_solicitacao, recusou_solicitacao,
  alterou_lote, descartou_lote, alterou_medicamento, deu_baixa_estoque
- Logs gravados na tabela logs_auditoria via service_role (obrigatório na v1)
- Tela /admin/auditoria/page.tsx: opcional na v1 — implementar somente se houver tempo; os logs no banco já cobrem o requisito de rastreabilidade

Arquivo de saída:
- /lib/auditoria.ts
- /app/admin/auditoria/page.tsx (opcional — v1 se houver tempo, v2 se não houver)

Como verificar sucesso:
☑ Cada ação gera um log com usuario_id correto
☑ Logs ficam registrados no banco (obrigatório)
☑ Tela de auditoria mostra histórico (se implementada na v1)

Estimativa: 2h
```

---

### Tarefa 10.2 — Revisão de segurança

```
[ ] Tarefa 10.2: Checklist de segurança e variáveis de ambiente

O que precisa ser feito:
- Auditar: lib/supabase/admin.ts nunca importado em componentes client-side ou em client.ts
- Auditar: service_role key nunca vai pro client
- Auditar: anon key usada apenas onde necessário
- Auditar: todos os webhooks validam Authorization header
- Revisar RLS de cada tabela
- Confirmar que receitas não são acessíveis sem URL assinada

Arquivo de saída:
- /docs/07-lgpd-e-seguranca.md (checklist preenchido)

Como verificar sucesso:
☑ lib/supabase/admin.ts sem nenhuma importação em Client Components ou em client.ts
☑ Nenhuma service_role key em código client-side
☑ Acesso direto ao bucket de receitas retorna 403
☑ Webhook sem token retorna 401
☑ RLS bloqueia acesso sem autenticação onde esperado

Estimativa: 2h
```

---

## FASE 11 — Testes, Deploy e Treinamento

**Objetivo:** Sistema em produção, equipe capacitada.

---

### Tarefa 11.1 — Testes end-to-end dos fluxos principais

```
[ ] Tarefa 11.1: Testar os fluxos principais manualmente

Fluxos a testar:
1. Solicitação pública — confirmação positiva (dados exibidos para revisão)
2. Solicitação pública — confirmação sem correspondência (formulário em branco, sem revelar CPF)
3. Solicitação com medicamento encontrado no estoque (via ?medicamentoId=)
4. Solicitação com medicamento não encontrado — campo livre (via ?livre=true)
5. Aprovação com baixa FEFO e notificação WhatsApp (reserva criada, quantidade física intacta)
6. Entrega com movimentação "saida" (quantidade física decrementada)
7. Recusa/cancelamento com liberação de reserva (cancelamento_reserva)
8. Entrada rápida de lote
9. Tentativa de cadastro de lote vencido (deve bloquear)
10. Dashboard refletindo dados reais
11. Job de vencimento disparando corretamente
12. Consulta pública de GET /api/medicamentos não retorna dados sensíveis (conferir no DevTools)
13. Receita acessível somente via URL assinada (acesso direto retorna 403)

Como verificar sucesso:
☑ Todos os fluxos executados sem erro de ponta a ponta
☑ Confirmação sem correspondência não revela se o CPF existe
☑ Reserva criada na aprovação — quantidade do lote não muda
☑ Entrega decrementa quantidade do lote
☑ Recusa/cancelamento libera reserva com cancelamento_reserva
☑ Lote vencido bloqueado no cadastro
☑ Notificações WhatsApp chegam corretamente (aprovação e recusa)
☑ GET /api/medicamentos não expõe quantidade, lote, validade ou doador
☑ Receita protegida — 403 sem URL assinada
☑ Dashboard atualiza após cada ação

Estimativa: 4h
```

---

### Tarefa 11.2 — Deploy em produção

```
[ ] Tarefa 11.2: Deploy no Vercel + domínio

O que precisa ser feito:
- Conectar repositório ao Vercel
- Configurar todas as variáveis de ambiente no Vercel
- Apontar domínio personalizado
- Testar em produção

Como verificar sucesso:
☑ Site acessível no domínio final
☑ HTTPS ativo
☑ Variáveis de ambiente funcionando em produção
☑ Sem erros no Vercel dashboard

Estimativa: 1h
```

---

### Tarefa 11.3 — Treinamento da equipe

```
[ ] Tarefa 11.3: Treinamento da equipe administrativa

O que precisa ser feito:
- Gravar ou fazer sessão ao vivo: entrada de lote, aprovar solicitação, ver dashboard
- Criar usuário admin para cada membro da equipe
- Configurar mensagens padrão e dados de contato em /admin/configuracoes
- Documentar o que fazer com lotes vencidos (descarte)

Como verificar sucesso:
☑ Equipe consegue registrar entrada sem ajuda
☑ Equipe consegue aprovar/recusar solicitação
☑ Configurações de mensagens estão preenchidas
☑ Equipe sabe onde ver os alertas de vencimento

Estimativa: 2h
```

---

## Resumo de Estimativas

| Fase | Descrição | Estimativa |
|---|---|---|
| 0 | Setup | 1.5h |
| 1 | Landing page | 5h |
| 2 | Páginas públicas (mock) | 7h |
| 3 | Banco de dados | 3h |
| 4 | Autenticação admin | 2h |
| 5 | CRUD medicamentos e lotes | 8h |
| 6 | Solicitação pública (Supabase) | 4.5h |
| 7 | Painel solicitações + aprovação | 6h |
| 8 | Dashboard e alertas | 6h |
| 9 | n8n + WhatsApp | 3h |
| 10 | LGPD, auditoria, segurança | 4h |
| 11 | Testes, deploy, treinamento | 6h |
| **Total** | | **~56h** |

> Estimativa conservadora para execução com agente IA (Claude Code / Antigravity).
> Em sessões de 2–3h cada, o projeto pode ser concluído em 20–25 sessões.

---

## Changelog

| Data | Alteração |
|---|---|
| 2026-05-19 | Versão inicial |
| 2026-05-26 | Incorporados ajustes técnicos: três clients Supabase (client/server/admin), rota POST /api/beneficiarios/verificar, terminologia de confirmação adicional, RLS sem SELECT público direto, retenção diferenciada de receitas, regra de bloqueio de lote vencido, campos de retorno de GET /api/medicamentos, regra de reserva/saida/cancelamento_reserva, alertas de validade view SQL vs configurações, variáveis n8n separadas por contexto, tela de auditoria opcional na v1 |
