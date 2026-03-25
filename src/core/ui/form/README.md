# Form Component Module

Módulo completo y autocontenido para crear formularios reutilizables con TanStack Form y Shadcn UI.

## 📦 Instalación

### 1. Copiar la carpeta completa

```bash
# Copiar toda la carpeta `src/components/form/` al nuevo proyecto
```

### 2. Instalar dependencias

```bash
# Componentes shadcn/ui
bunx shadcn@latest add input textarea select checkbox switch radio-group label button calendar popover command card slider

# Dependencias npm
bun add @tanstack/react-form zod date-fns
```

## 🚀 Uso Básico

```typescript
'use client'

import { useForm, FormSubscribeButton } from '@/components/form'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export default function MyForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onBlur: schema },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.AppField name="email">
        {field => <field.TextField label="Email" placeholder="Enter email" required />}
      </form.AppField>

      <form.AppField name="password">
        {field => <field.TextField label="Password" type="password" required />}
      </form.AppField>

      <form.AppForm>
        <FormSubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  )
}
```

## 📋 Campos Disponibles

Todos los campos comparten estas props base: `label`, `description?`, `required?`

- **TextField** - `type?`, `placeholder?`
- **TextareaField** - `rows?`, `placeholder?`
- **NumberField** - `min?`, `max?`, `step?`, `placeholder?`
- **SelectField** - `values: Array<{label, value}>`, `placeholder?`
- **CheckboxField** - (label al lado)
- **SwitchField** - (label al lado)
- **RadioGroupField** - `options: Array<{label, value}>`
- **DatePickerField** - Selector de fecha
- **SliderField** - `min?`, `max?`, `step?` (valor visible a la derecha)
- **ComboboxField** - `options: Array<{label, value}>`, `placeholder?`
- **MultiSelectField** - `options: Array<{label, value}>`, `placeholder?`
- **FileUploadField** - `accept?`, `multiple?` (drag & drop)

## 📁 Estructura

```
form/
├── use-form.ts              # Hook principal
├── form-context.ts          # Contextos TanStack Form
├── form-field-wrapper.tsx   # Wrapper común (label, descripción, errores)
├── form-subscribe-button.tsx
├── form-error.tsx
├── form-error-messages.tsx
├── fields/                  # Todos los campos
│   ├── form-text-field.tsx
│   ├── form-number-field.tsx
│   ├── form-select-field.tsx
│   └── ...
└── index.ts                 # Barrel export
```

## ➕ Añadir un Nuevo Campo

1. Crear el componente en `fields/form-[nombre]-field.tsx`:

```typescript
'use client'

import React from 'react'
import { useFieldContext } from '../form-context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { YourShadcnComponent } from '@/components/ui/your-component'

export interface IFormYourFieldProps {
  label: string
  description?: string
  required?: boolean
  // Props específicas
}

export const FormYourField: React.FC<IFormYourFieldProps> = ({
  label,
  description,
  required,
  // ...props específicas
}) => {
  const field = useFieldContext<YourType>()

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <YourShadcnComponent
        value={field.state.value}
        onChange={value => {
          field.handleChange(value)
          field.handleBlur()
        }}
        onBlur={field.handleBlur}
        aria-invalid={!field.state.meta.isValid && field.state.meta.isTouched}
      />
    </FormFieldWrapper>
  )
}
```

2. Exportar en `fields/index.ts`:

```typescript
export { FormYourField, type IFormYourFieldProps } from './form-your-field'
```

3. Añadir a `use-form.ts` en `fieldComponents`:

```typescript
fieldComponents: {
  // ... campos existentes
  YourField: FormYourField,  // Sin prefijo para uso: field.YourField
}
```

4. Exportar en `index.ts`:

```typescript
export { FormYourField, type IFormYourFieldProps } from './fields'
```

## 🔧 Componentes Auxiliares

- **FormSubscribeButton** - Botón que se deshabilita durante el envío
- **FormError** - Errores globales del formulario
- **FormFieldWrapper** - Wrapper reutilizable (label, descripción, errores)

## 💡 Notas

- Los campos se usan sin prefijo dentro de `form.AppField`: `field.TextField`, `field.SelectField`, etc.
- Validación automática en `onBlur` para todos los campos
- Diseño consistente: asterisco requerido (`*`) con espaciado optimizado, descripción con `text-xs`
- Campos especiales: CheckboxField y SwitchField tienen label al lado, SliderField muestra valor a la derecha
