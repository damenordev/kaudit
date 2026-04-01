'use client'

import { useRulesForm } from './use-rules-form'

interface IRulesFormProps {
  initialRules: string
}

export function RulesForm({ initialRules }: IRulesFormProps) {
  const { form, t } = useRulesForm({ initialRules })

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        e.stopPropagation()
        await form.handleSubmit()
      }}
      className="space-y-6"
    >
      <form.AppField name="customRules">
        {field => (
          <field.MonacoField
            label={t('label')}
            placeholder={t('placeholder')}
            height="500px"
            language="markdown"
            description={t('description')}
          />
        )}
      </form.AppField>
      <div className="flex justify-end pt-4">
        <form.AppForm>
          <form.SubscribeButton
            className="w-full sm:w-auto"
            label={t('submit')}
          />
        </form.AppForm>
      </div>
    </form>
  )
}
