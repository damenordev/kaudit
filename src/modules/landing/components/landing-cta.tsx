import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { Button } from '@/core/ui/primitives/button'
import { cn } from '@/core/utils/cn.utils'

export interface ILandingCtaProps {
  session: { user?: { name?: string | null } } | null
  labels: {
    title: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
  }
  className?: string
}

export function LandingCta({ session, labels, className }: ILandingCtaProps) {
  return (
    <section className={cn('py-24 px-6 border-t border-zinc-800/50', className)}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{labels.title}</h2>
        <p className="mt-4 text-zinc-400">{labels.subtitle}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 rounded-lg bg-white text-zinc-900 hover:bg-zinc-200">
            <Link href={session ? '/dashboard' : '/signin'}>
              {labels.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 rounded-lg border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <Link href="https://github.com/dmenomark/demo" target="_blank" rel="noreferrer">
              {labels.secondaryCta}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
