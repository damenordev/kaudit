import { pgTableCreator } from 'drizzle-orm/pg-core'

import { env } from '@/env'

import pkg from '../../../package.json'

const TABLE_PREFIX = env.NODE_ENV === 'production' ? '' : (pkg.config?.dbTablePrefix ?? '')

export const createTable = pgTableCreator(name => `${TABLE_PREFIX}${name}`)
