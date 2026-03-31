/**
 * Utilidades de autenticación para el CLI.
 * Maneja headers de autorización, validación de API keys y errores de auth.
 */
import { getApiKey } from './config'

/**
 * Construye headers HTTP incluyendo autenticación si hay API key.
 */
export function buildHeaders(custom?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...custom }
  const apiKey = getApiKey()
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }
  return headers
}

/**
 * Lanza error descriptivo según código HTTP de respuesta.
 * Usa `never | void` porque lanza en 401/403 pero no en otros casos.
 */
export function handleAuthError(status: number): never | void {
  if (status === 401) throw new Error('API key inválida. Ejecuta: kaudit login <api-key>')
  if (status === 403) throw new Error('No tienes permisos para realizar esta acción')
}

/**
 * Valida una API key contra el servidor.
 * Retorna información del usuario si es válida.
 */
export async function validateApiKey(apiKey: string, serverUrl: string): Promise<{ valid: boolean; userId?: string }> {
  const response = await fetch(`${serverUrl}/api/auth/validate`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (response.status === 401) return { valid: false }
  if (!response.ok) throw new Error(`Error validando API key: ${response.status}`)

  return (await response.json()) as { valid: boolean; userId?: string }
}
