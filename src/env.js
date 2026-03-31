import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
    BETTER_AUTH_URL: z.string().url().optional(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    REQUESTY_API_KEY: z.string(),
    OPENROUTER_API_KEY: z.string(),
    SENTRY_DSN: z.string().url().optional(),
    // Inngest - opcional, solo requerido cuando se usa Inngest
    INNGEST_EVENT_KEY: z.string().optional(),
    INNGEST_SIGNING_KEY: z.string().optional(),
    // GitHub - opcional en desarrollo, requerido en producción
    GITHUB_TOKEN: process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
    // GitHub App OAuth
    GITHUB_APP_CLIENT_ID: z.string().optional(),
    GITHUB_APP_CLIENT_SECRET: z.string().optional(),
    // Secreto del webhook de GitHub App
    GITHUB_WEBHOOK_SECRET: z.string().optional(),
  },

  client: {},

  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    REQUESTY_API_KEY: process.env.REQUESTY_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
    GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
    GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
