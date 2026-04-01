import { NextResponse } from 'next/server'
import { auth } from '@/modules/auth/lib/auth.config'

/**
 * GET /api/auth/validate
 * Endpoint para que el CLI verifique si una API key es válida.
 * El CLI envía la key en el header Authorization: Bearer <key>
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Falta el header de Authorization' }, { status: 400 })
    }

    const key = authHeader.slice(7).trim()
    if (!key) {
      return NextResponse.json({ error: 'API key vacía' }, { status: 400 })
    }

    // Usar el plugin de better-auth para verificar la key
    const result = await auth.api.verifyApiKey({
      body: { key }
    })

    if (!result.valid || !result.key) {
      return NextResponse.json({ valid: false, error: 'API key inválida o expirada' }, { status: 401 })
    }

    // Retornamos éxito si es válida
    return NextResponse.json({ 
      valid: true, 
      user: {
        id: result.key.userId,
        // No enviamos más info por seguridad si no es necesario
      }
    })
  } catch (error) {
    console.error('[auth-validate] Error validando API key:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
