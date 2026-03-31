/**
 * Cliente API para comunicarse con el backend de GitHub Auditor.
 * Maneja el inicio de auditorías y polling de estado.
 */
import type { IAuditStartResponse, IAuditStatusResponse } from '@/modules/audit/types/api.types'

import type { TCliStatus } from '../types/cli.types'

// Intervalo de polling en ms
const POLL_INTERVAL = 2000
// Tiempo máximo de polling por defecto (10 minutos)
const DEFAULT_MAX_POLL_TIME = 600_000
// Timeout para fetch individual (30 segundos)
const FETCH_TIMEOUT_MS = 30_000

/**
 * Envuelve un fetch con timeout y mensaje de error descriptivo.
 */
async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      ...init,
      signal: init.signal ?? controller.signal,
    })
    return response
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Request timeout: el servidor no respondió en ${FETCH_TIMEOUT_MS / 1000}s (${url})`)
    }
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(`No se pudo conectar al servidor (${url}). ` + `Verificá que esté corriendo: ${msg}`)
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Inicia una nueva auditoría en el backend.
 */
export async function startAudit(
  apiUrl: string,
  data: {
    repoUrl: string
    branchName: string
    targetBranch: string
    gitDiff: string
    options?: Record<string, unknown>
  }
): Promise<IAuditStartResponse> {
  const response = await fetchWithTimeout(`${apiUrl}/api/audit/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error: ${response.status} - ${errorText}`)
  }

  return response.json() as Promise<IAuditStartResponse>
}

/**
 * Obtiene el estado actual de una auditoría.
 */
export async function getAuditStatus(apiUrl: string, auditId: string): Promise<IAuditStatusResponse> {
  const response = await fetchWithTimeout(`${apiUrl}/api/audit/${auditId}/status`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Audit not found')
    }
    const errorText = await response.text()
    throw new Error(`API error: ${response.status} - ${errorText}`)
  }

  return response.json() as Promise<IAuditStatusResponse>
}

/**
 * Crea un Pull Request llamando al endpoint del servidor.
 */
export async function createPr(
  apiUrl: string,
  auditId: string
): Promise<{ success: boolean; prUrl?: string; prNumber?: number; error?: string }> {
  const response = await fetchWithTimeout(`${apiUrl}/api/audit/${auditId}/create-pr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  return response.json() as Promise<{ success: boolean; prUrl?: string; prNumber?: number; error?: string }>
}

/**
 * Hace polling del estado de la auditoría hasta que termine.
 */
export async function pollAuditStatus(
  apiUrl: string,
  auditId: string,
  onStatusChange: (status: TCliStatus, data?: IAuditStatusResponse) => Promise<void>,
  options?: { timeout?: number }
): Promise<IAuditStatusResponse> {
  const startTime = Date.now()
  const timeout = options?.timeout ?? DEFAULT_MAX_POLL_TIME

  while (Date.now() - startTime < timeout) {
    const statusData = await getAuditStatus(apiUrl, auditId)
    const status = statusData.status as TCliStatus

    await onStatusChange(status, statusData)

    // Estados finales: completed, failed, blocked
    if (status === 'completed' || status === 'failed' || status === 'blocked') {
      return statusData
    }

    // Esperar antes del siguiente poll
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))
  }

  throw new Error('Polling timeout - audit took too long')
}
