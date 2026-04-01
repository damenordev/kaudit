'use server'

import { revalidatePath } from 'next/cache'
import { getAuditById } from '../queries/audit.queries'
import { addPrComment } from '@/modules/github/services/github.service'

/**
 * Acción para aplicar una sugerencia de código de la IA a un PR.
 * Actualmente publica la sugerencia como un comentario en el PR de GitHub.
 * @param auditId - ID de la auditoría
 * @param code - Código sugerido
 */
export async function applySuggestionAction(auditId: string, code: string) {
  try {
    const audit = await getAuditById(auditId)
    if (!audit) {
      return { success: false, error: 'Audit not found' }
    }

    if (!audit.prUrl) {
      return { success: false, error: 'PR URL not found for this audit' }
    }

    // Extraer owner, repo y number de la URL del PR
    // Formato: https://github.com/owner/repo/pull/number
    const prRegex = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
    const prMatch = prRegex.exec(audit.prUrl)
    if (!prMatch) {
      return { success: false, error: 'Invalid PR URL' }
    }

    const owner = prMatch[1]
    const repo = prMatch[2]
    const pullNumber = prMatch[3]
    
    const prId = parseInt(pullNumber ?? '0', 10)
    if (!owner || !repo || !prId) {
      return { success: false, error: 'Incomplete PR data' }
    }

    const commentBody = `🤖 **Sugerencia de IA aplicada desde el panel de control:**\n\n\`\`\`typescript\n${code}\n\`\`\``
    
    await addPrComment(owner, repo, prId, commentBody)

    revalidatePath(`/dashboard/audits/${auditId}`)
    
    return { success: true }
  } catch (error) {
    console.error('[applySuggestionAction] Error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
