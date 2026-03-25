import { KanbanSquare, LayoutDashboard, MessageSquare, Users } from 'lucide-react'

import { routesConfig } from './routes.config'

export const SIDEBAR_STATE_COOKIE_NAME = 'sidebar:state'
export const SIDEBAR_VARIANT_COOKIE_NAME = 'sidebar:variant'
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export type TSidebarVariant = 'sidebar' | 'floating' | 'inset'

export interface INavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export interface INavGroup {
  label: string
  items: INavItem[]
}

export interface IDashboardConfig {
  navGroups: INavGroup[]
}

/**
 * Genera la configuración del sidebar del dashboard.
 *
 * @param {function} t - Función de traducción
 * @returns {IDashboardConfig} Configuración completa del sidebar
 */
export const getDashboardConfig = (t: (key: string) => string): IDashboardConfig => ({
  navGroups: [
    {
      label: t('nav.platform'),
      items: [
        {
          title: t('nav.dashboard'),
          url: routesConfig.dashboard.root,
          icon: <LayoutDashboard />,
          isActive: true,
        },
        {
          title: t('nav.users'),
          url: routesConfig.dashboard.users,
          icon: <Users />,
        },
        {
          title: t('nav.aiChat'),
          url: routesConfig.dashboard.aiChat,
          icon: <MessageSquare />,
        },
      ],
    },
  ],
})
