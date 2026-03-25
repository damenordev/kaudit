import { relations } from 'drizzle-orm'
import { text, timestamp } from 'drizzle-orm/pg-core'

import { createTable } from '@/core/db'
import { user } from '@/modules/auth/models/auth.schema'

// Tabla de perfil de usuario (relacion 1:1 con user)
export const userProfile = createTable('user_profile', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),

  // Informacion extendida
  bio: text('bio'),
  phone: text('phone'),
  location: text('location'),

  // Timestamps
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

// Relaciones
export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}))

// Tipos derivados
export type TUserProfile = typeof userProfile.$inferSelect
export type TNewUserProfile = typeof userProfile.$inferInsert
