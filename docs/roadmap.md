# kaudit Roadmap

## Visión

**kaudit** es un asistente de ingeniería AI-first que audita PRs automáticamente, detecta problemas de seguridad, y genera contenido profesional.

---

## FASE 1: Complementar (Dashboard Rico + CLI)

**Objetivo:** Ser la mejor experiencia de revisión de código con visualización avanzada.

### Features

| Feature                     | Descripción                                 | Prioridad |
| --------------------------- | ------------------------------------------- | --------- |
| Monaco Editor lado a lado   | Diff visual con syntax highlighting         | Alta      |
| Issues por archivo/línea    | Click en issue → salta a línea en Monaco    | Alta      |
| Parseo de commits del diff  | Mostrar qué commit introdujo cada cambio    | Alta      |
| Chat contextual por archivo | IA con contexto del archivo + diff + issues | Media     |
| Sugerencias aplicables      | Botón "Generar fix" → código corregido      | Media     |
| Historial de auditorías     | Dashboard con todas las auditorías pasadas  | Media     |
| Filtros y búsqueda          | Por archivo, por severidad, por fecha       | Baja      |

### Arquitectura de datos

```ts
interface IAuditRecord {
  // Referencias a commits
  baseCommitSha: string
  headCommitSha: string

  // Archivos parseados del diff
  changedFiles: IChangedFile[]

  // Commits del branch
  commits: IAuditCommit[]

  // Issues enriquecidos
  issues: IEnrichedIssue[]
}

interface IChangedFile {
  path: string
  language: string
  additions: number
  deletions: number
  status: 'added' | 'modified' | 'deleted' | 'renamed'
  diff: string
  hunks: IHunk[]
  issueCount: number
  commitSha: string
}

interface IHunk {
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  content: string
  changes: ILineChange[]
}

interface IAuditCommit {
  sha: string
  message: string
  author: { name; email; avatar }
  date: string
  files: string[]
}

interface IEnrichedIssue {
  id: string
  type: 'security' | 'style' | 'logic' | 'performance' | 'best-practice'
  severity: 'critical' | 'error' | 'warning' | 'info'
  file: string
  line: number
  commitSha?: string
  title: string
  message: string
  codeSnippet?: string
  suggestedFix?: string
  status: 'open' | 'acknowledged' | 'resolved' | 'ignored'
}
```

### Sprint Plan

**Sprint 1 (~5 días)**

- Schema + tipos
- parseDiff() → extrae archivos y hunks
- Fetch commits de GitHub
- Endpoints GET /audit/[id], GET /audit/[id]/files
- Sidebar de archivos

**Sprint 2 (~5 días)**

- Endpoint GET /audit/[id]/files/[path]?content=true
- Cache de archivos
- Componente Monaco Diff (lado a lado)
- Issues panel con cards
- Click en issue → scroll a línea

**Sprint 3 (~5 días)**

- Prompt IA mejorado (devuelve line, suggestedFix)
- Endpoint POST /audit/[id]/chat
- Componente Chat con IA
- Timeline de commits
- Testing + polish

---

## FASE 2: Competir (GitHub App + CI/CD)

**Objetivo:** Eliminar fricción, integrarse en el flujo normal del equipo.

### Features

| Feature                 | Descripción                             | Complejidad |
| ----------------------- | --------------------------------------- | ----------- |
| GitHub App              | OAuth + instalación en repos/orgs       | Alta        |
| Webhooks                | Auto-review cuando se abre/actualiza PR | Media       |
| Comentarios en PR       | Comentar en líneas específicas del diff | Alta        |
| Status checks           | Pass/Fail en GitHub checks              | Media       |
| Block merge on critical | Impedir merge si hay issues críticos    | Media       |
| Review summaries        | Comentario inicial con resumen del PR   | Baja        |
| Auto-approve            | Auto-aprobar PRs sin issues             | Baja        |

### Flujo con GitHub App

```
1. Dev abre PR en GitHub
2. kaudit recibe webhook → audita automáticamente
3. kaudit comenta en el PR:
   ┌─────────────────────────────────────────────────────────┐
   │ 🤖 kaudit Review                                        │
   │                                                         │
   │ ✅ 3 archivos revisados                                 │
   │ 🔴 1 issue crítico | 🟡 2 warnings                      │
   │                                                         │
   │ 📄 src/auth/login.ts:42                                 │
   │ 🔴 API key expuesta - [Ver detalle →]                  │
   │                                                         │
   │ [Ver auditoría completa en dashboard]                   │
   └─────────────────────────────────────────────────────────┘
4. Dev hace click → abre dashboard con Monaco
5. Dev fixea → push → kaudit re-review automáticamente
6. Status check: ✅ kaudit passed → merge habilitado
```

---

## FASE 3: Diferenciadores

**Objetivo:** Features únicas que nos distinguen de CodeRabbit.

| Feature                 | Por qué nos diferencia                       |
| ----------------------- | -------------------------------------------- |
| Diagramas Mermaid       | Visualización de arquitectura de cambios     |
| Generación de tests     | Tests unitarios para código nuevo            |
| Docstrings automáticos  | Documentación generada por IA                |
| Learnings del equipo    | La IA aprende las preferencias del equipo    |
| Integración Jira/Linear | Validar contra requisitos del ticket         |
| Múltiples modelos       | Usuario elige modelo (GPT-4, Claude, Gemini) |
| Self-hosted option      | Para empresas que no quieren code en la nube |

---

## Competidores

### CodeRabbit

- **Fortalezas:** GitHub App madura, comentarios en PR, diagramas, learnings
- **Debilidades:** Dashboard básico, CLI limitado, no self-hosted
- **Nuestra ventaja:** Monaco editor rico, CLI first, self-hosted

### GitHub Copilot Code Review

- **Fortalezas:** Integración nativa con GitHub
- **Debilidades:** Menos customizable, sin dashboard propio
- **Nuestra ventaja:** Dashboard centralizado, más control

---

## Arquitectura Técnica

```
FASE 1:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    CLI      │────▶│   API       │────▶│   Inngest   │
│   (local)   │     │  Next.js    │     │   + IA      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   ▼                   │
       │           ┌─────────────┐             │
       │           │  Dashboard  │◀────────────┘
       │           │  + Monaco   │
       │           └─────────────┘
       │
       └──▶ GitHub (push + PR)

FASE 2 (añadir):
┌─────────────┐     ┌─────────────┐
│ GitHub App  │◀───▶│  Webhooks   │
│  (OAuth)    │     │  /api/gh    │
└─────────────┘     └─────────────┘
       │
       └──▶ Comentarios en PR
       └──▶ Status checks
```

---

## Dependencias

### FASE 1

- `@monaco-editor/react` - Monaco editor
- `diff` - Parsear diffs
- `uuid` - IDs únicos para issues

### FASE 2

- GitHub App (crear en GitHub Developer Settings)
- Webhooks configuration
- GitHub API (Octokit ya lo tenemos)

---

## Estimación Total

| Fase      | Tiempo           |
| --------- | ---------------- |
| FASE 1    | 2-3 semanas      |
| FASE 2    | 3-4 semanas      |
| FASE 3    | 2-3 semanas      |
| **Total** | **7-10 semanas** |
