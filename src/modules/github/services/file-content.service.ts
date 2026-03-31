/**
 * Servicio para obtener contenido de archivos desde GitHub.
 * Implementa caché en memoria para evitar llamadas repetidas a la API.
 */
import 'server-only'

import { getGitHubClient } from '@/modules/github/lib/github-client'

// Caché en memoria con TTL de 5 minutos
const CACHE_TTL_MS = 5 * 60 * 1000
const fileCache = new Map<string, { content: string; timestamp: number }>()

/**
 * Limpia entradas expiradas del caché.
 */
function cleanExpiredCache(): void {
  const now = Date.now()
  for (const [key, value] of fileCache.entries()) {
    if (now - value.timestamp > CACHE_TTL_MS) {
      fileCache.delete(key)
    }
  }
}

/**
 * Genera clave de caché para un archivo.
 */
function getCacheKey(owner: string, repo: string, path: string, ref: string): string {
  return `${owner}/${repo}/${ref}:${path}`
}

export interface IFileContentResult {
  content: string
  encoding: string
  size: number
  sha: string
  cached: boolean
}

/**
 * Obtiene el contenido de un archivo desde GitHub.
 * Utiliza caché en memoria para optimizar llamadas repetidas.
 */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<IFileContentResult> {
  const octokit = getGitHubClient()
  if (!octokit) {
    throw new Error('GitHub client no disponible. Configura GITHUB_TOKEN.')
  }

  // Limpiar caché expirado
  cleanExpiredCache()

  // Verificar caché
  const cacheKey = getCacheKey(owner, repo, path, ref)
  const cached = fileCache.get(cacheKey)
  if (cached) {
    return {
      content: cached.content,
      encoding: 'utf-8',
      size: cached.content.length,
      sha: 'cached',
      cached: true,
    }
  }

  // Fetch desde GitHub API
  const response = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    ref,
  })

  // Verificar que es un archivo, no un directorio
  if (Array.isArray(response.data)) {
    throw new Error(`Path "${path}" es un directorio, no un archivo`)
  }

  if (response.data.type !== 'file') {
    throw new Error(`Path "${path}" no es un archivo: ${response.data.type}`)
  }

  // Decodificar contenido base64
  const fileData = response.data as { content?: string; encoding?: string; size?: number; sha?: string }
  if (!fileData.content) {
    throw new Error(`Archivo "${path}" no tiene contenido`)
  }

  const content = Buffer.from(fileData.content, 'base64').toString('utf-8')

  // Guardar en caché
  fileCache.set(cacheKey, { content, timestamp: Date.now() })

  return {
    content,
    encoding: fileData.encoding ?? 'base64',
    size: fileData.size ?? content.length,
    sha: fileData.sha ?? '',
    cached: false,
  }
}

/**
 * Obtiene contenido de archivos base y head para comparación.
 */
export async function fetchFileContentForDiff(
  owner: string,
  repo: string,
  path: string,
  baseRef: string,
  headRef: string
): Promise<{ baseContent: string; headContent: string }> {
  const [baseResult, headResult] = await Promise.all([
    // Archivo base puede no existir si es nuevo
    fetchFileContent(owner, repo, path, baseRef).catch(() => ({ content: '' })),
    fetchFileContent(owner, repo, path, headRef).catch(() => ({ content: '' })),
  ])

  return {
    baseContent: baseResult.content,
    headContent: headResult.content,
  }
}
