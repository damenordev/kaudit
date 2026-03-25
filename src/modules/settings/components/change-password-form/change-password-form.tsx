'use client'

import { useTranslations } from 'next-intl'

import { FormSubscribeButton } from '@/core/form'
import { useChangePasswordForm } from './use-change-password-form'

export function ChangePasswordForm() {
  const t = useTranslations('settings.profile.security.changePassword')
  const { form } = useChangePasswordForm()

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4 max-w-md"
    >
      <form.AppField name="currentPassword">
        {field => <field.TextField label={t('currentPassword')} type="password" required />}
      </form.AppField>

      <form.AppField name="newPassword">
        {field => <field.TextField label={t('newPassword')} type="password" required />}
      </form.AppField>

      <form.AppField name="confirmPassword">
        {field => <field.TextField label={t('confirmPassword')} type="password" required />}
      </form.AppField>

      <form.AppForm>
        <FormSubscribeButton label={t('submit')} className="w-full sm:w-auto" />
      </form.AppForm>
    </form>
  )
}
