'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import Link from 'next/link'
import { Check, ChevronsUpDown, Globe, LogOut, Settings } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/core/ui/primitives/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/core/ui/overlays/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/core/ui/navigation/sidebar'
import { Skeleton } from '@/core/ui/primitives/skeleton'
import { signOut } from '@/modules/auth/services/auth.actions'
import { setLocale } from '@/core/i18n/i18n.actions'
import { routing } from '@/core/i18n/i18n.routing'
import { routesConfig } from '@/core/config/routes.config'

interface INavUserProps {
  user?: {
    name: string
    email: string
    image?: string
  }
}

export function NavUser({ user }: INavUserProps) {
  const { isMobile } = useSidebar()
  const locale = useLocale()
  const t = useTranslations('dashboard')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const localeLabels: Record<string, string> = {
    en: 'English',
    es: 'Español',
  }

  function handleLocaleChange(nextLocale: string) {
    if (nextLocale === locale) return
    startTransition(async () => {
      await setLocale(nextLocale as 'en' | 'es')
      router.refresh()
    })
  }

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Skeleton className="mb-1 h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-sm font-semibold">{user.name}</span>
                <span className="-mt-1 truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Globe className="size-4" />
                  {t('userMenu.language')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {routing.locales.map(l => (
                    <DropdownMenuItem
                      key={l}
                      onClick={() => handleLocaleChange(l)}
                      disabled={isPending}
                      className="justify-between"
                    >
                      <span className="flex items-center gap-2">{localeLabels[l] ?? l.toUpperCase()}</span>
                      {locale === l && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={routesConfig.dashboard.settings}>
                  <Settings className="size-4" />
                  {t('nav.settings')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={async () => await signOut()}>
              <LogOut className="size-4" />
              {t('userMenu.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
