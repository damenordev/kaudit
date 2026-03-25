'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'

import { useForm } from '@/core/form'
import { upsertProfile } from '../../services/profile.actions'
import { profileFormSchema, type TProfileFormData } from './profile-form.schema'

export function useProfileForm(defaultValues: TProfileFormData) {
  const t = useTranslations('settings.profile.personal')
  const router = useRouter()

  const form = useForm({
    defaultValues,
    validators: { onBlur: profileFormSchema },
    onSubmit: async ({ value }) => {
      try {
        await upsertProfile(value)
        sileo.success({ title: t('success') })
        router.refresh()
      } catch {
        sileo.error({ title: t('error') })
      }
    },
  })

  return { form }
}
