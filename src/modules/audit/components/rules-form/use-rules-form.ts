'use client'

import { sileo } from 'sileo'
import { useTranslations } from 'next-intl'

import { useForm } from '@/core/ui/form'
import { saveCustomRulesAction } from '../../actions/rules.actions'
import { rulesFormSchema, type TRulesForm } from './rules-form.schema'

interface IUseRulesFormProps {
  initialRules: string
}

export function useRulesForm({ initialRules }: IUseRulesFormProps) {
  const t = useTranslations('settings.rules.form')

  const form = useForm({
    defaultValues: { customRules: initialRules } as TRulesForm,
    validators: { onBlur: rulesFormSchema },
    onSubmit: async ({ value }) => {
      const response = await saveCustomRulesAction(value.customRules ?? '')

      if (response.success) {
        sileo.success({ title: t('success') })
      } else {
        sileo.error({ title: response.error || t('error') })
      }

      return response
    },
  })

  return { form, t }
}
