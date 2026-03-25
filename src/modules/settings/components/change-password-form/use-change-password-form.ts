'use client'

import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'

import { useForm } from '@/core/form'
import { changePassword } from '../../services/profile.actions'
import { changePasswordSchema, type TChangePasswordFormData } from './change-password.schema'

export function useChangePasswordForm() {
  const t = useTranslations('settings.profile.security.changePassword')

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    } as TChangePasswordFormData,
    validators: { onBlur: changePasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        })
        sileo.success({ title: t('success') })
        form.reset()
      } catch {
        sileo.error({ title: t('error') })
      }
    },
  })

  return { form }
}
