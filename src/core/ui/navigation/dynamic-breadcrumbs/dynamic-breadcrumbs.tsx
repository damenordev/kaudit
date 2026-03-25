'use client'

import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import { useTranslations } from 'next-intl'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/core/ui/navigation/breadcrumb'

export function DynamicBreadcrumbs() {
  const tNav = useTranslations('navigation')
  const tDashBreadcrumbs = useTranslations('dashboard.breadcrumbs')
  const tDashNav = useTranslations('dashboard.nav')

  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const startIndex = segments[0]?.length === 2 ? 1 : 0
  const pathSegments = segments.slice(startIndex)

  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-1">
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`
          const isLast = index === pathSegments.length - 1
          let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

          if (tDashBreadcrumbs.has(segment)) {
            label = tDashBreadcrumbs(segment)
          } else if (tDashNav.has(segment)) {
            label = tDashNav(segment)
          } else if (tNav.has(segment)) {
            label = tNav(segment)
          }

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
