'use client'

import React from 'react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/ui/forms/select'

/**
 * Props para el campo de select.
 */
export interface IFormSelectFieldProps {
  label: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
  description?: string
  required?: boolean
}

/**
 * Componente de campo select para formularios.
 */
export const FormSelectField: React.FC<IFormSelectFieldProps> = ({
  label,
  values,
  placeholder,
  description,
  required,
}) => {
  const field = useFieldContext<string>()

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={value => {
          field.handleChange(value)
          field.handleBlur()
        }}
      >
        <SelectTrigger className="w-full" id={field.name}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {values.map(value => (
              <SelectItem key={value.value} value={value.value}>
                {value.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  )
}
