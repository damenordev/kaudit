import Link from 'next/link'

import { Sparkles } from 'lucide-react'

import { GitHubIcon } from './icons'
import { cn } from '@/core/utils/cn.utils'

export interface ILandingFooterProps {
  labels: {
    brand: string
    copyright: string
    githubLabel: string
  }
  className?: string
}

export function LandingFooter({ labels, className }: ILandingFooterProps) {
  return (
    <footer className={cn('border-t border-border/50 py-6', className)}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="KAudit Logo" className="h-5 w-5 object-contain" />
          <span className="text-sm font-medium">{labels.brand}</span>
        </div>

        <p className="text-sm text-muted-foreground">{labels.copyright}</p>

        <Link
          href="https://github.com/dmenomark/demo"
          target="_blank"
          rel="noreferrer"
          aria-label={labels.githubLabel}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <GitHubIcon className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  )
}
