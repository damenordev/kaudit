import { type Config } from 'drizzle-kit'

import { env } from '@/env'

import pkg from './package.json'

const TABLE_PREFIX = pkg.config?.dbTablePrefix ?? ''

export default {
  schema: ['./src/core/lib/db/schema.ts', './src/modules/*/models/*.schema.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: env.NODE_ENV === 'production' ? [] : [`${TABLE_PREFIX}*`],
  verbose: true,
  strict: true,
} satisfies Config
