'use client'

import React from 'react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { Input } from '@/core/ui/primitives/input'

/**
 * Props para el campo numérico.
 */
export interface IFormNumberFieldProps {
  label: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  description?: string
  required?: boolean
}

/**
 * Componente de campo numérico para formularios.
 */
export const FormNumberField: React.FC<IFormNumberFieldProps> = ({
  label,
  placeholder,
  min,
  max,
  step,
  description,
  required,
}) => {
  const field = useFieldContext<number>()

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <Input
        id={field.name}
        type="number"
        value={field.state.value ?? ''}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        onBlur={field.handleBlur}
        onChange={e => {
          const value = e.target.value ? Number(e.target.value) : 0
          field.handleChange(value)
        }}
        aria-invalid={!field.state.meta.isValid && field.state.meta.isTouched}
      />
    </FormFieldWrapper>
  )
}
