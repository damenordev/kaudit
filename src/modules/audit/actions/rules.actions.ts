'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/core/lib/db'
import { user } from '@/modules/auth/models/auth.schema'
import { getSession } from '@/modules/auth/services'

export type TSaveRulesResult = { success: true } | { success: false; error: string }

/**
 * Obtiene las reglas personalizadas del usuario autenticado.
 */
export async function getCustomRulesAction(): Promise<string> {
  try {
    const session = await getSession()
    if (!session?.user) return ''

    const [foundUser] = await db
      .select({ customRules: user.customRules })
      .from(user)
      .where(eq(user.id, session.user.id))

    return foundUser?.customRules ?? ''
  } catch (error) {
    console.error('Error al obtener custom rules:', error)
    return ''
  }
}

/**
 * Guarda las reglas personalizadas para el usuario autenticado.
 */
export async function saveCustomRulesAction(rules: string): Promise<TSaveRulesResult> {
  try {
    const session = await getSession()
    if (!session?.user) return { success: false, error: 'No autorizado' }

    await db
      .update(user)
      .set({
        customRules: rules,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    return { success: true }
  } catch (error) {
    console.error('Error guardando custom rules:', error)
    return { success: false, error: 'Ocurrió un error al guardar las reglas' }
  }
}
