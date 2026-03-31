/**
 * Server Action para obtener contenido de archivos.
 * Reemplaza el endpoint /api/audit/[id]/files/[path] eliminando
 * la capa HTTP y permitiendo llamadas directas desde Client Components.
 */
'use server'

import { z } from 'zod'

import { requireAuth } from '@/modules/auth/services/auth.service'
import { getAuditById } from '@/modules/audit/queries/audit.queries'
import { fetchFileContentForDiff } from '@/modules/github/services/file-content.service'

// Validación de inputs con Zod
const fileContentInputSchema = z.object({
  auditId: z.string().min(1, 'ID de auditoría requerido'),
  filePath: z.string().min(1, 'Ruta de archivo requerida'),
})

// Respuesta del action con datos del archivo
export interface IFileContentActionData {
  language: string
  originalContent: string
  modifiedContent: string
  baseRef: string
  headRef: string
}

// Resultado discriminado: éxito o error
export type TFileContentActionResult =
  | { success: true; data: IFileContentActionData }
  | { success: false; error: string }

/**
 * Detecta el lenguaje del archivo basado en su extensión.
 */
function detectLanguageFromPath(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase() ?? ''
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    kt: 'kotlin',
    swift: 'swift',
    c: 'c',
    cpp: 'cpp',
    h: 'c',
    hpp: 'cpp',
    cs: 'csharp',
    php: 'php',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    dockerfile: 'dockerfile',
    vue: 'vue',
    svelte: 'svelte',
    graphql: 'graphql',
    gql: 'graphql',
  }
  return languageMap[extension] ?? 'plaintext'
}

/**
 * Obtiene el contenido de un archivo para visualización de diff.
 * Valida inputs, verifica ownership y obtiene contenido base/head.
 */
export async function getFileContentAction(auditId: string, filePath: string): Promise<TFileContentActionResult> {
  // Validar inputs
  const parsed = fileContentInputSchema.safeParse({ auditId, filePath })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Input inválido' }
  }

  try {
    const audit = await getAuditById(auditId)
    if (!audit) {
      return { success: false, error: 'Auditoría no encontrada' }
    }

    // Verificar ownership del usuario autenticado
    try {
      const session = await requireAuth()
      if (audit.userId && audit.userId !== session.user.id) {
        return { success: false, error: 'Acceso denegado' }
      }
    } catch {
      // Usuario CLI anónimo - permitir acceso
    }

    // Parsear repoUrl para obtener owner y repo
    const repoUrlParts = audit.repoUrl.replace('https://github.com/', '').split('/')
    const owner = repoUrlParts[0] ?? ''
    const repo = repoUrlParts[1] ?? ''

    if (!owner || !repo) {
      return { success: false, error: 'URL de repositorio inválida' }
    }

    // Obtener contenido de archivos (base y head en paralelo)
    const { baseContent, headContent } = await fetchFileContentForDiff(
      owner,
      repo,
      filePath,
      audit.targetBranch,
      audit.branchName
    )

    return {
      success: true,
      data: {
        language: detectLanguageFromPath(filePath),
        originalContent: baseContent,
        modifiedContent: headContent,
        baseRef: audit.targetBranch,
        headRef: audit.branchName,
      },
    }
  } catch (error) {
    console.error('Error obteniendo contenido del archivo:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}
