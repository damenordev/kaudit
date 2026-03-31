# Optimización del Pipeline de Auditoría — Diseño

**Fecha:** 2026-03-31
**Estado:** Aprobado
**Enfoque:** Reestructuración completa (Enfoque B)

## Problema

Las auditorías tardan 90-180 segundos (a veces causan timeout del CLI en 5 min). Causas:

- Modelo `openrouter/free` lento y rate-limited
- Chunks de validación secuenciales (for...await)
- Steps 3, 4, 5 del workflow secuenciales pero independientes
- Sin timeout en llamadas AI
- Steps no esenciales (docstrings, tests) siempre se ejecutan

## Objetivo

Reducir tiempo de auditoría a ~25-45s (vs 90-180s actual) eliminando cuellos de botella mediante paralelización, modelos optimizados, y timeouts.

## Workflow Reestructurado

### Antes (7 steps secuenciales, 90-180s)

Step 1: validate → Step 2: parse → Step 3: generate PR → Step 4: docstrings → Step 5: tests → Step 6: PR comments → Step 7: status check

### Después (4 steps, paralelo, ~25-45s)

**Step 1: validate-security (~10-25s)**

- Chunks en PARALELO (Promise.all)
- Modelo: Qwen 3.6 free (1M ctx)
- Fallback: Gemini 3 Flash → DeepSeek V3.2
- Timeout: 30s por llamada

**Step 2: parse-and-enrich (~2s)**

- parseDiff() + enrichIssues() (sin IA)
- fetchCommits() (GitHub API)

**Step 3: generate-all (~10-15s, PARALELO)**

- generatePrDescription() → Qwen 3.6 free
- generateDocstrings() → openrouter/free
- generateTests() → openrouter/free
- Si uno falla, los otros continúan
- Opcional via flags: skipDocstrings, skipTests

**Step 4: publish-results (~2s)**

- PR comments + Status check (GitHub API)

## Distribución de Modelos

| Tarea          | Modelo primario    | Fallback          | Razón           |
| -------------- | ------------------ | ----------------- | --------------- |
| Validación     | Qwen 3.6 free (1M) | Gemini → DeepSeek | Token-intensiva |
| PR Description | Qwen 3.6 free (1M) | Gemini → DeepSeek | Diff grande     |
| Docstrings     | openrouter/free    | Qwen → DeepSeek   | Liviano         |
| Tests          | openrouter/free    | Qwen → DeepSeek   | Liviano         |
| Chat IA        | openrouter/free    | Qwen → DeepSeek   | Interactivo     |

Costo estimado: $0.00 — Todo usa modelos gratuitos.

## Feature Flags

```typescript
interface IAuditEvent {
  auditId: string
  gitDiff: string
  options?: {
    skipDocstrings?: boolean
    skipTests?: boolean
    skipPRComments?: boolean
  }
}
```

CLI: `--fast` = skip docstrings + tests → ~15-20s por auditoría

## Timeouts y Protección

- 30s timeout por llamada AI (AbortSignal.timeout)
- Retry con backoff exponencial en fallbacks
- Timeout CLI: 10 min (safety net)
- Fallback graceful: si todo falla, status "failed" con mensaje amigable

## Context-Aware Chunking

| Modelo              | Contexto | Comportamiento                        |
| ------------------- | -------- | ------------------------------------- |
| Qwen 3.6 / Gemini 3 | 1M       | Casi nunca necesita chunks            |
| DeepSeek V3.2       | 128K     | Chunking estándar (~100K presupuesto) |

getMaxDiffInputTokens() lee el modelo activo y ajusta presupuesto dinámicamente.

## Archivos a Modificar

| Archivo                         | Cambio                                               |
| ------------------------------- | ---------------------------------------------------- |
| ai.config.ts                    | Fallbacks por tarea, timeouts, context-aware budgets |
| process-audit.workflow.ts       | 7 steps → 4 steps, Promise.all                       |
| validate-chunks.utils.ts        | for...await → Promise.all                            |
| generation.service.ts           | Timeout + fallback de modelo                         |
| validation.service.ts           | Timeout + fallback de modelo                         |
| docstring-generation.service.ts | Timeout, modelo openrouter/free                      |
| test-generation.service.ts      | Timeout, modelo openrouter/free                      |
| truncate-diff.utils.ts          | Context-aware budget según modelo activo             |
| cli/lib/api.ts                  | Timeout CLI → 10 min                                 |

## Métricas de Éxito

- Auditoría completa en <45s (vs 90-180s actual)
- Sin timeouts del CLI
- Fallback transparente entre modelos
- Opción --fast en <20s
