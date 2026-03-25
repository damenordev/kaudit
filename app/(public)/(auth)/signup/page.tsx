import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { SignUpForm } from '@/modules/auth/components'

export default async function SignUpPage() {
  const t = await getTranslations('auth')

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background text-foreground">
      {/* Visual / Branding Side */}
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex border-r border-border order-last lg:order-first">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="/images/home/hero.jpeg" alt="Background" className="w-full h-full object-cover opacity-60 grayscale-[0.2]" />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-black" />
          
          {/* Scanning Line Background Effects */}
          <div
            className="absolute inset-0 z-10 pointer-events-none opacity-20"
            style={{
              background:
                'linear-gradient(rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.075) 4px, transparent 4px, transparent 9px)',
              backgroundSize: '100% 9px',
              animation: 'pan-overlay 22s infinite linear',
            }}
          />
        </div>

        <Link href="/" className="relative z-20 flex items-center gap-3 text-2xl font-black font-mono tracking-tighter uppercase group w-fit">
          <img 
            src="/logo.png" 
            alt="KAudit Logo" 
            className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(var(--primary),0.8)] transition-transform duration-500 group-hover:scale-110" 
          />
          <span className="group-hover:text-primary transition-colors">KAudit</span>
        </Link>

        <div className="relative z-20 mt-auto max-w-lg mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <blockquote className="space-y-4">
            <p className="text-2xl font-medium leading-[1.2] tracking-tight font-mono text-white/90">
              "{t('signUp.quote')}"
            </p>
            <footer className="flex items-center gap-3 opacity-60">
              <div className="h-px w-8 bg-current" />
              <span className="text-sm font-mono uppercase tracking-widest">
                {t('signUp.quoteAuthor')}
              </span>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Form Side */}
      <div className="p-8 lg:p-12 h-full flex items-center justify-center relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.03),transparent_70%)]" />
        
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[380px] relative z-10 animate-in fade-in zoom-in-[0.98] duration-700">
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-black uppercase tracking-tighter font-mono">{t('signUp.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('signUp.description')}</p>
          </div>

          <SignUpForm />

          <p className="text-center lg:text-left text-sm text-muted-foreground mt-6">
            {t('signUp.hasAccount')}{' '}
            <Link
              href="/signin"
              className="text-foreground hover:text-primary transition-colors font-mono font-bold uppercase tracking-widest text-xs underline underline-offset-4 decoration-border hover:decoration-primary"
            >
              {t('signUp.signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
