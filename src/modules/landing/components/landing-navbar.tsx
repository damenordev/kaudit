import Link from 'next/link'

import { Sparkles } from 'lucide-react'

import { Button } from '@/core/ui/primitives/button'
import { LocaleSwitcher } from '@/modules/settings/components/locale-switcher'
import { LandingThemeToggle } from '@/core/theme/palette/components/landing-theme-toggle'
import { GitHubIcon } from './icons'
import { cn } from '@/core/utils/cn.utils'

export interface ILandingNavbarProps {
  session: { user?: { name?: string | null } } | null
  labels: {
    base: string
    template: string
    signIn: string
    dashboard: string
  }
  className?: string
}

export function LandingNavbar({ session, labels, className }: ILandingNavbarProps) {
  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50', className)}>
      <nav className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              {labels.base}
              <span className="text-primary">{labels.template}</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Link href="https://github.com/dmenomark/demo" target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHubIcon className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
                <span className="sr-only sm:hidden">GitHub</span>
              </Link>
            </Button>

            <Button asChild size="sm" className="gap-2">
              <Link href={session ? '/dashboard' : '/signin'}>{session ? labels.dashboard : labels.signIn}</Link>
            </Button>

            <LocaleSwitcher />
            <LandingThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
