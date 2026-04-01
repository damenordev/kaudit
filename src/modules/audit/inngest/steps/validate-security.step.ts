/**
 * Step 1 del workflow: validación de seguridad del diff.
 * Verifica que el diff no contenga patrones peligrosos.
 */
import { NonRetriableError } from 'inngest'
import { eq } from 'drizzle-orm'

import { db } from '@/core/lib/db'
import { user } from '@/modules/auth/models/auth.schema'
import { getAuditById, updateAuditStatus } from '../../queries/audit.queries'
import { validateGitDiff } from '../../services/validation.service'

import type { IValidationResult } from '../../types'

/**
 * Ejecuta la validación de seguridad sobre el git diff de la auditoría.
 * @param auditId - ID de la auditoría
 * @returns Resultado de la validación con issues detectados
 */
export async function runValidateSecurity(auditId: string): Promise<IValidationResult> {
  await updateAuditStatus(auditId, 'validating')
  const auditRecord = await getAuditById(auditId)
  if (!auditRecord?.gitDiff) {
    throw new NonRetriableError('No se encontró git diff para la auditoría')
  }

  let customRules: string | undefined
  if (auditRecord.userId) {
    const [foundUser] = await db
      .select({ customRules: user.customRules })
      .from(user)
      .where(eq(user.id, auditRecord.userId))
    
    if (foundUser?.customRules) {
      customRules = foundUser.customRules
    }
  }

  return validateGitDiff(auditRecord.gitDiff, customRules)
}
