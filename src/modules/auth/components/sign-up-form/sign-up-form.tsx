'use client'

import { useTranslations } from 'next-intl'
import { FormSubscribeButton } from '@/core/ui/form'
import { useSignUpForm } from './use-sign-up-form'

export function SignUpForm() {
  const t = useTranslations('auth')
  const { form } = useSignUpForm()

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.AppField name="name">
        {field => <field.TextField label={t('fields.name')} placeholder={t('fields.namePlaceholder')} required />}
      </form.AppField>

      <form.AppField name="email">
        {field => (
          <field.TextField label={t('fields.email')} type="email" placeholder={t('fields.emailPlaceholder')} required />
        )}
      </form.AppField>

      <form.AppField name="password">
        {field => <field.TextField label={t('fields.password')} type="password" required />}
      </form.AppField>

      <form.AppField name="confirmPassword">
        {field => <field.TextField label={t('fields.confirmPassword')} type="password" required />}
      </form.AppField>

      <form.AppForm>
        <FormSubscribeButton label={t('signUp.submit')} className="w-full font-medium" />
      </form.AppForm>
    </form>
  )
}
