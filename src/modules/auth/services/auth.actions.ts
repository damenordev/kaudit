'use server'

import { auth } from '@/modules/auth/lib/auth.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Acción del servidor para cerrar sesión del usuario.
 */
export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  })
  redirect('/')
}
