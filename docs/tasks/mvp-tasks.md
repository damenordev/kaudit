# GitHub Auditor AI - Tareas MVP

**Actualizado:** 2026-03-25
**Total de tareas:** ~85

---

## Fase 0: Documentación

- [ ] Crear directorio `docs/plans/`
- [ ] Crear directorio `docs/tasks/`
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

## Fase 6: Dashboard de Auditorías

### 6.1 Configuración de Rutas

- [ ] Actualizar `src/core/config/routes.config.ts`
  - [ ] Añadir rutas de auditorías
- [ ] Actualizar `src/core/config/sidebar.config.tsx`
  - [ ] Añadir item "Auditorías" en navegación

### 6.2 Página de Historial

- [ ] Crear `app/dashboard/audits/page.tsx`
  - [ ] Server Component que carga datos iniciales
- [ ] Crear `src/modules/audit/components/audits-table/audits-table.tsx`
  - [ ] Tabla con data-table existente
  - [ ] Columnas: Fecha, Repo, Status, PR URL, Acciones
- [ ] Crear `src/modules/audit/components/audits-table/columns.tsx`
  - [ ] Definición de columnas
  - [ ] Badge de status con colores
- [ ] Crear `src/modules/audit/components/audits-table/index.ts` - Exports

### 6.3 Página de Detalle

- [ ] Crear `app/dashboard/audits/[id]/page.tsx`
  - [ ] Server Component que carga audit específico
- [ ] Crear `src/modules/audit/components/audit-detail/audit-detail.tsx`
  - [ ] Header con info de la auditoría
  - [ ] Sección de validación (issues encontrados o aprobado)
  - [ ] Sección de contenido generado (Markdown renderizado)
  - [ ] Link a PR en GitHub
- [ ] Crear `src/modules/audit/components/audit-detail/index.ts` - Exports

---

## Fase 7: Configuración y Polish

### 7.1 Variables de Entorno

- [ ] Actualizar `src/env.js`
  - [ ] `INNGEST_EVENT_KEY` (string, opcional en dev)
  - [ ] `INNGEST_SIGNING_KEY` (string, opcional en dev)
  - [ ] `GITHUB_TOKEN` (string, requerido en prod)
- [ ] Actualizar `.env.example`
- [ ] Documentar en README cómo obtener cada valor

### 7.2 Internacionalización

- [ ] Actualizar `src/core/locales/en.json`
  - [ ] Añadir claves para auditorías
- [ ] Actualizar `src/core/locales/es.json`
  - [ ] Añadir claves para auditorías

### 7.3 Documentación

- [ ] Actualizar README.md
  - [ ] Instrucciones de instalación
  - [ ] Instrucciones de configuración
  - [ ] Uso del CLI
  - [ ] Explicación de arquitectura Inngest

---

## Progreso

| Fase      | Tareas  | Completadas | Progreso |
| --------- | ------- | ----------- | -------- |
| 0         | 4       | 2           | 50%      |
| 1         | 17      | 17          | 100% ✅  |
| 2         | 19      | 19          | 100% ✅  |
| 3         | 18      | 18          | 100% ✅  |
| 4         | 11      | 11          | 100% ✅  |
| 5         | 15      | 15          | 100% ✅  |
| 6         | 11      | 0           | 0%       |
| 7         | 8       | 0           | 0%       |
| **Total** | **103** | **82**      | **80%**  |
