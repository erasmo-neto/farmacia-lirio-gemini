# FASE 0-M — Migração arquitetural Vite/React → Next.js/TypeScript

**Projeto:** Farmácia Solidária Lírio dos Vales
**Objetivo:** migrar o aplicativo funcional atual de Vite/React/JavaScript para a arquitetura definitiva em Next.js/TypeScript, preservando os fluxos já validados e preparando o sistema para autenticação, regras transacionais de estoque, FEFO, auditoria e LGPD.

## 0. Objetivo da fase

Ao final desta fase:

```text
ANTES

Vite
React
JavaScript
App.jsx monolítico
Supabase acessado diretamente pelo client
Login simulado
```

deverá existir:

```text
DEPOIS

Next.js
TypeScript
App Router
componentes separados
camada server/client definida
Supabase SSR
estrutura de API
estrutura de autenticação
estrutura preparada para regras transacionais
```

A landing page institucional `/` fica **fora desta fase**.

O Vite atual continua preservado como referência funcional até que a nova aplicação tenha os fluxos equivalentes validados.

---

# PRINCÍPIO DA MIGRAÇÃO

Não reescrever o sistema indiscriminadamente.

Preservar:

* regras de negócio já descobertas;
* UX já validada;
* estrutura real do banco;
* nomes reais das tabelas e campos;
* comportamento público já validado;
* formulário de solicitação;
* apresentação dos medicamentos;
* correções já realizadas.

Refazer:

* arquitetura;
* roteamento;
* separação público/admin;
* camada de acesso ao Supabase;
* autenticação;
* fronteira server/client;
* API;
* tipagem.

A documentação atual do Next.js trata o App Router como o router moderno e destaca o uso de Server Components; o Supabase recomenda `@supabase/ssr` para aplicações Next.js com sessões em cookies.

---

# TAREFA 0-M.1 — Criar baseline do sistema Vite atual

## O que precisa ser feito

Antes de modificar a arquitetura atual:

1. garantir que o Vite atual compila;
2. garantir que o deploy atual está funcional;
3. criar um ponto de restauração no Git;
4. documentar a versão funcional;
5. não apagar o projeto Vite ainda.

## Resultado esperado

Criar uma referência Git do último estado funcional:

```text
vite-stable-before-next-migration
```

ou equivalente.

Criar também uma branch de trabalho:

```text
migration/nextjs-typescript
```

A branch `main` não deve ser substituída enquanto a nova arquitetura não for validada.

## Critério de aceite

```text
☑ npm run build funciona no Vite atual
☑ versão funcional registrada no Git
☑ branch de migração criada
☑ nenhum código existente apagado
☑ deploy atual continua disponível como referência
```

---

# TAREFA 0-M.2 — Inventariar o código atual antes da migração

## O que precisa ser feito

Mapear:

```text
src/App.jsx
src/supabaseClient.js
```

e todos os demais arquivos realmente existentes no projeto.

Identificar:

```text
componentes
estados
funções de acesso ao Supabase
rotas simuladas
modais
formulários
queries
mutações
dados derivados
regras de negócio
```

Também identificar todas as tabelas e campos realmente utilizados pelo código atual.

## Criar documento

```text
docs/migration/vite-current-state.md
```

Esse documento deve registrar:

```text
Tela
→ componente atual
→ comportamento
→ fonte de dados
→ tabela Supabase
→ ação executada
→ destino na nova arquitetura
```

## Critério de aceite

```text
☑ Nenhuma funcionalidade importante do App.jsx ficou sem destino
☑ Todas as queries Supabase foram identificadas
☑ Todas as mutações Supabase foram identificadas
☑ Estrutura real do banco usada pelo frontend foi registrada
```

---

# TAREFA 0-M.3 — Criar o projeto Next.js + TypeScript

## O que precisa ser feito

Criar a nova aplicação usando `create-next-app` com:

```text
Next.js
TypeScript
App Router
Tailwind
```

A documentação atual do Next.js continua usando `create-next-app` como caminho oficial para iniciar projetos, e a documentação do Supabase oferece inclusive um template `with-supabase` já preparado para Next.js, TypeScript, Tailwind e Auth baseado em cookies.

### Regra

Não copiar o `App.jsx` inteiro para um `page.tsx`.

A migração deve aproveitar o comportamento, não reproduzir o monólito.

## Estrutura inicial

```text
app/
components/
lib/
public/
```

e, conforme necessário:

```text
docs/
assets/
```

## Critério de aceite

```text
☑ npm run dev funciona
☑ npm run build funciona
☑ TypeScript funciona sem erros
☑ App Router ativo
☑ Tailwind funcionando
☑ nenhum erro de runtime na aplicação inicial
```

---

# TAREFA 0-M.4 — Configurar Supabase para Browser + Server

## Objetivo

Estabelecer a fronteira arquitetural correta antes de migrar funcionalidades.

Criar:

```text
lib/supabase/
├── client.ts
└── server.ts
```

e preparar também o cliente administrativo:

```text
lib/supabase/admin.ts
```

quando necessário para operações server-side privilegiadas.

A documentação atual do Supabase recomenda um cliente para Client Components e outro para Server Components/Route Handlers/Server Actions; `@supabase/ssr` é o pacote indicado para integrar sessões via cookies.

## Regra inviolável

```text
SUPABASE_SERVICE_ROLE_KEY
       ↓
SERVER ONLY
```

Nunca:

```text
Client Component
browser
bundle JavaScript
```

## Variáveis

Preparar:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
N8N_WEBHOOK_SECRET=
N8N_NOVA_SOLICITACAO_URL=
N8N_APROVACAO_URL=
N8N_RECUSA_URL=
NEXT_PUBLIC_APP_URL=
```

## Observação

Os documentos antigos usam `NEXT_PUBLIC_SUPABASE_ANON_KEY`. A documentação atual do Supabase passou a utilizar `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` nos exemplos recentes. Antes de finalizar, verificar quais chaves estão efetivamente disponíveis no projeto Supabase e padronizar o nome no projeto.

## Critério de aceite

```text
☑ client.ts funciona no browser
☑ server.ts funciona no servidor
☑ admin.ts nunca é importado por Client Component
☑ service_role não aparece no bundle
☑ .env.local está no .gitignore
☑ .env.example não contém segredos
```

---

# TAREFA 0-M.5 — Definir a arquitetura de rotas

Criar a estrutura da Farmácia, sem construir ainda a landing institucional:

```text
app/
├── farmacia/
│   ├── page.tsx
│   ├── estoque/
│   │   └── page.tsx
│   ├── solicitar/
│   │   └── page.tsx
│   └── doar/
│       └── page.tsx
│
├── admin/
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── estoque/
│   │   └── page.tsx
│   ├── solicitacoes/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── relatorios/
│   │   └── page.tsx
│   └── configuracoes/
│       └── page.tsx
│
└── api/
```

A estrutura corresponde ao desenho funcional já definido na especificação UX.

## Importante

Não criar ainda todas as páginas completas.

Nesta tarefa, o objetivo é estrutural.

## Critério de aceite

```text
☑ Rotas públicas existem
☑ Rotas administrativas existem
☑ Dynamic route de solicitação existe
☑ Landing "/" não foi incluída no escopo de implementação
```

---

# TAREFA 0-M.6 — Criar os tipos TypeScript fundamentais

Criar uma camada inicial de tipos:

```text
types/
├── medicamento.ts
├── lote.ts
├── beneficiario.ts
├── solicitacao.ts
├── movimentacao.ts
└── configuracao.ts
```

Os tipos devem refletir o **banco real atualmente utilizado**, e não simplesmente copiar o schema conceitual antigo.

### Exemplo

```ts
export type Medicamento = {
  id: string
  nome_comercial: string
  principio_ativo: string
  dosagem: string
  forma_farmaceutica: string | null
  categoria: string | null
  ...
}
```

## Critério de aceite

```text
☑ Campos correspondem ao banco real
☑ Não existem tipos inventados sem correspondência
☑ status utiliza unions quando apropriado
☑ quantidade é number
☑ IDs são tipados como string/UUID
```

---

# TAREFA 0-M.7 — Migrar o design system básico

Migrar apenas o que já está sendo utilizado na Farmácia:

```text
cores
tipografia
espaçamento
cards
botões
inputs
badges
modais
```

Preservar a identidade visual definida:

```text
dark teal
mid teal
accent teal
gold
```

Mas não obrigar a reprodução de uma configuração antiga do Tailwind caso a versão atual utilize outra estrutura.

O objetivo é:

```text
tokens visuais
      ↓
componentes reutilizáveis
```

e não:

```text
copiar estilos do App.jsx inteiro
```

## Critério de aceite

```text
☑ card de medicamento reproduz aparência atual
☑ botão principal reproduz aparência atual
☑ inputs reproduzem aparência atual
☑ layout funciona em mobile
☑ não existem estilos globais duplicados sem necessidade
```

---

# TAREFA 0-M.8 — Migrar primeiro o card de medicamento

Migrar o componente:

```text
components/farmacia/MedicamentoCard.tsx
```

com o comportamento atual:

```text
ACERTALIX

Perindopril arginina 5mg + indapamida 1,25mg

📦 Caixa com 15 comprimidos

[Solicitar]
```

A função de formatação da apresentação também deve ser transformada em função tipada e reutilizável.

## Regra

O componente não deve consultar o banco.

Recebe dados:

```tsx
<MedicamentoCard medicamento={medicamento} />
```

Isso cria a separação:

```text
Banco/API
   ↓
dados
   ↓
componente
```

## Critério de aceite

```text
☑ ACERTALIX aparece corretamente
☑ apresentação aparece corretamente
☑ componente não consulta Supabase
☑ componente é reutilizável
☑ build funciona
```

---

# TAREFA 0-M.9 — Criar o primeiro fluxo público funcional

Migrar somente:

```text
/farmacia/estoque
```

usando dados reais do Supabase.

Mas nesta versão a regra arquitetural já deve ser:

```text
Browser
   ↓
GET /api/medicamentos
   ↓
Server
   ↓
Supabase
```

e não:

```text
Browser
   ↓
supabase.from(...)
```

O critério de aceite já especificado exige API server-side e que a resposta pública não exponha quantidade, lote, validade ou dados de beneficiários.

## Retorno público

```ts
{
  id,
  nome_comercial,
  principio_ativo,
  dosagem,
  forma_farmaceutica,
  categoria,
  disponivel
}
```

## Não retornar

```text
quantidade
lote
validade
doador
CPF
beneficiário
```

## Critério de aceite

```text
☑ busca por nome funciona
☑ busca por princípio ativo funciona
☑ card funciona
☑ quantidade não é exposta
☑ lote não é exposto
☑ validade não é exposta
☑ doador não é exposto
☑ build funciona
```

---

# TAREFA 0-M.10 — Criar os esqueletos das APIs

Criar apenas as estruturas, sem implementar ainda toda a regra de negócio:

```text
app/api/
├── medicamentos/
│   └── route.ts
├── beneficiarios/
│   └── verificar/
│       └── route.ts
├── solicitacoes/
│   └── route.ts
├── receitas/
│   └── [id]/
│       └── route.ts
└── webhooks/
    └── n8n/
        └── route.ts
```

## Critério de aceite

```text
☑ rotas compilam
☑ métodos HTTP estão definidos corretamente
☑ nenhuma service_role chega ao client
☑ nenhuma API retorna dados sensíveis por engano
☑ não implementar ainda FEFO
☑ não implementar ainda baixa de estoque
```

---

# TAREFA 0-M.11 — Preparar autenticação administrativa

Nesta fase, somente preparar a arquitetura.

Criar a base para:

```text
/admin/login
```

e o mecanismo de proteção das rotas administrativas.

## Atualização importante

A especificação antiga diz:

```text
middleware.ts
```

As versões atuais do Next.js passaram a usar:

```text
proxy.ts
```

como convenção para esse tipo de interceptação. A própria documentação atual do Supabase explica essa mudança no contexto Next.js 16.

Portanto:

```text
NÃO obrigar middleware.ts
```

A implementação deve usar a convenção exigida pela versão efetivamente instalada.

## Critério de aceite

```text
☑ /admin/login existe
☑ infraestrutura de sessão está preparada
☑ /admin/* está preparado para proteção
☑ nenhuma autenticação fictícia permanece na nova aplicação
```

---

# TAREFA 0-M.12 — Migrar o formulário de solicitação como Client Component isolado

O formulário necessita de interação intensa:

```text
CPF
WhatsApp
passos
validação
upload
consentimento
feedback
```

Portanto ele será:

```text
Client Component
```

mas **não poderá acessar diretamente dados administrativos do Supabase**.

A arquitetura será:

```text
Formulário
   ↓
POST /api/beneficiarios/verificar
   ↓
POST /api/solicitacoes
   ↓
server
   ↓
Supabase
```

## Preservar

```text
CPF + últimos 4 dígitos
dados do beneficiário
tratamento
quantidade
receita
consentimento LGPD
```

O comportamento do fluxo já está definido pelos critérios de aceite.

## Critério de aceite

```text
☑ fluxo visual equivalente ao atual
☑ CPF funciona
☑ confirmação funciona
☑ formulário funciona
☑ consentimento funciona
☑ nenhum SELECT administrativo é feito diretamente do browser
```

---

# TAREFA 0-M.13 — Migrar a estrutura administrativa sem implementar ainda as regras de estoque

Criar:

```text
/admin/estoque
/admin/solicitacoes
/admin/dashboard
/admin/relatorios
/admin/configuracoes
```

com layout:

```text
AdminLayout
   ├── Sidebar
   ├── Header
   └── conteúdo
```

Ainda não implementar:

```text
FEFO
reserva
baixa
entrega
auditoria
```

Esses itens virão depois da autenticação e da camada server.

---

# TAREFA 0-M.14 — Remover dependência arquitetural do Vite

Somente depois que os fluxos essenciais estiverem reproduzidos no Next.js:

```text
Farmácia
Estoque
Solicitação
Admin shell
```

começar a retirar a dependência do código Vite.

Não apagar ainda:

```text
src/App.jsx
src/supabaseClient.js
```

até a validação final da migração.

## Critério

```text
☑ Next.js executa sem Vite
☑ nenhuma página da Farmácia depende de App.jsx
☑ nenhuma página nova usa supabaseClient.js do Vite
☑ build Next.js funciona
```

---

# TAREFA 0-M.15 — Validação final da migração

Executar:

```bash
npm run build
```

e validar:

```text
/farmacia
/farmacia/estoque
/farmacia/solicitar
/farmacia/doar
/admin/login
/admin
/admin/estoque
/admin/solicitacoes
```

## Também verificar

No DevTools:

```text
Network
```

Confirmar que:

```text
SUPABASE_SERVICE_ROLE_KEY
```

não aparece.

Confirmar:

```text
GET /api/medicamentos
```

não retorna:

```text
quantidade
lote
validade
doador
CPF
endereço
```

Os critérios de aceite e o checklist LGPD colocam essas verificações como requisitos explícitos do projeto.

---

# DEFINIÇÃO DE PRONTO DA FASE 0-M

A migração só está concluída quando:

```text
☑ Next.js funcionando
☑ TypeScript funcionando
☑ App Router funcionando
☑ Tailwind funcionando
☑ Supabase browser/server configurado
☑ service_role exclusivamente server-side
☑ rotas públicas da Farmácia estruturadas
☑ rotas administrativas estruturadas
☑ API pública de medicamentos criada
☑ consulta pública funcionando
☑ card de medicamento funcionando
☑ formulário de solicitação migrado
☑ arquitetura de autenticação preparada
☑ dados públicos separados dos administrativos
☑ build de produção funcionando
☑ Vite preservado como baseline
☑ nenhum fluxo depende mais do App.jsx
```

---

# O QUE FICA DELIBERADAMENTE PARA DEPOIS

Não implementar nesta fase:

```text
❌ Landing page institucional
❌ FEFO
❌ reserva de estoque
❌ baixa de estoque
❌ RPC de estoque
❌ entrega
❌ cancelamento
❌ dashboard completo
❌ gráficos
❌ n8n
❌ WhatsApp
❌ auditoria completa
```

Esses itens entram depois que a arquitetura estiver estabilizada.

---

# PRÓXIMA FASE APÓS A MIGRAÇÃO

A próxima fase será:

```text
FASE 4
AUTENTICAÇÃO ADMINISTRATIVA REAL
```

seguida por:

```text
FASE 5
SEPARAÇÃO COMPLETA PÚBLICO × ADMIN
```

depois:

```text
FASE 6
TRIAGEM + qtd_atendida
```

e então:

```text
FASE 7
FEFO + RESERVA + RPC + MOVIMENTAÇÕES
```

A partir daí o sistema começa a deixar de ser apenas uma interface funcional e passa a operar como o sistema de gestão definido na especificação.
