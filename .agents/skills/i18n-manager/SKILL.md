---
name: i18n-manager
description: Manages internationalization files (JSON). Use this skill when asked to "add a translation", "translate a text", or "fix a missing key". Handles namespaces and nested keys automatically.
---

# i18n Manager

This skill helps manage the project's internationalization using **next-intl** with automatic message loading and caching.

## Project i18n Structure

```
src/core/
├── i18n/
│   ├── i18n.config.ts       # Locale definitions (TLocale, locales, defaultLocale)
│   ├── i18n.routing.ts      # Routing config (Link, useRouter, usePathname)
│   ├── i18n.request.ts      # Request config with caching
│   └── i18n.actions.ts      # Server actions for locale switching
│
├── locales/                 # Global translations
│   ├── en.json              # common.*, navigation.*
│   └── es.json

src/modules/[module]/
└── locales/                 # Module-specific translations
    ├── en.json              # [module].* namespace
    └── es.json
```

## Namespace Conventions

| Location    | Namespace   | Example Keys                        |
|-------------|-------------|-------------------------------------|
| Global      | `common`    | `common.save`, `common.cancel`      |
| Global      | `navigation`| `navigation.dashboard`              |
| Module auth | `auth`      | `auth.signIn.title`, `auth.fields.email` |
| Module blog | `blog`      | `blog.post.create`, `blog.comments.title` |

## Automatic Message Loading

The `i18n.request.ts` automatically loads messages from:

1. `src/core/locales/{locale}.json` - Global translations
2. `src/modules/*/locales/{locale}.json` - All module translations

Messages are merged with module translations taking precedence. A cache with 1-minute TTL optimizes performance in development.

## When to Use

Use this skill when:

- Adding new UI text
- Creating translations for a new module
- Fixing missing translation keys
- Updating existing translations

## Translation File Format

### Global Translations (`src/core/locales/`)

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "navigation": {
    "dashboard": "Dashboard",
    "settings": "Settings",
    "signOut": "Sign out"
  }
}
```

### Module Translations (`src/modules/[module]/locales/`)

```json
{
  "auth": {
    "signIn": {
      "title": "Sign In",
      "description": "Enter your credentials",
      "noAccount": "Don't have an account?",
      "signUpLink": "Sign up"
    },
    "fields": {
      "email": "Email",
      "password": "Password"
    },
    "errors": {
      "invalidCredentials": "Invalid credentials"
    }
  }
}
```

## Usage in Components

### Server Components

```typescript
import { getTranslations } from 'next-intl/server'

export async function SignInPage() {
  const t = await getTranslations('auth.signIn')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### Client Components

```typescript
'use client'

import { useTranslations } from 'next-intl'

export function SignInForm() {
  const t = useTranslations('auth')

  return (
    <form>
      <label>{t('fields.email')}</label>
      <label>{t('fields.password')}</label>
      <button>{t('signIn.title')}</button>
    </form>
  )
}
```

## Routing and Navigation

Always import from `@/core/i18n/routing`:

```typescript
import { Link, useRouter, usePathname, redirect } from '@/core/i18n/routing'

// Usage
<Link href="/dashboard">Dashboard</Link>

// Programmatic navigation
const router = useRouter()
router.push('/dashboard')
```

## Adding Translations

When adding new text:

1. **Identify the namespace**: Is it global (`common`, `navigation`) or module-specific (`auth`, `blog`)?
2. **Update both languages**: Always update `en.json` AND `es.json`
3. **Use nested structure**: Group related keys logically

### Example: Adding a new module translation

```json
// src/modules/blog/locales/en.json
{
  "blog": {
    "post": {
      "create": "Create Post",
      "edit": "Edit Post",
      "delete": "Delete Post"
    },
    "comments": {
      "title": "Comments",
      "add": "Add a comment"
    }
  }
}

// src/modules/blog/locales/es.json
{
  "blog": {
    "post": {
      "create": "Crear publicación",
      "edit": "Editar publicación",
      "delete": "Eliminar publicación"
    },
    "comments": {
      "title": "Comentarios",
      "add": "Añadir comentario"
    }
  }
}
```

## Date and Time Formatting

```typescript
// Server Component
import { getFormatter } from 'next-intl/server'

const format = await getFormatter()
format.dateTime(date, 'short')

// Client Component
import { useFormatter } from 'next-intl'

const format = useFormatter()
format.dateTime(date, 'short')
```

## Key Rules

1. **Always translate to both languages**: EN and ES are mandatory
2. **Use namespace hierarchy**: `module.section.key` (e.g., `auth.signIn.title`)
3. **Module locales in module folder**: `src/modules/[module]/locales/`
4. **Global locales in core**: `src/core/locales/`
5. **Import routing from**: `@/core/i18n/routing`
6. **Cache TTL**: 1 minute in development for hot-reload support
