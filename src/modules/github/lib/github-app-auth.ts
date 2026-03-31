/**
 * Capa de autenticación para GitHub App.
 * Genera JWTs firmados manualmente con Node crypto y obtiene tokens por instalación.
 * Si no hay App configurada, cae a modo PAT (Personal Access Token).
 */
import 'server-only'

import { createSign } from 'crypto'
import { Octokit } from 'octokit'

import { env } from '@/env'

// Cache en memoria del token por instalación (los tokens duran 1h)
interface ITokenCache {
  token: string
  expiresAt: number
}

const tokenCache = new Map<number, ITokenCache>()

// Duración máxima del JWT de GitHub App: 10 minutos
const JWT_LIFETIME_SECONDS = 10 * 60

/**
 * Verifica si GitHub App está configurada con credenciales completas.
 * Requiere tanto GITHUB_APP_ID como GITHUB_APP_PRIVATE_KEY.
 */
export function isGitHubAppConfigured(): boolean {
  return Boolean(env.GITHUB_APP_ID && env.GITHUB_APP_PRIVATE_KEY)
}

/**
 * Genera un JWT firmado con RS256 para autenticarse como GitHub App.
 * El JWT tiene una validez máxima de 10 minutos (requerimiento de GitHub).
 * @returns JWT codificado en base64url
 */
function createAppJwt(): string {
  const now = Math.floor(Date.now() / 1000)

  // Header y payload del JWT (formato base64url)
  const header = base64urlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64urlEncode(
    JSON.stringify({
      iat: now - 60, // 1 minuto de margen por clock drift
      exp: now + JWT_LIFETIME_SECONDS,
      iss: env.GITHUB_APP_ID,
    })
  )

  const signInput = `${header}.${payload}`
  const signature = createSign('RSA-SHA256').update(signInput).sign(env.GITHUB_APP_PRIVATE_KEY!, 'base64')

  return `${signInput}.${base64urlEncode(signature)}`
}

/**
 * Codifica un string en base64url (sin padding, URL-safe).
 */
function base64urlEncode(input: string): string {
  return Buffer.from(input).toString('base64url')
}

/**
 * Crea un Octokit autenticado como la App (nivel JWT).
 * Usado para llamadas administrativas como obtener tokens de instalación.
 */
function getAppOctokit(): Octokit {
  const jwt = createAppJwt()
  return new Octokit({ auth: jwt })
}

/**
 * Obtiene un token de acceso para una instalación específica.
 * Usa cache en memoria para evitar llamadas innecesarias (tokens duran 1h).
 * @param installationId - ID de la instalación de GitHub App
 * @returns Token de acceso para la instalación
 */
export async function getInstallationToken(installationId: number): Promise<string> {
  // Verificar cache
  const cached = tokenCache.get(installationId)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.token
  }

  try {
    // Obtener token nuevo vía App-level JWT
    const appOctokit = getAppOctokit()
    const response = await appOctokit.rest.apps.createInstallationAccessToken({
      installation_id: installationId,
    })

    const { token, expires_at } = response.data

    // Guardar en cache con margen de 5 minutos antes de expirar
    const expiresAt = expires_at ? new Date(expires_at).getTime() - 5 * 60 * 1000 : Date.now() + 55 * 60 * 1000

    tokenCache.set(installationId, { token, expiresAt })

    return token
  } catch (error) {
    // Limpiar cache en caso de error
    tokenCache.delete(installationId)
    throw new Error(
      `Error obteniendo token de instalación ${installationId}: ${error instanceof Error ? error.message : 'desconocido'}`
    )
  }
}

/**
 * Crea un Octokit con scope de instalación específica.
 * Usa el token de instalación obtenido vía GitHub App API.
 * @param installationId - ID de la instalación de GitHub App
 * @returns Octokit autenticado para esa instalación
 */
export async function getInstallationOctokit(installationId: number): Promise<Octokit> {
  const token = await getInstallationToken(installationId)
  return new Octokit({ auth: token })
}
