# 05 — Backlog
## Site Institucional + Farmácia Solidária Lírio dos Vales
**Igreja Presbiteriana Lírio dos Vales — Tatuí/SP**
Versão: 1.0 | Data: 2026-05-19

> Tarefas pequenas, objetivas e verificáveis. Cada tarefa deve poder ser executada numa sessão única com um agente de IA.
> Ordem de execução: Fase 0 → Fase 11.

---

## Fase 0 — Setup do projeto

- [ ] Criar projeto Next.js 14+ com TypeScript e App Router via `create-next-app`
- [ ] Instalar e inicializar shadcn/ui
- [ ] Instalar `@supabase/supabase-js` e `@supabase/ssr`
- [ ] Criar estrutura de pastas conforme `03-technical-spec.md`
- [ ] Criar `lib/supabase/client.ts` — `createBrowserClient` com anon key (browser only)
- [ ] Criar `lib/supabase/server.ts` — `createServerClient` com anon key + cookies (Server Components e middleware)
- [ ] Criar `lib/supabase/admin.ts` — `createClient` com `SUPABASE_SERVICE_ROLE_KEY` (somente API Routes, jobs e scripts — nunca importar em Client Components)
- [ ] Criar `.env.example` com as 8 variáveis obrigatórias:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  N8N_WEBHOOK_SECRET=
  N8N_NOVA_SOLICITACAO_URL=
  N8N_APROVACAO_URL=
  N8N_RECUSA_URL=
  NEXT_PUBLIC_APP_URL=
  ```
- [ ] Garantir que `.env.local` está no `.gitignore`
- [ ] Configurar paleta de cores IP Lírio dos Vales no `tailwind.config.ts`
- [ ] Configurar fonte padrão via Google Fonts
- [ ] Criar repositório no GitHub e fazer primeiro commit
- [ ] Verificar: `npm run dev` roda sem erro

---

## Fase 1 — Site institucional

- [ ] Criar componente `Header` com logo e links âncora (mobile-first)
- [ ] Aplicar correção de transparência no logo (máscara de pixels escuros → alpha=0)
- [ ] Criar seção `Hero` com chamada da igreja e CTA para a Farmácia Solidária
- [ ] Criar seção `#sobre` com texto "Quem Somos"
- [ ] Criar seção `#cremos` com pilares doutrinários
- [ ] Criar seção `#horarios` com cultos e encontros
- [ ] Criar seção `#localizacao` com endereço e embed Google Maps
- [ ] Criar seção `#contato` com botão WhatsApp e email
- [ ] Criar `Footer` com informações básicas
- [ ] Garantir scroll suave entre âncoras
- [ ] Verificar responsividade em 375px e 1280px
- [ ] Verificar: botão "Farmácia Solidária" no header navega para `/farmacia`

---

## Fase 2 — Páginas públicas da Farmácia (dados mockados)

- [ ] Criar `/farmacia/page.tsx` com apresentação do projeto (missão, visão, valores)
- [ ] Criar dois cards de ação: "Solicitar" (botão "Ver disponibilidade") → `/farmacia/estoque` e "Doar" (botão "Quero doar") → `/farmacia/doar`
- [ ] Garantir que card "Solicitar" nunca aponta direto para `/farmacia/solicitar` — consulta ao estoque é etapa obrigatória
- [ ] Adicionar aviso: "A disponibilidade não garante retirada automática"
- [ ] Criar `/farmacia/estoque/page.tsx` com campo de busca e resultados mockados
- [ ] Implementar busca por nome e princípio ativo (filtra array mockado em tempo real)
- [ ] Exibir apenas: nome + princípio ativo + dosagem + disponível/indisponível
- [ ] Botão "Solicitar" somente em medicamentos disponíveis → `/farmacia/solicitar?medicamentoId=...`
- [ ] Mensagem "Não encontrei" com botão "Enviar mesmo assim" → `/farmacia/solicitar?livre=true`
- [ ] Criar `/farmacia/solicitar/page.tsx` — Passo 1: campos CPF + últimos 4 dígitos do WhatsApp, botão "Continuar"
- [ ] Criar Passo 2: confirmação positiva (dados exibidos para revisão e atualização) / confirmação sem correspondência (formulário completo em branco) — sem revelar se o CPF existe
- [ ] Criar Passo 3: medicamento pré-selecionado (via `?medicamentoId`) ou campo livre (via `?livre=true`) + campo de tratamento
- [ ] Criar Passo 4: upload de receita (aceita jpg, png, pdf, max 10MB) + consentimento LGPD
- [ ] Criar tela de confirmação pós-envio (sem envio real — só `console.log`)
- [ ] Criar `/farmacia/doar/page.tsx` com orientações, restrições claras (controlados, manipulados, termolábeis, vencidos, embalagem violada) e contato WhatsApp
- [ ] Verificar: formulário funciona end-to-end no celular (375px)

---

## Fase 3 — Banco de dados Supabase

- [ ] Criar projeto no Supabase
- [ ] Criar migration `001_initial_schema.sql` com todas as tabelas
- [ ] Criar migration `002_rls_policies.sql` com políticas RLS:
  - `medicamentos`: sem SELECT público direto; consulta somente via API Route ou view segura
  - `lotes`: sem SELECT público direto
  - `beneficiarios`: sem SELECT público; escrita somente via API Route com `admin.ts`
  - `solicitacoes`: sem SELECT público; escrita somente via API Route com `admin.ts`
  - `estoque_movimentacoes`, `configuracoes`, `logs_auditoria`: sem acesso público
- [ ] Criar migration `003_views_and_functions.sql` com view `alertas_validade`
- [ ] Criar `seed.sql` com valores iniciais da tabela `configuracoes`
- [ ] Criar bucket `receitas` no Supabase Storage com acesso público desabilitado
- [ ] Configurar política de Storage: somente `service_role` (via `admin.ts`) faz upload
- [ ] Documentar política de retenção de receitas:
  - Entregues: manter por 12 meses após a entrega
  - Recusadas ou canceladas: excluir após 90 dias
  - v1: exclusão manual; v2: job automático
- [ ] Criar API Route `GET /api/receitas/[solicitacaoId]` que gera URL assinada (60 min)
- [ ] Testar: SELECT direto em `beneficiarios` e `solicitacoes` com anon key retorna vazio ou erro
- [ ] Testar: SELECT direto em lotes com anon key retorna vazio ou erro
- [ ] Testar: insert manual de medicamento e lote via dashboard Supabase
- [ ] Testar: view `alertas_validade` retorna dados corretos
- [ ] Testar: URL assinada expira em 60 minutos
- [ ] Testar: acesso direto ao bucket sem URL assinada retorna erro 403

---

## Fase 4 — Autenticação admin

- [ ] Criar `middleware.ts` que intercepta `/admin/*` e verifica sessão Supabase Auth
- [ ] Redirecionar para `/admin/login` se sem sessão
- [ ] Criar `/admin/login/page.tsx` com campo email + senha
- [ ] Implementar login via Supabase Auth (`signInWithPassword`)
- [ ] Criar layout `/admin/layout.tsx` com sidebar de navegação
- [ ] Criar botão de logout que limpa sessão e redireciona
- [ ] Garantir: nenhum link de login visível no menu público
- [ ] Verificar: acesso a `/admin/dashboard` sem login redireciona para login
- [ ] Verificar: credenciais inválidas mostram mensagem de erro

---

## Fase 5 — CRUD de medicamentos e lotes

- [ ] Criar `/admin/estoque/page.tsx` com tabela de medicamentos + busca + filtros
- [ ] Criar formulário de cadastro completo de medicamento (todos os campos do schema)
- [ ] Criar formulário de edição de medicamento
- [ ] Implementar toggle ativo/inativo
- [ ] Criar componente de expansão de linha para mostrar lotes por medicamento
- [ ] Exibir por lote: número, validade, quantidade, doador, criticidade com cores
- [ ] Criar modal "Registrar entrada" com autocomplete de medicamentos existentes
- [ ] Formulário reduzido para medicamento existente (lote, validade, qtd, doador, data)
- [ ] Formulário completo para medicamento novo (todos os campos)
- [ ] Validação de bloqueio: `controlado`, `manipulado`, `termolabil = true` → impede entrada
- [ ] Validação de validade: lote vencido (validade < hoje) → bloqueia cadastro com mensagem definitiva
- [ ] Validação de validade: lote próximo do vencimento → exibe alerta visual e permite confirmação consciente do admin
- [ ] Registrar movimentação `entrada` automaticamente ao salvar lote
- [ ] Ação de descarte de lote: muda status + registra movimentação `descarte`
- [ ] Verificar: entrada rápida de lote existente leva < 60 segundos

---

## Fase 6 — Solicitação pública com Supabase real

- [ ] Criar API Route `GET /api/medicamentos` retornando apenas campos básicos: `id`, `nome_comercial`, `principio_ativo`, `dosagem`, `forma_farmaceutica`, `disponivel: boolean`
- [ ] Implementar query de disponibilidade considerando reservas ativas: `(quantidade - reservas_ativas) > 0`
- [ ] Excluir medicamentos `controlado = true` da consulta pública
- [ ] Substituir mock do `/farmacia/estoque` pela API real
- [ ] Criar API Route `POST /api/beneficiarios/verificar` com payload CPF + últimos 4 dígitos do WhatsApp:
  - Confirmação positiva: retorna dados para revisão e atualização
  - Confirmação sem correspondência: retorna resposta genérica — não revela se o CPF existe
- [ ] Criar API Route `POST /api/beneficiarios` para criação/atualização de beneficiário
- [ ] Criar API Route `POST /api/solicitacoes` que:
  - Cria ou atualiza beneficiário conforme dados do formulário
  - Faz upload de receita para bucket Storage se houver arquivo (usa `admin.ts`)
  - Cria registro em `solicitacoes` com `status = 'pendente'`
  - Registra `consentimento_lgpd = true`
  - Dispara webhook para n8n (notificação ao admin)
- [ ] Substituir `console.log` do formulário pela chamada real à API
- [ ] Verificar: solicitação aparece no banco com status "pendente"
- [ ] Verificar: confirmação positiva exibe dados para revisão; confirmação sem correspondência exibe formulário em branco sem revelar o CPF
- [ ] Verificar: receita salva no Storage com path correto
- [ ] Verificar: `consentimento_lgpd = true` no registro
- [ ] Verificar: webhook dispara e admin recebe WhatsApp
- [ ] Verificar: `GET /api/medicamentos` não expõe quantidade, lote, validade, doador ou CPF

---

## Fase 7 — Painel de solicitações e aprovação

- [ ] Criar `/admin/solicitacoes/page.tsx` com tabela + filtros por status
- [ ] Ordenação: pendentes primeiro, por data de criação
- [ ] Criar `/admin/solicitacoes/[id]/page.tsx` com detalhe completo
- [ ] Exibir dados do beneficiário e medicamento solicitado
- [ ] Botão de visualização de receita: gera URL assinada via API Route → log `visualizou_receita`
- [ ] Selector de lote com sugestão FEFO automática
- [ ] Botão Aprovar: muda status, cria movimentação `reserva`, dispara webhook n8n — quantidade física não decrementada ainda
- [ ] Botão Recusar: campo de observação obrigatório, dispara webhook n8n, libera reserva existente com movimentação `cancelamento_reserva`
- [ ] Botão Cancelar solicitação: libera reserva existente com movimentação `cancelamento_reserva` se houver
- [ ] Botão Marcar como Entregue (após aprovação): muda status, cria movimentação `saida` e decrementa quantidade física do lote
- [ ] Verificar: aprovação cria movimentação `reserva` — quantidade do lote não muda
- [ ] Verificar: entrega cria movimentação `saida` e atualiza disponibilidade pública
- [ ] Verificar: recusa/cancelamento libera reserva com `cancelamento_reserva`
- [ ] Criar `/admin/relatorios/page.tsx` com filtro de período e tabelas de histórico

---

## Fase 8 — Dashboard e alertas

- [ ] Criar query para cada um dos 6 cards do dashboard
- [ ] Criar componente `CardResumo` reutilizável
- [ ] Criar seção de alertas com lista de lotes críticos e cores por criticidade
- [ ] Implementar regra de alertas: view SQL usa 30/60 dias fixos; frontend lê `configuracoes.alerta_laranja_dias` e `alerta_amarelo_dias` para colorir e filtrar — decisão consciente da v1
- [ ] Criar gráfico de barras: solicitações por mês (últimos 6 meses) — usar recharts
- [ ] Criar ranking top 10 medicamentos mais solicitados
- [ ] Criar gráfico rosca: solicitações por status
- [ ] Criar lista de estoque crítico (abaixo de `estoque_minimo`)
- [ ] Criar feed das últimas 10 solicitações com link para detalhe
- [ ] Verificar: todos os 6 cards mostram número correto vs banco
- [ ] Criar `/admin/configuracoes/page.tsx` com formulário para editar todas as chaves da tabela `configuracoes`

---

## Fase 9 — Integrações n8n + WhatsApp

- [ ] Criar Workflow 1 no n8n: webhook → WhatsApp admin (nova solicitação)
- [ ] Criar Workflow 2 no n8n: webhook → WhatsApp beneficiário (aprovação)
- [ ] Criar Workflow 3 no n8n: webhook → WhatsApp beneficiário (recusa)
- [ ] Criar Workflow 4 no n8n: cron 8h → consulta Supabase → WhatsApp admin (vencimentos)
- [ ] Proteger todos os webhooks n8n com validação do header `Authorization: Bearer {SECRET}`
- [ ] Implementar validação do token no Next.js `POST /api/webhooks/n8n`
- [ ] Configurar variáveis de ambiente no Vercel: N8N_WEBHOOK_SECRET; N8N_NOVA_SOLICITACAO_URL; N8N_APROVACAO_URL; N8N_RECUSA_URL
- [ ] Configurar variáveis no n8n: EVOLUTION_API_URL; EVOLUTION_API_KEY; EVOLUTION_INSTANCE_NAME; SUPABASE_URL;  SUPABASE_SERVICE_ROLE_KEY; WEBHOOK_SECRET
- [ ] Exportar os 4 workflows como JSON em `/docs/n8n/`
- [ ] Verificar: nova solicitação → admin recebe WhatsApp
- [ ] Verificar: aprovação → beneficiário recebe WhatsApp com endereço e horário
- [ ] Verificar: recusa → beneficiário recebe WhatsApp com motivo
- [ ] Verificar: webhook sem token correto retorna 401

---

## Fase 10 — LGPD, auditoria e segurança

- [ ] Criar helper `lib/auditoria.ts` com função `logAuditoria(acao, entidade, entidade_id, antes?, depois?)`
- [ ] Aplicar `logAuditoria` em: `visualizou_receita`, `aprovou_solicitacao`, `recusou_solicitacao`
- [ ] Aplicar `logAuditoria` em: `registrou_entrada_lote`, `descartou_lote`, `alterou_medicamento`, `marcou_entregue`
- [ ] Criar página `/admin/auditoria` com lista de logs filtráveis (opcional na v1 — logs no banco são o requisito mínimo obrigatório)
- [ ] Auditar: `lib/supabase/admin.ts` não aparece em nenhum Client Component ou em `client.ts`
- [ ] Auditar: `SUPABASE_SERVICE_ROLE_KEY` não aparece em nenhum bundle client
- [ ] Auditar: acesso direto ao bucket de receitas retorna 403
- [ ] Auditar: RLS bloqueia SELECT em beneficiarios, solicitacoes e lotes sem autenticação
- [ ] Auditar: `GET /api/medicamentos` não expõe quantidade, lote, validade, doador ou CPF (conferir no DevTools)
- [ ] Preencher checklist do `07-lgpd-e-seguranca.md`

---

## Fase 11 — Testes, deploy e treinamento

- [ ] Testar Fluxo 1a: solicitação pública — confirmação positiva (dados exibidos para revisão)
- [ ] Testar Fluxo 1b: solicitação pública — confirmação sem correspondência (formulário em branco, sem revelar CPF)
- [ ] Testar Fluxo 1c: solicitação com medicamento encontrado no estoque (via `?medicamentoId=`)
- [ ] Testar Fluxo 1d: solicitação com medicamento não encontrado — campo livre (via `?livre=true`)
- [ ] Testar Fluxo 2: aprovação com FEFO — reserva criada, quantidade física intacta + WhatsApp ao beneficiário
- [ ] Testar Fluxo 2b: entrega — movimentação `saida`, quantidade física decrementada
- [ ] Testar Fluxo 2c: recusa/cancelamento — movimentação `cancelamento_reserva`, reserva liberada
- [ ] Testar Fluxo 3: entrada rápida de lote (< 60 segundos)
- [ ] Testar Fluxo 3b: tentativa de cadastro de lote vencido — deve bloquear
- [ ] Testar Fluxo 4: job diário de vencimento dispara no horário
- [ ] Testar: medicamento com todas as unidades reservadas aparece como Indisponível
- [ ] Testar: `GET /api/medicamentos` não retorna dados sensíveis (conferir no DevTools)
- [ ] Testar: receita acessível somente via URL assinada — acesso direto retorna 403
- [ ] Conectar repositório ao Vercel
- [ ] Configurar todas as variáveis de ambiente no Vercel
- [ ] Apontar domínio e verificar HTTPS ativo
- [ ] Verificar: site funciona no domínio final sem erros
- [ ] Criar usuário admin para cada membro da equipe (Supabase Auth dashboard)
- [ ] Preencher `/admin/configuracoes`: endereço de retirada, horário, mensagens padrão, WhatsApp admin
- [ ] Conduzir sessão de treinamento: entrada de lote, aprovação de solicitação, dashboard, alertas
- [ ] Documentar procedimento de descarte de medicamento vencido
