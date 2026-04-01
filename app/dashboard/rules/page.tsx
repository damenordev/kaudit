import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { getSession } from '@/modules/auth/services/auth.service'
import { getCustomRulesAction } from '@/modules/audit/actions/rules.actions'
import { RulesForm } from '@/modules/audit/components/rules-form'

export const metadata: Metadata = {
  title: 'IA Rules',
  description: 'Custom instructions for the AI engine',
}

export default async function RulesPage() {
  const session = await getSession()
  const t = await getTranslations('settings.rules')

  if (!session?.user?.id) return null

  // Obtenemos las reglas actuales guardadas en BBDD
  const initialRules = await getCustomRulesAction()

  return (
    <div className="flex flex-col gap-6 p-3 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-xs text-muted-foreground/60">{t('description')}</p>
        </div>
      </header>

      <RulesForm initialRules={initialRules} />
    </div>
  )
}
