'use client'

import { useTranslations } from 'next-intl'

import { FormSubscribeButton, useForm } from '@/core/form'
import { upsertProfile } from '../../services/profile.actions'
import { profileFormSchema, type TProfileFormData } from './profile-form.schema'

export interface IProfileFormProps {
  defaultValues: TProfileFormData
}

export function ProfileForm({ defaultValues }: IProfileFormProps) {
  const t = useTranslations('settings.profile.personal')

  const form = useForm({
    defaultValues,
    validators: { onBlur: profileFormSchema },
    onSubmit: async ({ value }) => {
      await upsertProfile(value)
    },
  })

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4 max-w-md"
    >
      <form.AppField name="name">{field => <field.TextField label={t('fields.name')} required />}</form.AppField>

      <form.AppField name="bio">
        {field => <field.TextareaField label={t('fields.bio')} description={t('fields.bioDescription')} rows={3} />}
      </form.AppField>

      <form.AppField name="phone">
        {field => <field.TextField label={t('fields.phone')} type="tel" placeholder="+34 600 000 000" />}
      </form.AppField>

      <form.AppField name="location">
        {field => <field.TextField label={t('fields.location')} placeholder="Madrid, Espana" />}
      </form.AppField>

      <form.AppForm>
        <FormSubscribeButton label={t('save')} className="w-full sm:w-auto" />
      </form.AppForm>
    </form>
  )
}
