# Skill Registry - kaudit (midudev-cubepath-github-auditor)

> Generated: 2026-03-25 | SDD Init

## Project Context

| Aspect          | Value                  |
| --------------- | ---------------------- |
| **Name**        | kaudit                 |
| **Type**        | Next.js 16 Application |
| **Persistence** | engram                 |

### Stack Detectado

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript 5.9.3 (strict mode)
- **UI**: React 19.2.4 + Tailwind CSS 4.2.0
- **Database**: PostgreSQL + Drizzle ORM 0.45.1
- **Auth**: better-auth 1.4.18
- **i18n**: next-intl 4.8.3
- **Forms**: TanStack Form + Zod 4.3.6
- **AI**: AI SDK 6.0.108 + OpenRouter/Requesty providers
- **Package Manager**: pnpm 10.30.1

### Arquitectura

```
src/
├── core/           # Infraestructura (db, form, i18n, config, utils)
│   ├── db/         # Drizzle client + createTable helper
│   ├── form/       # TanStack Form wrapper + field components
│   ├── config/     # Site, routes, theme, metadata
│   └── utils/      # cn(), etc.
└── modules/        # Lógica de negocio (auth, ai-assistant, landing)
    └── [module]/
        ├── components/   # UI + formularios co-locados
        ├── services/     # Lógica de negocio + actions
        ├── models/       # Drizzle schemas
        ├── locales/      # Traducciones (en.json, es.json)
        └── index.ts      # Barrel export client-safe
```

### Convenciones

| Herramienta    | Configuración                                          |
| -------------- | ------------------------------------------------------ |
| **ESLint**     | Flat config + typescript-eslint + drizzle plugin       |
| **Prettier**   | prettier-plugin-tailwindcss                            |
| **TypeScript** | strict, noUncheckedIndexedAccess, verbatimModuleSyntax |
| **Tests**      | No configurados actualmente                            |
| **CI/CD**      | No configurado actualmente                             |

### Nomenclatura de Archivos

| Sufijo          | Propósito                | Ejemplo             |
| --------------- | ------------------------ | ------------------- |
| `.utils.ts`     | Utilidades               | `cn.utils.ts`       |
| `.schema.ts`    | Validación Zod / Drizzle | `user.schema.ts`    |
| `.actions.ts`   | Server Actions           | `user.actions.ts`   |
| `.service.ts`   | Lógica de negocio        | `auth.service.ts`   |
| `.types.ts`     | Tipos TypeScript         | `user.types.ts`     |
| `.constants.ts` | Constantes               | `user.constants.ts` |
| `.config.ts`    | Configuración            | `sidebar.config.ts` |

---

## Skills Disponibles

### Project Skills (`.agents/skills/`)

| Skill                             | Descripción                                        | Triggers                                     |
| --------------------------------- | -------------------------------------------------- | -------------------------------------------- |
| **ai-elements**                   | Componentes para UI de chat/IA                     | chatbot, AI assistant UI, chat interface     |
| **ai-sdk**                        | AI SDK functions (generateText, streamText, tools) | AI SDK, Vercel AI SDK, useChat, tool calling |
| **brainstorming**                 | Exploración antes de implementación                | crear feature, añadir funcionalidad          |
| **database-drizzle**              | Patrones Drizzle ORM + PostgreSQL                  | db, database, table, schema, migration, SQL  |
| **form-generator**                | Sistema de formularios (TanStack Form + Zod)       | create form, login form, inputs              |
| **i18n-manager**                  | Gestión de traducciones JSON                       | add translation, translate, missing key      |
| **memory-protocol**               | Memoria persistente con Engram                     | guardar contexto, recordar                   |
| **module-generator**              | Estructura y generación de módulos                 | crear módulo, nueva feature                  |
| **next-best-practices**           | Next.js best practices                             | RSC, data patterns, async APIs               |
| **next-cache-components**         | Next.js 16 cache (PPR, use cache)                  | cacheLife, cacheTag, updateTag               |
| **systematic-debugging**          | Debug sistemático                                  | bug, test failure, unexpected behavior       |
| **verify-change**                 | Verificación post-implementación                   | typecheck, lint, tests                       |
| **vercel-react-best-practices**   | Optimización React/Next.js                         | performance, bundle optimization             |
| **writing-clearly-and-concisely** | Escritura clara                                    | documentation, commit messages               |
| **zod-validation**                | Validación con Zod                                 | schema, validation, form validation          |

### User Skills (`~/.config/opencode/skills/`)

| Skill             | Descripción                        |
| ----------------- | ---------------------------------- |
| **sdd-init**      | Inicializar SDD en un proyecto     |
| **sdd-explore**   | Explorar ideas antes de un cambio  |
| **sdd-propose**   | Crear propuesta de cambio          |
| **sdd-spec**      | Escribir especificaciones          |
| **sdd-design**    | Crear diseño técnico               |
| **sdd-tasks**     | Desglosar tareas de implementación |
| **sdd-apply**     | Implementar tareas                 |
| **sdd-verify**    | Validar implementación             |
| **sdd-archive**   | Archivar cambio completado         |
| **skill-creator** | Crear nuevas skills                |
| **go-testing**    | Patrones de testing en Go          |

---

## Project Conventions Files

| Archivo     | Propósito                                                          |
| ----------- | ------------------------------------------------------------------ |
| `AGENTS.md` | Reglas core del proyecto (nomenclatura, arquitectura, IA behavior) |

### Reglas Clave de AGENTS.md

1. **Cero código perezoso**: Sin placeholders, código completo siempre
2. **Idioma**: Comentarios en español, código en inglés
3. **Sin `any`**: Usar `unknown` o tipos específicos
4. **150 líneas máximo** por archivo
5. **Server Components por defecto**, `'use client'` lo más abajo posible
6. **Arquitectura unidireccional**: `modules/` → `core/`, nunca al revés
7. **Uso obligatorio de skills** cuando exista una relevante

---

## Quick Commands

```bash
# Desarrollo
pnpm dev              # Iniciar dev server con Turbopack
pnpm build            # Build de producción
pnpm lint             # Ejecutar ESLint
pnpm typecheck        # Verificar tipos

# Base de datos
pnpm db:generate      # Generar migración
pnpm db:migrate       # Aplicar migración
pnpm db:push          # Push directo (dev)
pnpm db:studio        # Drizzle Studio

# Generadores
pnpm g:module <name>  # Generar nuevo módulo
pnpm agents:sync      # Sincronizar agentes

# Formato
pnpm format:check     # Verificar formato
pnpm format:write     # Formatear código
```

---

## Next Steps

1. **Configurar tests**: Considerar añadir Vitest o Playwright
2. **Configurar CI/CD**: GitHub Actions para lint, typecheck, tests
3. **Documentar API**: Considerar OpenAPI/Swagger si hay endpoints REST
