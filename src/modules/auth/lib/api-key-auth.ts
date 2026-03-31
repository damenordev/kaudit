/**
 * Helper para validar API keys desde headers de petición.
 * Usado por el CLI para autenticarse con el servidor.
 */
import { auth } from './auth.config'

/** Resultado exitoso de validación de API key */
interface IApiKeyUser {
  userId: string
}

/** Cache en memoria para evitar queries repetidas a la DB */
const keyCache = new Map<string, { userId: string; expiresAt: number }>()

/** Tiempo de vida del cache: 30 segundos */
const CACHE_TTL_MS = 30_000

/** Limpia entradas expiradas del cache */
function cleanExpiredCache(): void {
  const now = Date.now()
  for (const [key, entry] of keyCache) {
    if (now > entry.expiresAt) {
      keyCache.delete(key)
    }
  }
}

/**
 * Extrae y valida un Bearer token del header Authorization.
 * Retorna el userId si la API key es válida, null en caso contrario.
 */
export async function validateApiKey(request: Request): Promise<IApiKeyUser | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const key = authHeader.slice(7)
  if (!key) return null

  // Verificar cache antes de consultar la DB
  const cached = keyCache.get(key)
  if (cached && Date.now() < cached.expiresAt) {
    return { userId: cached.userId }
  }

  try {
    const result = await auth.api.verifyApiKey({ body: { key } })

    if (!result.valid || !result.key) return null

    // El plugin retorna el key con userId (Omit<ApiKey, "key"> incluye userId)
    const userId = result.key.userId
    if (!userId) return null

    // Guardar en cache
    keyCache.set(key, {
      userId,
      expiresAt: Date.now() + CACHE_TTL_MS,
    })

    // Limpieza periódica del cache
    if (keyCache.size > 100) {
      cleanExpiredCache()
    }

    return { userId }
  } catch {
    return null
  }
}
