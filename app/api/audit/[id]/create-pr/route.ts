/**
 * Endpoint para crear un Pull Request desde el CLI.
 * POST /api/audit/[id]/create-pr
 *
 * Permite acceso anónimo para CLI - usa Octokit en lugar de gh CLI.
 */
import { NextResponse } from 'next/server'

import { getAuditById, updateAuditStatus } from '@/modules/audit/queries/audit.queries'
import { createPullRequest, isGitHubAvailable } from '@/modules/github/services/github.service'

interface ICreatePrResponse {
  success: boolean
  prUrl?: string
  prNumber?: number
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

    // Verificar que GitHub está configurado en el servidor
    if (!isGitHubAvailable()) {
      return NextResponse.json(
        { success: false, error: 'GitHub no está configurado en el servidor. Falta GITHUB_TOKEN.' },
        { status: 503 }
      )
    }

    // Obtener la auditoría
    const audit = await getAuditById(id)
    if (!audit) {
      return NextResponse.json({ success: false, error: 'Auditoría no encontrada' }, { status: 404 })
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

    // Actualizar la auditoría con la URL del PR
    await updateAuditStatus(id, 'completed', { prUrl: prResult.prUrl })

    return NextResponse.json({
      success: true,
      prUrl: prResult.prUrl,
      prNumber: prResult.prNumber,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
