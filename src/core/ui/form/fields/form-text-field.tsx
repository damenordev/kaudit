'use client'

import React from 'react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { Input } from '@/core/ui/input'

/**
 * Props para el campo de texto.
 */
export interface IFormTextFieldProps {
  label: string
  placeholder?: string
  type?: string
  description?: string
  required?: boolean
}

/**
 * Componente de campo de texto para formularios.
 */
export const FormTextField: React.FC<IFormTextFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  description,
  required,
}) => {
  const field = useFieldContext<string>()
  const hasErrors = field.state.meta.isTouched && field.state.meta.errors.length > 0
  const describedBy = [description ? `${field.name}-description` : null, hasErrors ? `${field.name}-error` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <Input
        id={field.name}
        type={type}
        value={field.state.value}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
        aria-describedby={describedBy || undefined}
        aria-invalid={hasErrors}
      />
    </FormFieldWrapper>
  )
}
