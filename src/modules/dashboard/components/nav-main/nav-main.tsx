'use client'

import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/core/ui/utilities/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/core/ui/navigation/sidebar'

interface INavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export interface INavMainProps {
  items: INavItem[]
  label?: string
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '') || '/'
}

function isRouteActive(pathname: string, url: string, exactOnly: boolean = false): boolean {
  const normalizedPathname = normalizeUrl(pathname)
  const normalizedUrl = normalizeUrl(url)

  if (normalizedPathname === normalizedUrl) {
    return true
  }

  if (exactOnly) {
    return false
  }

  if (normalizedUrl !== '/' && normalizedPathname.startsWith(normalizedUrl + '/')) {
    return true
  }

  return false
}

export function NavMain({ items, label }: INavMainProps) {
  const pathname = usePathname()

  const allItemUrls = items.flatMap(item => [item.url, ...(item.items?.map(sub => sub.url) ?? [])])

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map(item => {
          const isChildActive = item.items?.some(sub => isRouteActive(pathname, sub.url, true)) ?? false

          const hasMoreSpecificMatch = allItemUrls.some(url => {
            if (url === item.url) return false
            const normalizedPathname = normalizeUrl(pathname)
            const normalizedUrl = normalizeUrl(url)
            return normalizedPathname.startsWith(normalizedUrl + '/') || normalizedPathname === normalizedUrl
          })

          const isMainActive = item.items?.length
            ? false
            : !hasMoreSpecificMatch && isRouteActive(pathname, item.url, true)

          const isOpen = item.isActive ?? isChildActive ?? isMainActive

          const isParentActive = item.items?.length ? isChildActive : isMainActive

          return (
            <Collapsible key={item.title} asChild defaultOpen={isOpen} className="group/collapsible">
              <SidebarMenuItem>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={isParentActive}>
                        {item.icon}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="mr-0 pr-0 pt-2">
                        {item.items.map(subItem => {
                          const isSubItemActive = isRouteActive(pathname, subItem.url, true)
                          return (
                            <SidebarMenuSubItem className="mr-0" key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={isSubItemActive}>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isMainActive}>
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
