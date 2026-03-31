import { headers } from 'next/headers'
import { cache } from 'react'

import { auth } from '../lib/auth.config'

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }))

export const requireAuth = async () => {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export { auth } from '../lib/auth.config'
export type { Session } from '../lib/auth.config'
export { authenticateRequest, requireAuthOrApiKey, requireAuthWithOwnership } from '../lib/cli-auth.middleware'
export type { IAuthenticatedUser } from '../lib/cli-auth.middleware'
