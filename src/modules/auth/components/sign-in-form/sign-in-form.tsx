'use client'

import { useTranslations } from 'next-intl'
import { FormSubscribeButton } from '@/core/form'
import { useSignInForm } from './use-sign-in-form'

export function SignInForm() {
  const t = useTranslations('auth')
  const { form } = useSignInForm()

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.AppField name="email">
        {field => (
          <field.TextField label={t('fields.email')} type="email" placeholder={t('fields.emailPlaceholder')} required />
        )}
      </form.AppField>

      <form.AppField name="password">
        {field => <field.TextField label={t('fields.password')} type="password" required />}
      </form.AppField>

      <form.AppForm>
        <FormSubscribeButton label={t('signIn.submit')} className="w-full font-medium" />
      </form.AppForm>
    </form>
  )
}
