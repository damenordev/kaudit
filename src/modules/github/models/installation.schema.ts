/**
 * Schema de la tabla github_installation para el flujo OAuth de GitHub App.
 * Almacena las instalaciones de la app en cuentas de usuarios/organizaciones.
 */
import { relations } from 'drizzle-orm'
import { index, integer, jsonb, text, timestamp } from 'drizzle-orm/pg-core'

import { createTable } from '@/core/lib/db'
import { user } from '@/modules/auth/models/auth.schema'

import type { IGitHubRepository } from '../types/installation.types'

// Enum para tipo de cuenta de GitHub
export const accountTypeEnum = ['User', 'Organization'] as const
export type TAccountType = (typeof accountTypeEnum)[number]

// Enum para selección de repositorios
export const repoSelectionEnum = ['all', 'selected'] as const
export type TRepoSelection = (typeof repoSelectionEnum)[number]

// Tabla de instalaciones de GitHub App
export const githubInstallation = createTable(
  'github_installation',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Usuario que autorizó la instalación
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    // ID de instalación de GitHub
    installationId: integer('installation_id').notNull().unique(),
    // Información de la cuenta de GitHub
    accountId: integer('account_id').notNull(),
    accountLogin: text('account_login').notNull(),
    accountType: text('account_type', { enum: accountTypeEnum }).notNull(),
    // Tokens de acceso (encriptados en producción)
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at'),
    // Configuración de repositorios
    repositorySelection: text('repository_selection', { enum: repoSelectionEnum }).default('all').notNull(),
    repositories: jsonb('repositories').$type<IGitHubRepository[]>(),
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => [
    index('gh_installation_user_id_idx').on(table.userId),
    index('gh_installation_installation_id_idx').on(table.installationId),
    index('gh_installation_account_id_idx').on(table.accountId),
  ]
)

// Relaciones de la tabla github_installation
export const githubInstallationRelations = relations(githubInstallation, ({ one }) => ({
  user: one(user, { fields: [githubInstallation.userId], references: [user.id] }),
}))
