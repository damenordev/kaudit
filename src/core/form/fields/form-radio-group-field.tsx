'use client'

import React from 'react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { RadioGroup, RadioGroupItem } from '@/core/ui/primitives/radio-group'
import { Label } from '@/core/ui/primitives/label'

/**
 * Props para el campo de radio group.
 */
export interface IFormRadioGroupFieldProps {
  label: string
  options: Array<{ label: string; value: string }>
  description?: string
  required?: boolean
}

/**
 * Componente de campo radio group para formularios.
 */
export const FormRadioGroupField: React.FC<IFormRadioGroupFieldProps> = ({ label, options, description, required }) => {
  const field = useFieldContext<string>()

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <RadioGroup
        value={field.state.value}
        onValueChange={value => {
          field.handleChange(value)
          field.handleBlur()
        }}
      >
        {options.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
            <Label htmlFor={`${field.name}-${option.value}`} className="font-normal cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FormFieldWrapper>
  )
}
