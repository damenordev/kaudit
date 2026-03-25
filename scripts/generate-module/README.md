# Generate Module

Genera la estructura de un módulo siguiendo las convenciones del proyecto.

## Uso

```bash
pnpm run g:module <name>                  # Mínimo: components + locales + index.ts
pnpm run g:module <name> --with-actions   # Incluye actions/ + form scaffolding
pnpm run g:module <name> --with-services  # Incluye services/
pnpm run g:module <name> --with-lib       # Incluye lib/
pnpm run g:module <name> --with-db        # Incluye models/
pnpm run g:module <name> --with-config    # Incluye config/
pnpm run g:module <name> --with-types     # Incluye types/
pnpm run g:module <name> --full           # Todo incluido
```

## Estructura Generada

### Mínima (por defecto)

```
src/modules/[name]/
├── components/
│   └── index.ts
├── locales/
│   ├── en.json
│   └── es.json
└── index.ts                    # Client-safe exports
```

### Con `--with-actions`

Incluye actions/ y genera formulario co-locado en components/:

```
├── actions/
│   ├── [name].actions.ts
│   └── index.ts
├── components/
│   ├── [name]-form/
│   │   ├── index.ts
│   │   ├── [name]-form.tsx
│   │   ├── [name].schema.ts
│   │   └── use-[name]-form.ts
│   ├── [name]-list.tsx
│   └── index.ts
```

### Con `--with-services`

```
├── services/
│   ├── [name].service.ts
│   └── index.ts
```

### Con `--with-lib`

```
├── lib/
│   └── index.ts
```

### Con `--with-db`

```
├── models/
│   ├── [name].schema.ts        # Drizzle schema
│   └── index.ts
```

### Con `--with-types`

```
├── types/
│   ├── [name].types.ts
│   └── index.ts
```

### Con `--with-config`

```
├── config/
│   ├── [name].config.ts
│   └── index.ts
```

### Completa (`--full`)

```
src/modules/[name]/
├── components/
│   ├── [name]-form/
│   │   ├── index.ts
│   │   ├── [name]-form.tsx
│   │   ├── [name].schema.ts
│   │   └── use-[name]-form.ts
│   ├── [name]-list.tsx
│   └── index.ts
├── actions/
│   ├── [name].actions.ts
│   └── index.ts
├── services/
│   ├── [name].service.ts
│   └── index.ts
├── lib/
│   └── index.ts
├── models/
│   ├── [name].schema.ts
│   └── index.ts
├── types/
│   ├── [name].types.ts
│   └── index.ts
├── config/
│   ├── [name].config.ts
│   └── index.ts
├── locales/
│   ├── en.json
│   └── es.json
├── index.ts                    # Client-safe exports
└── server.ts                   # Server-side exports
```

## Flags

| Flag              | Descripción                                     |
| ----------------- | ----------------------------------------------- |
| `--with-actions`  | Incluye `actions/` + formulario co-locado       |
| `--with-services` | Incluye `services/` para queries                |
| `--with-lib`      | Incluye `lib/` para utilidades del módulo       |
| `--with-db`       | Incluye `models/` con Drizzle schema            |
| `--with-config`   | Incluye `config/` para configuración del módulo |
| `--with-types`    | Incluye `types/` para tipos compartidos         |
| `--full`          | Incluye todas las carpetas opcionales           |

## Barrels

**`index.ts`** (Client-safe) — siempre se genera:

```typescript
export * from './components'
export * from './lib' // solo si --with-lib
```

**`server.ts`** (Server-side) — solo se genera cuando hay exports server-side:

```typescript
export * from './actions' // si --with-actions
export * from './services' // si --with-services
export * from './models' // si --with-db
export * from './types' // si --with-types
```

## Ejemplos

```bash
# Landing page o componente visual simple
pnpm run g:module notifications

# Módulo con formulario CRUD
pnpm run g:module contact --with-actions --with-services

# Módulo con base de datos completa
pnpm run g:module products --with-actions --with-services --with-db

# Módulo completo
pnpm run g:module orders --full
```

## Después de Crear

### Con `--with-db`

1. Añadir la tabla a `src/core/db/schema.ts`:

   ```typescript
   export * from '@/modules/[name]/models'
   ```

2. Aplicar cambios:
   ```bash
   pnpm run db:push
   pnpm run db:sync
   ```

### Sin base de datos

El módulo está listo para usar:

```typescript
// Client component
import { [Name]Form } from '@/modules/[name]'

// Server component (solo si tiene server.ts)
import { get[Name] } from '@/modules/[name]/server'
```

## Estructura del Script

```
scripts/generate-module/
├── index.ts        # Entry point
├── config.ts       # Tipos, flags y configuración
├── utils.ts        # Validación y utilidades
├── templates.ts    # Templates de archivos
├── generators.ts   # Funciones de generación
└── README.md       # Este archivo
```
