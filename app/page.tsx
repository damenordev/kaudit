import { getTranslations } from 'next-intl/server'

import { getSession } from '@/modules/auth/services'
import { Zap, Shield, Globe, Palette, Code2, Layers } from 'lucide-react'
import {
  AmbientBackground,
  LandingNavbar,
  LandingHero,
  LandingFeatures,
  LandingTechStack,
  LandingCta,
  LandingFooter,
} from '@/modules/landing'

export default async function Home() {
  const session = await getSession()
  const t = await getTranslations('landing')

  const navLabels = {
    base: t('hero.base'),
    template: t('hero.template'),
    signIn: t('cards.settings.signin'),
    dashboard: t('cards.dashboard.authorized'),
  }

  const heroLabels = {
    badge: t('hero.live'),
    title: t('hero.title'),
    titleHighlight: t('hero.titleHighlight'),
    subtitle: t('hero.subtitle'),
    primaryCta: session ? t('cards.dashboard.authorized') : t('buttons.getStarted'),
    secondaryCta: t('buttons.github'),
    loggedIn: t('auth.loggedIn'),
  }

  const features = [
    { icon: Zap, title: t('features.performance.title'), description: t('features.performance.desc') },
    { icon: Shield, title: t('features.auth.title'), description: t('features.auth.desc') },
    { icon: Globe, title: t('features.i18n.title'), description: t('features.i18n.desc') },
    { icon: Palette, title: t('features.themes.title'), description: t('features.themes.desc') },
    { icon: Code2, title: t('features.typescript.title'), description: t('features.typescript.desc') },
    { icon: Layers, title: t('features.components.title'), description: t('features.components.desc') },
  ]

  const ctaLabels = {
    title: t('cta.title'),
    subtitle: t('cta.subtitle'),
    primaryCta: session ? t('cards.dashboard.authorized') : t('buttons.getStarted'),
    secondaryCta: t('cta.docs'),
  }

  const footerLabels = {
    brand: `${t('hero.base')}${t('hero.template')}`,
    copyright: t('footer.copyright', { year: new Date().getFullYear() }),
    githubLabel: t('buttons.github'),
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AmbientBackground />
      <LandingNavbar session={session} labels={navLabels} />
      <main>
        <LandingHero session={session} labels={heroLabels} />
        <LandingFeatures title={t('features.title')} subtitle={t('features.subtitle')} features={features} />
        <LandingTechStack title={t('techStack.title')} subtitle={t('techStack.subtitle')} />
        <LandingCta session={session} labels={ctaLabels} />
      </main>
      <LandingFooter labels={footerLabels} />
    </div>
  )
}
