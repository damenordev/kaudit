import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { apiKey } from 'better-auth/plugins'

import { db } from '@/core/lib/db'
import { account, apiKey as apiKeyTable, session, user, verification } from '../models/auth.schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification,
      apiKey: apiKeyTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [apiKey()],
})

export type Session = typeof auth.$Infer.Session
