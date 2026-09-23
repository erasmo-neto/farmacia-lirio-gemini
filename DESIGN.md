# DESIGN.md — Sistema Visual da v1

## Site Institucional + Farmácia Solidária Lírio dos Vales

**Projeto:** Site Institucional + Farmácia Solidária Lírio dos Vales  
**Igreja:** Igreja Presbiteriana Lírio dos Vales — Tatuí/SP  
**Versão:** 1.0  
**Uso:** Guia visual para humanos e agentes de IA durante a implementação  
**Status:** Direção visual consolidada para a v1  

---

## 1. Objetivo deste documento

Este documento orienta a criação da interface visual do projeto.

Ele deve ser lido antes da implementação de qualquer tela, junto com os documentos oficiais da pasta `/docs`.

O objetivo é garantir que o site institucional, a área pública da Farmácia Solidária e o painel administrativo pareçam partes de um mesmo projeto, com identidade visual coerente, linguagem humana e experiência simples.

Este arquivo orienta:

```txt
paleta de cores
tipografia
atmosfera visual
uso de imagens
layout
botões
cards
formulários
tabelas
dashboard
estados de interface
responsividade
acessibilidade
```

Este arquivo **não substitui** os specs oficiais.

Regras de produto, segurança, dados, LGPD, Supabase, rotas e fluxos continuam sendo definidas por:

```txt
docs/01-product-spec.md
docs/02-ux-spec-rotas-e-fluxos.md
docs/03-technical-spec.md
docs/04-implementation-plan.md
docs/05-backlog.md
docs/06-acceptance-criteria.md
docs/07-lgpd-e-seguranca.md
docs/decisions/001-decisoes-consolidadas-v1.md
```

---

## 2. Personalidade visual

A interface deve comunicar:

```txt
igreja local
acolhimento
seriedade
cuidado
confiança
sobriedade
beleza simples
responsabilidade técnica
serviço cristão
```

O projeto não deve parecer apenas um sistema administrativo. Também não deve parecer apenas uma landing page bonita.

Ele une três dimensões:

```txt
1. Igreja que acolhe
2. Projeto social que serve
3. Sistema que protege dados e organiza a operação
```

### Deve parecer

```txt
humano
pastoral
institucional
moderno
limpo
calmo
confiável
organizado
```

### Não deve parecer

```txt
startup genérica
sistema hospitalar frio
site religioso antiquado
dashboard corporativo sem alma
landing page barulhenta
aplicativo público burocrático
interface infantilizada
```

---

## 3. Princípios visuais

### 3.1. Sobriedade com calor humano

Usar fundos claros, tons creme e bastante respiro, combinados com teal escuro e dourado.

A sensação deve ser de um espaço acolhedor, sério e limpo.

### 3.2. Palavra no centro

O site institucional deve dar destaque à Palavra, à fé reformada e à vida comunitária.

Fotos com Bíblia, púlpito, ensino e comunhão podem ser usadas para reforçar esse eixo.

### 3.3. Clareza antes de decoração

A Farmácia Solidária lida com saúde, medicamentos e dados sensíveis. Por isso, formulários, avisos, estados de erro e confirmações precisam ser claros e diretos.

### 3.4. Uma identidade, três zonas

As três zonas do projeto devem compartilhar a mesma base visual:

```txt
site institucional
área pública da farmácia
painel administrativo
```

Mas cada uma pode ter intensidade diferente:

```txt
site institucional → mais emocional e visual
farmácia pública → acolhedora e informativa
admin → funcional, limpo e objetivo
```

---

## 4. Paleta de cores

A paleta principal vem da identidade visual já usada pela IP Lírio dos Vales.

### 4.1. Cores principais

| Nome | Hex | Uso |
|---|---|---|
| Teal 950 | `#0E1716` | Fundo escuro profundo |
| Teal 900 | `#182524` | Header escuro, footer, blocos fortes |
| Teal 800 | `#263837` | Hero, painéis institucionais |
| Teal 700 | `#354D4C` | Blocos escuros e cards destacados |
| Teal 600 | `#436160` | Ações secundárias e títulos |
| Teal 500 | `#547473` | Cor institucional média |
| Teal 400 | `#6A9392` | Elementos de apoio |
| Teal 100 | `#DCEAEA` | Fundos suaves |
| Teal 50 | `#F0F5F5` | Fundos muito leves |

### 4.2. Cores de destaque

| Nome | Hex | Uso |
|---|---|---|
| Gold | `#B8935A` | Botões principais, detalhes, links importantes |
| Gold 2 | `#D4AF7A` | Hover, destaque suave |
| Gold 3 | `#E8CFA0` | Fundo de alerta suave, detalhes decorativos |

### 4.3. Cores neutras

| Nome | Hex | Uso |
|---|---|---|
| Cream | `#FAF7F2` | Fundo institucional claro |
| Cream 2 | `#F0EBE2` | Seções alternadas |
| Cream 3 | `#E4DDD0` | Bordas e divisores suaves |
| Ink | `#1C1C1C` | Texto principal |
| Ink 60 | `#5A5A5A` | Texto secundário |
| White | `#FFFFFF` | Fundo de cards e texto sobre fundos escuros |

### 4.4. Cores de estado

| Estado | Cor sugerida | Uso |
|---|---|---|
| Sucesso | `#2F7D5C` | Confirmações e aprovações |
| Aviso | `#B8935A` | Vencimento próximo, atenção |
| Erro | `#B84A3A` | Falhas, bloqueios, erros críticos |
| Informação | `#436160` | Avisos neutros e instruções |
| Bloqueado | `#7A3B35` | Lote vencido, medicamento não aceito |

### 4.5. Regras de uso

```txt
Teal escuro → confiança, base institucional, header/footer
Gold → ações principais e detalhes nobres
Cream → acolhimento, respiro e fundo institucional
White → cards e áreas de leitura
Vermelho/erro → usar com moderação, apenas quando houver bloqueio real
```

---

## 5. Tipografia

### 5.1. Fontes recomendadas

| Uso | Fonte |
|---|---|
| Títulos institucionais | Playfair Display |
| Texto, botões e UI | DM Sans |
| Fallback serifado | Georgia, serif |
| Fallback sem serifa | system-ui, sans-serif |

### 5.2. Direção tipográfica

Usar contraste entre uma fonte serifada elegante e uma fonte sem serifa limpa.

```txt
Playfair Display → títulos, frases institucionais, chamadas nobres
DM Sans → navegação, corpo, botões, formulários, painel admin
```

### 5.3. Escala sugerida

| Elemento | Tamanho sugerido |
|---|---|
| Hero H1 | 56–96px desktop / 42–56px mobile |
| H2 | 36–54px desktop / 30–38px mobile |
| H3 | 24–32px |
| Card title | 18–22px |
| Body | 16px |
| Small | 14px |
| Microcopy | 12–13px |

### 5.4. Regras

```txt
Não usar muitos pesos diferentes.
Evitar textos longos em caixa alta.
Usar caixa alta apenas em labels, eyebrow e navegação curta.
Manter boa altura de linha: 1.5 a 1.8.
```

---

## 6. Grid, espaçamento e layout

### 6.1. Largura máxima

| Área | Max width |
|---|---|
| Conteúdo institucional | 1120–1200px |
| Texto corrido | 680–760px |
| Painel admin | 1280–1440px |
| Formulários públicos | 720–860px |

### 6.2. Espaçamento

Usar escala consistente:

```txt
4px
8px
12px
16px
24px
32px
48px
64px
96px
128px
```

### 6.3. Seções

Seções institucionais devem ter bastante respiro:

```txt
padding vertical desktop: 96px a 128px
padding vertical mobile: 56px a 80px
padding horizontal: 5vw ou 24px mobile
```

### 6.4. Layout geral

```txt
landing page → blocos amplos, hero forte, imagens e textos bem respirados
farmácia pública → blocos claros, cards objetivos, CTAs evidentes
formulários → layout em etapas, leitura simples, mensagens claras
admin → grid funcional, cards de indicadores, tabelas limpas
```

---

## 7. Bordas, sombras e cantos

### 7.1. Bordas

Usar bordas discretas:

```txt
1px solid rgba(...)
Cream 3 para divisores claros
Teal 100/200 para bordas suaves
```

### 7.2. Cantos

O visual pode ter cantos levemente arredondados, sem exagero.

```txt
botões: 8px a 12px
cards: 12px a 20px
inputs: 10px a 12px
badges: 999px
```

### 7.3. Sombras

Sombras devem ser suaves, não chamativas.

```txt
cards em fundo claro:
0 12px 40px rgba(38, 56, 55, 0.08)

elementos flutuantes:
0 20px 60px rgba(14, 23, 22, 0.15)
```

---

## 8. Componentes principais

## 8.1. Botões

### Botão primário

Uso:

```txt
ações principais
enviar solicitação
ver disponibilidade
confirmar aprovação
entrar no painel
```

Estilo:

```txt
fundo Gold
texto Teal 950
peso 600 ou 700
padding confortável
hover em Gold 2
```

Texto do botão deve ser claro:

```txt
Ver disponibilidade
Solicitar medicamento
Enviar solicitação
Confirmar aprovação
Marcar como entregue
```

Evitar:

```txt
Clique aqui
Avançar agora mesmo
Finalizar processo
```

### Botão secundário

Uso:

```txt
ações alternativas
voltar
editar
ver detalhes
doar medicamentos
```

Estilo:

```txt
borda Teal 600 ou Teal 500
texto Teal 700
fundo transparente ou branco
```

### Botão fantasma

Uso:

```txt
navegação em fundos escuros
links secundários
hero institucional
```

Estilo:

```txt
borda branca translúcida
texto branco translúcido
hover Gold 2
```

### Botão destrutivo

Uso:

```txt
descartar lote
cancelar solicitação
excluir receita
```

Estilo:

```txt
vermelho sóbrio
texto branco
mensagem de confirmação antes da ação
```

---

## 8.2. Cards

### Card institucional

Uso:

```txt
valores
o que cremos
horários
visão
como funciona
```

Estilo:

```txt
fundo branco ou cream
borda suave
título serifado
texto curto
ícone discreto em Teal ou Gold
```

### Card da Farmácia Solidária

Uso:

```txt
Solicitar medicamento
Doar medicamentos
Como funciona
Critérios de doação
```

Estilo:

```txt
fundo branco
borda Teal 100
CTA evidente
microcopy explicativa
```

### Card de indicador admin

Uso:

```txt
solicitações pendentes
medicamentos em estoque
lotes vencidos
vencendo em 30 dias
```

Estilo:

```txt
fundo branco
número grande
label curta
ícone discreto
estado visual quando crítico
```

---

## 8.3. Formulários

Formulários devem ser simples, com poucos campos por etapa.

### Regras

```txt
labels sempre visíveis
placeholder não substitui label
mensagens de erro inline
inputs com altura confortável
CPF e WhatsApp com teclado numérico
botão desabilitado até campos obrigatórios válidos
```

### Formulário de solicitação

Fluxo visual:

```txt
1. Identificação segura
2. Dados pessoais
3. Medicamento e informações clínicas
4. Confirmação
```

Passo 1:

```txt
CPF
últimos 4 dígitos do WhatsApp
```

Mensagem genérica quando não confirmar:

```txt
Não conseguimos confirmar um cadastro anterior com esses dados. Preencha ou atualize suas informações para continuar.
```

Nunca usar na interface pública:

```txt
CPF não encontrado
CPF já cadastrado
Encontramos seu cadastro
Últimos 4 dígitos incorretos para este CPF
```

### Upload de receita

Deve parecer seguro e simples.

Incluir:

```txt
formatos aceitos: jpg, jpeg, png, pdf
limite: 10MB
aviso de privacidade
estado de carregamento
estado de erro
estado de arquivo anexado
```

---

## 8.4. Tabelas

Tabelas são usadas principalmente no admin.

### Desktop

```txt
cabeçalho fixo quando útil
linhas com hover suave
badges de status
ações alinhadas à direita
filtros no topo
busca visível
```

### Mobile

Tabelas devem virar:

```txt
cards
linhas expansíveis
blocos empilhados
```

Não usar tabela horizontal que exige rolagem difícil no celular, exceto quando inevitável.

---

## 8.5. Badges e status

### Solicitações

| Status | Estilo |
|---|---|
| Pendente | Aviso / Gold suave |
| Em análise | Teal claro |
| Aprovada | Verde |
| Reservada | Teal médio |
| Entregue | Verde escuro |
| Recusada | Vermelho suave |
| Cancelada | Cinza |

### Lotes

| Status | Estilo |
|---|---|
| Ativo | Verde/Teal |
| Vencido | Vermelho |
| Descartado | Cinza |
| Bloqueado | Vermelho escuro |

### Validade

| Estado | Cor |
|---|---|
| Vencido | Vermelho |
| Crítico | Laranja/Gold |
| Atenção | Amarelo suave |
| Normal | Teal/Verde |

---

## 9. Estados de interface

Toda tela que busca dados deve prever estados.

### Loading

Usar:

```txt
skeleton loader
spinner discreto
mensagem curta quando necessário
```

Evitar tela em branco.

### Erro

Mensagem humana e objetiva.

Exemplo:

```txt
Não foi possível carregar os dados agora. Tente novamente em alguns instantes.
```

Sempre que possível, incluir botão:

```txt
Tentar novamente
```

### Vazio

Exemplos:

```txt
Nenhum medicamento encontrado.
Nenhuma solicitação pendente.
Nenhum lote crítico no momento.
Nenhuma movimentação registrada no período.
```

### Sucesso

Mensagem clara e tranquila.

Exemplo:

```txt
Sua solicitação foi enviada com sucesso. A equipe responsável fará a análise e entrará em contato pelo WhatsApp informado.
```

---

## 10. Site institucional

### Objetivo visual

Comunicar:

```txt
igreja reformada
comunidade acolhedora
Palavra no centro
família da fé
beleza simples
seriedade pastoral
```

### Seções recomendadas

```txt
Hero
Quem somos
O que cremos
Horários
Localização
Contato
Chamada para Farmácia Solidária
```

### Imagens

Priorizar:

```txt
Bíblia aberta
culto visto de trás
púlpito
ambiente interno
comunhão
pregação
grupo autorizado
```

Evitar:

```txt
fotos muito escuras
fotos tremidas
close de pessoas sem autorização
crianças identificáveis sem autorização
```

---

## 11. Área pública da Farmácia Solidária

### Objetivo visual

Comunicar:

```txt
cuidado
responsabilidade
clareza
acolhimento
segurança
serviço cristão
```

### Página `/farmacia`

Deve conter:

```txt
explicação do projeto
missão, visão e valores
como funciona
aviso de que disponibilidade não garante retirada automática
card Solicitar medicamento
card Doar medicamentos
```

O card Solicitar medicamento deve levar para:

```txt
/farmacia/estoque
```

Nunca diretamente para:

```txt
/farmacia/solicitar
```

### Página `/farmacia/estoque`

Deve ser objetiva.

Mostrar:

```txt
nome comercial
princípio ativo
dosagem
forma farmacêutica
status disponível/indisponível
```

Nunca mostrar:

```txt
quantidade
lote
validade
doador
dados internos
```

### Página `/farmacia/doar`

Deve destacar claramente o que não é aceito:

```txt
medicamentos controlados
medicamentos manipulados
medicamentos termolábeis
medicamentos vencidos
medicamentos com embalagem violada
```

---

## 12. Painel administrativo

### Objetivo visual

Comunicar:

```txt
controle
clareza
segurança
rastreabilidade
agilidade
```

O painel pode ser mais funcional que emocional, mas ainda deve manter a identidade da igreja.

### Layout

```txt
sidebar ou header administrativo
cards de indicadores no topo
filtros visíveis
tabelas limpas
ações bem agrupadas
alertas destacados sem poluição visual
```

### Dashboard

Priorizar leitura rápida:

```txt
solicitações pendentes
medicamentos em estoque
lotes vencidos
lotes vencendo
recebidas nos últimos 30 dias
aprovadas nos últimos 30 dias
```

### Admin mobile

O painel deve funcionar no celular, mas não precisa parecer um app nativo.

No mobile:

```txt
cards empilhados
tabelas como cards
ações principais sempre visíveis
evitar colunas apertadas
```

---

## 13. Uso de imagens

As imagens reais devem ser organizadas em:

```txt
assets/imagens-igreja/ambiente-interno
assets/imagens-igreja/comunidade
assets/imagens-igreja/culto
assets/imagens-igreja/ensino
assets/imagens-igreja/farmacia-solidaria
assets/imagens-igreja/fachada
```

### Boas imagens para usar

```txt
Bíblia aberta em primeiro plano
púlpito
pregador autorizado
culto visto de trás
sala de comunhão
grupo adulto autorizado
ambiente interno bem iluminado
medicamentos organizados, sem dados sensíveis
```

### Cuidados

Antes de usar fotos com pessoas identificáveis, especialmente crianças e adolescentes, verificar autorização de imagem.

Não usar imagens que mostrem:

```txt
receitas médicas legíveis
CPF
endereços
dados pessoais
beneficiários em situação vulnerável sem consentimento
crianças identificáveis sem autorização
```

---

## 14. Referências visuais

A pasta abaixo contém referências de estilo:

```txt
assets/referencias-visuais/
```

Esses arquivos ajudam a orientar:

```txt
paleta
atmosfera
tipografia
layout
hero
cards
formulários
dashboard
```

Mas não são fonte oficial de conteúdo, regra de negócio ou fluxo.

Se houver conflito entre uma referência visual e os documentos de `/docs`, os documentos de `/docs` prevalecem.

---

## 15. Acessibilidade

### Regras mínimas

```txt
contraste adequado entre texto e fundo
texto não menor que 14px em UI
labels visíveis em formulários
foco visível em botões e inputs
botões com área de toque confortável
uso moderado de animações
não depender apenas de cor para indicar status
```

### Área de toque

Botões e ações devem ter pelo menos:

```txt
44px de altura
```

### Estados por cor

Quando usar cor para status, acompanhar com texto.

Exemplo:

```txt
🔴 Vencido
🟠 Crítico
🟡 Atenção
✅ Disponível
❌ Indisponível
```

---

## 16. Microcopy

A linguagem deve ser:

```txt
clara
humana
respeitosa
direta
sem jargão técnico desnecessário
sem prometer o que o projeto não pode garantir
```

### Bons exemplos

```txt
A disponibilidade exibida está sujeita à confirmação da equipe responsável.
Sua solicitação será analisada antes da retirada.
Não conseguimos confirmar um cadastro anterior com esses dados. Preencha ou atualize suas informações para continuar.
Este lote está vencido e não pode ser cadastrado no estoque da Farmácia Solidária.
```

### Evitar

```txt
CPF inválido no banco
Usuário inexistente
Erro 500
Falha no payload
Paciente recusado
Cadastro encontrado
```

---

## 17. Animações

Animações devem ser discretas.

Usar:

```txt
fade in
slide up leve
hover suave
transições de cor
skeleton loading
```

Evitar:

```txt
movimentos exagerados
parallax pesado
animações contínuas sem necessidade
efeitos que prejudiquem leitura
```

---

## 18. Ícones

Usar ícones simples, lineares e consistentes.

Sugestão:

```txt
lucide-react
```

Ícones devem apoiar o texto, não substituir o texto.

Exemplos:

```txt
calendar → horários
map-pin → localização
heart-handshake → serviço/cuidado
pill → medicamento
shield → segurança
file-text → receita
users → comunidade
book-open → Palavra/ensino
```

---

## 19. Tailwind e tokens

Na implementação, mapear a paleta no Tailwind.

Sugestão de nomes:

```txt
brand-teal-950
brand-teal-900
brand-teal-800
brand-teal-700
brand-teal-600
brand-teal-500
brand-teal-100
brand-teal-50

brand-gold
brand-gold-2
brand-gold-3

brand-cream
brand-cream-2
brand-cream-3
```

Evitar usar hex solto espalhado pelos componentes.

Preferir tokens e classes reutilizáveis.

---

## 20. Componentização sugerida

### Componentes globais

```txt
Button
Card
SectionHeader
Container
StatusBadge
EmptyState
ErrorState
LoadingSkeleton
```

### Site institucional

```txt
SiteHeader
SiteFooter
HeroSection
AboutSection
BeliefsSection
ScheduleSection
LocationSection
ContactSection
```

### Farmácia pública

```txt
FarmaciaHero
HowItWorks
ActionCard
MedicationSearch
MedicationResultCard
RequestFormStepper
DonationGuidelines
```

### Admin

```txt
AdminLayout
AdminSidebar
DashboardCard
AdminTable
FilterBar
RequestDetail
LotSelector
AuditLogItem
```

---

## 21. O que evitar

```txt
mudar paleta sem necessidade
misturar muitas fontes
usar sombras pesadas
usar gradientes coloridos demais
copiar layout de startup genérica
usar linguagem fria em fluxos públicos
esconder avisos importantes
mostrar dados internos no público
criar telas que não estão previstas nos specs
implementar componentes sem reutilização
```

---

## 22. Regra para agentes de IA

Antes de implementar qualquer tela, o agente deve ler:

```txt
README.md
DESIGN.md
docs/decisions/001-decisoes-consolidadas-v1.md
docs/02-ux-spec-rotas-e-fluxos.md
docs/03-technical-spec.md
docs/06-acceptance-criteria.md
```

Ao implementar uma tela, o agente deve respeitar:

```txt
rotas definidas
fluxos definidos
paleta definida
componentes reutilizáveis
regras de segurança
regras de privacidade
estados de loading, erro, vazio e sucesso
```

Se houver conflito entre este arquivo e os specs de `/docs`, os specs de `/docs` prevalecem.

---

## 23. Status

```txt
Status: direção visual consolidada para a v1.
Uso: guia para criação da interface e base inicial do design system.
Próxima etapa: transformar este guia em tokens, componentes e padrões reutilizáveis no código.
```
