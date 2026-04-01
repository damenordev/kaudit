import { pgTableCreator } from 'drizzle-orm/pg-core'

import pkg from '../../../../package.json'

/** Prefijo global para todas las tablas (ej: "kaudit_user", "kaudit_session") */
const TABLE_PREFIX = pkg.config?.dbTablePrefix ?? ''

export const createTable = pgTableCreator(name => `${TABLE_PREFIX}${name}`)
