/**
 * Server Action para corregir auditorías atascadas en estados intermedios.
 * Marca como 'failed' las que llevan más de 10 minutos sin actualizarse.
 */
'use server'

import { and, inArray, lt } from 'drizzle-orm'

import { db } from '@/core/lib/db'
import { audit } from '@/modules/audit/models/audit.schema'

/** Status que indican auditorías en progreso (potencialmente atascadas). */
const STALE_STATUSES = ['pending', 'processing', 'validating', 'generating'] as const

/** Tiempo máximo (ms) que una auditoría puede estar en progreso. */
const STALE_THRESHOLD_MS = 10 * 60 * 1000

export type TFixStaleAuditsResult = { success: true; fixedCount: number } | { success: false; error: string }

/**
 * Busca auditorías atascadas en estados intermedios y las marca como fallidas.
 * Solo afecta auditorías cuyo updatedAt sea mayor a 10 minutos atrás,
 * para no interferir con auditorías que realmente están en ejecución.
 */
export async function fixStaleAuditsAction(): Promise<TFixStaleAuditsResult> {
  try {
    const tenMinutesAgo = new Date(Date.now() - STALE_THRESHOLD_MS)

    const fixed = await db
      .update(audit)
      .set({
        status: 'failed',
        errorMessage: 'Auditoría interrumpida — falló antes de completarse. Intenta ejecutarla de nuevo.',
        updatedAt: new Date(),
      })
      .where(and(inArray(audit.status, [...STALE_STATUSES]), lt(audit.updatedAt, tenMinutesAgo)))
      .returning({ id: audit.id })

    return { success: true, fixedCount: fixed.length }
  } catch (error) {
    console.error('Error corrigiendo auditorías atascadas:', error)
    return { success: false, error: 'Error interno al corregir auditorías atascadas.' }
  }
}
