import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Command } from 'lucide-react'

import { SignUpForm } from '@/modules/auth/components'

export default async function SignUpPage() {
  const t = await getTranslations('auth')

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background">
      <div className="p-4 lg:p-8 flex items-center justify-center h-full order-last lg:order-first">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
          <div className="flex flex-col space-y-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('signUp.title')}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed px-2">{t('signUp.description')}</p>
          </div>

          <SignUpForm />

          <p className="text-center text-sm text-muted-foreground">
            {t('signUp.hasAccount')}{' '}
            <Link
              href="/signin"
              className="underline underline-offset-4 hover:text-primary transition-colors font-semibold"
            >
              {t('signUp.signInLink')}
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden h-full flex-col bg-sidebar p-10 text-sidebar-foreground lg:flex border-l border-sidebar-border">
        <div className="absolute inset-0 bg-sidebar" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--primary),transparent)] opacity-[0.03]" />

        <div className="relative z-20 flex items-center text-xl font-bold tracking-tight">
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="h-5 w-5" />
          </div>
          {t('brandName')}
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-2xl font-medium leading-normal tracking-tight">&ldquo;{t('signUp.quote')}&rdquo;</p>
            <footer className="flex items-center gap-3">
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-sm font-medium text-muted-foreground/80 lowercase tracking-wide">
                {t('signUp.quoteAuthor')}
              </span>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
