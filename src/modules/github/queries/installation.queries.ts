/**
 * Queries para operaciones de base de datos de instalaciones de GitHub App.
 * Encapsula todas las operaciones CRUD para instalaciones.
 */
import 'server-only'

import { eq } from 'drizzle-orm'

import { db } from '@/core/lib/db'

import { githubInstallation } from '../models/installation.schema'

import type { IGitHubInstallation, IGitHubRepository } from '../types/installation.types'

// Tipo para crear una nueva instalación
type TCreateInstallationData = {
  userId?: string | null
  installationId: number
  accountId: number
  accountLogin: string
  accountType: 'User' | 'Organization'
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  repositorySelection?: 'all' | 'selected'
  repositories?: IGitHubRepository[]
}

// Tipo para actualizar una instalación
type TUpdateInstallationData = Partial<Omit<TCreateInstallationData, 'installationId'>>

/**
 * Obtiene una instalación por el ID del usuario.
 */
export async function getInstallationByUserId(userId: string): Promise<IGitHubInstallation | null> {
  const result = await db.select().from(githubInstallation).where(eq(githubInstallation.userId, userId)).limit(1)
  return (result[0] as unknown as IGitHubInstallation) ?? null
}

/**
 * Obtiene una instalación por el installation ID de GitHub.
 */
export async function getInstallationByGithubId(installationId: number): Promise<IGitHubInstallation | null> {
  const result = await db
    .select()
    .from(githubInstallation)
    .where(eq(githubInstallation.installationId, installationId))
    .limit(1)
  return (result[0] as unknown as IGitHubInstallation) ?? null
}

/**
 * Crea una nueva instalación de GitHub App.
 */
export async function createInstallation(data: TCreateInstallationData): Promise<IGitHubInstallation> {
  const result = await db.insert(githubInstallation).values(data).returning()
  return result[0] as unknown as IGitHubInstallation
}

/**
 * Actualiza una instalación existente.
 */
export async function updateInstallation(id: string, data: TUpdateInstallationData): Promise<IGitHubInstallation> {
  const result = await db
    .update(githubInstallation)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(githubInstallation.id, id))
    .returning()
  return result[0] as unknown as IGitHubInstallation
}

/**
 * Elimina una instalación por su ID.
 */
export async function deleteInstallation(id: string): Promise<void> {
  await db.delete(githubInstallation).where(eq(githubInstallation.id, id))
}
