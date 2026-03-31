/**
 * Cliente API para comunicarse con el backend de GitHub Auditor.
 * Maneja el inicio de auditorías, polling de estado y autenticación.
 */
import type { IAuditStartResponse, IAuditStatusResponse } from '@/modules/audit/types/api.types'

import type { TCliStatus } from '../types/cli.types'
import { buildHeaders, handleAuthError } from './auth'

const POLL_INTERVAL = 2000
const DEFAULT_MAX_POLL_TIME = 600_000
const FETCH_TIMEOUT_MS = 30_000
// Timeout para polling de estado (60s — el servidor puede estar procesando)
const STATUS_POLL_TIMEOUT_MS = 60_000

/**
 * Envuelve un fetch con timeout configurable y mensaje de error descriptivo.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs: number = FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...init, signal: init.signal ?? controller.signal })
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Request timeout: el servidor no respondió en ${timeoutMs / 1000}s (${url})`)
    }
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(`No se pudo conectar al servidor (${url}). Verificá que esté corriendo: ${msg}`)
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Valida una API key contra el servidor.
 */
export { validateApiKey } from './auth'

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
    headers: buildHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    handleAuthError(response.status)
    const errorText = await response.text()
    throw new Error(`API error: ${response.status} - ${errorText}`)
  }

  return response.json() as Promise<IAuditStartResponse>
}

/**
 * Obtiene el estado actual de una auditoría.
 */
export async function getAuditStatus(apiUrl: string, auditId: string): Promise<IAuditStatusResponse> {
  const response = await fetchWithTimeout(
    `${apiUrl}/api/audit/${auditId}/status`,
    { headers: buildHeaders() },
    STATUS_POLL_TIMEOUT_MS
  )

  if (!response.ok) {
    if (response.status === 404) throw new Error('Audit not found')
    handleAuthError(response.status)
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
): Promise<{ success: boolean; prUrl?: string; prNumber?: number; updated?: boolean; error?: string }> {
  const response = await fetchWithTimeout(`${apiUrl}/api/audit/${auditId}/create-pr`, {
    method: 'POST',
    headers: buildHeaders(),
  })

  if (!response.ok) {
    handleAuthError(response.status)
  }

  return response.json() as Promise<{
    success: boolean
    prUrl?: string
    prNumber?: number
    updated?: boolean
    error?: string
  }>
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

    if (status === 'completed' || status === 'failed' || status === 'blocked') {
      return statusData
    }

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))
  }

  throw new Error('Polling timeout - audit took too long')
}
