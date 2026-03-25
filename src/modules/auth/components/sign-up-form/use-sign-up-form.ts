'use client'

import { useRouter } from 'next/navigation'
import { sileo } from 'sileo'
import { useTranslations } from 'next-intl'

import { useForm } from '@/core/ui/form'
import { authClient } from '@/modules/auth/lib'
import { signUpSchema, type TSignUpForm } from './sign-up.schema'

export function useSignUpForm() {
  const router = useRouter()
  const t = useTranslations('auth')

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as TSignUpForm,
    validators: { onBlur: signUpSchema },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      })

      if (error) {
        sileo.error({ title: error.message || 'Error al registrarse' })
        return
      }

      sileo.success({ title: 'Cuenta creada. Por favor verifica tu email.' })
      router.push('/signin')
    },
  })

  return { form }
}
