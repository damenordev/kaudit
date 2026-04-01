import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { apiKey } from 'better-auth/plugins'

import { db } from '@/core/lib/db'
import { account, apiKey as apiKeyTable, session, user, verification } from '../models/auth.schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
      apikey: apiKeyTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_APP_CLIENT_ID!,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['github'],
    },
  },
  plugins: [
    apiKey({
      rateLimit: {
        enabled: false,
      },
    }),
  ],
})

export type Session = typeof auth.$Infer.Session
