/**
 * Queries para operaciones de base de datos de API keys.
 * Consulta directa con Drizzle, sin pasar por API routes.
 */
import 'server-only'

import { desc, eq } from 'drizzle-orm'

import { db } from '@/core/lib/db'
import { apiKey } from '../models/auth.schema'

/** API key enmascarada segura para enviar al cliente */
export interface IApiKeyRow {
  id: string
  name: string | null
  prefix: string | null
  start: string | null
  createdAt: Date | null
  expiresAt: Date | null
  enabled: boolean | null
}

/**
 * Lista las API keys de un usuario, ordenadas por fecha de creación.
 * Omite el campo `key` por seguridad (nunca se expone al frontend).
 */
export async function listApiKeysByUserId(userId: string): Promise<IApiKeyRow[]> {
  return db
    .select({
      id: apiKey.id,
      name: apiKey.name,
      prefix: apiKey.prefix,
      start: apiKey.start,
      createdAt: apiKey.createdAt,
      expiresAt: apiKey.expiresAt,
      enabled: apiKey.enabled,
    })
    .from(apiKey)
    .where(eq(apiKey.userId, userId))
    .orderBy(desc(apiKey.createdAt))
}
