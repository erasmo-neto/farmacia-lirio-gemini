# 02 — UX Spec: Rotas e Fluxos
## Site Institucional + Farmácia Solidária Lírio dos Vales
**Igreja Presbiteriana Lírio dos Vales — Tatuí/SP**
Versão: 1.0 | Data: 2026-05-19

---

## Mapa de rotas

```
liriodosvalestatu.com.br/
│
├── /                              → Landing page institucional (single-page)
│   ├── #sobre                     → Quem somos
│   ├── #cremos                    → O que cremos
│   ├── #horarios                  → Cultos e encontros
│   ├── #localizacao               → Endereço + mapa
│   └── #contato                   → WhatsApp e email
│
├── /farmacia                      → Apresentação do projeto + dois cards de entrada
├── /farmacia/estoque              → Consulta pública de disponibilidade
├── /farmacia/solicitar            → Formulário de solicitação (fluxo por CPF)
└── /farmacia/doar                 → Orientações para doadores e parceiros
│
└── /admin                         → Redireciona para /admin/dashboard se autenticado
    ├── /admin/login               → Tela de login (Supabase Auth)
    ├── /admin/dashboard           → Indicadores, alertas e atividade recente
    ├── /admin/estoque             → Gestão de medicamentos e lotes
    ├── /admin/solicitacoes        → Fila de análise e aprovação
    ├── /admin/relatorios          → Histórico por período
    └── /admin/configuracoes       → Parâmetros operacionais editáveis
```

---

## Páginas públicas

### `/` — Landing page institucional

**Propósito:** apresentar a Igreja Presbiteriana Lírio dos Vales para visitantes, membros e comunidade.

**Seções:**

| Âncora | Conteúdo |
|---|---|
| #sobre | Texto "Quem somos" — identidade reformada, histórico da congregação |
| #cremos | Pilares doutrinários — soberania de Deus, graça, aliança, missão |
| #horarios | Culto dominical, EBD, grupos pequenos — dias e horários |
| #localizacao | Endereço completo + embed Google Maps |
| #contato | Botão WhatsApp + endereço de email |

**Cabeçalho (fixo):** logo IP Lírio dos Vales + links âncora + botão "Farmácia Solidária" → `/farmacia`

**Rodapé:** endereço, contato, crédito institucional.

**Notas de UX:**
- Single-page com scroll suave entre âncoras
- Navegação fixa no topo — visível em mobile e desktop
- Botão "Farmácia Solidária" em destaque no cabeçalho — é uma das principais entradas para o projeto diaconal
- Design responsivo — maioria dos visitantes acessa pelo celular

---

### `/farmacia` — Apresentação da Farmácia Solidária

**Propósito:** explicar o projeto, sua missão e oferecer dois caminhos de ação claros.

**Conteúdo:**
- Título: Farmácia Solidária Lírio dos Vales
- Chamada principal: *"A Farmácia Solidária Lírio dos Vales existe para expressar o amor de Cristo por meio do cuidado com a saúde, oferecendo medicamentos gratuitos, orientação responsável e apoio a pessoas que enfrentam dificuldade para manter seus tratamentos."*
- Missão, visão e valores
- Como funciona (4 etapas resumidas: recebimento → avaliação → solicitação → distribuição)
- Aviso importante: *"A disponibilidade exibida no site está sujeita à confirmação da equipe responsável. O envio da solicitação não garante retirada automática do medicamento."*
- Dois cards de ação:

```
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  💊 Solicitar medicamento   │   │  🤝 Doar medicamentos       │
│                             │   │                             │
│  Consulte o estoque e veja  │   │  Saiba como contribuir com  │
│  o que está disponível.     │   │  o projeto.                 │
│                             │   │                             │
│  [Ver disponibilidade]      │   │  [Quero doar]               │
└─────────────────────────────┘   └─────────────────────────────┘
```

**Notas de UX:**
- Os dois cards devem ter o mesmo peso visual
- Botão "Solicitar medicamento" leva para `/farmacia/estoque` (beneficiário consulta primeiro o que está disponível)
- Botão "Doar medicamentos" leva para `/farmacia/doar`
- Responsividade: cards em coluna no mobile, lado a lado no desktop

---

### `/farmacia/estoque` — Consulta pública de disponibilidade

**Propósito:** permitir que qualquer pessoa consulte se um medicamento está disponível.

**Elementos:**
- Campo de busca com placeholder: *"Busque por nome ou princípio ativo"*
- Filtro rápido por categoria (opcional, melhora usabilidade)
- Lista de resultados

**Resultado por medicamento:**
```
ACERTALIX
Perindopril arginina 5mg + indapamida 1,25mg | Comprimido
✅ Disponível        [Solicitar]

ACERTANLO
Perindopril arginina 3,5mg + anlodipino besilato 2,5mg | Comprimido
❌ Indisponível no momento
```

**Regras de exibição:**
- Disponível = quantidade física do lote menos reservas ativas é maior que zero, considerando apenas lotes ativos e dentro da validade.
- Nunca exibir quantidade, número de lote, validade ou nome do doador
- Botão "Solicitar" aparece apenas para medicamentos disponíveis
- Medicamentos com `controlado = true` não aparecem na consulta pública

**Estados:**

| Estado | Mensagem |
|---|---|
| Carregando | Skeleton / indicador de carregamento |
| Busca sem resultado | "Não encontrei esse medicamento no nosso estoque. Mas você ainda pode enviar uma solicitação — nossa farmacêutica vai verificar se temos algum equivalente disponível." + botão "Enviar mesmo assim" |
| Erro de conexão | "Não conseguimos carregar o estoque agora. Tente novamente em instantes." |
| Estoque vazio | "Nenhum medicamento disponível no momento. Entre em contato para saber mais." |

**Fluxo de continuação:**
- Clicar em "Solicitar" ou "Enviar mesmo assim" → `/farmacia/solicitar` (medicamento selecionado ou campo livre pré-identificado)

---

### `/farmacia/solicitar` — Formulário de solicitação

**Propósito:** receber a solicitação completa do beneficiário com o menor atrito possível.

**Estrutura em passos:**

**Passo 1 — Identificação segura**
```
Para começar, informe seus dados de contato:

CPF: [___.___.___-__]
Últimos 4 dígitos do seu WhatsApp: [____]

[Continuar]
```
- Confirmação positiva (CPF existe e últimos 4 dígitos conferem): dados existentes são exibidos no Passo 2 para revisão e atualização
- Confirmação sem correspondência (CPF não existe, ou dígitos não conferem): Passo 2 exibe formulário completo em branco
- Em ambos os casos o usuário pode preencher ou atualizar livremente seus próprios dados
- A mensagem exibida não deve revelar se o CPF existe ou não

**Passo 2 — Dados pessoais**

*Confirmação positiva:*
```
Confirme ou atualize seus dados:
Nome: [___]
WhatsApp: [___]
Endereço: [___]
```

*Confirmação sem correspondência:*
```
Nome completo: [___]
WhatsApp (com DDD): [___]
Endereço completo: [___]
```

**Passo 3 — Medicamento e informações clínicas**

Se veio do botão "Solicitar" na consulta:
```
Medicamento selecionado: ACERTALIX — Perindopril arginina 5mg
(pode trocar → volta para estoque)
```

Se veio de "Enviar mesmo assim" (campo livre):
```
Não encontrei o medicamento que preciso.
Nome do medicamento / princípio ativo / dosagem: [___]
```

Campos seguintes (para ambos os casos):
```
Para qual tratamento você usa este medicamento? [___]

Receita médica:
[o medicamento selecionado exige receita → upload obrigatório]
[medicamento não exige receita → upload opcional]
[upload por imagem ou PDF]
```

**Passo 4 — Consentimento e envio**
```
☐ Declaro que li e concordo com o uso dos meus dados para análise da
  solicitação pela equipe responsável da Farmácia Solidária Lírio dos Vales.

[Enviar solicitação]
```

**Tela de confirmação:**
```
✅ Solicitação enviada com sucesso!

Sua solicitação foi recebida e será analisada pela nossa equipe.
Você receberá uma mensagem no WhatsApp [número] quando ela for processada.

Lembre-se: a disponibilidade está sujeita à confirmação técnica.
A retirada precisa ser agendada com a equipe responsável.
```

**Estados e mensagens de erro:**

| Campo | Erro | Mensagem |
|---|---|---|
| CPF | Formato inválido | "CPF inválido. Verifique e tente novamente." |
| CPF + WhatsApp | Confirmação sem correspondência | "Não conseguimos confirmar um cadastro anterior com esses dados. Preencha ou atualize suas informações para continuar." |
| WhatsApp | Campo vazio | "Informe seu WhatsApp com DDD para receber o retorno." |
| Receita | Upload obrigatório ausente | "Este medicamento exige receita médica. Anexe uma foto ou PDF." |
| Consentimento | Não marcado | "É necessário aceitar o uso dos dados para continuar." |
| Envio | Falha de rede | "Não foi possível enviar sua solicitação. Verifique sua conexão e tente novamente." |

**Notas de UX:**
- Fluxo passo a passo — não mostrar todos os campos de uma vez
- CPF e WhatsApp devem abrir teclado numérico (`inputmode="numeric"`)
- Todos os campos devem ter labels visíveis — sem depender apenas de placeholder
- Upload de receita: aceitar imagem (jpg, png) e PDF — tamanho máximo 10MB
- Botão de envio desabilitado até todos os campos obrigatórios estarem preenchidos
- No mobile: campos com tamanho de toque adequado (mínimo 44px de altura)
- Tabelas administrativas devem virar cards ou linhas expansíveis no mobile — não rolar horizontalmente

---

### `/farmacia/doar` — Orientações para doadores

**Propósito:** orientar parceiros e doadores sobre como contribuir com o projeto.

**Conteúdo:**
- Apresentação do projeto e impacto
- *"Queremos ampliar o alcance da Farmácia Solidária por meio de parcerias com laboratórios, profissionais da saúde, empresas e instituições comprometidas com o cuidado da nossa cidade."*
- O que aceitamos:
  - ✅ Amostras grátis de laboratórios, com embalagem lacrada e dentro do prazo
  - ✅ Caixas lacradas de medicamentos para uso oral ou tópico
- O que **não** aceitamos:
  - ❌ Medicamentos de uso controlado
  - ❌ Medicamentos que exigem refrigeração (termolábeis)
  - ❌ Medicamentos manipulados
  - ❌ Medicamentos vencidos
  - ❌ Medicamentos com embalagem violada
- Endereço de entrega: Av. Prof.ª Zilah de Aquino, 1150, Vila Paulina, Tatuí/SP
- Horário de recebimento: a preencher pela equipe
- Botão WhatsApp para dúvidas ou agendamento

**Notas de UX:**
- Tom: acolhedor, claro, sem burocracia desnecessária
- As restrições devem ser visualmente destacadas (cards ou lista com ícones)
- Não criar formulário de cadastro de parceiro na v1 — o contato é pelo WhatsApp

---

## Páginas administrativas

### `/admin/login`

- Campo email + senha
- Botão "Entrar"
- Sem link de recuperação visível na v1 (fazer via Supabase Auth diretamente)
- Sem referência ao login no menu público
- Erro de credenciais: "E-mail ou senha incorretos."

### `/admin/dashboard`

**Topo — 6 cards:**

| Card | Dado |
|---|---|
| Medicamentos em estoque | Total de itens únicos com lotes ativos |
| Solicitações pendentes | Contagem com destaque visual se > 0 |
| Recebidas (últimos 30d) | Total de novas solicitações |
| Aprovadas (últimos 30d) | Total de aprovadas |
| Vencidos 🔴 | Lotes com validade < hoje |
| Vencendo em 30d 🟠 | Lotes dentro do prazo de alerta laranja |

**Seção de alertas:**
Lista de lotes críticos com: nome do medicamento, lote, validade, cor de criticidade.
```
🔴 ACERTALIX — Lote 747890 — Venceu em 04/2026
🟠 ACERTANLO — Lote 757599 — Vence em 15/06/2026
🟡 LOSARTANA  — Lote 112233 — Vence em 30/06/2026
```

**Gráficos:**
- Barras: solicitações por mês (últimos 6 meses)
- Ranking: top 10 medicamentos mais solicitados
- Rosca: solicitações por status
- Lista: itens com estoque abaixo do mínimo

**Feed de atividade:**
Últimas 10 solicitações — nome, medicamento, status, data. Link abre detalhe.

### `/admin/estoque`

**Visão de medicamentos:**
- Tabela com busca e filtro por categoria, forma farmacêutica, ativo/inativo
- Por medicamento: nome, princípio ativo, dosagem, total em estoque, status
- Expandir linha: lista de lotes com número, validade, quantidade, doador, criticidade
- Ação: registrar nova entrada | editar medicamento | marcar lote como descartado

**Modal de entrada rápida:**
- Campo de busca com autocomplete (medicamentos já cadastrados)
- Se encontrou: formulário reduzido (lote, validade, qtd, doador, data entrada)
- Se não encontrou: formulário completo de medicamento + lote
- Bloqueio automático se controlado / manipulado / termolábil

### `/admin/solicitacoes`

- Tabela com filtros por status (pendente, em análise, aprovada, recusada, entregue, cancelada)
- Ordenação: pendentes primeiro, por data de criação
- Clique em linha → detalhe da solicitação

**Detalhe da solicitação:**
- Dados do beneficiário
- Medicamento solicitado ou campo livre
- Tratamento informado
- Receita (link para URL assinada — abre nova aba, gera log de auditoria)
- Selector de lote: sistema sugere FEFO, admin pode selecionar outro
- Botão Aprovar | Botão Recusar (com campo de observação obrigatório)
- Botão Marcar como entregue (disponível após aprovação)

### `/admin/relatorios`

- Filtro por período (data início / data fim)
- Tabela de solicitações com todos os status
- Tabela de movimentações de estoque
- Na v1: visualização apenas — sem exportação

### `/admin/configuracoes`

Campos editáveis:

| Chave | Descrição |
|---|---|
| endereco_retirada | Endereço exibido na mensagem de aprovação |
| horario_retirada | Horário de atendimento exibido ao beneficiário |
| whatsapp_admin | Número que recebe notificações |
| mensagem_aprovacao | Texto base da mensagem de aprovação |
| mensagem_recusa | Texto base da mensagem de recusa |
| alerta_vermelho_dias | Dias para alerta vermelho (padrão: 0 = vencido) |
| alerta_laranja_dias | Dias para alerta laranja (padrão: 30) |
| alerta_amarelo_dias | Dias para alerta amarelo (padrão: 60) |

---

## Fluxos detalhados

### Fluxo do visitante da igreja

```
Acessa liriodosvalestatu.com.br
→ Lê sobre a igreja (sobre, cremos, horários)
→ Vê o botão "Farmácia Solidária" no header
→ Pode navegar para a localização e entrar em contato
→ [Opcional] Clica em "Farmácia Solidária" → /farmacia
```

### Fluxo do beneficiário

```
Acessa /farmacia
→ Lê sobre o projeto, entende a missão
→ Clica em "Ver disponibilidade"
→ /farmacia/estoque: busca por nome ou princípio ativo

Caminho A — medicamento encontrado:
→ Vê ✅ Disponível + botão "Solicitar"
→ Clica em "Solicitar" → /farmacia/solicitar
→ Passo 1: informa CPF + últimos 4 dígitos do WhatsApp
  → Confirmação positiva: dados existentes exibidos para revisão e atualização
  → Confirmação sem correspondência: preenche nome, WhatsApp e endereço
→ Passo 2: medicamento já selecionado, informa tratamento
→ Passo 3: faz upload de receita se necessário
→ Passo 4: aceita consentimento LGPD → envia
→ Vê confirmação na tela
→ Recebe WhatsApp quando solicitação for processada

Caminho B — medicamento não encontrado:
→ Vê mensagem "Não encontrei esse medicamento"
→ Clica "Enviar mesmo assim"
→ /farmacia/solicitar: preenche campo livre com nome/princípio ativo/dosagem
→ Mesmo fluxo de CPF e dados do Caminho A
```

### Fluxo do doador

```
Acessa /farmacia
→ Clica em "Quero doar" → /farmacia/doar
→ Lê o que o projeto aceita e o que não aceita
→ Vê endereço e horário de entrega
→ Clica em botão WhatsApp para entrar em contato ou tirar dúvidas
```

### Fluxo do admin

**Nova solicitação:**
```
Admin recebe WhatsApp: "💊 Nova solicitação de [nome] para [medicamento]"
→ Acessa /admin/solicitacoes
→ Filtra por "pendente"
→ Abre a solicitação
→ Visualiza dados e receita (se houver — via URL assinada, log gerado)
→ Verifica lote sugerido pelo sistema (FEFO)
→ Aprova ou recusa
  → Aprovação: status → "aprovada", movimentação "reserva", WhatsApp disparado
  → Recusa: preenche observação, status → "recusada", WhatsApp disparado
→ Na retirada: marca como "entregue" → movimentação "saida"
```

**Nova entrada de estoque:**
```
Admin acessa /admin/estoque → clica "Registrar entrada"
→ Digita nome do medicamento no autocomplete
→ Medicamento já existe: formulário reduzido (lote, validade, qtd, doador, data)
→ Medicamento novo: formulário completo
→ Sistema valida: se controlado/manipulado/termolábil → bloqueia com aviso
→ Salva → movimentação "entrada" registrada → dashboard atualizado
```

**Monitoramento de vencimentos:**
```
Às 8h: admin recebe WhatsApp com lista de lotes vencidos ou críticos
→ Acessa /admin/dashboard → vê alertas visuais
→ Acessa /admin/estoque → expande o medicamento
→ Marca lote como "descartado" → movimentação "descarte" registrada
```

---

## Estados globais de interface

| Estado | Comportamento esperado |
|---|---|
| Carregando | Skeleton loader — nunca tela em branco |
| Erro de rede | Mensagem clara + botão "Tentar novamente" |
| Formulário inválido | Erro inline no campo, sem scroll para topo |
| Ação bem-sucedida | Feedback positivo visível (toast ou tela de confirmação) |
| Sessão expirada (admin) | Redirecionar para /admin/login com mensagem "Sua sessão expirou." |
| Acesso negado (admin) | Redirecionar para /admin/login — sem expor a existência da página |
| Sem solicitações pendentes | "Nenhuma solicitação pendente no momento." |
| Nenhum medicamento cadastrado | "Nenhum medicamento cadastrado ainda. Use 'Registrar entrada' para começar." |
| Nenhum lote crítico | "Nenhum lote vencido ou próximo do vencimento no momento." |
| Nenhum resultado na busca | "Nenhum resultado encontrado. Verifique o nome ou tente um princípio ativo." |
| Nenhuma movimentação no período | "Nenhuma movimentação registrada no período selecionado." |

---

## Mensagens importantes para o usuário

### Para o beneficiário

| Situação | Mensagem |
|---|---|
| Após envio da solicitação | "Sua solicitação foi recebida. Você receberá um retorno pelo WhatsApp informado." |
| Medicamento não encontrado | "Não encontramos esse medicamento no momento. Mas você pode solicitar mesmo assim — nossa farmacêutica vai verificar se temos algum equivalente." |
| Receita obrigatória | "Este medicamento exige receita médica. Por favor, anexe uma foto ou PDF da sua receita." |

### Para o admin

| Situação | Mensagem |
|---|---|
| Entrada bloqueada (controlado) | "Este medicamento é de uso controlado e não pode ser recebido como doação pela Farmácia Solidária." |
| Entrada bloqueada (termolábil) | "Este medicamento requer refrigeração e não pode ser armazenado pela Farmácia Solidária." |
| Entrada bloqueada (manipulado) | "Medicamentos manipulados não são aceitos pelo projeto." |
| Lote vencido na entrada | "Este lote está vencido e não pode ser cadastrado no estoque da Farmácia Solidária." |

**Regras de validade de lote no cadastro:**
- Lote vencido (validade < hoje) → **bloqueia** o cadastro; não é possível salvar
- Lote próximo do vencimento (dentro do prazo de alerta configurado) → exibe alerta visual em cor laranja ou amarela; o admin pode confirmar conscientemente e prosseguir
