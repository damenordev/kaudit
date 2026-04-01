/**
 * Endpoint callback para GitHub App OAuth.
 * GET /api/gh/callback - Intercambia code por access token y guarda instalación.
 */
import { NextRequest, NextResponse } from 'next/server'

import { env } from '@/env'
import { requireAuth } from '@/modules/auth/services/auth.service'

import {
  getInstallationByGithubId,
  createInstallation,
  updateInstallation,
} from '@/modules/github/queries/installation.queries'

import type { IGitHubTokenResponse } from '@/modules/github/types/installation.types'

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

/**
 * Intercambia el code de OAuth por un access token de GitHub.
 */
async function exchangeCodeForToken(code: string): Promise<IGitHubTokenResponse> {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_APP_CLIENT_ID,
      client_secret: env.GITHUB_APP_CLIENT_SECRET,
      code,
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.status}`)
  }

  return response.json() as Promise<IGitHubTokenResponse>
}

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación del usuario
    const session = await requireAuth()
    const userId = session.user.id

    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const installationId = searchParams.get('installation_id')

    if (!code && !installationId) {
      return NextResponse.json({ error: 'Missing code or installation_id' }, { status: 400 })
    }

    // Flujo de instalación de GitHub App
    if (installationId) {
      const numericId = Number(installationId)
      const existing = await getInstallationByGithubId(numericId)

      if (existing) {
        await updateInstallation(existing.id, { userId })
      } else {
        await createInstallation({
          userId,
          installationId: numericId,
          accountId: numericId,
          accountLogin: '',
          accountType: 'User',
          repositorySelection: 'all',
        })
      }

      return NextResponse.redirect(new URL('/dashboard/install?installed=true', req.url))
    }

    // Flujo de OAuth con code
    const tokenData = await exchangeCodeForToken(code!)

    // Obtener info del usuario de GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const ghUser = (await userResponse.json()) as {
      id: number
      login: string
      type: 'User' | 'Organization'
    }

    await createInstallation({
      userId,
      installationId: ghUser.id,
      accountId: ghUser.id,
      accountLogin: ghUser.login,
      accountType: ghUser.type,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : undefined,
      repositorySelection: 'all',
    })

    return NextResponse.redirect(new URL('/dashboard/install?installed=true', req.url))
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
    console.error('GitHub OAuth callback error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=github_auth_failed', req.url))
  }
}
