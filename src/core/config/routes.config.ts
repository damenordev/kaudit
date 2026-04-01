export const routesConfig = {
  home: '/',
  auth: {
    signIn: '/signin',
    signUp: '/signup',
  },
  /** Rutas del dashboard */
  dashboard: {
    root: '/dashboard',
    settings: '/dashboard/settings',
    rules: '/dashboard/rules',
    apiKeys: '/dashboard/api-keys',
    /** Instalación de la GitHub App */
    install: '/dashboard/install',
    audits: {
      list: '/dashboard/audits',
      detail: (id: string) => `/dashboard/audits/${id}`,
    },
  },
} as const

/** Tipo inferido de la configuración de rutas */
export type TRoutesConfig = typeof routesConfig
