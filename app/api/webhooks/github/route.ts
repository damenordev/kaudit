/**
 * Endpoint para recibir webhooks de GitHub App.
 * POST /api/webhooks/github
 * Procesa eventos pull_request (opened, synchronize) y dispara auditorías.
 */
import { NextResponse } from 'next/server'

import { env } from '@/env'
import { inngest } from '@/core/lib/inngest/client'
import { createAudit } from '@/modules/audit/queries/audit.queries'
import { verifyGitHubWebhook } from '@/modules/github/lib/verify-webhook.utils'
import { getGitHubClient } from '@/modules/github/lib/github-client'
import { nanoid } from 'nanoid'

import type { IGitHubPullRequestEvent, TGitHubPrAction } from '@/modules/github/types/webhook.types'

// Acciones que disparan auditoría
const PR_ACTIONS: Set<string> = new Set<TGitHubPrAction>(['opened', 'synchronize'])

/**
 * Obtiene el diff entre base y head usando la API de GitHub.
 */
async function fetchGitDiff(owner: string, repo: string, base: string, head: string): Promise<string> {
  const octokit = getGitHubClient()
  if (!octokit) return ''

  const response = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base,
    head,
    headers: { accept: 'application/vnd.github.v3.diff' },
  })

  const data = response.data as { files?: Array<{ filename: string; patch?: string }> }
  return (
    data.files
      ?.map(f => f.patch ?? '')
      .filter(Boolean)
      .join('\n') ?? ''
  )
}

export async function POST(req: Request) {
  // Leer body crudo para verificación de firma
  const rawBody = await req.text()
  const signature = req.headers.get('x-hub-signature-256') ?? ''
  const githubEvent = req.headers.get('x-github-event') ?? ''

  // Verificar firma del webhook
  const webhookSecret = env.GITHUB_WEBHOOK_SECRET
  if (!webhookSecret || !verifyGitHubWebhook(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Solo procesar eventos pull_request
  if (githubEvent !== 'pull_request') {
    return NextResponse.json({ message: 'Event ignored' }, { status: 200 })
  }

  const payload: IGitHubPullRequestEvent = JSON.parse(rawBody)

  // Filtrar acciones relevantes
  if (!PR_ACTIONS.has(payload.action)) {
    return NextResponse.json({ message: `Action '${payload.action}' ignored` }, { status: 200 })
  }

  // Extraer datos del PR de forma segura
  const pr = payload.pull_request
  const repo = payload.repository
  const [owner, repoName] = repo.full_name.split('/')
  const branchName = pr.head.ref
  const targetBranch = pr.base.ref
  const repoUrl = repo.html_url
  const installationId = payload.installation?.id

  // Crear auditoría sin bloquear la respuesta
  const auditId = nanoid()

  // Obtener diff en background
  const gitDiff = await fetchGitDiff(owner!, repoName!, targetBranch, branchName)

  await createAudit({
    id: auditId,
    repoUrl,
    branchName,
    targetBranch,
    gitDiff: gitDiff || undefined,
  })

  // Disparar workflow de auditoría
  await inngest.send({
    name: 'audit/created',
    data: {
      auditId,
      repoUrl,
      branchName,
      targetBranch,
      userId: installationId ? `github-app:${installationId}` : null,
    },
  })

  return NextResponse.json(
    {
      auditId,
      status: 'pending',
      message: `Audit triggered for PR #${pr.number} (${payload.action})`,
    },
    { status: 201 }
  )
}
