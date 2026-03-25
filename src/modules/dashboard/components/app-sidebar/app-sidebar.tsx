import { GalleryVerticalEnd } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { NavMain } from '../nav-main'
import { NavUser } from '../nav-user'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/core/ui/navigation/sidebar'
import { getDashboardConfig } from '../../config/sidebar.config'
import { siteConfig } from '@/core/config/site.config'

export interface IAppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    image?: string
  }
}

export async function AppSidebar({ user, ...props }: IAppSidebarProps) {
  const t = await getTranslations('dashboard')
  const { navGroups } = getDashboardConfig(t)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-2">
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-md font-semibold">{siteConfig.name}</span>
              <span className="truncate text-xs">{siteConfig.shortDescription}</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label={t('nav.platform')}>
          {navGroups.map(group => (
            <NavMain key={group.label} items={group.items} label={group.label} />
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
