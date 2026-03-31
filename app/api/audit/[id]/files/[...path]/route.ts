/**
 * Endpoint para obtener el contenido de un archivo específico.
 * GET /api/audit/[id]/files/[path]?content=true
 *
 * Retorna contenido base y head para visualización de diff en Monaco.
 */
import { NextResponse } from 'next/server'

import { authenticateRequest } from '@/modules/auth/lib/cli-auth.middleware'
import { getAuditById } from '@/modules/audit/queries/audit.queries'
import { fetchFileContentForDiff } from '@/modules/github/services/file-content.service'

interface IFileContentResponse {
  path: string
  language: string
  baseContent: string
  headContent: string
  baseRef: string
  headRef: string
}

/**
 * Extrae el path del archivo de la URL.
 * El path puede contener múltiples segmentos (e.g., src/components/Button.tsx).
 */
function extractFilePath(url: string): string {
  const urlObj = new URL(url)
  const pathSegments = urlObj.pathname.split('/')
  // /api/audit/[id]/files/[path...]
  const filesIndex = pathSegments.findIndex(s => s === 'files')
  if (filesIndex === -1 || filesIndex + 1 >= pathSegments.length) {
    return ''
  }
  return pathSegments.slice(filesIndex + 1).join('/')
}

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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const filePath = extractFilePath(req.url)

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 })
    }

    // Decodificar path (URL encoded)
    const decodedPath = decodeURIComponent(filePath)

    const audit = await getAuditById(id)
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Autenticación unificada: sesión web o API key del CLI
    const authenticatedUser = await authenticateRequest(req)
    if (authenticatedUser && audit.userId && audit.userId !== authenticatedUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parsear repoUrl para obtener owner y repo
    // Formato esperado: https://github.com/owner/repo o owner/repo
    const repoUrlParts = audit.repoUrl.replace('https://github.com/', '').split('/')
    const owner = repoUrlParts[0] ?? ''
    const repo = repoUrlParts[1] ?? ''

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Invalid repository URL' }, { status: 400 })
    }

    // Obtener contenido de archivos
    const { baseContent, headContent } = await fetchFileContentForDiff(
      owner,
      repo,
      decodedPath,
      audit.targetBranch,
      audit.branchName
    )

    const response: IFileContentResponse = {
      path: decodedPath,
      language: detectLanguageFromPath(decodedPath),
      baseContent,
      headContent,
      baseRef: audit.targetBranch,
      headRef: audit.branchName,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching file content:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
