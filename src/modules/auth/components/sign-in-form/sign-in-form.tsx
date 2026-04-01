'use client'

import { useTranslations } from 'next-intl'
import { FormSubscribeButton } from '@/core/ui/form'
import { useSignInForm } from './use-sign-in-form'

import { GitHubSignInButton } from '../github-sign-in-button.component'

export function SignInForm() {
  const t = useTranslations('auth')
  const { form } = useSignInForm()

  return (
    <div className="space-y-6">
      <GitHubSignInButton label={t('signIn.github')} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-mono font-bold tracking-widest bg-white dark:bg-zinc-950">
            {t('common.or')}
          </span>
        </div>
      </div>

      <form
        onSubmit={async e => {
          e.preventDefault()
          e.stopPropagation()
          await form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.AppField name="email">
          {field => (
            <field.TextField
              label={t('fields.email')}
              type="email"
              placeholder={t('fields.emailPlaceholder')}
              required
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {field => <field.TextField label={t('fields.password')} type="password" required />}
        </form.AppField>

        <form.AppForm>
          <FormSubscribeButton
            label={t('signIn.submit')}
            className="w-full h-12 rounded-xl font-mono uppercase tracking-widest bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all duration-300"
          />
        </form.AppForm>
      </form>
    </div>
  )
}
