# 01 — Product Spec
## Site Institucional + Farmácia Solidária Lírio dos Vales
**Igreja Presbiteriana Lírio dos Vales — Tatuí/SP**
Versão: 1.0 | Data: 2026-05-19

---

## Visão geral do projeto

A Igreja Presbiteriana Lírio dos Vales, localizada na Av. Prof.ª Zilah de Aquino, 1150, Vila Paulina, Tatuí/SP, conduz um projeto diaconal chamado **Farmácia Solidária Lírio dos Vales**: uma iniciativa social que recebe doações de medicamentos de laboratórios parceiros e distribui gratuitamente para pessoas em situação de necessidade, sob responsabilidade técnica da farmacêutica Dra. Monique Camprubi Pereira (CRF nº 104872).

Este sistema web existe para dar estrutura digital ao projeto: comunicar a missão da igreja e da Farmácia Solidária ao público, permitir que beneficiários consultem o estoque e enviem solicitações, e oferecer à equipe administrativa uma ferramenta confiável de gestão de estoque, solicitações e indicadores operacionais.

Tudo hospedado num único domínio, num único projeto Next.js, com um único deploy.

---

## Identidade institucional

### Missão
Expressar o amor de Cristo por meio do cuidado com a saúde, oferecendo medicamentos gratuitos, orientação farmacêutica responsável e educação sobre o uso correto dos medicamentos.

### Visão
Ser referência em serviço cristão e cuidado com a saúde na cidade de Tatuí, levando acesso, orientação e esperança às pessoas que mais precisam.

### Valores
- Amor ao próximo
- Ética e responsabilidade técnica
- Transparência e legalidade
- Serviço cristão
- Compromisso com a comunidade

### Como o projeto surgiu
A Farmácia Solidária nasceu de uma realidade concreta de Tatuí: muitas pessoas precisam escolher entre comprar comida ou remédio, enquanto medicamentos em bom estado são descartados por vencimento em estoques e prateleiras.

O projeto foi idealizado pelo Dr. Javier Oscar Villalpando Rosas (médico ortopedista atuante em Tatuí) e sua esposa, Dra. Patrícia Neves Villalpando, com o objetivo inicial de atender membros da IP Lírio dos Vales. Com o amadurecimento da iniciativa, a visão se expandiu para alcançar toda a comunidade de Tatuí.

A Dra. Monique Camprubi Pereira integrou o projeto como farmacêutica responsável técnica, garantindo que recebimento, armazenamento e distribuição seguissem as orientações do CRF e a legislação vigente. Após cumprimento das exigências legais, a Farmácia Solidária foi oficialmente constituída.

### Responsabilidade técnica e pastoral
| Papel | Nome | Registro |
|---|---|---|
| Farmacêutica responsável | Dra. Monique Camprubi Pereira | CRF/SP nº 104872 |
| Pastor responsável | Rev. Erasmo Consani Neto | — |
| Autores do projeto | Dr. Javier Oscar Villalpando Rosas e Dra. Patrícia Neves Villalpando | — |
| Registro CRF do projeto | — | nº 96633 |

### Fundamentação cristã e diaconal
A Farmácia Solidária entende que a igreja anuncia o Evangelho não apenas por palavras, mas por ações concretas de cuidado, compaixão e serviço à cidade. Dois textos orientam a identidade pública do projeto:

> *"Procurem a paz da cidade para onde eu os deportei e orem por ela ao SENHOR."* — Jeremias 29.7

> *"Estive enfermo, e vocês cuidaram de mim."* — Mateus 25.36

### Restrições de medicamentos (base legal e técnica)
Por responsabilidade técnica e conformidade com o CRF, a Farmácia Solidária **não recebe nem distribui**:
- Medicamentos de uso controlado
- Medicamentos que exigem refrigeração (termolábeis)
- Medicamentos manipulados
- Qualquer medicamento com embalagem violada ou fora do prazo

Essas restrições devem aparecer na página pública `/farmacia/doar` e devem ser aplicadas como validação no sistema administrativo (campos `controlado`, `manipulado`, `termolabil` na tabela `medicamentos`).

### Tom de comunicação
O tom público do projeto deve ser: cristão, acolhedor, responsável, claro, simples e técnico quando necessário. Sem sensacionalismo, sem prometer mais do que o projeto pode entregar.

### Impacto social esperado
- Reduzir o desperdício de medicamentos
- Apoiar tratamentos interrompidos por falta de recursos
- Aliviar o sofrimento de famílias vulneráveis
- Promover educação sobre o uso correto de medicamentos
- Demonstrar o amor de Deus por meio de ações concretas

---

## O problema que este projeto resolve

**Para os beneficiários:**
Muitas pessoas em Tatuí interrompem tratamentos por não conseguir comprar medicamentos. Hoje não existe um canal digital onde possam consultar se a Farmácia Solidária tem o que precisam e fazer uma solicitação sem precisar se deslocar ou ligar.

**Para a equipe administrativa:**
O controle de estoque hoje é feito em planilha. O volume de medicamentos doados é alto, o trabalho de entrada é repetitivo e o risco de distribuir medicamentos próximos do vencimento é real. Não há rastreabilidade das saídas nem histórico das solicitações.

**Para os doadores e parceiros:**
Não há um canal claro que explique como funciona a parceria, o que pode ser doado e como entrar em contato.

---

## Público-alvo

### Beneficiários
Pessoas da comunidade de Tatuí e região que precisam de medicamentos e não têm condição de adquiri-los. Maioria acessa pelo celular. Parte tem baixa familiaridade com sistemas digitais. Precisam de uma experiência simples, clara e digna — sem expor dados desnecessários.

### Doadores e parceiros
Laboratórios farmacêuticos são uma das principais frentes de parceria previstas, ao lado de médicos, empresas, instituições parceiras e pessoas físicas que desejam contribuir com o projeto. Precisam de orientações claras sobre o que pode ser doado e como proceder.

### Equipe administrativa
Dra. Monique (farmacêutica responsável), Rev. Erasmo e outros 1–2 voluntários que gerenciam o estoque, analisam solicitações e aprovam entregas. Na v1, são entre 3 e 4 pessoas com responsabilidades claras e alinhadas — nível único de acesso admin é suficiente e adequado.

### Visitantes da igreja
Pessoas que chegam ao site pela primeira vez e querem saber sobre a Igreja Presbiteriana Lírio dos Vales: cultos, localização, identidade, doutrina.

---

## Objetivos da v1

1. Publicar o site institucional da Igreja Presbiteriana Lírio dos Vales com informações claras e atualizadas.
2. Apresentar a Farmácia Solidária como expressão diaconal da missão da igreja.
3. Permitir que qualquer pessoa consulte a disponibilidade de medicamentos sem precisar criar conta.
4. Oferecer um formulário de solicitação online simples, com reconhecimento por CPF e confirmação adicional pelos últimos 4 dígitos do WhatsApp — sem retornar dados pessoais completos apenas com o CPF.
5. Dar à equipe uma ferramenta de gestão de estoque por lote com entrada rápida e alertas de vencimento.
6. Criar um painel administrativo com fila de solicitações, aprovação com baixa FEFO e notificações automáticas por WhatsApp.
7. Garantir rastreabilidade de todas as movimentações de estoque.
8. Proteger dados sensíveis (receitas médicas, CPF, dados de saúde) conforme boas práticas de segurança e LGPD.

---

## Usuários envolvidos

| Usuário | Autenticação | Acesso |
|---|---|---|
| Visitante da igreja | Nenhuma | Landing page / |
| Beneficiário | Nenhuma | /farmacia, /farmacia/estoque, /farmacia/solicitar |
| Doador / parceiro | Nenhuma | /farmacia/doar |
| Admin (equipe Farmácia Solidária) | Supabase Auth | /admin/* |

---

## Funcionalidades principais

### Site institucional
- Apresentação da Igreja Presbiteriana Lírio dos Vales
- Seções: Quem somos, O que cremos, Cultos e horários, Localização, Contato

### Área pública da Farmácia Solidária
- Página de apresentação do projeto com missão, visão e valores
- Dois cards de entrada: **Solicitar medicamento** → leva para `/farmacia/estoque` / **Doar medicamentos** → leva para `/farmacia/doar`
- Consulta de disponibilidade de estoque por nome ou princípio ativo em `/farmacia/estoque`
- Aviso de que a disponibilidade não garante retirada automática
- Em `/farmacia/estoque`, botão **Solicitar** leva para `/farmacia/solicitar` com o medicamento pré-selecionado
- Em `/farmacia/estoque`, botão **Enviar mesmo assim** (quando não encontra o medicamento) leva para `/farmacia/solicitar` com campo livre para a farmacêutica avaliar
- O card "Solicitar medicamento" **nunca** leva diretamente para o formulário — a consulta ao estoque é etapa obrigatória do fluxo
- Formulário `/farmacia/solicitar` com reconhecimento por CPF e confirmação adicional pelos últimos 4 dígitos do WhatsApp
- Upload de receita médica quando necessário
- Consentimento LGPD explícito
- Página de doação `/farmacia/doar` com orientações, restrições claras e convite a parceiros

### Painel administrativo
- Login via Supabase Auth (nível único — v1)
- CRUD de medicamentos com campos farmacêuticos completos
- Cadastro de lotes com entrada rápida por autocomplete
- Validação automática: medicamentos controlados, manipulados e termolábeis não entram no estoque como doação
- Fila de solicitações com filtros por status
- Aprovação com seleção de lote FEFO automático
- Marcação de entrega
- Movimentações de estoque rastreadas
- Dashboard com 6 cards, alertas de vencimento e gráficos
- Configurações editáveis (mensagens WhatsApp, endereço, horários, prazos de alerta)
- Logs básicos de auditoria

### Integrações
- Notificação WhatsApp ao admin em nova solicitação (n8n + Evolution API)
- Notificação WhatsApp ao beneficiário na aprovação ou recusa
- Job diário automático de alerta de vencimento às 8h

---

## Escopo da v1

### Incluído
- Site institucional (landing page single-page com âncoras)
- Página /farmacia com dois cards de ação
- Consulta pública /farmacia/estoque (disponível/indisponível, sem quantidade)
- Formulário /farmacia/solicitar com fluxo por CPF
- Página /farmacia/doar com restrições e convite a parceiros
- Login admin com proteção de rota via middleware Next.js
- CRUD de medicamentos (base) e lotes (entradas)
- Entrada rápida de lote com autocomplete
- Fila de solicitações com aprovação, recusa e entrega
- Baixa por lote com sugestão FEFO
- Movimentações de estoque
- Upload de receita com bucket privado e URL assinada
- Alertas de vencimento configuráveis
- Dashboard operacional com 6 cards, gráficos e feed
- Notificações WhatsApp via n8n + Evolution API
- Job diário de alerta de vencimento
- Tabela de configurações editável
- Logs básicos de auditoria
- Consentimento LGPD no formulário
- Proteção de webhooks por token secreto

### Fora do escopo (v1)
- Múltiplos níveis de permissão admin (v2: Admin geral / Farmacêutico / Voluntário)
- Histórico completo por beneficiário com linha do tempo
- Relatórios exportáveis em PDF ou Excel
- Rastreamento avançado de status para o beneficiário (linha do tempo, acompanhamento pós-solicitação) — as notificações básicas de aprovação e recusa por WhatsApp estão incluídas na v1
- Painel público de transparência com números do projeto
- Leitura automática de receita por IA / OCR
- Múltiplas unidades ou congregações
- App mobile nativo
- Indicadores avançados de tempo médio de aprovação e taxa de recusa
- Integração com sistemas de saúde externos

---

## Critérios gerais de sucesso

### Para os beneficiários
- Consultar disponibilidade de medicamento em menos de 30 segundos, sem criar conta
- Preencher solicitação completa em menos de 3 minutos num celular

### Para a equipe administrativa
- Registrar entrada de lote de medicamento já cadastrado em menos de 60 segundos
- Aprovar ou recusar uma solicitação com notificação ao beneficiário em menos de 2 minutos
- Visualizar em tempo real quais lotes estão vencidos ou próximos do vencimento

### Para o projeto como um todo
- Nenhuma receita médica acessível publicamente
- Nenhum medicamento controlado, manipulado ou termolábil cadastrado como doação
- Admin recebe WhatsApp a cada nova solicitação
- Beneficiário recebe WhatsApp a cada aprovação ou recusa
- Todas as ações críticas no painel deixam rastro em logs_auditoria

---

## Referências institucionais

- Farmacêutica responsável: Dra. Monique Camprubi Pereira — CRF/SP nº 104872
- Pastor responsável: Rev. Erasmo Consani Neto
- Endereço: Av. Prof.ª Zilah de Aquino, 1150, Vila Paulina, Tatuí/SP
- Registro CRF: nº 96633
- Textos-base aprovados: `farmacia-solidaria-contexto-institucional.md`
- Autores do projeto: Dr. Javier Oscar Villalpando Rosas e Dra. Patrícia Neves Villalpando
- Design técnico: `lirio-farmacia-design.md`

> **Atenção:** padronizar sempre o endereço como Tatuí/SP. O documento-base da farmácia menciona "Valinhos" em uma linha por erro tipográfico — ignorar essa referência em todos os sistemas.
