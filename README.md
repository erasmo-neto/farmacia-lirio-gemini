# farmacia-lirio-gemini
Aqui está o código completo do **README.md** pronto em bloco de código Markdown para você copiar e colar diretamente no seu repositório do GitHub:

```markdown
# Farmácia Solidária Lírio dos Vales 🌿💊

> Projeto social da **Igreja Presbiteriana Lírio dos Vales** (Tatuí/SP) criado para expressar o amor de Cristo por meio do cuidado com a saúde, oferecendo medicamentos gratuitos, orientação responsável e apoio a famílias em situação de vulnerabilidade[cite: 11].

---

## 📌 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Regras de Negócio](#-regras-de-negócio)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Modelo de Banco de Dados](#-modelo-de-banco-de-dados)
- [Como Começar](#-como-começar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Segurança e LGPD](#-segurança-e-lgpd)
- [Licença e Mantenedores](#-licença-e-mantenedores)

---

## 📖 Sobre o Projeto

O **Farmácia Solidária Lírio dos Vales** é um ecossistema web integrado que une a presença institucional da igreja ao gerenciamento operacional da doação de medicamentos[cite: 11]. 

O sistema foi desenvolvido em **Next.js com App Router**, dividido em 3 zonas operacionais[cite: 11]:
1. **Site Institucional:** Apresentação da igreja, horários de cultos, avisos e eventos[cite: 11].
2. **Área Pública da Farmácia:** Consulta de disponibilidade de medicamentos em tempo real e formulário de solicitação online[cite: 11].
3. **Painel Administrativo:** Gestão de estoque por lote e validade (FEFO), triagem de solicitações com verificação de receita médica e relatórios de impacto social[cite: 11].

---

## ✨ Funcionalidades Principais

### 🌐 Área Pública (Beneficiários)
- **Consulta ao Estoque em Tempo Real:** Busca ágil por Nome Comercial ou Princípio Ativo[cite: 12].
- **Visualização de Disponibilidade:** Status claro por item (*Disponível* ou *Indisponível*).
- **Solicitação Simplificada:** Formulário de pedido rápido exigindo apenas a inclusão da foto/PDF da **Receita Médica**.
- **Logística Flexível:** Escolha entre *Retirada Presencial* no templo da igreja ou *Entrega a Domicílio* (para casos de mobilidade reduzida/acamados).
- **Acompanhamento por Protocolo:** Geração de código de protocolo para consulta do status da solicitação.

### 🛡️ Painel Administrativo (Voluntários e Farmacêuticos)
- **Dashboard de Indicadores:**
  - Métricas de atendimentos realizados no mês[cite: 11].
  - Alertas de lotes próximos ao vencimento (30, 60 e 90 dias)[cite: 11].
  - Alertas de medicamentos em estoque crítico[cite: 11].
- **Gestão de Lotes & FEFO (*First Expired, First Out*):** Baixa automática priorizando sempre os lotes com vencimento mais próximo[cite: 12].
- **Triagem de Solicitações:**
  - Visualização direta do arquivo de receita médica anexado.
  - Alertas automáticos de validade da receita (Selo Verde para receita válida; Selo Vermelho para receita vencida).
  - Aprovação/Recusa com registro do voluntário responsável.
- **Movimentações & Auditoria:** Histórico completo de entradas (doações), saídas (doações entregues) e perdas (validade/avaria)[cite: 11, 12].

### 🤖 Automações (n8n + Evolution API)
- Notificação automática via **WhatsApp** para o beneficiário quando a receita for aprovada e o remédio estiver pronto para retirada[cite: 11].
- Alertas para a equipe de voluntários sobre novos pedidos pendentes de análise[cite: 11].

---

## ⚖️ Regras de Negócio

### Validade de Receitas Médicas
- **Regra Geral (180 dias / 6 meses):** Hipertensão, Diabetes, Asma, Osteoporose, Parkinson, Glaucoma, Fraldas e demais medicamentos contínuos/agudos.
- **Exceção (365 dias / 1 ano):** Anticoncepcionais e Contraceptivos.

### Requisitos Mínimos da Receita Médica
Para aprovação na triagem, a receita enviada deve conter obrigatoriamente:
- Nome completo do paciente.
- Assinatura e carimbo médico com número do CRM (ou certificado digital ICP-Brasil).
- Data de emissão e posologia clara.

---

## 🛠️ Stack Tecnológica

- **Frontend & Backend (SSR/API):** [Next.js](https://nextjs.org/) (App Router + TypeScript)[cite: 11]
- **Estilização & UI:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)[cite: 11]
- **Ícones:** [Lucide Icons](https://lucide.dev/)
- **Banco de Dados & Autenticação:** [Supabase](https://supabase.com/) (PostgreSQL + Supabase Auth + Row Level Security)[cite: 11]
- **Armazenamento de Arquivos:** Supabase Storage (Buckets Privados para Receitas)[cite: 11]
- **Hospedagem:** [Vercel](https://vercel.com/)[cite: 11]
- **Automação de Comunicação:** [n8n](https://n8n.io/) + Evolution API (WhatsApp)[cite: 11]

---

## 📁 Estrutura do Projeto

```txt
farmacia-solidaria-lirio/
├── assets/                  # Logos, imagens estáticas e recursos visuais
├── docs/                    # Documentação técnica e especificações
│   ├── 01-product-spec.md
│   ├── 02-ux-spec-rotas-e-fluxos.md
│   ├── 03-technical-spec.md
│   └── 07-lgpd-e-seguranca.md
├── src/
│   ├── app/
│   │   ├── (public)/        # Site institucional e consulta de medicamentos
│   │   │   ├── page.tsx     # Home institucional da Igreja
│   │   │   └── farmacia/    # Catálogo público e formulário de solicitação
│   │   ├── (admin)/         # Painel administrativo protegido
│   │   │   └── admin/       # Dashboard, gestão de estoque e triagem
│   │   └── api/             # Webhooks e rotas internas de API
│   ├── components/          # Componentes reutilizáveis (shadcn/ui, tabelas, modais)
│   ├── lib/                 # Configurações do Supabase, utilitários e helpers
│   └── types/               # Definições de tipos TypeScript do banco de dados
├── public/                  # Arquivos estáticos servidos diretamente
├── .env.example             # Modelo de variáveis de ambiente
├── next.config.js
├── package.json
└── README.md

```

---

## 🗄️ Modelo de Banco de Dados

O banco de dados relacional (PostgreSQL via Supabase) possui as seguintes tabelas principais:

1. **`medicamentos`**: Catálogo único com nome comercial, princípio ativo, dosagem e tipo de validade da receita (`geral_180` ou `anticoncepcional_365`).


2. **`estoque_lotes`**: Controle físico das caixas, número do lote, data de validade, quantidade de unidades e parceiro doador.


3. **`perfis`**: Dados cadastrais dos beneficiários, voluntários e administradores (com consentimento LGPD).
4. **`solicitacoes`**: Ficha do pedido contendo protocolo, tipo de entrega, anexo da receita médica, status e parecer do voluntário.
5. **`movimentacoes_estoque`**: Registro de auditoria de todas as entradas, saídas e perdas.
6. **`igreja_eventos`**: Gerenciamento de eventos e avisos do site institucional.



---

## 🚀 Como Começar

### Pré-requisitos

* **Node.js** (v18.0.0 ou superior)
* **npm**, **yarn** ou **pnpm**
* Conta ativa no **Supabase**

### Instalação

1. **Clone o repositório:**
```bash
git clone [https://github.com/usuario/farmacia-solidaria-lirio.git](https://github.com/usuario/farmacia-solidaria-lirio.git)
cd farmacia-solidaria-lirio

```


2. **Instale as dependências:**
```bash
npm install

```


3. **Configure as Variáveis de Ambiente:**
Crie um arquivo `.env.local` na raiz do projeto baseado no `.env.example`:
```bash
cp .env.example .env.local

```


4. **Execute o servidor de desenvolvimento:**
```bash
npm run dev

```


Acesse [http://localhost:3000](http://localhost:3000?utm_source=gemini) no seu navegador.

### Variáveis de Ambiente

Preencha o arquivo `.env.local` com as credenciais do seu projeto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

# Integração n8n / Evolution API (Opcional para ambiente local)
NEXT_PUBLIC_N8N_WEBHOOK_URL=[https://seu-n8n.com/webhook/solicitacao](https://seu-n8n.com/webhook/solicitacao)

```

---

## 🔒 Segurança e LGPD

Por lidar com dados de saúde e receitas médicas (considerados **dados pessoais sensíveis** pela LGPD):

* **Row Level Security (RLS):** Todas as tabelas no Supabase possuem políticas ativas de RLS. Beneficiários acessam apenas seus próprios pedidos, enquanto voluntários autenticados gerenciam o painel geral.


* **Buckets Privados:** As imagens/PDFs das receitas médicas são salvas em um bucket privado com suporte a URLs assinadas temporárias.
* **Consentimento Explícito:** O formulário de cadastro exige aceite dos Termos de Privacidade e LGPD com registro de *timestamp*.

---

## 🤝 Licença e Mantenedores

Este projeto é desenvolvido e mantido com amor pela equipe de voluntários da **Igreja Presbiteriana Lírio dos Vales** em Tatuí/SP.

* **Organização:** Igreja Presbiteriana Lírio dos Vales


* **Localização:** Tatuí, SP - Brasil


* **Finalidade:** Uso comunitário sem fins lucrativos.

---
