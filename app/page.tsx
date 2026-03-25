import { getTranslations } from 'next-intl/server'

import { getSession } from '@/modules/auth/services'
import { LandingView } from '@/modules/landing/components'

export default async function Home() {
  const session = await getSession()
  const t = await getTranslations('landing')

  const labels = {
    hero: {
      badge: t('hero.live'),
      title: t('hero.title'),
      titleHighlight: t('hero.titleHighlight'),
      subtitle: t('hero.subtitle'),
    },
    features: {
      title: t('features.title'),
      subtitle: t('features.subtitle'),
    },
    cta: {
      title: t('cta.title'),
      subtitle: t('cta.subtitle'),
    },
  }

  return <LandingView session={session} labels={labels} />
}
