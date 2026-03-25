'use client'

import { useRouter } from 'next/navigation'
import { sileo } from 'sileo'
import { useTranslations } from 'next-intl'

import { useForm } from '@/core/ui/form'
import { authClient } from '@/modules/auth/lib'
import { signInSchema, type TSignInForm } from './sign-in.schema'

export function useSignInForm() {
  const router = useRouter()
  const t = useTranslations('auth')

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as TSignInForm,
    validators: { onSubmit: signInSchema },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      })

      if (error) {
        sileo.error({
          title:
            error.status === 401 ? t('errors.invalidCredentials') : error.message || t('errors.invalidCredentials'),
        })
        return
      }

      sileo.success({ title: t('signIn.title') + ' 🎉' }) // using a placeholder success message until proper translations exist
      router.push('/dashboard')
    },
  })

  return { form }
}
