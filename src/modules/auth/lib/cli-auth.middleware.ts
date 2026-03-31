/**
 * Middleware de autenticación para API routes.
 * Soporta sesión web (cookies) y API key (Bearer token) para CLI.
 */
import { getSession, requireAuth } from '../services/auth.service'
import { validateApiKey } from './api-key-auth'

/** Información del usuario autenticado */
interface IAuthenticatedUser {
  userId: string
}

/**
 * Intenta autenticar una petición usando sesión o API key.
 * Retorna el usuario si alguna autenticación es válida, null si no.
 * Útil para rutas que permiten acceso anónimo condicional.
 */
export async function authenticateRequest(request: Request): Promise<IAuthenticatedUser | null> {
  // 1. Intentar autenticación por API key (CLI con Bearer token)
  const apiKeyUser = await validateApiKey(request)
  if (apiKeyUser) return apiKeyUser

  // 2. Intentar autenticación por sesión (web dashboard)
  try {
    const session = await getSession()
    if (session?.user?.id) {
      return { userId: session.user.id }
    }
  } catch {
    // Sin sesión válida - continuar
  }

  return null
}

/**
 * Requiere autenticación obligatoria (sesión o API key).
 * Lanza error si no hay autenticación válida.
 * Usar en rutas que NO permiten acceso anónimo.
 */
export async function requireAuthOrApiKey(request: Request): Promise<IAuthenticatedUser> {
  const user = await authenticateRequest(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

/**
 * Requiere autenticación obligatoria con verificación de ownership.
 * Útil para rutas que protegen recursos de un usuario específico.
 */
export async function requireAuthWithOwnership(
  request: Request,
  resourceUserId: string | null | undefined
): Promise<IAuthenticatedUser> {
  const user = await requireAuthOrApiKey(request)

  if (resourceUserId && resourceUserId !== user.userId) {
    throw new Error('Forbidden')
  }

  return user
}

export type { IAuthenticatedUser }
