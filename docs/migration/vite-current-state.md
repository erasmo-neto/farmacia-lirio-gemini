# Vite Current State — Farmácia Solidária Lírio dos Vales

**Data do inventário:** 23/09/2026  
**Objetivo:** registrar o estado funcional e arquitetural do aplicativo Vite/React antes da migração para Next.js + TypeScript.

> Este arquivo é um snapshot de engenharia reversa do código atual. Ele não substitui os specs do produto, UX, segurança ou arquitetura.

---

# 1. Stack atual

```text
React
Vite
JavaScript / JSX
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
src/main.jsx
src/App.css
src/index.css
```

---

# 2. Estado Git conhecido

Baseline da migração:

```text
branch:
migration/nextjs-typescript

tag:
vite-stable-before-next-migration
```

O build do Vite foi validado antes da migração.

---

# 3. Estrutura funcional atual

A aplicação atual concentra praticamente toda a interface e lógica em:

```text
src/App.jsx
```

O arquivo possui aproximadamente 758 linhas e reúne:

```text
estado global
carregamento de dados
Header
página inicial
consulta pública
login administrativo
painel administrativo
triagem de solicitações
gestão de estoque
modal de solicitação
identificação de beneficiário
cadastro/atualização de beneficiário
upload de receita
criação de solicitação
consentimento LGPD
modal de doação
navegação
```

A nova arquitetura não deve transformar esse arquivo diretamente em um único `page.tsx`. Ele servirá como fonte de comportamento para decomposição.

---

# 4. Navegação atual

A navegação atual não utiliza rotas reais.

O aplicativo usa estado React:

```js
const [activeTab, setActiveTab] = useState('inicio');
```

A navegação é feita por valores como:

```text
inicio
consulta
admin
```

O painel admin também usa estado interno:

```js
const [adminTab, setAdminTab] = useState('pedidos');
```

Portanto, a navegação atual deve ser entendida como:

```text
SPA + tabs internas
```

e não como:

```text
/farmacia
/farmacia/estoque
/admin/solicitacoes
```

As rotas reais serão introduzidas na migração.

---

# 5. Estado e carregamento inicial de dados

O `App.jsx` chama:

```js
useEffect(() => {
  carregarDadosDoSupabase();
}, []);
```

A função `carregarDadosDoSupabase()` atualmente consulta diretamente o Supabase.

## Medicamentos

```js
supabase
  .from('medicamentos')
  .select('*');
```

O resultado é transformado para uma estrutura usada pelo frontend:

```text
id
nome
principio
categoria
apresentacao
```

A apresentação atual é derivada de:

```text
medicamentos.forma_farmaceutica
```

## Lotes

O frontend consulta:

```js
supabase
  .from('estoque_lotes')
  .select('*');
```

e mapeia campos como:

```text
id
medicamento_id
lote
validade
qtd_caixas
unidades_por_caixa
doador
```

## Solicitações

O frontend consulta:

```js
supabase
  .from('solicitacoes')
  .select(`
    *,
    beneficiarios (
      id,
      nome,
      cpf,
      whatsapp,
      endereco
    )
  `)
```

e ordena por `created_at` decrescente.

---

# 6. Achado arquitetural: dados públicos e administrativos estão misturados

O carregamento inicial busca, no mesmo fluxo:

```text
medicamentos
estoque_lotes
solicitacoes
beneficiarios
```

Isso significa que a aplicação atual não possui separação arquitetural entre:

```text
dados públicos
```

e:

```text
dados administrativos/sensíveis
```

A nova arquitetura deverá separar esses fluxos.

## Destino previsto

Público:

```text
Browser
  ↓
GET /api/medicamentos
  ↓
Server
  ↓
Supabase
```

Admin:

```text
Browser autenticado
  ↓
Next.js server/API
  ↓
Supabase
```

---

# 7. Consulta pública de medicamentos

Componente atual:

```text
ConsultaView
```

Responsabilidades:

```text
busca por nome
busca por princípio ativo
filtro por categoria
renderização dos cards
```

O filtro atual utiliza:

```js
med.nome.toLowerCase().includes(...)
med.principio.toLowerCase().includes(...)
```

e categoria.

## Card atual

O card apresenta:

```text
categoria
nome comercial
princípio ativo
apresentação
botão Solicitar e Reservar
```

Exemplo validado:

```text
ACERTALIX

Perindopril arginina 5mg + indapamida 1,25mg

📦 Caixa com 15 comprimidos
```

A função atual é:

```js
formatarApresentacao(apresentacao)
```

Ela expande abreviações como:

```text
cp → comprimidos
co → comprimidos
env → envelopes
bisn → bisnaga
```

Na nova arquitetura, essa responsabilidade deve virar função utilitária tipada e/ou regra de apresentação do componente.

---

# 8. Solicitação de medicamento

Componente atual:

```text
ModalSolicitacaoPaciente
```

O fluxo possui quatro etapas:

```text
1. Identificação segura
2. Dados pessoais
3. Informações clínicas
4. Consentimento LGPD
```

## Estado do formulário

```text
cpf
whatsapp4
nome
whatsapp
endereco
beneficiarioId
tratamento
quantidade
receitaFile
consentimento
```

## Identificação

Atualmente o browser consulta diretamente:

```text
beneficiarios
```

usando:

```text
CPF
+
últimos 4 dígitos do WhatsApp
```

A nova arquitetura deverá mover essa consulta para:

```text
POST /api/beneficiarios/verificar
```

sem revelar se o CPF existe quando não houver correspondência.

---

# 9. Cadastro/atualização de beneficiário

Ao enviar uma solicitação, o frontend atual:

1. limpa o CPF;
2. procura beneficiário existente;
3. se encontra, atualiza nome/WhatsApp/endereço;
4. se não encontra, cria um beneficiário;
5. obtém o ID real;
6. continua o processo.

Operações atuais:

```text
SELECT beneficiarios
UPDATE beneficiarios
INSERT beneficiarios
```

todas executadas diretamente a partir do frontend.

Na arquitetura de destino:

```text
formulário
   ↓
API/server
   ↓
beneficiario
```

---

# 10. Upload de receita

O frontend atual faz upload diretamente para:

```text
Supabase Storage
bucket:
receitas
```

O path atual é baseado no ID do beneficiário:

```text
{beneficiarioId}/{fileName}
```

O frontend registra o caminho em:

```text
receita_url
url_receita
```

A nova arquitetura deverá mudar isso para:

```text
API/server
   ↓
bucket privado
   ↓
receitas/{solicitacao_id}/{timestamp}_{filename}
```

e o acesso administrativo deverá ocorrer por URL assinada temporária.

---

# 11. Criação de solicitação

Atualmente o frontend cria diretamente:

```text
solicitacoes
```

com campos como:

```text
protocolo
beneficiario_id
medicamento_id
qtd_solicitada
tratamento
receita_url
url_receita
consentimento_lgpd
status
```

O status inicial atual é:

```text
PENDENTE
```

## Ponto a revisar

O protocolo atual é gerado no browser com:

```js
Math.floor(100000 + Math.random() * 900000)
```

Isso deverá ser revisado antes da implementação definitiva.

---

# 12. Painel administrativo

O painel atual usa:

```text
AdminLogin
AdminPanel
```

O `AdminPanel` contém duas áreas principais:

```text
Triagem de Pedidos
Gestão de Estoque
```

## Triagem

Mostra atualmente:

```text
status
data
beneficiário
CPF
telefone
medicamento
princípio ativo
quantidade solicitada
```

Ações existentes:

```text
Aprovar
Rejeitar
```

---

# 13. Autenticação administrativa atual

A autenticação atual não é real.

Existe:

```js
const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
```

e o botão de login apenas altera esse estado:

```js
setIsAdminAuthenticated(true)
```

O logout faz:

```js
setIsAdminAuthenticated(false)
```

Portanto:

```text
não existe Supabase Auth real no fluxo atual
não existe sessão administrativa real
não existe proteção server-side de /admin
```

Isso deve ser reconstruído na arquitetura Next.js.

---

# 14. Atualização de status

Hoje a aprovação/rejeição executa diretamente no frontend:

```js
supabase
  .from('solicitacoes')
  .update({ status: novoStatus })
  .eq('id', id)
```

Depois recarrega os dados.

## Limitação

Essa operação ainda não implementa:

```text
qtd_atendida
FEFO
reserva
movimentações
auditoria
notificação
```

Ela apenas altera o status.

Na arquitetura definitiva, as ações críticas deverão passar por server/API e, para operações de estoque, por transação/RPC.

---

# 15. Gestão de estoque atual

A tela atual lista lotes e mostra:

```text
medicamento
lote
validade
quantidade de caixas
```

Não existe ainda, no fluxo atual, a operação completa especificada para:

```text
entrada
descarte
FEFO
reserva
entrega
baixa
cancelamento
```

Essas funcionalidades serão construídas após a migração arquitetural.

---

# 16. Dados importantes já confirmados

## Solicitação

```text
qtd_solicitada
```

representa:

```text
embalagens / caixas solicitadas
```

E a arquitetura de destino deverá usar:

```text
qtd_atendida
```

para representar as embalagens efetivamente aprovadas/atendidas.

## Movimentação

```text
quantidade_unidades
```

representa unidades físicas.

Exemplo:

```text
1 caixa × 15 comprimidos = 15 unidades
```

---

# 17. Regras de negócio que devem ser preservadas na migração

```text
qtd_solicitada = quantidade pedida
qtd_atendida = quantidade aprovada
quantidade_unidades = unidades físicas

aprovação parcial é permitida

FEFO será usado para seleção de lotes

uma solicitação pode utilizar vários lotes

movimentacoes_estoque registra os lotes utilizados

estoque físico não deve ser baixado apenas porque uma solicitação foi aprovada

reserva ocorre antes da entrega

baixa física ocorre na entrega

operação crítica de estoque deve ser atômica
```

---

# 18. Mapa de migração

| Estado Vite atual | Destino Next.js |
|---|---|
| `App.jsx` | decompor em páginas + layouts + componentes |
| `supabaseClient.js` | `lib/supabase/client.ts` |
| consultas públicas | API/server |
| beneficiário | API server-side |
| solicitação | API/server |
| upload receita | API/server + Storage privado |
| `AdminLogin` | `/admin/login` |
| `AdminPanel` | `/admin/*` |
| `ConsultaView` | `/farmacia/estoque` + componentes |
| card medicamento | `components/farmacia/MedicamentoCard.tsx` |
| modal solicitação | Client Component isolado |
| atualização status | API/action administrativa |
| estoque | `/admin/estoque` |
| triagem | `/admin/solicitacoes` |

---

# 19. Problemas que não devem ser simplesmente transportados

Não copiar diretamente para Next.js:

```text
❌ App.jsx monolítico
❌ navegação por tabs no lugar de rotas
❌ consultas sensíveis diretamente no browser
❌ autenticação por booleano React
❌ upload de receita diretamente do fluxo público para Storage
❌ alteração de status diretamente pelo client
❌ protocolo aleatório no browser
❌ carregamento inicial de beneficiários junto com dados públicos
```

---

# 20. Baseline funcional a preservar

Durante a migração, preservar o comportamento já validado de:

```text
✅ consulta pública
✅ busca
✅ cards de medicamentos
✅ apresentação do medicamento
✅ solicitação
✅ identificação por CPF + últimos 4 dígitos
✅ criação/atualização de beneficiário
✅ upload de receita no fluxo existente
✅ consentimento LGPD
✅ gravação de solicitação
✅ triagem
✅ aprovação/rejeição básica
✅ gestão visual de lotes
```

A implementação técnica mudará; a UX validada não deve ser perdida sem justificativa.

---

# 21. Próxima etapa

O próximo passo arquitetural é:

```text
FASE 0-M.3
Criar projeto Next.js + TypeScript + App Router
```

O baseline Vite deve permanecer intacto até que a nova aplicação tenha os fluxos equivalentes validados.

---

# 22. Observação de segurança

Este documento deliberadamente não contém:

```text
SUPABASE_SERVICE_ROLE_KEY
tokens n8n
tokens Evolution API
senhas
.env.local
```

O baseline compartilhado com ferramentas deve utilizar apenas variáveis de ambiente de exemplo.

