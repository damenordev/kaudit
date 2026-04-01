/**
 * Configuración centralizada de todas las rutas de la aplicación.
 * Proporciona un punto único de referencia para todas las URLs, facilitando
 * el mantenimiento y la refactorización de rutas.
 *
 * @example
 * ```tsx
 * import { routesConfig } from '@/core/config/routes.config'
 * <Link href={routesConfig.dashboard.root}>Dashboard</Link>
 * <Link href={routesConfig.dashboard.settings}>Settings</Link>
 * ```
 */
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
