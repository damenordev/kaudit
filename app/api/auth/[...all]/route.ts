import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@/modules/auth/services'

export const { GET, POST } = toNextJsHandler(auth.handler)
