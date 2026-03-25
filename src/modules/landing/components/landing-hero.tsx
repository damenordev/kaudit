import Link from 'next/link'

import { ArrowRight, Sparkles, Terminal } from 'lucide-react'

import { Button } from '@/core/ui/primitives/button'
import { cn } from '@/core/utils/cn.utils'

export interface ILandingHeroProps {
  session: { user?: { name?: string | null } } | null
  labels: {
    badge: string
    title: string
    titleHighlight: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
    loggedIn?: string
  }
  className?: string
}

export function LandingHero({ session, labels, className }: ILandingHeroProps) {
  return (
    <section className={cn('relative min-h-[90vh] flex items-center px-6 pt-24 pb-16', className)}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left: Content */}
          <div>
            <Link
              href="https://github.com/dmenomark/demo/releases"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400 transition-all hover:border-white/20 hover:text-white"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              {labels.badge}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {labels.title}
              <span className="text-primary block mt-1">{labels.titleHighlight}</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-md leading-relaxed">{labels.subtitle}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
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

            {session?.user?.name && (
              <p className="mt-6 text-sm text-zinc-500">{labels.loggedIn?.replace('{name}', session.user.name)}</p>
            )}
          </div>

          {/* Right: Terminal Preview */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Glow behind terminal */}
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-3xl opacity-50" />

              {/* Terminal window */}
              <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-2 text-xs text-zinc-500">
                    <Terminal className="h-3.5 w-3.5" />
                    terminal
                  </div>
                </div>

                {/* Terminal content */}
                <div className="p-4 font-mono text-sm">
                  <div className="text-zinc-500">
                    $ <span className="text-zinc-300">npx create-next-app my-app</span>
                  </div>
                  <div className="mt-2 text-zinc-500">
                    $ <span className="text-zinc-300">cd my-app && pnpm dev</span>
                  </div>
                  <div className="mt-3 text-emerald-400">✓ Ready in 2.3s</div>
                  <div className="mt-1 text-zinc-400">
                    {' '}
                    → Local: <span className="text-primary">http://localhost:3000</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-zinc-500">$</span>
                    <span className="w-2 h-4 bg-primary animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
