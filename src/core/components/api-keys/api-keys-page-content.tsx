'use client'

import { useTranslations } from 'next-intl'

import { ApiKeysTab } from '@/core/components/settings/tabs'
import type { IApiKeysTranslations } from '@/core/components/settings/tabs/api-keys-tab.types'

/** Contenido de la página de API Keys — client component que inyecta traducciones */
export function ApiKeysPageContent() {
  const t = useTranslations('settings.apiKeys')

  const translations: IApiKeysTranslations = {
    title: t('title'),
    description: t('description'),
    createButton: t('createButton'),
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
    },
    create: {
      title: t('create.title'),
      nameLabel: t('create.nameLabel'),
      namePlaceholder: t('create.namePlaceholder'),
      cancel: t('create.cancel'),
      submit: t('create.submit'),
      submitting: t('create.submitting'),
      error: t('create.error'),
    },
    reveal: {
      title: t('reveal.title'),
      warning: t('reveal.warning'),
      copy: t('reveal.copy'),
      copied: t('reveal.copied'),
      close: t('reveal.close'),
    },
  }

  return <ApiKeysTab translations={translations} />
}
