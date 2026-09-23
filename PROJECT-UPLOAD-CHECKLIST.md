# PROJECT-UPLOAD-CHECKLIST

## Essenciais

### Contexto
- [x] `docs/00-project-context.md`

### Especificações
- [ ] `docs/01-product-spec.md`
- [ ] `docs/02-ux-spec-rotas-e-fluxos.md`
- [ ] `docs/03-technical-spec.md`
- [ ] `docs/04-implementation-plan.md`
- [ ] `docs/05-backlog.md`
- [ ] `docs/06-acceptance-criteria.md`
- [ ] `docs/07-lgpd-e-seguranca.md`

### Decisões
- [ ] `docs/decisions/001-decisoes-consolidadas-v1.md`

### Handoff
- [ ] `docs/handoff/handoff-farmacia-solidaria-lirio.md`

### Migração
- [ ] `docs/migration/vite-current-state.md`

### Design
- [ ] `DESIGN.md`

### Código Vite
- [ ] `package.json`
- [ ] `package-lock.json`
- [ ] `vite.config.js`
- [ ] `eslint.config.js`
- [ ] `index.html`
- [ ] `README.md`
- [ ] `README-CONTEXTO.md`
- [ ] `src/App.jsx`
- [ ] `src/App.css`
- [ ] `src/index.css`
- [ ] `src/main.jsx`
- [ ] `src/supabaseClient.js`
- [ ] assets realmente utilizados

## NÃO enviar

- `node_modules/`
- `dist/`
- `.git/`
- `.env`
- `.env.local`
- service role key
- tokens n8n/Evolution API
- senhas

## Banco

Gerar também:

- `docs/database/schema-real-atual.md`
- `docs/database/queries-verificacao.sql`

Esses arquivos devem representar o banco real, não apenas o schema conceitual.

## Primeira conversa no novo Projeto

Use:

> Leia `PROJECT-INDEX.md` e `docs/00-project-context.md`. Não altere arquivos. Confirme o contexto e indique como próxima tarefa a Fase 0-M.3.
