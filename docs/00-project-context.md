# 00 — Project Context

## Farmácia Solidária Lírio dos Vales

**Status do documento:** contexto operacional e arquitetural  
**Data de atualização:** 23/09/2026  
**Escopo atual:** Farmácia Solidária  
**Landing page institucional:** fora do escopo neste momento

---

## 1. Propósito deste arquivo

Este arquivo é a **memória técnica oficial de contexto** do projeto.

Ele não substitui:

- Product Spec;
- UX Spec;
- Technical Spec;
- Implementation Plan;
- Backlog;
- Acceptance Criteria;
- LGPD/Security;
- código-fonte;
- schema real do banco.

Sua função é registrar o contexto que precisa permanecer estável entre sessões de desenvolvimento.

### Regra de ouro

> **Memória = como trabalhamos e quais decisões foram tomadas.**  
> **Documentação = o que o sistema deve fazer.**  
> **Código + banco real = o que efetivamente existe.**

Quando houver divergência:

1. verificar o código e o banco reais;
2. revisar os documentos correspondentes;
3. registrar a decisão consolidada neste arquivo, quando ela for estável.

---

# 2. Projeto

A aplicação é o web app da **Farmácia Solidária Lírio dos Vales**, com objetivo de apoiar:

- consulta pública de disponibilidade de medicamentos;
- solicitação de medicamentos por beneficiários;
- gestão administrativa do estoque;
- análise e tratamento de solicitações;
- rastreabilidade das movimentações;
- indicadores operacionais;
- proteção de dados e auditoria;
- notificações por WhatsApp via n8n/Evolution API.

O projeto foi inicialmente construído como aplicação funcional em **React + Vite + JavaScript**, utilizando Supabase.

A arquitetura definitiva prevista para a aplicação é **Next.js + TypeScript + App Router + Supabase SSR**.

---

# 3. Fluxo de desenvolvimento

## Ambiente principal

O usuário desenvolve pelo:

- VS Code;
- terminal integrado do VS Code;
- Git;
- npm/npx;
- Supabase;
- Vercel.

Não há dependência de agentes de IA dentro do VS Code.

### Papel do ChatGPT

O ChatGPT atua como:

- analista do projeto;
- arquiteto de software;
- revisor técnico;
- revisor de documentação;
- gerador e explicador de código;
- gerador de comandos;
- planejador de fases e tarefas;
- apoio em debugging;
- apoio em decisões de modelagem;
- apoio em segurança e LGPD.

### Processo de trabalho

```text
Usuário apresenta a tarefa
        ↓
ChatGPT analisa docs + código + banco/estado conhecido
        ↓
ChatGPT propõe solução
        ↓
ChatGPT fornece comandos/código exatos
        ↓
Usuário executa no VS Code
        ↓
npm run build
        ↓
Usuário informa resultado/erro
        ↓
ChatGPT revisa
        ↓
Só depois:
git commit / git push
```

---

# 4. Regra fundamental de execução

## Uma tarefa por vez

Não avançar automaticamente para a próxima tarefa.

Cada tarefa deve ser:

- pequena;
- autocontida;
- verificável;
- concluída antes da próxima.

### Sempre validar

```bash
npm run build
```

antes de considerar uma alteração concluída.

Se houver erro:

1. identificar a causa;
2. corrigir somente o necessário;
3. executar novamente o build;
4. prosseguir apenas com o build verde.

---

# 5. Regra para instruções de código

Toda instrução de alteração deve indicar:

### Arquivo

Exemplo:

```text
src/App.jsx
```

### Localização

Indicar:

- componente;
- função;
- bloco;
- linhas aproximadas, quando possível;
- trecho-âncora.

### Trecho atual

Mostrar o código relevante que existe.

### Alteração

Fornecer o trecho completo para:

- substituir;
- inserir;
- remover.

### Proibição

Não fornecer instruções vagas como:

> "procure a função e altere."

Não presumir que linhas de versões anteriores ainda sejam iguais.

Antes de alterar, ler o arquivo atual.

---

# 6. Estado atual conhecido em 23/09/2026

O projeto funcional atual é:

```text
React
Vite
JavaScript/JSX
Supabase
Tailwind CSS
Lucide React
GitHub
Vercel
```

Arquivos principais conhecidos:

```text
src/App.jsx
src/supabaseClient.js
```

O estado registrado no último handoff indica:

```text
✅ build local funcionando
✅ deploy de produção funcionando
✅ consulta pública de medicamentos funcionando
✅ busca por nome/princípio ativo funcionando
✅ cards de medicamentos funcionando
✅ apresentação dos medicamentos funcionando
✅ solicitação de paciente funcionando
✅ criação/atualização de beneficiário funcionando
✅ upload de receita funcionando no fluxo atual
✅ consentimento LGPD sendo registrado
✅ solicitação sendo gravada no Supabase
✅ painel administrativo funcionando
✅ aprovação/rejeição básica funcionando
```

### Exemplo validado de apresentação pública

```text
ACERTALIX

Perindopril arginina 5mg + indapamida 1,25mg

📦 Caixa com 15 comprimidos
```

---

# 7. O Vite atual é o baseline

O projeto Vite atual deve ser tratado como:

> **baseline funcional / referência de UX e comportamento**

e não como código descartável.

Durante a migração:

```text
Vite atual
   ↓
preserva comportamento validado
   ↓
Next.js novo
   ↓
arquitetura definitiva
```

Não apagar o projeto Vite no início da migração.

Não reconstruir funcionalidades sem necessidade.

---

# 8. Decisão arquitetural consolidada

## Migrar

```text
Vite + React + JavaScript
```

para:

```text
Next.js
TypeScript
App Router
Tailwind
Supabase
@supabase/ssr
Supabase Auth
Supabase Storage
Vercel
GitHub
```

### Motivo

O sistema deixou de ser apenas uma interface simples e precisa suportar:

- autenticação real;
- separação público/admin;
- dados sensíveis;
- API server-side;
- Storage privado;
- URLs assinadas;
- regras de estoque;
- FEFO;
- reservas;
- baixa transacional;
- auditoria;
- integrações n8n.

O objetivo da migração é adequar o projeto à arquitetura definitiva antes de implementar essas partes críticas.

---

# 9. Escopo atual

## Dentro do escopo

```text
/farmacia
/farmacia/estoque
/farmacia/solicitar
/farmacia/doar

/admin/login
/admin/dashboard
/admin/estoque
/admin/solicitacoes
/admin/solicitacoes/[id]
/admin/relatorios
/admin/configuracoes
```

APIs previstas:

```text
/api/medicamentos
/api/beneficiarios/verificar
/api/solicitacoes
/api/receitas/[id]
/api/webhooks/n8n
```

## Fora do escopo neste momento

```text
/
/landing page institucional
```

Não gastar esforço da migração atual na landing page.

---

# 10. Princípio de separação público × administrativo

## Público

O beneficiário deve ter acesso somente ao necessário.

A consulta pública deve expor:

```text
id
nome_comercial
principio_ativo
dosagem
forma_farmaceutica
categoria
disponivel
```

Não deve expor:

```text
quantidade
número do lote
validade
doador
CPF
endereço
dados de outros beneficiários
dados operacionais internos
```

## Admin autenticado

O admin pode trabalhar com:

```text
estoque
lotes
solicitações
beneficiários
receitas
movimentações
configurações
indicadores
```

---

# 11. Regra de acesso ao Supabase

A aplicação deve possuir uma separação clara entre:

```text
Browser
Server
Admin / Service Role
```

Clientes esperados:

```text
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/admin.ts
```

### Regra inviolável

`SUPABASE_SERVICE_ROLE_KEY`:

```text
NUNCA
↓
Client Component
NUNCA
↓
browser
NUNCA
↓
bundle público
```

A service role deve ser usada somente em contexto server-side autorizado.

---

# 12. Banco de dados — regra de ouro

A documentação conceitual e o banco real atualmente utilizado não são perfeitamente idênticos.

Portanto:

> **Nunca inventar nomes de tabelas, campos ou enums apenas com base no documento antigo.**

Antes de uma alteração estrutural:

1. verificar o banco real;
2. verificar o código atual;
3. verificar a especificação;
4. consolidar a solução.

---

# 13. Estruturas reais relevantes já confirmadas

## `medicamentos`

Campos relevantes conhecidos:

```text
id
nome_comercial
principio_ativo
dosagem
forma_farmaceutica
categoria
tipo_validade_receita
```

Também existem/foram especificados campos de restrição e regras farmacêuticas, que devem ser confirmados no schema real antes de novas operações.

---

## `estoque_lotes`

Campos relevantes conhecidos:

```text
id
medicamento_id
numero_lote
data_validade
qtd_caixas
unidades_por_caixa
qtd_total_unidades
data_entrada
parceiro_doador
created_at
apresentacao
```

### Regra importante

A apresentação pode variar por lote.

Não assumir que todos os lotes do mesmo medicamento possuem necessariamente a mesma apresentação.

---

## `beneficiarios`

Estrutura relevante:

```text
id
cpf
nome
whatsapp
endereco
created_at
updated_at
```

---

## `solicitacoes`

Campos relevantes conhecidos:

```text
id
protocolo
beneficiario_id
medicamento_id
lote_id
qtd_solicitada
qtd_atendida
url_receita
receita_url
tipo_entrega
justificativa_domicilio
status
tratamento
consentimento_lgpd
observacoes_admin
analisado_por
data_analise
data_entrega
created_at
```

---

## `movimentacoes_estoque`

Campos conhecidos:

```text
id
lote_id
tipo
quantidade_unidades
solicitacao_id
realizado_por
observacao
created_at
```

### Regra

Não criar uma segunda tabela de movimentação sem decisão explícita.

---

# 14. Regra de quantidade

Existem duas unidades conceituais.

## Solicitação

```text
qtd_solicitada
qtd_atendida
```

representam:

```text
embalagens / caixas
```

## Movimentação

```text
quantidade_unidades
```

representa:

```text
unidades físicas
```

### Exemplo

```text
1 caixa
×
15 comprimidos
=
15 unidades físicas
```

Portanto:

```text
qtd_atendida = 1
quantidade_unidades = 15
```

---

# 15. Aprovação parcial

A equipe poderá atender quantidade menor do que a solicitada.

Exemplo:

```text
qtd_solicitada = 5
qtd_atendida = 3
```

Regra:

```text
0 <= qtd_atendida <= qtd_solicitada
```

Para aprovação:

```text
qtd_atendida > 0
```

A baixa de estoque deve considerar:

```text
qtd_atendida
```

e não `qtd_solicitada`.

---

# 16. Regra FEFO

FEFO significa:

```text
First Expire, First Out
```

O sistema deve sugerir o lote com menor validade entre os lotes elegíveis.

Exemplo:

```text
Solicitação: 3 embalagens

Lote A
validade mais próxima
2 embalagens

Lote B
validade seguinte
1 embalagem
```

Resultado:

```text
2 × Lote A
1 × Lote B
```

Uma mesma solicitação pode consumir vários lotes.

---

# 17. Regra de reserva

A aprovação cria uma **reserva**, mas não reduz a quantidade física do lote.

Conceito:

```text
aprovação
   ↓
reserva
   ↓
quantidade física permanece
```

Na entrega:

```text
entrega
   ↓
saida
   ↓
quantidade física é decrementada
```

Em recusa/cancelamento:

```text
cancelamento
   ↓
cancelamento_reserva
   ↓
reserva é liberada
```

---

# 18. Baixa de estoque deve ser atômica

Não implementar a operação crítica com uma sequência simples de updates independentes no React.

Evitar:

```text
update solicitação
↓
update lote
↓
insert movimentação
```

A operação crítica deve ser transacional no PostgreSQL, via:

- RPC;
- função SQL;
- transação equivalente.

Objetivo:

```text
verificar estoque
+
calcular uso
+
reservar/baixar
+
registrar movimentações
+
atualizar solicitação
```

de maneira atomicamente consistente.

---

# 19. `solicitacoes.lote_id`

A coluna deve ser mantida.

Ela pode representar o lote principal/primeiro lote utilizado.

Quando uma solicitação utilizar vários lotes, a fonte de auditoria detalhada será:

```text
movimentacoes_estoque
```

com uma movimentação correspondente a cada lote efetivamente utilizado.

---

# 20. Autenticação administrativa

## Estado atual

A autenticação real ainda não está consolidada na aplicação atual.

O mecanismo antigo usa estado do React para simular acesso administrativo.

Isso não é considerado autenticação válida para a versão definitiva.

## Destino

```text
Supabase Auth
      ↓
sessão
      ↓
proteção das rotas /admin/*
      ↓
painel
```

O método de proteção deve seguir a convenção da versão atual do Next.js instalada, sem copiar cegamente estruturas antigas.

---

# 21. Receitas médicas

Receitas são dados sensíveis.

## Regras

Bucket:

```text
receitas
```

deve ser privado.

Acesso deve ocorrer via:

```text
API autenticada
↓
service role server-side
↓
URL assinada
```

A URL assinada deve ter tempo limitado conforme a especificação vigente.

### Nunca

- URL pública permanente;
- service role no client;
- receita disponível diretamente sem controle de acesso.

---

# 22. Fluxo público de solicitação

O fluxo funcional validado utiliza:

### Passo 1

```text
CPF
últimos 4 dígitos do WhatsApp
```

### Passo 2

```text
nome
WhatsApp
endereço
```

### Passo 3

```text
medicamento
tratamento
quantidade
receita
```

### Passo 4

```text
consentimento LGPD
envio
```

O novo fluxo Next.js deve manter a UX, mas mover operações de dados sensíveis para API/server-side.

---

# 23. Apresentação pública do medicamento

O beneficiário deve ver:

```text
nome
princípio ativo
dosagem
categoria
apresentação
status
```

Exemplo:

```text
ACERTALIX

Perindopril arginina 5mg + indapamida 1,25mg

📦 Caixa com 15 comprimidos
```

Não deve ver:

```text
quantidade de estoque
número do lote
validade
doador
```

---

# 24. Estado do código atual e decisões de preservação

Já foram corrigidos problemas de:

- apresentação do medicamento;
- estrutura JSX do card;
- relacionamento `beneficiario_id`;
- fluxo de obtenção do ID real do beneficiário;
- quantidade solicitada;
- carregamento do relacionamento do beneficiário;
- correções necessárias para build e deploy.

Esses comportamentos devem ser preservados durante a migração, salvo decisão explícita posterior.

---

# 25. Migração — ordem consolidada

A migração deve seguir aproximadamente:

```text
Fase 0-M.1
Baseline Vite

        ↓

Fase 0-M.2
Inventário do código atual

        ↓

Fase 0-M.3
Next.js + TypeScript

        ↓

Fase 0-M.4
Supabase Browser/Server/Admin

        ↓

Fase 0-M.5
Rotas

        ↓

Fase 0-M.6
Tipos TypeScript

        ↓

Fase 0-M.7
Design system

        ↓

Fase 0-M.8
MedicamentoCard

        ↓

Fase 0-M.9
API /medicamentos + estoque público

        ↓

Fase 0-M.10
Estrutura das demais APIs

        ↓

Fase 0-M.11
Preparação de Auth

        ↓

Fase 0-M.12
Solicitação pública

        ↓

Fase 0-M.13
Estrutura Admin

        ↓

Fase 0-M.14
Retirada da dependência do Vite

        ↓

Fase 0-M.15
Validação final
```

---

# 26. Depois da migração

A ordem geral prevista é:

```text
Autenticação real
        ↓
Separação público/admin
        ↓
qtd_atendida
        ↓
FEFO
        ↓
reserva
        ↓
RPC/transação
        ↓
movimentações
        ↓
entrega
        ↓
recusa/cancelamento
        ↓
auditoria
        ↓
dashboard
        ↓
n8n + WhatsApp
        ↓
testes finais
```

---

# 27. Pendências arquiteturais importantes

Antes de implementar operações definitivas, revisar:

1. nomes e tipos reais dos enums/status;
2. definição real de `protocolo`;
3. valores reais de `movimentacoes_estoque.tipo`;
4. relacionamento real de `responsavel`/`realizado_por`;
5. schema exato de lotes e quantidades;
6. política RLS atual;
7. estrutura real do Storage;
8. origem correta da apresentação pública;
9. regras definitivas para retenção de receitas;
10. diferenças entre documentos antigos e schema atual.

---

# 28. Regra de fonte de verdade

Quando surgir uma divergência:

### 1º — código e banco reais

Usados para saber o que existe.

### 2º — decisões consolidadas

Usadas para saber o que já foi deliberadamente decidido.

### 3º — especificações

Usadas para saber o que o produto deve fazer.

### 4º — hipóteses

Nunca assumir como verdade.

Se uma informação não estiver confirmada:

```text
não inventar
não presumir
verificar
```

---

# 29. Segurança

Regras mínimas permanentes:

```text
service_role = server only
receitas = bucket privado
dados de beneficiários = não públicos
RLS = obrigatório
webhooks = secret/token
ações críticas = auditáveis
```

Nunca colocar segredos em:

```text
Git
código client-side
bundle
screenshots
mensagens públicas
```

---

# 30. Git

Fluxo recomendado:

```text
alteração
↓
npm run build
↓
revisão
↓
git status
↓
git add
↓
git commit
↓
git push
```

Não fazer commit de código que ainda não passou pelo build.

Antes de mudanças arquiteturais grandes, manter ponto de restauração.

---

# 31. Definição de sucesso da migração

A migração não está concluída apenas porque:

```text
npm run build
```

funciona.

Ela deve também atingir:

```text
☑ Next.js funcionando
☑ TypeScript funcionando
☑ App Router funcionando
☑ Supabase SSR configurado
☑ service_role server-side
☑ consulta pública via API
☑ ausência de dados sensíveis no client
☑ formulário migrado
☑ estrutura admin criada
☑ Vite preservado até validação
☑ funcionalidades principais reproduzidas
☑ build de produção funcionando
```

---

# 32. Documentos principais do projeto

Os documentos técnicos existentes incluem:

```text
01-product-spec.md
02-ux-spec-rotas-e-fluxos.md
03-technical-spec.md
04-implementation-plan.md
05-backlog.md
06-acceptance-criteria.md
07-lgpd-e-seguranca.md
```

Também existem documentos de decisões e handoffs de sessões anteriores.

Sempre consultar os documentos relevantes antes de uma alteração arquitetural.

---

# 33. Regra final para o ChatGPT

Ao trabalhar neste projeto, o ChatGPT deve:

1. analisar antes de alterar;
2. consultar a documentação relevante;
3. reconciliar documentação com código/banco real;
4. evitar suposições;
5. preservar funcionalidades já validadas;
6. propor mudanças incrementais;
7. fornecer localização exata no código;
8. exigir validação com `npm run build`;
9. não avançar automaticamente;
10. registrar decisões arquiteturais estáveis neste arquivo ou nos documentos apropriados.

> **Não confundir velocidade de implementação com progresso arquitetural.**
>
> A Farmácia Solidária deve evoluir de forma incremental, verificável e segura.
