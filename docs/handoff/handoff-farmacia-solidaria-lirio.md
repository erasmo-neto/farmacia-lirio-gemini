# HANDOFF — Farmácia Solidária Lírio dos Vales

**Data:** 23/09/2026
**Objetivo:** continuar o desenvolvimento/debug do projeto em outro chat sem perder o contexto técnico e as decisões já tomadas.

---

## 1. Projeto

Aplicação web da **Farmácia Solidária Lírio dos Vales**, desenvolvida com:

- React
- Vite
- Supabase
- Tailwind CSS
- Lucide React
- GitHub
- Vercel

Repositório:

```text
github.com/erasmo-neto/farmacia-lirio-gemini
```

Branch principal:

```text
main
```

Arquivo principal atualmente trabalhado:

```text
src/App.jsx
```

Cliente Supabase:

```text
src/supabaseClient.js
```

---

# 2. ESTADO ATUAL

A aplicação está atualmente:

```text
✅ Compilando localmente
✅ npm run build funcionando
✅ Commit enviado ao GitHub
✅ Deploy de produção funcionando no Vercel
✅ Consulta pública funcionando
✅ Apresentação dos medicamentos aparecendo nos cards
✅ Solicitação de paciente funcionando
✅ Beneficiário sendo criado/atualizado
✅ Solicitação sendo gravada no Supabase
✅ Painel administrativo funcionando
✅ Aprovação/rejeição de solicitação funcionando
```

O último deploy foi confirmado como **Ready / Production** no Vercel.

O último problema de build foi corrigido e o projeto voltou a ser publicado normalmente.

---

# 3. ÚLTIMO PROBLEMA RESOLVIDO

Foi introduzida a apresentação do medicamento no card público.

O objetivo era sair de:

```text
15 comprimidos
```

para:

```text
Caixa com 15 comprimidos
```

A aplicação agora exibe no card aproximadamente:

```text
ACERTALIX

Perindopril arginina 5mg + indapamida 1,25mg

📦 Caixa com 15 comprimidos

[ Solicitar e Reservar ]
```

A apresentação é transformada por uma função:

```jsx
const formatarApresentacao = (apresentacao) => {
  if (!apresentacao) return null;

  return apresentacao
    .replace(/\bcp\b/gi, 'comprimidos')
    .replace(/\bco\b/gi, 'comprimidos')
    .replace(/\bdrágeas\b/gi, 'drágeas')
    .replace(/\bsachés\b/gi, 'sachês')
    .replace(/\benv\b/gi, 'envelopes')
    .replace(/\bbisn\b/gi, 'bisnaga');
};
```

Ela está localizada logo depois da função de carregamento de dados no `App.jsx`.

No carregamento dos medicamentos, o frontend atualmente utiliza:

```jsx
apresentacao: m.forma_farmaceutica || null
```

---

# 4. ERRO DE JSX QUE FOI CORRIGIDO

Durante a implementação da apresentação, o bloco JSX foi inserido no meio da abertura de um `<button>`, causando:

```text
Unexpected token
```

Depois havia um botão duplicado no card, provocando:

```text
Adjacent JSX elements must be wrapped in an enclosing tag.
```

O bloco duplicado foi removido.

Depois disso:

```bash
npm run build
```

passou com sucesso.

Os avisos restantes:

```text
[lightningcss minify] Unknown at rule: @tailwind
```

não impediram o build.

---

# 5. ESTRUTURA ATUAL DO CARD DE MEDICAMENTO

A região relevante em `ConsultaView` está estruturada assim:

```jsx
{medicamentosFiltrados.map(med => (
  <div
    key={med.id}
    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
  >
    <div className="p-5 flex-1">

      <span>
        {med.categoria}
      </span>

      <h3>
        {med.nome}
      </h3>

      <p>
        {med.principio}
      </p>

      {med.apresentacao && (
        <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <Box className="w-4 h-4 text-emerald-600" />
          <span>
            Caixa com {formatarApresentacao(med.apresentacao)}
          </span>
        </div>
      )}

    </div>

    <div className="bg-slate-50 p-4 border-t border-slate-100">
      <button>
        <FileText className="w-4 h-4" />
        Solicitar e Reservar
      </button>
    </div>
  </div>
))}
```

A estrutura original da `ConsultaView` pode ser conferida na região correspondente do arquivo.

---

# 6. BANCO DE DADOS

## `medicamentos`

Estrutura principal:

```text
id
nome_comercial
principio_ativo
dosagem
forma_farmaceutica
tipo_validade_receita
created_at
categoria
```

O projeto utiliza atualmente `forma_farmaceutica` como origem da apresentação pública.

---

## `estoque_lotes`

Estrutura confirmada:

```text
id uuid
medicamento_id uuid
numero_lote text
data_validade date
qtd_caixas integer
unidades_por_caixa integer
qtd_total_unidades integer
data_entrada date
parceiro_doador text
created_at timestamptz
apresentacao text
```

A coluna:

```text
apresentacao
```

foi adicionada ao lote.

Todos os lotes atuais foram preenchidos com apresentação correspondente ao medicamento.

Também foi executada uma conferência:

```sql
qtd_total_unidades =
qtd_caixas * unidades_por_caixa
```

e os lotes existentes estavam consistentes.

---

## `solicitacoes`

Estrutura relevante:

```text
id
protocolo
beneficiario_id
medicamento_id
lote_id
qtd_solicitada
qtd_atendida
data_emissao_receita
url_receita
tipo_entrega
justificativa_domicilio
status
observacoes_admin
analisado_por
data_analise
data_entrega
created_at
tratamento
receita_url
consentimento_lgpd
```

Regra definida:

```text
qtd_solicitada = quantidade pedida pelo beneficiário
qtd_atendida   = quantidade efetivamente aprovada/dispensada pela equipe
```

A baixa de estoque deverá usar:

```text
qtd_atendida
```

e **não** `qtd_solicitada`.

---

# 7. CORREÇÃO IMPORTANTE JÁ FEITA NO BANCO

A FK de:

```text
solicitacoes.beneficiario_id
```

estava apontando incorretamente para:

```text
perfis(id)
```

Foi corrigida para:

```text
beneficiarios(id)
```

com:

```text
ON UPDATE CASCADE
ON DELETE RESTRICT
```

Também foi verificado que não existiam solicitações órfãs.

Depois disso, uma nova solicitação de paciente foi criada com sucesso e apareceu corretamente no painel administrativo.

---

# 8. BENEFICIÁRIOS

O fluxo atual funciona assim:

### Passo 1

Paciente informa:

```text
CPF
últimos 4 dígitos do WhatsApp
```

O sistema procura em:

```text
beneficiarios
```

---

### Passo 2

Caso encontre:

```text
nome
whatsapp
endereco
```

são preenchidos.

Caso não encontre, os dados são preenchidos manualmente.

---

### Ao enviar

O sistema:

1. verifica novamente o CPF;
2. cria ou atualiza o beneficiário;
3. obtém o UUID real do beneficiário;
4. faz upload da receita;
5. cria a solicitação.

O código atual utiliza:

```jsx
beneficiario_id: currentBeneficiarioId
```

e:

```jsx
qtd_solicitada: quantidade
```

O arquivo mostra esse fluxo explicitamente.

---

# 9. QUANTIDADE SOLICITADA

A interface já foi alterada para quantidade numérica.

No estado:

```jsx
const [quantidade, setQuantidade] = useState(1);
```

E o campo utiliza:

```jsx
<input
  type="number"
  min="1"
  required
  value={quantidade}
  onChange={e => setQuantidade(Number(e.target.value))}
/>
```

A regra conceitual é:

```text
Paciente pede → número de embalagens

Exemplo:

1 embalagem
2 embalagens
5 embalagens
```

---

# 10. PAINEL ADMINISTRATIVO

Atualmente existe:

```text
Painel Admin
├── Triagem de Pedidos
└── Gestão de Estoque
```

A triagem já mostra:

```text
status
data
beneficiário
CPF
telefone
medicamento
princípio ativo
qtd_solicitada
```

e possui:

```text
Aprovar
Rejeitar
```

O relacionamento com `beneficiarios` já está sendo carregado no `select`.

---

# 11. PROBLEMA FUNCIONAL AINDA PENDENTE — AUTENTICAÇÃO ADMINISTRATIVA

**A autenticação administrativa real ainda NÃO foi implementada.**

Atualmente o login antigo fazia essencialmente:

```jsx
onClick={() => setIsAdminAuthenticated(true)}
```

Isso significa que o acesso ao painel ainda não representa uma autenticação real do Supabase.

Esse é um dos próximos pontos a corrigir.

### Objetivo

Implementar:

```text
Supabase Auth
↓
signInWithPassword()
↓
sessão
↓
painel admin
```

e no logout:

```text
supabase.auth.signOut()
```

Também deverá existir verificação de sessão ao carregar a aplicação.

---

# 12. PROBLEMA FUNCIONAL MAIS IMPORTANTE — ESTOQUE

A aprovação atual **ainda não faz baixa/reserva do estoque**.

Hoje a lógica é essencialmente:

```jsx
await supabase
  .from('solicitacoes')
  .update({ status: novoStatus })
  .eq('id', id);
```

Portanto:

```text
Aprovar
↓
status = APROVADO
```

mas ainda não:

```text
Aprovar
↓
qtd_atendida
↓
FEFO
↓
lotes
↓
movimentação
↓
estoque
```

---

# 13. MODELO DE ESTOQUE DEFINIDO

Foi tomada a decisão de usar **FEFO**:

```text
First Expire, First Out
```

Ou seja:

```text
primeiro lote a vencer
↓
primeiro lote utilizado
```

Exemplo:

```text
Solicitação: 3 embalagens

Lote A
validade mais próxima
2 embalagens

Lote B
validade seguinte
1 embalagem

Resultado:
2 × Lote A
1 × Lote B
```

---

# 14. MOVIMENTAÇÕES DE ESTOQUE

A tabela já existe:

```text
movimentacoes_estoque
```

Estrutura:

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

FKs existentes:

```text
lote_id → estoque_lotes(id)
realizado_por → perfis(id)
solicitacao_id → solicitacoes(id)
```

**Não criar uma nova tabela de movimentações.**

---

# 15. DECISÃO DE MODELAGEM IMPORTANTÍSSIMA

A aplicação trabalha com duas unidades:

### Solicitação

```text
qtd_solicitada
qtd_atendida
```

representam:

```text
embalagens / caixas
```

### Movimentação

```text
quantidade_unidades
```

representa:

```text
unidades físicas
```

Exemplo:

```text
1 caixa
×
15 comprimidos

=
15 unidades
```

Portanto:

```text
qtd_atendida = 1
quantidade_unidades = 15
```

---

# 16. APROVAÇÃO PARCIAL

Foi definido que a equipe administrativa poderá alterar a quantidade efetivamente atendida.

Exemplo:

```text
Paciente solicitou:
5 embalagens

Equipe aprova:
3 embalagens
```

Então:

```text
qtd_solicitada = 5
qtd_atendida = 3
```

Regras:

```text
0 <= qtd_atendida <= qtd_solicitada
```

Para aprovação:

```text
qtd_atendida > 0
```

A baixa de estoque será baseada em:

```text
qtd_atendida
```

---

# 17. NÃO FAZER A BAIXA DIRETAMENTE NO REACT

Foi definida uma decisão arquitetural:

**não fazer a baixa simplesmente com vários `.update()` no frontend.**

A operação deve ser atômica no PostgreSQL utilizando uma:

```text
RPC / função SQL / transaction
```

porque precisamos evitar:

```text
Usuário A aprova
+
Usuário B aprova simultaneamente
↓
ambos enxergam o mesmo estoque
↓
estoque fica negativo ou inconsistente
```

A operação precisa garantir atomicidade.

---

# 18. `lote_id` DA SOLICITAÇÃO

A coluna:

```text
solicitacoes.lote_id
```

será mantida.

Ela pode representar o lote principal/primeiro lote utilizado.

Mas, quando uma solicitação utilizar vários lotes:

```text
solicitação
├── Lote A
├── Lote B
└── Lote C
```

a fonte oficial de auditoria será:

```text
movimentacoes_estoque
```

com uma movimentação para cada lote.

---

# 19. QUESTÃO A VERIFICAR ANTES DE CRIAR A RPC

Antes de escrever a função SQL definitiva, ainda precisamos confirmar os valores usados atualmente em:

```text
movimentacoes_estoque.tipo
```

Executar no Supabase:

```sql
SELECT DISTINCT tipo
FROM public.movimentacoes_estoque
ORDER BY tipo;
```

E também:

```sql
SELECT
  id,
  lote_id,
  tipo,
  quantidade_unidades,
  solicitacao_id,
  realizado_por,
  observacao,
  created_at
FROM public.movimentacoes_estoque
ORDER BY created_at DESC
LIMIT 20;
```

Isso evitará inventarmos valores para `tipo`.

---

# 20. OUTRO PONTO A REVISAR — PROTOCOLO

O frontend atualmente ainda contém geração de protocolo:

```jsx
protocolo: Math.floor(100000 + Math.random() * 900000)
```

Foi identificada a possibilidade de deixar o banco gerar o protocolo via sequence/default.

**Ainda não foi feita essa alteração.**

Antes de alterar, confirmar a definição atual da coluna `protocolo` no Supabase.

---

# 21. APRESENTAÇÃO DOS LOTES

Foi criada:

```text
estoque_lotes.apresentacao
```

porque a apresentação pode variar entre lotes.

Isso é importante porque alguns medicamentos podem aparecer no inventário com apresentações diferentes.

Exemplos encontrados no inventário:

```text
15 cp
21 drágeas
2 sachés
3 bisnagas
1 ampola
8 cp e 1 inalador
```

Portanto, não devemos assumir que todos os lotes de um medicamento têm necessariamente a mesma apresentação.

---

# 22. DECISÃO DE UX PÚBLICA

O beneficiário:

### DEVE ver

```text
Nome
Princípio ativo
Categoria
Apresentação
```

### NÃO DEVE ver

```text
quantidade em estoque
número do lote
doador
dados operacionais
```

A apresentação serve para explicar o que significa:

```text
1 embalagem
```

Exemplo:

```text
📦 Caixa com 15 comprimidos
```

---

# 23. PROBLEMA ARQUITETURAL IDENTIFICADO NO CARREGAMENTO DE DADOS

No arquivo atual, o carregamento inicial chama:

```jsx
carregarDadosDoSupabase();
```

e essa função originalmente carrega:

```text
medicamentos
estoque_lotes
solicitacoes
beneficiarios
```

inclusive dados sensíveis de beneficiários.

O `select` atual das solicitações traz:

```text
beneficiarios (
  id,
  nome,
  cpf,
  whatsapp,
  endereco
)
```

Foi identificada a necessidade de separar:

```text
carregarDadosPublicos()
```

de:

```text
carregarDadosAdmin()
```

### Público

Somente:

```text
medicamentos
```

### Admin autenticado

```text
estoque_lotes
solicitacoes
beneficiarios
```

Essa alteração **ainda não foi aplicada no código final**.

---

# 24. ORDEM RECOMENDADA PARA A PRÓXIMA SESSÃO

A sequência recomendada é:

```text
FASE A
Autenticação Supabase real
        ↓
FASE B
Separação de dados públicos/admin
        ↓
FASE C
qtd_atendida na triagem
        ↓
FASE D
FEFO
        ↓
FASE E
RPC transacional para estoque
        ↓
FASE F
movimentacoes_estoque
        ↓
FASE G
testes completos de aprovação
        ↓
FASE H
entrega/cancelamento/recusa
```

---

# 25. O QUE NÃO DEVE SER ALTERADO SEM NECESSIDADE

Já está funcionando e deve ser preservado:

```text
✅ FK beneficiario_id
✅ fluxo de criação/atualização do beneficiário
✅ upload da receita
✅ consentimento LGPD
✅ qtd_solicitada numérica
✅ consulta pública
✅ apresentação no card
✅ triagem administrativa
✅ aprovação/rejeição básica
✅ deploy Vercel
```

---

# 26. REGRA DE TRABALHO PARA O PRÓXIMO CHAT

O usuário definiu explicitamente:

> **Sempre indicar a posição exata dentro do código onde inserir ou substituir alterações.**

Portanto, todas as próximas instruções de código devem seguir este formato:

### Local exato

```text
src/App.jsx
linhas X–Y
dentro de NomeDoComponente
```

### Código atual

```jsx
// trecho existente
```

### Substituir por

```jsx
// novo trecho
```

ou:

### Inserir imediatamente depois de

```jsx
// trecho âncora
```

Não indicar apenas “procure a função”.

---

# 27. PROTOCOLO DE DEBUG

Sempre que houver erro:

1. pedir o erro completo;
2. localizar arquivo e linha;
3. pedir o trecho exato daquela região quando necessário;
4. fornecer substituição cirúrgica;
5. mandar executar:

```bash
npm run build
```

6. somente depois fazer:

```bash
git add .
git commit ...
git push
```

7. conferir o Vercel.

Essa abordagem funcionou para o último erro de JSX.

---

# 28. ESTADO DO GIT / VERCEL

O último deployment confirmado:

```text
🟢 Ready
Production
main
```

O commit anterior que havia falhado:

```text
e5fb5bc
feat: adicionar apresentacao dos...
```

O commit posterior corrigindo o JSX:

```text
6b7b913
fix: corrigir estrutura JSX da apresentação
```

Depois houve novo commit para a melhoria:

```text
feat: melhorar apresentação dos medicamentos
```

e o usuário confirmou que o deploy deu certo.

---

# 29. ARQUIVO DE REFERÊNCIA

O arquivo completo que foi analisado nesta conversa foi:

```text
Código colado(1).js
```

Ele possui **769 linhas** e corresponde à versão do `App.jsx` analisada durante o debug.

A versão final atual do código no computador do usuário pode ter pequenas diferenças posteriores, portanto **não assumir que cada número de linha desse arquivo continua idêntico**. Para alterações novas, localizar novamente o trecho no arquivo atual.

---

# 30. PROMPT PRONTO PARA COLAR NO NOVO CHAT

Copie e cole o bloco abaixo no próximo chat:

```text
Estou continuando o desenvolvimento da Farmácia Solidária Lírio dos Vales.

CONTEXTO DO PROJETO
- React + Vite + Supabase + Tailwind + Lucide
- GitHub: github.com/erasmo-neto/farmacia-lirio-gemini
- branch: main
- deploy: Vercel
- arquivo principal: src/App.jsx
- npm run build está funcionando
- Vercel Production está funcionando

O QUE JÁ ESTÁ FUNCIONANDO
- Consulta pública de medicamentos
- Pesquisa por nome/princípio ativo
- Apresentação do medicamento no card
- Formato atual desejado:
  ACERTALIX
  Perindopril arginina 5mg + indapamida 1,25mg
  📦 Caixa com 15 comprimidos
- Solicitação de paciente
- Verificação de CPF + últimos 4 dígitos do WhatsApp
- Criação/atualização de beneficiário
- Upload de receita
- consentimento LGPD
- gravação de solicitacoes
- painel administrativo
- aprovação/rejeição básica

BANCO
Tabela medicamentos:
id, nome_comercial, principio_ativo, dosagem, forma_farmaceutica, categoria...

Tabela estoque_lotes:
id, medicamento_id, numero_lote, data_validade, qtd_caixas,
unidades_por_caixa, qtd_total_unidades, data_entrada,
parceiro_doador, apresentacao...

Tabela solicitacoes:
id, protocolo, beneficiario_id, medicamento_id, lote_id,
qtd_solicitada, qtd_atendida, receita_url, url_receita,
status, tratamento, consentimento_lgpd...

Tabela movimentacoes_estoque:
id, lote_id, tipo, quantidade_unidades,
solicitacao_id, realizado_por, observacao, created_at

DECISÕES DE NEGÓCIO
- Beneficiário não vê quantidade de estoque.
- Beneficiário vê apresentação.
- qtd_solicitada = quantidade pedida pelo beneficiário.
- qtd_atendida = quantidade efetivamente aprovada pela equipe.
- Pode haver aprovação parcial.
- Estoque deve usar FEFO.
- Uma solicitação pode consumir vários lotes.
- movimentacoes_estoque registra cada lote utilizado.
- quantidade_unidades é em unidades físicas.
- qtd_atendida é em embalagens/caixas.
- Baixa de estoque deve ser atômica no PostgreSQL/RPC, não em múltiplos updates no React.
- Manter solicitacoes.lote_id por enquanto.

PENDÊNCIAS IMPORTANTES
1. Implementar autenticação administrativa real com Supabase Auth.
2. Separar carregamento de dados públicos de dados administrativos.
3. Adicionar/editar qtd_atendida no painel de triagem.
4. Implementar aprovação FEFO.
5. Criar RPC/transação para baixa/reserva de estoque.
6. Criar movimentacoes_estoque corretamente.
7. Implementar tratamento de recusa/cancelamento/entrega.
8. Verificar os valores existentes de movimentacoes_estoque.tipo antes da RPC.
9. Revisar geração do protocolo, pois atualmente existe geração no frontend.
10. Rever a origem da apresentação pública, pois estoque_lotes.apresentacao existe e pode variar por lote.

IMPORTANTE
O usuário sempre quer a posição EXATA da alteração no código.
Toda resposta que pedir alteração deve indicar:
- arquivo
- componente/função
- linhas aproximadas
- trecho atual/âncora
- trecho completo para substituir/inserir.

NÃO fazer alterações genéricas ou presumidas.
Sempre testar com:
npm run build
antes de pedir git commit/push.

PRÓXIMA TAREFA
Começar pela autenticação administrativa real via Supabase Auth e, depois, separar os dados públicos dos administrativos.
```

**Esse é o estado consolidado para continuar o projeto no próximo chat.**