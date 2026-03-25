---
name: module-generator
description: Guía para generar y estructurar módulos en el proyecto. Usa esta skill cuando necesites crear un nuevo módulo, entender la estructura de módulos existentes, o generar componentes, actions, services, models, types, config o locales para un módulo.
---

# Module Generator

Esta skill documenta la estructura estándar de módulos y cómo generarlos usando el script `pnpm run g:module`.

## Contrato de Módulos

### Contrato Mínimo (todo módulo DEBE tener)

```
src/modules/[name]/
├── components/
│   └── index.ts
├── locales/
│   ├── en.json
│   └── es.json
└── index.ts                    # Barrel export (client-safe)
```

### Contrato Completo (cuando el módulo lo requiere)

```
src/modules/[name]/
├── components/
│   ├── [name]-form/            # Formulario co-locado
│   │   ├── index.ts
│   │   ├── [name]-form.tsx
│   │   ├── [name].schema.ts
│   │   └── use-[name]-form.ts
│   ├── primitives/             # Solo si el módulo tiene primitivos propios (ej: librería externa)
│   │   └── ...
│   ├── [name]-list.tsx
│   └── index.ts
├── actions/                    # Solo con --with-actions
│   ├── [name].actions.ts
│   └── index.ts
├── services/                   # Solo con --with-services
│   ├── [name].service.ts
│   └── index.ts
├── models/                     # Solo con --with-db
│   ├── [name].schema.ts
│   ├── [name].constants.ts
│   └── index.ts
├── types/                      # Solo con --with-types
│   ├── [name].types.ts
│   └── index.ts
├── lib/                        # Solo con --with-lib
│   └── index.ts
├── config/                     # Solo con --with-config
│   └── index.ts
├── locales/
│   ├── en.json
│   └── es.json
├── index.ts                    # Client-safe exports
└── server.ts                   # Server-side exports (solo con --with-actions o --with-services)
```

## Comando

```bash
pnpm run g:module <name>              # Mínimo: components + locales + index.ts
pnpm run g:module <name> --with-actions   # Incluye actions/
pnpm run g:module <name> --with-services  # Incluye services/
pnpm run g:module <name> --with-lib       # Incluye lib/
pnpm run g:module <name> --with-db        # Incluye models/
pnpm run g:module <name> --with-config    # Incluye config/
pnpm run g:module <name> --with-types     # Incluye types/
pnpm run g:module <name> --full           # Todo incluido
```

## Carpetas

| Carpeta       | Propósito                         | Incluido por defecto   |
| ------------- | --------------------------------- | ---------------------- |
| `components/` | Componentes React y formularios   | ✅ Sí                  |
| `locales/`    | Traducciones (en.json, es.json)   | ✅ Sí                  |
| `actions/`    | Server Actions (`'use server'`)   | No (`--with-actions`)  |
| `services/`   | Queries + lógica de negocio       | No (`--with-services`) |
| `lib/`        | Utilidades compartidas del módulo | No (`--with-lib`)      |
| `models/`     | Drizzle schemas + constantes DB   | No (`--with-db`)       |
| `types/`      | Tipos TypeScript compartidos      | No (`--with-types`)    |
| `config/`     | Configuración del módulo          | No (`--with-config`)   |

## Archivos Clave

### `index.ts` (Client-safe)

Exporta solo lo que es seguro para client components:

```typescript
export * from './components'
```

Si el módulo tiene `lib/`:

```typescript
export * from './components'
export * from './lib'
```

### `server.ts` (Server-side)

Solo se genera cuando hay carpetas server-only. Exporta lo que requiere server:

```typescript
export * from './actions'
export * from './services'
export * from './types'
```

### `actions/[name].actions.ts`

```typescript
'use server'

import { [name]Schema, type T${Name}Form } from '../components/[name]-form/[name].schema'

export async function create${Name}Action(data: T${Name}Form) {
  const parsed = [name]Schema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid input' }
  }
  // TODO: Implement creation logic
  return { success: true }
}
```

### `services/[name].service.ts`

```typescript
import { db } from '@/core/db'

export async function get${Name}s() {
  // return db.select().from(${name})
  return []
}

export async function get${Name}ById(id: string) {
  // const [item] = await db.select().from(${name}).where(eq(${name}.id, id))
  // return item
  return null
}
```

### `models/[name].schema.ts` (solo con `--with-db`)

```typescript
import { createTable, text, timestamp } from '@/core/db'

export const [name] = createTable('[name]', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

### Formulario co-locado (`components/[name]-form/`)

```
[name]-form/
├── index.ts
├── [name]-form.tsx         # Componente UI
├── [name].schema.ts        # Zod validation
└── use-[name]-form.ts      # Hook TanStack Form
```

### Subcarpeta `components/primitives/` (opcional)

Cuando un módulo tiene componentes de UI de bajo nivel (por ejemplo, de una librería externa como `@ai-elements`), se organizan dentro de `components/primitives/`:

```
components/
├── primitives/             # Componentes atómicos / de librería
│   ├── message.tsx
│   ├── prompt-input.tsx
│   └── ...
├── chat-view/              # Composiciones de alto nivel
│   └── chat-view.tsx
└── index.ts
```

## Reglas Importantes

1. **Barrel principal (`index.ts`)**: Solo exporta `components` (y `lib` si existe) — client-safe
2. **Barrel server (`server.ts`)**: Solo se crea si hay `actions/`, `services/`, `models/` o `types/`
3. **Schemas Zod**: Van co-locados en `components/[form]/`, NO en carpeta `schemas/`
4. **Hooks**: Van co-locados en `components/[form]/`, NO en carpeta `hooks/`
5. **Drizzle schemas**: Usar `createTable` de `@/core/db`, NO `pgTable` directo
6. **Server Actions**: Siempre llevan `'use server'` al inicio
7. **Locales**: Cada módulo tiene sus propias traducciones. `core/locales/` solo contiene claves globales (`common`, `navigation`, `metadata`)

## Uso de Imports

```typescript
// Client component (SAFE)
import { SignInForm } from '@/modules/auth'

// Server component / Server Action (SERVER-ONLY)
import { getSession, signOut } from '@/modules/auth/server'
```
