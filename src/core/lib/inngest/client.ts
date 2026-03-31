/**
 * Cliente singleton de Inngest para el sistema de auditorías.
 * Ubicado en core/ ya que es infraestructura transversal.
 */
import { Inngest } from 'inngest'

import { env } from '@/env'

// IDs de eventos disponibles en el sistema
export type TInngestEventIds = 'audit/created' | 'audit/processing' | 'audit/completed' | 'audit/failed'

/** Opciones para omitir steps opcionales del workflow de auditoría */
export interface IAuditOptions {
  skipPRDescription?: boolean
  skipDocstrings?: boolean
  skipTests?: boolean
  skipPRComments?: boolean
}

// Definición de tipos de eventos para type safety
export interface IInngestEvents {
  'audit/created': {
    data: {
      auditId: string
      repoUrl: string
      branchName: string
      targetBranch: string
      userId: string | null
      options?: IAuditOptions
    }
  }
  'audit/processing': {
    data: {
      auditId: string
      step: string
    }
  }
  'audit/completed': {
    data: {
      auditId: string
      prUrl: string | null
    }
  }
  'audit/failed': {
    data: {
      auditId: string
      error: string
    }
  }
}

// Cliente singleton de Inngest
export const inngest = new Inngest({
  id: 'github-auditor',
  eventKey: env.INNGEST_EVENT_KEY,
  // URL base del servidor Inngest (self-hosted o dev server). Si no se define,
  // el SDK usa Inngest Cloud por defecto.
  ...(env.INNGEST_BASE_URL ? { baseUrl: env.INNGEST_BASE_URL } : {}),
})
