'use client'

import { useExamplesForm } from './use-examples-form'

export function ExamplesForm() {
  const { form } = useExamplesForm()

  return (
    <form.AppForm>
      <form.AppField name="name">{field => <field.TextField label="Name" />}</form.AppField>
      <form.SubscribeButton label="Submit" />
    </form.AppForm>
  )
}
