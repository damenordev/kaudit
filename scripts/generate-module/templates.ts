import type { Flags } from './config'

export const templates = {
  components: {
    formComponent: (name: string, capitalized: string) => `'use client'

import { use${capitalized}Form } from './use-${name}-form'

export function ${capitalized}Form() {
  const { form } = use${capitalized}Form()

  return (
    <form.AppForm>
      <form.AppField name="name">
        {(field) => <field.TextField label="Name" />}
      </form.AppField>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  )
}
`,
    formSchema: (name: string, capitalized: string, camelCase: string) => `import { z } from 'zod'

export const ${camelCase}Schema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export type T${capitalized}Form = z.infer<typeof ${camelCase}Schema>
`,
    formHook: (name: string, capitalized: string, camelCase: string) => `'use client'

import { useForm } from '@/core/form'
import { create${capitalized}Action } from '../../actions/${name}.actions'
import { ${camelCase}Schema, type T${capitalized}Form } from './${name}.schema'

export function use${capitalized}Form() {
  const form = useForm({
    defaultValues: { name: '' } as T${capitalized}Form,
    validators: { onBlur: ${camelCase}Schema },
    onSubmit: async ({ value }) => {
      return create${capitalized}Action(value)
    },
  })

  return { form }
}
`,
    formBarrel: (name: string) => `export * from './${name}-form'
export * from './${name}.schema'
`,
    listComponent: (capitalized: string) => `export function ${capitalized}List() {
  return (
    <div>
      <h2>${capitalized} List</h2>
    </div>
  )
}
`,
    barrel: (name: string, capitalized: string) => `export * from './${name}-form'
export { ${capitalized}List } from './${name}-list'
`,
  },

  actions: {
    content: (name: string, capitalized: string, camelCase: string) => `'use server'

import { ${camelCase}Schema, type T${capitalized}Form } from '../components/${name}-form/${name}.schema'

export async function create${capitalized}Action(data: T${capitalized}Form) {
  const parsed = ${camelCase}Schema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  // TODO: Implement creation logic
  return { success: true }
}
`,
    barrel: (name: string) => `export * from './${name}.actions'
`,
  },

  services: {
    content: (capitalized: string) => `export async function get${capitalized}s() {
  // TODO: Implement query
  return []
}

export async function get${capitalized}ById(id: string) {
  // TODO: Implement query
  return null
}
`,
    barrel: (name: string) => `export * from './${name}.service'
`,
  },

  models: {
    schema: (name: string, camelCase: string) => `import { text, timestamp } from 'drizzle-orm/pg-core'

import { createTable } from '@/core/db'

export const ${camelCase} = createTable('${name}', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
`,
    barrel: (name: string) => `export * from './${name}.schema'
`,
  },

  types: {
    content: (capitalized: string) => `export interface I${capitalized} {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}
`,
    barrel: (name: string) => `export * from './${name}.types'
`,
  },

  config: {
    content: (name: string) => `// Module configuration
// Example: export const ${name.toUpperCase().replace(/-/g, '_')}_PER_PAGE = 10
`,
    barrel: (name: string) => `export * from './${name}.config'
`,
  },

  barrels: {
    clientSafe: (flags: Flags) => {
      const exports = [`export * from './components'`]
      if (flags.withLib) exports.push(`export * from './lib'`)
      return exports.join('\n') + '\n'
    },
    serverSide: (flags: Flags) => {
      const exports: string[] = []
      if (flags.withActions) exports.push(`export * from './actions'`)
      if (flags.withServices) exports.push(`export * from './services'`)
      if (flags.withDb) exports.push(`export * from './models'`)
      if (flags.withTypes) exports.push(`export * from './types'`)
      return exports.join('\n') + '\n'
    },
  },
}
