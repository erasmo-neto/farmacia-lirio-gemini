# PROJECT-INDEX — Farmácia Solidária Lírio dos Vales

## Porta de entrada do projeto

Leia nesta ordem:

1. `docs/00-project-context.md`
2. `docs/01-product-spec.md`
3. `docs/02-ux-spec-rotas-e-fluxos.md`
4. `docs/03-technical-spec.md`
5. `docs/decisions/001-decisoes-consolidadas-v1.md`
6. `docs/04-implementation-plan.md`
7. `docs/05-backlog.md`
8. `docs/06-acceptance-criteria.md`
9. `docs/07-lgpd-e-seguranca.md`
10. `docs/handoff/handoff-farmacia-solidaria-lirio.md`
11. `docs/migration/vite-current-state.md`
12. `source/baseline/` — código Vite preservado

## Arquitetura

Atual:
`Vite + React + JavaScript + Supabase`

Destino:
`Next.js + TypeScript + App Router + Supabase SSR`

## Escopo atual

Farmácia:
- `/farmacia`
- `/farmacia/estoque`
- `/farmacia/solicitar`
- `/farmacia/doar`

Admin:
- `/admin/*`

API:
- `/api/*`

Fora do escopo atual:
- `/` — landing page institucional

## Estado da migração

- Fase 0-M.1 — concluída
- Fase 0-M.2 — inventário inicial concluído
- Fase 0-M.3 — próxima tarefa

## Regra de trabalho

Uma tarefa por vez.

Sempre validar com:

```bash
npm run build
```

antes de considerar a tarefa concluída.

Para alterações de código, sempre informar arquivo, localização exata, trecho-âncora, trecho atual e alteração completa.

## Fonte de verdade

`Memória GPT → como trabalhamos e decisões estáveis`

`Documentação → o que o sistema deve fazer`

`Código + banco → o que realmente existe`

Não presumir divergências; verificar.
