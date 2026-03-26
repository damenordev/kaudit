/**
 * Cliente singleton de Inngest para el sistema de auditorías.
 * Ubicado en core/ ya que es infraestructura transversal.
 */
import { Inngest } from 'inngest'

import { env } from '@/env'

// IDs de eventos disponibles en el sistema
export type TInngestEventIds = 'audit/created' | 'audit/processing' | 'audit/completed' | 'audit/failed'

// Definición de tipos de eventos para type safety
export interface IInngestEvents {
  'audit/created': {
    data: {
      auditId: string
      repoUrl: string
      branchName: string
      targetBranch: string
      userId: string | null
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
})
