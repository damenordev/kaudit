/**
 * Endpoint para gestionar API keys desde el dashboard.
 * GET    — Lista las API keys del usuario (enmascaradas)
 * POST   — Genera una nueva API key
 * DELETE — Revoca una API key existente
 *
 * Todas las operaciones requieren sesión autenticada (web dashboard).
 */
import { headers as getNextHeaders } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth } from '@/modules/auth/lib/auth.config'
import { requireAuth } from '@/modules/auth/services/auth.service'

/** Esquema de la API key enmascarada para respuesta segura */
interface IMaskedApiKey {
  id: string
  name: string | null
  prefix: string | null
  start: string | null
  createdAt: Date | null
  expiresAt: Date | null
  enabled: boolean | null
}

/** Construye los headers necesarios para las llamadas internas de better-auth */
async function buildAuthHeaders(): Promise<Headers> {
  const h = new Headers()
  const cookieHeader = await getNextHeaders()
  const cookieStr = cookieHeader.get('cookie') ?? ''
  h.set('cookie', cookieStr)
  return h
}

/** Enmascara una API key para respuesta segura */
function maskApiKey(key: Record<string, unknown>): IMaskedApiKey {
  return {
    id: (key.id as string) ?? '',
    name: (key.name as string) ?? null,
    prefix: (key.prefix as string) ?? null,
    start: (key.start as string) ?? null,
    createdAt: (key.createdAt as Date) ?? null,
    expiresAt: (key.expiresAt as Date) ?? null,
    enabled: (key.enabled as boolean) ?? null,
  }
}

/**
 * GET /api/auth/api-key
 * Lista las API keys del usuario autenticado (valores enmascarados).
 */
export async function GET() {
  try {
    await requireAuth()
    const headers = await buildAuthHeaders()

    const result = await auth.api.listApiKeys({ headers })
    const rawKeys = Array.isArray(result) ? result : []
    const maskedKeys = rawKeys.map(k => maskApiKey(k as Record<string, unknown>))

    return NextResponse.json({ keys: maskedKeys })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('[api-key] Error listando API keys:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * POST /api/auth/api-key
 * Genera una nueva API key para el usuario autenticado.
 * Body: { name?: string, expiresIn?: number (ms) }
 */
export async function POST(req: Request) {
  try {
    await requireAuth()
    const body = (await req.json()) as { name?: string; expiresIn?: number }
    const headers = await buildAuthHeaders()

    const result = await auth.api.createApiKey({
      body: { name: body.name ?? 'CLI API Key', expiresIn: body.expiresIn },
      headers,
    })

    return NextResponse.json(
      {
        key: result,
        message: 'Guarda esta API key en un lugar seguro. No se volverá a mostrar.',
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('[api-key] Error creando API key:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * DELETE /api/auth/api-key
 * Revoca una API key existente.
 * Body: { keyId: string }
 */
export async function DELETE(req: Request) {
  try {
    await requireAuth()
    const body = (await req.json()) as { keyId: string }

    if (!body.keyId) {
      return NextResponse.json({ error: 'keyId es requerido' }, { status: 400 })
    }

    const headers = await buildAuthHeaders()
    await auth.api.deleteApiKey({ body: { keyId: body.keyId }, headers })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('[api-key] Error revocando API key:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
