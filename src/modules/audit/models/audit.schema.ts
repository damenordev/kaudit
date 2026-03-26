/**
 * Schema de la tabla audit para el sistema de auditorías de GitHub.
 * Incluye el enum de estados y las relaciones con el usuario.
 */
import { relations } from 'drizzle-orm'
import { index, jsonb, text, timestamp, varchar } from 'drizzle-orm/pg-core'

import { createTable } from '@/core/lib/db'
import { user } from '@/modules/auth/models/auth.schema'

// Enum de estados de una auditoría
export const auditStatusEnum = ['pending', 'processing', 'validating', 'generating', 'completed', 'failed'] as const
export type TAuditStatus = (typeof auditStatusEnum)[number]

// Tabla principal de auditorías
export const audit = createTable(
  'audit',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Usuario que creó la auditoría (nullable para CLI/anonymous)
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    // Información del repositorio
    repoUrl: text('repo_url').notNull(),
    branchName: text('branch_name').notNull(),
    targetBranch: text('target_branch').notNull().default('main'),
    // Contenido del diff
    gitDiff: text('git_diff'),
    gitDiffHash: varchar('git_diff_hash', { length: 64 }).unique(),
    // Estado y resultados
    status: text('status', { enum: auditStatusEnum }).default('pending').notNull(),
    validationResult: jsonb('validation_result').$type<Record<string, unknown>>(),
    generatedContent: jsonb('generated_content').$type<Record<string, unknown>>(),
    // URLs y errores
    prUrl: text('pr_url'),
    errorMessage: text('error_message'),
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => [
    index('audit_user_id_idx').on(table.userId),
    index('audit_status_idx').on(table.status),
    index('audit_git_diff_hash_idx').on(table.gitDiffHash),
  ]
)

// Relaciones de la tabla audit
export const auditRelations = relations(audit, ({ one }) => ({
  user: one(user, { fields: [audit.userId], references: [user.id] }),
}))
