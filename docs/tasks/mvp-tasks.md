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

## Fase 1: Infraestructura Base

### 1.1 Configurar Inngest

- [ ] Instalar dependencias: `pnpm add inngest`
- [ ] Instalar CLI: `pnpm add -D inngest-cli`
- [ ] Crear `src/core/lib/inngest/client.ts` - Cliente Inngest
- [ ] Crear `src/core/lib/inngest/index.ts` - Entry point para funciones
- [ ] Crear `app/api/inngest/route.ts` - Webhook handler
- [ ] Añadir variables en `src/env.js`: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
- [ ] Añadir script en `package.json`: `"inngest:dev": "inngest-cli dev"`
- [ ] Actualizar `.env.example` con nuevas variables

### 1.2 Schema de Base de Datos - Auditorías

- [ ] Crear `src/modules/audit/models/audit.schema.ts`
  - [ ] Campo `id` (uuid, primary key)
  - [ ] Campo `userId` (foreign key a user)
  - [ ] Campo `repoUrl` (text)
  - [ ] Campo `branchName` (text)
  - [ ] Campo `targetBranch` (text, default: 'main')
  - [ ] Campo `gitDiff` (text)
  - [ ] Campo `gitDiffHash` (text, para caché)
  - [ ] Campo `status` (enum: pending, validating, generating, creating_pr, completed, blocked, failed)
  - [ ] Campo `validationResult` (jsonb)
  - [ ] Campo `generatedContent` (jsonb)
  - [ ] Campo `prUrl` (text, nullable)
  - [ ] Campo `errorMessage` (text, nullable)
  - [ ] Campos `createdAt`, `updatedAt` (timestamps)
- [ ] Crear `src/modules/audit/models/index.ts` - Exportaciones
- [ ] Ejecutar `pnpm db:generate`
- [ ] Ejecutar `pnpm db:migrate`

---

## Fase 2: Motor de Auditoría (Backend)

### 2.1 Servicio de Validación de Seguridad (Step 1)

- [ ] Crear `src/modules/audit/lib/prompts/validation.prompt.ts`
  - [ ] Prompt para detectar API Keys expuestas
  - [ ] Prompt para detectar SQL Injection
  - [ ] Prompt para detectar XSS
  - [ ] Prompt para detectar secrets en código
  - [ ] Prompt para detectar lógica peligrosa
- [ ] Crear `src/modules/audit/types/validation.types.ts`
  - [ ] Interface `IValidationIssue`
  - [ ] Interface `IValidationResult`
  - [ ] Type `TValidationSeverity`
- [ ] Crear `src/modules/audit/services/validation.service.ts`
  - [ ] Función `validateGitDiff(gitDiff: string): Promise<IValidationResult>`
  - [ ] Usar modelo rápido (gpt-4o-mini vía Requesty/OpenRouter)
  - [ ] Retornar estructura tipada

### 2.2 Servicio de Generación de Descripción (Step 2)

- [ ] Crear `src/modules/audit/lib/prompts/generation.prompt.ts`
  - [ ] Prompt para generar Markdown profesional
  - [ ] Secciones: Resumen, Cambios Detallados, Sugerencias, Checklist
- [ ] Crear `src/modules/audit/types/generation.types.ts`
  - [ ] Interface `IGeneratedContent`
  - [ ] Interface `IPrDescription`
- [ ] Crear `src/modules/audit/services/generation.service.ts`
  - [ ] Función `generatePrDescription(gitDiff: string, validationResult: IValidationResult): Promise<IGeneratedContent>`
  - [ ] Usar modelo preciso (claude-3.5-sonnet vía OpenRouter)

### 2.3 Servicio de Integración GitHub (Step 3)

- [ ] Instalar dependencia: `pnpm add octokit`
- [ ] Crear `src/modules/github/types/github.types.ts`
  - [ ] Interface `IGitHubPrOptions`
  - [ ] Interface `IGitHubPrResult`
- [ ] Crear `src/modules/github/lib/github-client.ts`
  - [ ] Función `getGitHubClient(): Octokit`
  - [ ] Manejo de autenticación (Token o GitHub App)
- [ ] Crear `src/modules/github/services/github.service.ts`
  - [ ] Función `createPullRequest(options: IGitHubPrOptions): Promise<IGitHubPrResult>`
  - [ ] Función `addPrComment(prNumber: number, comment: string): Promise<void>`
- [ ] Añadir variables en `src/env.js`: `GITHUB_TOKEN`
- [ ] Actualizar `.env.example`

---

## Fase 3: Inngest Workflow

### 3.1 Definir Eventos y Tipos

- [ ] Crear `src/modules/audit/inngest/events.ts`
  - [ ] Evento `audit/started`
  - [ ] Evento `audit/validation-completed`
  - [ ] Evento `audit/content-generated`
  - [ ] Evento `audit/pr-created`
  - [ ] Evento `audit/blocked`
  - [ ] Evento `audit/failed`

### 3.2 Crear Función Inngest con Steps

- [ ] Crear `src/modules/audit/inngest/audit.workflow.ts`
  - [ ] Step 1: `validate-security`
    - [ ] Llamar `validation.service.validateGitDiff()`
    - [ ] Si falla, actualizar status a `blocked` y terminar
    - [ ] Si pasa, continuar a Step 2
  - [ ] Step 2: `generate-content`
    - [ ] Llamar `generation.service.generatePrDescription()`
    - [ ] Guardar contenido generado en DB
  - [ ] Step 3: `create-pr`
    - [ ] Llamar `github.service.createPullRequest()`
    - [ ] Actualizar status a `completed`
    - [ ] Guardar PR URL en DB
- [ ] Crear `src/modules/audit/inngest/index.ts`
  - [ ] Exportar todas las funciones Inngest
- [ ] Registrar funciones en `src/core/lib/inngest/index.ts`

---

## Fase 4: API Endpoints

### 4.1 Endpoint de Inicio de Auditoría

- [ ] Crear `src/modules/audit/types/api.types.ts`
  - [ ] Interface `IAuditStartRequest`
  - [ ] Interface `IAuditStartResponse`
- [ ] Crear `src/modules/audit/queries/audit.queries.ts`
  - [ ] Función `createAudit(data): Promise<Audit>`
  - [ ] Función `getAuditById(id): Promise<Audit | null>`
  - [ ] Función `updateAuditStatus(id, status, data?): Promise<Audit>`
- [ ] Crear `app/api/audit/start/route.ts`
  - [ ] Validar autenticación
  - [ ] Validar body con Zod
  - [ ] Crear registro en DB
  - [ ] Emitir evento Inngest `audit/started`
  - [ ] Retornar `{ auditId, status: "pending" }`

### 4.2 Endpoint de Estado de Auditoría

- [ ] Crear `app/api/audit/[id]/status/route.ts`
  - [ ] Validar autenticación
  - [ ] Obtener audit de DB
  - [ ] Retornar estado completo

### 4.3 Endpoint de Historial (para Dashboard)

- [ ] Crear `app/api/audit/list/route.ts`
  - [ ] Validar autenticación
  - [ ] Paginación
  - [ ] Filtros por status, fecha
  - [ ] Retornar lista de auditorías

---

## Fase 5: CLI Tool

### 5.1 Estructura del CLI

- [ ] Crear `src/cli/index.ts` - Entry point con shebang
- [ ] Crear `src/cli/types/cli.types.ts`
  - [ ] Interface `ICliOptions`
  - [ ] Type `TCliStatus`
- [ ] Actualizar `package.json`
  - [ ] Añadir `"bin": { "github-auditor": "./bin/github-auditor" }`

### 5.2 Comando Ship

- [ ] Crear `src/cli/commands/ship.ts`
  - [ ] Parsear argumentos
  - [ ] Validar que estamos en un repo git
  - [ ] Capturar git diff
- [ ] Crear `src/cli/lib/git-diff.ts`
  - [ ] Función `getGitDiff(baseBranch: string): Promise<string>`
  - [ ] Función `getCurrentBranch(): Promise<string>`
  - [ ] Función `getRepoUrl(): Promise<string>`

### 5.3 Cliente API del CLI

- [ ] Crear `src/cli/lib/api-client.ts`
  - [ ] Función `startAudit(data): Promise<IAuditStartResponse>`
  - [ ] Función `getAuditStatus(id): Promise<IAuditStatusResponse>`
  - [ ] Función `pollAuditStatus(id, callback): Promise<void>`

### 5.4 UI del CLI

- [ ] Crear `src/cli/lib/display.ts`
  - [ ] Funciones para mostrar progreso (spinners, colores)
  - [ ] Función para mostrar resultado final
- [ ] Instalar dependencia: `pnpm add ora chalk`

### 5.5 Binario

- [ ] Crear `bin/github-auditor`
  - [ ] Shebang `#!/usr/bin/env node`
  - [ ] Importar y ejecutar CLI

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

| Fase | Tareas | Completadas | Progreso |
|------|--------|-------------|----------|
| 0 | 4 | 2 | 50% |
| 1 | 17 | 0 | 0% |
| 2 | 19 | 0 | 0% |
| 3 | 10 | 0 | 0% |
| 4 | 11 | 0 | 0% |
| 5 | 15 | 0 | 0% |
| 6 | 11 | 0 | 0% |
| 7 | 8 | 0 | 0% |
| **Total** | **95** | **2** | **2%** |
