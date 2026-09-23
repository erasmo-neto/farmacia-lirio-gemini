# 06 — Critérios de Aceite
## Site Institucional + Farmácia Solidária Lírio dos Vales
**Igreja Presbiteriana Lírio dos Vales — Tatuí/SP**
Versão: 1.0 | Data: 2026-05-19

> Um critério de aceite é uma afirmação verificável que pode ser testada manualmente ou automaticamente.
> Formato: dado contexto X, quando Y acontece, então Z deve ser verdade.

---

## Site institucional (`/`)

- [ ] Quando acessar `/`, a landing page carrega em menos de 3 segundos em conexão 4G
- [ ] O header é fixo no topo e permanece visível durante o scroll
- [ ] Os links de âncora (#sobre, #cremos, #horarios, #localizacao, #contato) levam à seção correta com scroll suave
- [ ] O botão "Farmácia Solidária" no header navega para `/farmacia`
- [ ] A página exibe corretamente em 375px (iPhone SE) e 1280px (desktop)
- [ ] O embed do Google Maps carrega e mostra o endereço correto (Av. Prof.ª Zilah de Aquino, 1150, Vila Paulina, Tatuí/SP)
- [ ] O botão WhatsApp abre `wa.me` com o número correto
- [ ] O logo da IP Lírio dos Vales aparece sem fundo preto (transparência aplicada)
- [ ] Não há nenhum link visível para `/admin` ou área de login no menu público

---

## Página da Farmácia Solidária (`/farmacia`)

- [ ] A página exibe missão, visão e valores do projeto conforme `farmacia-solidaria-contexto-institucional.md`
- [ ] Dois cards são exibidos: "Solicitar medicamento" e "Doar medicamentos"
- [ ] O card "Solicitar" (botão "Ver disponibilidade") leva para `/farmacia/estoque` — nunca para `/farmacia/solicitar` diretamente
- [ ] O card "Doar" (botão "Quero doar") leva para `/farmacia/doar`
- [ ] O aviso "A disponibilidade não garante retirada automática" é visível
- [ ] Os cards ficam em coluna no mobile e lado a lado no desktop

---

## Consulta pública de estoque (`/farmacia/estoque`)

- [ ] Quando carregar a página, os medicamentos são buscados via `GET /api/medicamentos` (API Route server-side — sem SELECT público direto nas tabelas)
- [ ] O campo de busca filtra por nome comercial e por princípio ativo
- [ ] Cada resultado exibe apenas: nome comercial, princípio ativo, dosagem, forma farmacêutica e status (Disponível/Indisponível)
- [ ] A quantidade, o número do lote, a validade, o doador e qualquer dado de beneficiário **não aparecem** em nenhum resultado
- [ ] Medicamentos com `controlado = true` **não aparecem** na listagem pública
- [ ] O botão "Solicitar" aparece apenas nos medicamentos com `disponivel = true` e leva para `/farmacia/solicitar?medicamentoId=...`
- [ ] "Disponível" é calculado considerando: lotes ativos + validade >= hoje + (quantidade - reservas_ativas) > 0
- [ ] Um medicamento com todas as unidades reservadas aparece como Indisponível mesmo antes da entrega física
- [ ] Quando a busca não retorna resultado, exibe mensagem com botão "Enviar mesmo assim" que leva para `/farmacia/solicitar?livre=true`
- [ ] Quando há erro de conexão, exibe mensagem com botão "Tentar novamente"
- [ ] O skeleton loader aparece enquanto os dados carregam (nunca tela em branco)

---

## Formulário de solicitação (`/farmacia/solicitar`)

- [ ] O fluxo é dividido em passos: Identificação segura → Dados pessoais → Medicamento → Confirmação
- [ ] Passo 1 ("Identificação segura") exibe dois campos: CPF e últimos 4 dígitos do WhatsApp
- [ ] Ambos os campos abrem teclado numérico no celular (`inputmode="numeric"`)
- [ ] Quando a confirmação é positiva (CPF + 4 dígitos conferem), os dados do beneficiário são exibidos para revisão e atualização no Passo 2
- [ ] Quando a confirmação não bate ou o CPF não existe, o Passo 2 exibe o formulário completo em branco
- [ ] Em ambos os casos, a mensagem exibida é genérica: "Não conseguimos confirmar um cadastro anterior com esses dados. Preencha ou atualize suas informações para continuar." — nunca revela se o CPF existe
- [ ] O beneficiário pode preencher ou atualizar todos os seus dados em qualquer cenário
- [ ] CPF com formato inválido exibe mensagem de erro inline
- [ ] Quando a página é acessada via `?medicamentoId=...`, o medicamento correspondente está pré-selecionado no Passo 3
- [ ] Quando a página é acessada via `?livre=true`, o Passo 3 exibe campo livre para nome/princípio ativo/dosagem
- [ ] O campo de tratamento é obrigatório
- [ ] Quando `exige_receita = true` no medicamento selecionado, o upload de receita é obrigatório no Passo 3
- [ ] O checkbox de consentimento LGPD é obrigatório para habilitar o envio
- [ ] O botão de envio fica desabilitado até todos os campos obrigatórios estarem preenchidos
- [ ] Após o envio, a tela de confirmação exibe o número de WhatsApp informado
- [ ] Após o envio, o banco de dados tem um registro em `solicitacoes` com `status = 'pendente'`
- [ ] Após o envio, `consentimento_lgpd = true` no registro

---

## Upload de receita médica

- [ ] O campo de upload aparece no Passo 3 do formulário de solicitação
- [ ] Quando `exige_receita = true` no medicamento selecionado, o upload é obrigatório
- [ ] Quando `exige_receita = false`, o upload é exibido como opcional
- [ ] Os formatos aceitos são: jpg, jpeg, png e pdf
- [ ] Arquivos maiores que 10MB são rejeitados com mensagem clara
- [ ] Após o envio, a receita é salva no bucket `receitas` com path `receitas/{solicitacao_id}/{timestamp}_{filename}`
- [ ] A receita **não é acessível** por URL pública (acesso direto ao bucket retorna 403)
- [ ] A receita é acessível pelo admin somente via URL assinada gerada por API Route autenticada
- [ ] A URL assinada expira em 60 minutos
- [ ] Receitas de solicitações com status `entregue` são mantidas por 12 meses após a data de entrega
- [ ] Receitas de solicitações com status `recusada` ou `cancelada` são excluídas após 90 dias
- [ ] Na v1, essa exclusão é realizada manualmente pela equipe; na v2 será automatizada por job

---

## Painel administrativo — acesso e segurança

- [ ] Acesso a qualquer rota `/admin/*` sem sessão redireciona para `/admin/login`
- [ ] Login com credenciais corretas dá acesso ao painel
- [ ] Login com credenciais incorretas exibe "E-mail ou senha incorretos" sem expor detalhes
- [ ] O logout limpa a sessão e redireciona para `/admin/login`
- [ ] A mensagem "Sua sessão expirou" aparece quando a sessão expira durante o uso
- [ ] Nenhum link de login está visível no menu público
- [ ] `lib/supabase/admin.ts` não é importado em nenhum Client Component (verificar com grep ou bundle analyzer)

---

## Gestão de estoque (`/admin/estoque`)

- [ ] A tabela de medicamentos pode ser filtrada por nome, categoria e status ativo/inativo
- [ ] Expandir um medicamento exibe seus lotes com: número, validade, quantidade, doador, criticidade (🔴🟠🟡)
- [ ] O total exibido por medicamento é a soma das quantidades dos lotes ativos
- [ ] O modal "Registrar entrada" exibe autocomplete de medicamentos já cadastrados
- [ ] Ao selecionar medicamento existente, o formulário exibe apenas: lote, validade, quantidade, doador, data de entrada
- [ ] Ao não encontrar medicamento, o formulário completo é exibido
- [ ] Tentar cadastrar lote de medicamento com `controlado = true` exibe mensagem de bloqueio e não salva
- [ ] Tentar cadastrar lote de medicamento com `manipulado = true` ou `termolabil = true` exibe bloqueio e não salva
- [ ] Tentar cadastrar lote com validade anterior a hoje bloqueia o salvamento com a mensagem: "Este lote está vencido e não pode ser cadastrado no estoque da Farmácia Solidária."
- [ ] Tentar cadastrar lote próximo do vencimento (dentro do prazo de alerta) exibe alerta visual e permite confirmação consciente do admin para prosseguir
- [ ] Ao salvar, uma movimentação `entrada` é criada em `estoque_movimentacoes`
- [ ] Marcar lote como descartado cria movimentação `descarte` e muda status para `descartado`
- [ ] Entrada de lote já cadastrado leva menos de 60 segundos do início ao fim

---

## Aprovação e recusa de solicitações (`/admin/solicitacoes`)

- [ ] Solicitações com status `pendente` aparecem em destaque no topo da lista
- [ ] A tabela pode ser filtrada por todos os status disponíveis
- [ ] O detalhe da solicitação exibe dados completos do beneficiário e do medicamento
- [ ] Clicar em "Ver receita" gera uma URL assinada (60 min) e registra log `visualizou_receita`
- [ ] O sistema sugere automaticamente o lote com menor validade (FEFO)
- [ ] O admin pode selecionar outro lote se necessário
- [ ] Ao aprovar: status muda para `aprovada`, movimentação `reserva` é criada, quantidade física do lote não é decrementada, webhook n8n é disparado
- [ ] Ao recusar: campo de observação é obrigatório, status muda para `recusada`, movimentação `cancelamento_reserva` é criada se havia reserva, webhook n8n é disparado
- [ ] Ao cancelar solicitação: movimentação `cancelamento_reserva` é criada se havia reserva
- [ ] A recusa sem observação não é permitida (botão desabilitado ou validação)

---

## Baixa por lote (entrega)

- [ ] O botão "Marcar como entregue" aparece apenas para solicitações com status `aprovada`
- [ ] Ao marcar como entregue: status muda para `entregue`, movimentação `saida` é criada
- [ ] A movimentação `saida` decrementa a `quantidade` do lote correspondente
- [ ] Após a entrega, a reserva associada não continua contando como reserva ativa
- [ ] A disponibilidade pública é recalculada com base em `quantidade - reservas_ativas` após a entrega
- [ ] Se o lote ficar com quantidade 0 após a entrega, o medicamento passa a aparecer como Indisponível na consulta pública
- [ ] Se todas as unidades estiverem reservadas (mas não entregues), o medicamento já aparece como Indisponível

---

## Dashboard (`/admin/dashboard`)

- [ ] O card "Medicamentos em estoque" exibe o total de itens únicos com lotes ativos
- [ ] O card "Solicitações pendentes" exibe a contagem atual e fica em destaque visual se > 0
- [ ] Os cards "Recebidas" e "Aprovadas" mostram o total correto dos últimos 30 dias
- [ ] O card "Vencidos" exibe apenas lotes com `validade < CURRENT_DATE`
- [ ] O card "Vencendo em 30d" exibe lotes dentro do prazo de alerta laranja configurado
- [ ] A seção de alertas lista lotes críticos com nome, lote, validade e cor correta (🔴🟠🟡)
- [ ] O gráfico de barras exibe solicitações por mês nos últimos 6 meses
- [ ] O ranking exibe os 10 medicamentos mais solicitados em ordem decrescente
- [ ] O gráfico rosca reflete a proporção correta de status das solicitações
- [ ] O feed exibe as 10 solicitações mais recentes com link funcional para o detalhe
- [ ] Os dados dos cards são consistentes com o banco de dados (conferir manualmente)
- [ ] A view SQL `alertas_validade` usa 30/60 dias fixos na v1
- [ ] O frontend usa `configuracoes.alerta_laranja_dias` e `configuracoes.alerta_amarelo_dias` para colorir e filtrar os alertas exibidos
- [ ] Alterar os prazos nas configurações muda as cores dos alertas no frontend sem alterar a view

---

## Notificações WhatsApp

- [ ] Quando uma solicitação é enviada, o admin recebe WhatsApp em menos de 2 minutos
- [ ] A mensagem para o admin inclui o nome do beneficiário e o medicamento solicitado
- [ ] Quando uma solicitação é aprovada, o beneficiário recebe WhatsApp em menos de 2 minutos
- [ ] A mensagem de aprovação inclui o endereço de retirada e o horário de atendimento (conforme `configuracoes`)
- [ ] Quando uma solicitação é recusada, o beneficiário recebe WhatsApp em menos de 2 minutos
- [ ] A mensagem de recusa inclui o motivo informado pelo admin
- [ ] O job diário dispara às 8h e o admin recebe a lista de lotes vencidos ou críticos
- [ ] Um webhook sem o `Authorization: Bearer {SECRET}` correto retorna HTTP 401
- [ ] As mensagens de WhatsApp não contêm dados sensíveis desnecessários (CPF, endereço completo, dados de terceiros)
- [ ] As URLs e tokens de webhook não aparecem no código client-side nem em logs públicos

---

## LGPD e segurança

- [ ] `SUPABASE_SERVICE_ROLE_KEY` não aparece em nenhum bundle client-side (verificar via DevTools)
- [ ] `lib/supabase/admin.ts` não é importado em nenhum Client Component (verificar com grep ou bundle analyzer)
- [ ] Acesso direto ao bucket `receitas` sem URL assinada retorna erro 403
- [ ] `POST /api/beneficiarios/verificar` recebe CPF + últimos 4 dígitos do WhatsApp — confirmação sem correspondência retorna mensagem genérica sem revelar se o CPF existe
- [ ] Nenhuma resposta pública retorna CPF, endereço ou dados sensíveis do beneficiário
- [ ] RLS bloqueia SELECT em `beneficiarios` via anon key (retorna 0 linhas ou erro)
- [ ] RLS bloqueia SELECT em `solicitacoes` via anon key
- [ ] RLS bloqueia SELECT em `lotes` via anon key
- [ ] `GET /api/medicamentos` não retorna quantidade, lote, validade, doador, CPF ou qualquer dado sensível (conferir no DevTools)
- [ ] O checkbox de consentimento LGPD é obrigatório e seu valor é gravado como `true` na solicitação
- [ ] Toda visualização de receita gera log `visualizou_receita` em `logs_auditoria`
- [ ] Toda ação crítica no admin (aprovar, recusar, descartar lote, alterar medicamento, marcar como entregue) gera registro em `logs_auditoria`
- [ ] Os logs de auditoria incluem `usuario_id` do admin que executou a ação
