import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { getSession } from '@/modules/auth/services'
import { AppSidebar, SidebarProvider, SidebarInset, SidebarTrigger } from '@/core/dashboard'
import { DynamicBreadcrumbs } from '@/core/ui/navigation'
import { Separator } from '@/core/ui/primitives/separator'
import { getSidebarState } from '@/core/ui/navigation/sidebar.server'
import { routesConfig } from '@/core/config/routes.config'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const t = await getTranslations('dashboard')

  if (!session) redirect(routesConfig.auth.signIn)

  const user = {
    name: session.user?.name || t('user.fallbackName'),
    email: session.user?.email || '',
    image: session.user?.image ?? undefined,
  }

  const { defaultOpen, defaultVariant } = await getSidebarState()

  return (
    <SidebarProvider defaultOpen={defaultOpen} defaultVariant={defaultVariant}>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background px-4 h-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumbs />
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
