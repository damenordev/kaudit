import type { ReactNode } from 'react'
import { KanbanSquare, LayoutDashboard, MessageSquare, Settings, Users } from 'lucide-react'

import { routesConfig } from '@/core/config/routes.config'

export interface INavItem {
  title: string
  url: string
  icon?: ReactNode
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
          title: t('nav.editor'),
          url: routesConfig.dashboard.editor,
          icon: <LayoutDashboard />,
        },
        {
          title: t('nav.kanban'),
          url: routesConfig.dashboard.kanban,
          icon: <KanbanSquare />,
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
