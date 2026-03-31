# GitHub Auditor AI - Tareas MVP

**Actualizado:** 2026-03-31
**Total de tareas:** ~122

---

## Fase 0: Documentación ✅

- [x] Crear directorio `docs/plans/`
- [x] Crear directorio `docs/tasks/`
- [x] Escribir `docs/plans/2026-03-25-mvp-implementation-plan.md`
- [x] Escribir `docs/tasks/mvp-tasks.md`

---

## Fase 1: Infraestructura Base ✅

### 1.1 Configurar Inngest

- [x] Instalar dependencias: `pnpm add inngest`
- [x] Instalar CLI: `pnpm add -D inngest-cli`
- [x] Crear `src/core/lib/inngest/client.ts` - Cliente Inngest
- [x] Crear `src/core/lib/inngest/index.ts` - Entry point para funciones
- [x] Crear `app/api/inngest/route.ts` - Webhook handler
- [x] Añadir variables en `src/env.js`: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
- [x] Añadir script en `package.json`: `"dev:inngest": "npx --ignore-scripts=false inngest-cli@latest dev"`
- [x] Actualizar `.env.example` con nuevas variables

### 1.2 Schema de Base de Datos - Auditorías

- [x] Crear `src/modules/audit/models/audit.schema.ts`
  - [x] Campo `id` (uuid, primary key)
  - [x] Campo `userId` (foreign key a user)
  - [x] Campo `repoUrl` (text)
  - [x] Campo `branchName` (text)
  - [x] Campo `targetBranch` (text, default: 'main')
  - [x] Campo `gitDiff` (text)
  - [x] Campo `gitDiffHash` (text, para caché)
  - [x] Campo `status` (enum: pending, processing, validating, generating, completed, failed)
  - [x] Campo `validationResult` (jsonb)
  - [x] Campo `generatedContent` (jsonb)
  - [x] Campo `prUrl` (text, nullable)
  - [x] Campo `errorMessage` (text, nullable)
  - [x] Campos `createdAt`, `updatedAt` (timestamps)
- [x] Crear `src/modules/audit/models/index.ts` - Exportaciones
- [x] Ejecutar `pnpm db:generate`
- [x] Ejecutar `pnpm db:push` (aplicado via push)

---

## Fase 2: Motor de Auditoría (Backend) ✅

### 2.1 Servicio de Validación de Seguridad (Step 1)

- [x] Crear `src/modules/audit/lib/prompts/validation.prompt.ts`
  - [x] Prompt para detectar API Keys expuestas
  - [x] Prompt para detectar SQL Injection
  - [x] Prompt para detectar XSS
  - [x] Prompt para detectar secrets en código
  - [x] Prompt para detectar lógica peligrosa
- [x] Crear `src/modules/audit/types/validation.types.ts`
  - [x] Interface `IValidationIssue`
  - [x] Interface `IValidationResult`
  - [x] Type `TValidationSeverity`
- [x] Crear `src/modules/audit/services/validation.service.ts`
  - [x] Función `validateGitDiff(gitDiff: string): Promise<IValidationResult>`
  - [x] Usar modelo rápido (gpt-4o-mini vía Requesty/OpenRouter)
  - [x] Retornar estructura tipada

### 2.2 Servicio de Generación de Descripción (Step 2)

- [x] Crear `src/modules/audit/lib/prompts/generation.prompt.ts`
  - [x] Prompt para generar Markdown profesional
  - [x] Secciones: Resumen, Cambios Detallados, Sugerencias, Checklist
- [x] Crear `src/modules/audit/types/generation.types.ts`
  - [x] Interface `IGeneratedContent`
  - [x] Interface `IPrDescription`
- [x] Crear `src/modules/audit/services/generation.service.ts`
  - [x] Función `generatePrDescription(gitDiff: string, validationResult: IValidationResult): Promise<IGeneratedContent>`
  - [x] Usar modelo preciso (claude-3.5-sonnet vía OpenRouter)

### 2.3 Servicio de Integración GitHub (Step 3)

- [x] Instalar dependencia: `pnpm add octokit`
- [x] Crear `src/modules/github/types/github.types.ts`
  - [x] Interface `IGitHubPrOptions`
  - [x] Interface `IGitHubPrResult`
- [x] Crear `src/modules/github/lib/github-client.ts`
  - [x] Función `getGitHubClient(): Octokit`
  - [x] Manejo de autenticación (Token o GitHub App)
- [x] Crear `src/modules/github/services/github.service.ts`
  - [x] Función `createPullRequest(options: IGitHubPrOptions): Promise<IGitHubPrResult>`
  - [x] Función `addPrComment(prNumber: number, comment: string): Promise<void>`
- [x] Añadir variables en `src/env.js`: `GITHUB_TOKEN`
- [x] Actualizar `.env.example`

### 2.4 GitHub App Integration

- [x] Crear modelo DB para GitHub Installation (`src/modules/github/models/github-installation.schema.ts`)
- [x] Crear types para GitHub Installation (`src/modules/github/types/github-installation.types.ts`)
- [x] Crear queries para GitHub Installation (`src/modules/github/queries/github-installation.queries.ts`)
- [x] Crear OAuth callback endpoint (`app/api/gh/callback/route.ts`)
- [x] Crear Webhook endpoint con verificación (`app/api/webhooks/github/route.ts`)
- [x] Crear PR Comments service integrado al workflow (step en Inngest)
- [x] Crear Status Checks service integrado al workflow (step en Inngest)
- [x] Implementar bloqueo de merge en issues críticos (Block merge on critical issues)

---

## Fase 3: Inngest Workflow ✅

### 3.1 Definir Eventos y Tipos

- [x] Eventos definidos en `src/core/lib/inngest/client.ts`
  - [x] Evento `audit/created`
  - [x] Evento `audit/processing`
  - [x] Evento `audit/completed`
  - [x] Evento `audit/failed`

### 3.2 DB Queries

- [x] Crear `src/modules/audit/queries/audit.queries.ts`
  - [x] Función `createAudit(data): Promise<Audit>`
  - [x] Función `getAuditById(id): Promise<Audit | null>`
  - [x] Función `updateAuditStatus(id, status, data?): Promise<Audit>`
  - [x] Función `getAuditByDiffHash(hash): Promise<Audit | null>`
- [x] Crear `src/modules/audit/queries/index.ts`

### 3.3 Schema Updates

- [x] Añadir estado `blocked` al enum de status
- [x] Actualizar tipos jsonb con interfaces específicas

### 3.4 Crear Función Inngest con Steps

- [x] Crear `src/modules/audit/inngest/process-audit.workflow.ts`
  - [x] Step 1: `validate-security`
    - [x] Llamar `validation.service.validateGitDiff()`
    - [x] Si falla, actualizar status a `blocked` y terminar
    - [x] Si pasa, continuar a Step 2
  - [x] Step 2: `generate-content`
    - [x] Llamar `generation.service.generatePrDescription()`
    - [x] Guardar contenido generado en DB
  - [x] Step 3: `create-pr`
    - [x] Llamar `github.service.createPullRequest()`
    - [x] Actualizar status a `completed`
    - [x] Guardar PR URL en DB
- [x] Crear `src/modules/audit/inngest/index.ts`
  - [x] Exportar todas las funciones Inngest
- [x] Registrar funciones en `src/core/lib/inngest/index.ts`

### 3.5 Diferenciadores - Diagramas Mermaid

- [x] Crear `src/modules/audit/lib/generate-mermaid.utils.ts` - Generación de diagramas
- [x] Crear componente `mermaid-viewer` para renderizado
- [x] Crear componente `diagrams-panel` para panel de diagramas

### 3.6 Diferenciadores - Generación de Tests por IA

- [x] Crear `src/modules/audit/services/test-generation.service.ts`
- [x] Crear prompt especializado para generación de tests unitarios

### 3.7 Diferenciadores - Docstrings Automáticos

- [x] Crear `src/modules/audit/services/docstring-generation.service.ts`
- [x] Crear prompt especializado para generación de docstrings

### 3.8 Diferenciadores - IA Configurable

- [x] Crear `src/core/config/ai.config.ts` - Configuración de modelo IA

### 3.9 Diferenciadores - Filtros Avanzados

- [x] Implementar filtros avanzados en auditorías (status, fecha, repo search con URL state)
- [x] Crear `src/modules/audit/services/enrich-issues.service.ts` - EnrichIssues service

---

## Fase 4: API Endpoints ✅

### 4.1 Endpoint de Inicio de Auditoría

- [x] Crear `src/modules/audit/types/api.types.ts`
  - [x] Interface `IAuditStartRequest`
  - [x] Interface `IAuditStartResponse`
- [x] Crear `src/modules/audit/queries/audit.queries.ts`
  - [x] Función `createAudit(data): Promise<Audit>`
  - [x] Función `getAuditById(id): Promise<Audit | null>`
  - [x] Función `updateAuditStatus(id, status, data?): Promise<Audit>`
  - [x] Función `listAudits(userId, options): Promise<IAuditListResponse>`
- [x] Crear `app/api/audit/start/route.ts`
  - [x] Validar autenticación
  - [x] Validar body con Zod
  - [x] Crear registro en DB
  - [x] Emitir evento Inngest `audit/created`
  - [x] Retornar `{ auditId, status: "pending" }`

### 4.2 Endpoint de Estado de Auditoría

- [x] Crear `app/api/audit/[id]/status/route.ts`
  - [x] Validar autenticación
  - [x] Obtener audit de DB
  - [x] Retornar estado completo

### 4.3 Endpoint de Historial (para Dashboard)

- [x] Crear `app/api/audit/list/route.ts`
  - [x] Validar autenticación
  - [x] Paginación
  - [x] Filtros por status
  - [x] Retornar lista de auditorías

---

## Fase 5: CLI Tool ✅

### 5.1 Estructura del CLI

- [x] Crear `src/cli/index.ts` - Entry point con shebang
- [x] Crear `src/cli/types/cli.types.ts`
  - [x] Interface `ICliOptions`
  - [x] Type `TCliStatus`
- [x] Actualizar `package.json`
  - [x] Añadir `"bin": { "github-auditor": "./bin/github-auditor.js" }`

### 5.2 Comando Ship

- [x] Crear `src/cli/commands/ship.ts`
  - [x] Parsear argumentos
  - [x] Validar que estamos en un repo git
  - [x] Capturar git diff
- [x] Crear `src/cli/lib/git.ts`
  - [x] Función `getGitDiff(baseBranch: string): Promise<string>`
  - [x] Función `getCurrentBranch(): Promise<string>`
  - [x] Función `getRepoUrl(): Promise<string | null>`

### 5.3 Cliente API del CLI

- [x] Crear `src/cli/lib/api.ts`
  - [x] Función `startAudit(data): Promise<IAuditStartResponse>`
  - [x] Función `getAuditStatus(id): Promise<IAuditStatusResponse>`
  - [x] Función `pollAuditStatus(id, callback): Promise<void>`

### 5.4 UI del CLI

- [x] Crear `src/cli/lib/display.ts`
  - [x] Funciones para mostrar progreso (spinners, colores)
  - [x] Función para mostrar resultado final
- [x] Instalar dependencia: `pnpm add ora chalk commander`

### 5.5 Binario

- [x] Crear `bin/github-auditor.js`
  - [x] Shebang `#!/usr/bin/env npx tsx`
  - [x] Importar y ejecutar CLI

---

## Fase 6: Dashboard de Auditorías ✅

### 6.1 Configuración de Rutas

- [x] Actualizar `src/core/config/routes.config.ts`
  - [x] Añadir rutas de auditorías
- [x] Actualizar `src/core/config/sidebar.config.tsx`
  - [x] Añadir item "Auditorías" en navegación

### 6.2 Página de Historial

- [x] Crear `app/dashboard/audits/page.tsx`
  - [x] Server Component que carga datos iniciales
- [x] Crear `src/modules/audit/components/audits-table/audits-table.tsx`
  - [x] Tabla con DataTable existente
  - [x] Filtros avanzados (status, fecha, repo search con URL state)
- [x] Crear `src/modules/audit/components/audits-table/columns.tsx`
  - [x] Definición de columnas
  - [x] Badge de status con colores
- [x] Crear `src/modules/audit/components/audits-table/index.ts` - Exports

### 6.3 Página de Detalle

- [x] Crear `app/dashboard/audits/[id]/page.tsx`
  - [x] Server Component que carga audit específico
- [x] Crear `src/modules/audit/components/audit-detail/audit-detail.tsx`
  - [x] Monaco Editor para visualización de diff
  - [x] Sidebar con info de la auditoría
  - [x] Panel de Issues encontrados
  - [x] Chat panel con IA contextual
  - [x] Panel de Diagramas Mermaid
  - [x] Commit timeline
  - [x] Link a PR en GitHub
- [x] Crear `src/modules/audit/components/audit-detail/index.ts` - Exports

---

## Fase 7: Configuración y Polish ✅

### 7.1 Variables de Entorno

- [x] Actualizar `src/env.js`
  - [x] `INNGEST_EVENT_KEY` (string, opcional en dev)
  - [x] `INNGEST_SIGNING_KEY` (string, opcional en dev)
  - [x] `GITHUB_TOKEN` (string, requerido en prod)
- [x] Actualizar `.env.example`
- [x] Documentar en README cómo obtener cada valor

### 7.2 Internacionalización

- [x] Actualizar `src/core/locales/en.json`
  - [x] Añadir 27 claves nuevas para auditorías
- [x] Actualizar `src/core/locales/es.json`
  - [x] Añadir 27 claves nuevas para auditorías

### 7.3 Documentación

- [x] Actualizar README.md
  - [x] Instrucciones de instalación
  - [x] Instrucciones de configuración
  - [x] Uso del CLI
  - [x] Explicación de arquitectura Inngest
  - [x] Documentación profesional completa

---

## Progreso

| Fase      | Tareas  | Completadas | Progreso |
| --------- | ------- | ----------- | -------- |
| 0         | 4       | 4           | 100% ✅  |
| 1         | 17      | 17          | 100% ✅  |
| 2         | 27      | 27          | 100% ✅  |
| 3         | 30      | 30          | 100% ✅  |
| 4         | 11      | 11          | 100% ✅  |
| 5         | 15      | 15          | 100% ✅  |
| 6         | 14      | 14          | 100% ✅  |
| 7         | 8       | 8           | 100% ✅  |
| **Total** | **126** | **126**     | **100%** |
