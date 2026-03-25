'use client'

import { useForm } from '@/core/form'
import { createExamplesAction } from '../../actions/examples.actions'
import { examplesSchema, type TExamplesForm } from './examples.schema'

export function useExamplesForm() {
  const form = useForm({
    defaultValues: { name: '' } as TExamplesForm,
    validators: { onBlur: examplesSchema },
    onSubmit: async ({ value }) => {
      return createExamplesAction(value)
    },
  })

  return { form }
}
