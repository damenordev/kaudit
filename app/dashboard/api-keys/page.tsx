import { getTranslations } from 'next-intl/server'

import { getSession } from '@/modules/auth/services/auth.service'
import { listApiKeysByUserId } from '@/modules/auth/queries/api-key.queries'
import { ApiKeysPageClient } from '@/modules/auth/components/api-keys'
import { getMetadata } from '@/core/config/metadata.config'

/** Metadatos dinámicos con traducciones para la página de API Keys */
export async function generateMetadata() {
  const t = await getTranslations('dashboard.apiKeys')
  return getMetadata({
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

/**
 * Server Component page para API Keys.
 * Obtiene las keys directamente desde la DB (Drizzle) y las pasa
 * al cliente component para la interactividad (crear, eliminar, copiar).
 */
export default async function ApiKeysPage() {
  const session = await getSession()
  const t = await getTranslations('settings.apiKeys')

  // Si no hay sesión, no mostramos nada (el layout ya redirige)
  const userId = session?.user?.id
  if (!userId) return null

  // Fetch directo desde la DB — sin API route
  const keys = await listApiKeysByUserId(userId)

  return (
    <section className="flex flex-col gap-4 p-3 h-full" aria-labelledby="api-keys-page-heading">
      <h1 id="api-keys-page-heading" className="sr-only">
        {t('title')}
      </h1>
      <ApiKeysPageClient
        initialKeys={keys}
        translations={{
          title: t('title'),
          description: t('description'),
          table: {
            name: t('table.name'),
            key: t('table.key'),
            created: t('table.created'),
            status: t('table.status'),
            actions: t('table.actions'),
            empty: t('table.empty'),
            enabled: t('table.enabled'),
            disabled: t('table.disabled'),
            unnamed: t('table.unnamed'),
            confirmDelete: t('table.confirmDelete'),
            delete: t('table.delete'),
            cancel: t('create.cancel'),
          },
          create: {
            trigger: t('createButton'),
            title: t('create.title'),
            description: t('description'),
            nameLabel: t('create.nameLabel'),
            namePlaceholder: t('create.namePlaceholder'),
            cancel: t('create.cancel'),
            submit: t('create.submit'),
            submitting: t('create.submitting'),
            error: t('create.error'),
          },
          reveal: {
            warning: t('reveal.warning'),
            copy: t('reveal.copy'),
            copied: t('reveal.copied'),
            close: t('reveal.close'),
          },
        }}
      />
    </section>
  )
}
