'use client'

import React from 'react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { Textarea } from '@/core/ui/primitives/textarea'

/**
 * Props para el campo de textarea.
 */
export interface IFormTextareaFieldProps {
  label: string
  rows?: number
  placeholder?: string
  description?: string
  required?: boolean
}

/**
 * Componente de campo textarea para formularios.
 */
export const FormTextareaField: React.FC<IFormTextareaFieldProps> = ({
  label,
  rows = 3,
  placeholder,
  description,
  required,
}) => {
  const field = useFieldContext<string>()

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <Textarea
        id={field.name}
        value={field.state.value}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        rows={rows}
        onChange={e => field.handleChange(e.target.value)}
        aria-invalid={!field.state.meta.isValid && field.state.meta.isTouched}
      />
    </FormFieldWrapper>
  )
}
