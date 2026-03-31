/** Endpoint para crear un Pull Request desde el CLI. Requiere autenticación. */
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireAuthOrApiKey } from '@/modules/auth/lib/cli-auth.middleware'
import { getAuditById, updateAuditStatus } from '@/modules/audit/queries/audit.queries'
import { createPullRequest, isGitHubAvailable } from '@/modules/github/services/github.service'

/** El endpoint create-pr no acepta body */
const emptyBodySchema = z.union([z.undefined(), z.object({}).strict()])

interface ICreatePrResponse {
  success: boolean
  prUrl?: string
  prNumber?: number
  updated?: boolean
  error?: string
}

/**
 * Parsea una URL de GitHub para extraer owner y repo.
 * Soporta formatos: https://github.com/owner/repo, git@github.com:owner/repo.git
 */
function parseGitHubUrl(repoUrl: string): { owner: string; repo: string } | null {
  try {
    // Formato HTTPS: https://github.com/owner/repo
    const httpsMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (httpsMatch?.[1] && httpsMatch[2]) {
      return { owner: httpsMatch[1], repo: httpsMatch[2].replace(/\.git$/, '') }
    }

    // Formato SSH: git@github.com:owner/repo.git
    const sshMatch = repoUrl.match(/git@github\.com:([^/]+)\/(.+)\.git$/)
    if (sshMatch?.[1] && sshMatch[2]) {
      return { owner: sshMatch[1], repo: sshMatch[2] }
    }

    return null
  } catch {
    return null
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ICreatePrResponse>> {
  try {
    const { id } = await params
    // CRÍTICO: Requiere autenticación obligatoria (sesión web o API key del CLI)
    const authenticatedUser = await requireAuthOrApiKey(req)

    // Validar que el body esté vacío o sea un objeto vacío
    let body: unknown
    try {
      body = await req.json()
    } catch {
      body = undefined
    }
    emptyBodySchema.parse(body)

    // Verificar que GitHub está configurado
    if (!isGitHubAvailable()) {
      return NextResponse.json(
        { success: false, error: 'GitHub no está configurado en el servidor. Falta GITHUB_TOKEN.' },
        { status: 503 }
      )
    }

    // Obtener auditoría y verificar existencia
    const audit = await getAuditById(id)
    if (!audit) {
      return NextResponse.json({ success: false, error: 'Auditoría no encontrada' }, { status: 404 })
    }

    // Verificar ownership si el usuario está autenticado y la auditoría tiene userId
    if (authenticatedUser && audit.userId && audit.userId !== authenticatedUser.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // Verificar estado completado
    if (audit.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: `La auditoría no está completada. Estado actual: ${audit.status}` },
        { status: 400 }
      )
    }

    // Verificar que hay contenido generado
    if (!audit.generatedContent?.title) {
      return NextResponse.json(
        { success: false, error: 'La auditoría no tiene contenido generado para el PR' },
        { status: 400 }
      )
    }

    // Parsear URL del repositorio
    const repoInfo = parseGitHubUrl(audit.repoUrl)
    if (!repoInfo) {
      return NextResponse.json(
        { success: false, error: 'No se pudo parsear la URL del repositorio. Formato no soportado.' },
        { status: 400 }
      )
    }

    // Verificar que no es un repo local
    if (audit.repoUrl.includes('/local/') || audit.repoUrl.includes('local/repository')) {
      return NextResponse.json(
        { success: false, error: 'Repositorio local detectado. No se puede crear PR.' },
        { status: 400 }
      )
    }

    // Crear el PR usando Octokit
    const prBody = audit.generatedContent.rawMarkdown ?? audit.generatedContent.summary
    const prResult = await createPullRequest({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      title: audit.generatedContent.title,
      head: audit.branchName,
      base: audit.targetBranch ?? 'main',
      body: prBody,
    })

    // Actualizar auditoría con URL del PR
    await updateAuditStatus(id, 'completed', { prUrl: prResult.prUrl })

    return NextResponse.json({
      success: true,
      prUrl: prResult.prUrl,
      prNumber: prResult.prNumber,
      updated: prResult.updated,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Este endpoint no acepta body', details: error.issues },
        { status: 400 }
      )
    }
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
