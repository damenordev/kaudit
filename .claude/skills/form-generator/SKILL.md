---
name: form-generator
description: Guide for creating forms using the project's standard internal form system (useForm hook, Zod, Server Actions). Use this skill when asked to "create a form", "add a login form", "implement inputs", or any task involving user data entry.
---

# Form Generator Skill

This skill guides the creation of forms that comply with the project's **Hybrid Modular Architecture** (core/ + modules/) and use the internal custom form library based on TanStack Form.

## When to Use

Use this skill when:

- Creating new forms (login, signup, settings, contact, etc.).
- Refactoring existing forms to the current standard.
- Adding input fields to existing features.

## Architecture & Pattern

**Co-locación**: Todo lo específico de un formulario va en la misma carpeta.

```
src/modules/[module]/components/[form-name]/
├── index.ts              # Barrel export
├── [form-name].tsx       # Componente UI
├── [form-name].schema.ts # Zod validation (específico del form)
└── use-[form-name].ts    # Hook (específico del form)
```

## Directory Structure

```
src/modules/auth/
├── components/
│   ├── sign-in-form/
│   │   ├── index.ts
│   │   ├── sign-in-form.tsx
│   │   ├── sign-in.schema.ts
│   │   └── use-sign-in-form.ts
│   ├── sign-up-form/
│   │   ├── index.ts
│   │   ├── sign-up-form.tsx
│   │   ├── sign-up.schema.ts
│   │   └── use-sign-up-form.ts
│   └── index.ts
├── schemas/              # Solo Zod schemas COMPARTIDOS
├── services/
│   ├── auth.actions.ts
│   ├── auth.queries.ts
│   └── index.ts
├── models/               # Drizzle tables (DB schema)
│   ├── auth.schema.ts
│   └── auth.constants.ts
└── index.ts
```

## Implementation Steps

### Step 1: Create Component Folder with Schema

**Location**: `src/modules/[module]/components/[form-name]/[form-name].schema.ts`

```typescript
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type TSignInForm = z.infer<typeof signInSchema>
```

### Step 2: Create Hook

**Location**: `src/modules/[module]/components/[form-name]/use-[form-name].ts`

```typescript
'use client'

import { useForm } from '@/core/form'
import { signInAction } from '../../services/auth.actions'
import { signInSchema, type TSignInForm } from './sign-in.schema'

export function useSignInForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' } as TSignInForm,
    validators: { onBlur: signInSchema },
    onSubmit: async ({ value }) => {
      return signInAction(value)
    },
  })

  return { form }
}
```

### Step 3: Create Component

**Location**: `src/modules/[module]/components/[form-name]/[form-name].tsx`

```typescript
'use client'

import { useSignInForm } from './use-sign-in-form'

export function SignInForm() {
  const { form } = useSignInForm()

  return (
    <form.AppForm>
      <form.AppField name="email">
        {(field) => <field.TextField label="Email" />}
      </form.AppField>
      <form.AppField name="password">
        {(field) => <field.TextField label="Password" type="password" />}
      </form.AppField>
      <form.SubscribeButton>Sign In</form.SubscribeButton>
    </form.AppForm>
  )
}
```

### Step 4: Create Barrel

**Location**: `src/modules/[module]/components/[form-name]/index.ts`

```typescript
export * from './sign-in-form'
export * from './sign-in.schema'
```

### Step 5: Update Components Index

**Location**: `src/modules/[module]/components/index.ts`

```typescript
export * from './sign-in-form'
export * from './sign-up-form'
```

## Available Form Fields

Located in `src/core/form/fields`:

- `field.TextField`
- `field.TextareaField`
- `field.NumberField`
- `field.SelectField`
- `field.CheckboxField`
- `field.SwitchField`
- `field.RadioGroupField`
- `field.DatePickerField`
- `field.SliderField`
- `field.ComboboxField`
- `field.MultiSelectField`
- `field.FileUploadField`
- `field.TiptapField`

## Key Rules

1. **Co-locación**: Schema, hook y componente en la misma carpeta.
2. **Imports relativos**: Schema desde `./[form-name].schema.ts`, actions desde `../../services/`.
3. **Type Safety**: Usar `z.infer` para derivar tipos.
4. **Barrel exports**: Exportar componente y schema en `index.ts`.
5. **schemas/ solo para compartidos**: Si un schema se usa en múltiples componentes, entonces va en `schemas/`.
