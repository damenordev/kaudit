// Exportaciones seguras para uso en cliente
export { authClient } from './auth-client'
export type { Session } from './auth-client'

// Módulos de solo servidor — importar directamente desde su archivo:
// import { validateApiKey } from '@/modules/auth/lib/api-key-auth'
// import { authenticateRequest, requireAuthOrApiKey, requireAuthWithOwnership } from '@/modules/auth/lib/cli-auth.middleware'
// import type { IAuthenticatedUser } from '@/modules/auth/lib/cli-auth.middleware'
