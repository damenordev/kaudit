'use client'

import React from 'react'
import { useStore } from '@tanstack/react-form'

import { useFieldContext } from '../form.context'
import { Checkbox } from '@/core/ui/primitives/checkbox'
import { Label } from '@/core/ui/primitives/label'
import { FormErrorMessages } from '../form-error-messages'

/**
 * Props para el campo de checkbox.
 */
export interface IFormCheckboxFieldProps {
  label: string
  description?: string
  required?: boolean
}

/**
 * Componente de campo checkbox para formularios.
 * El checkbox tiene el label al lado, no arriba como otros campos.
 */
export const FormCheckboxField: React.FC<IFormCheckboxFieldProps> = ({ label, description, required }) => {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, state => state.meta.errors)
  const showErrors = field.state.meta.isTouched && errors.length > 0

  return (
    <div className="space-y-1.5">
      <div className="space-y-0.5">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={field.name}
            checked={field.state.value}
            onCheckedChange={checked => {
              field.handleChange(checked === true)
              field.handleBlur()
            }}
            aria-invalid={!field.state.meta.isValid && field.state.meta.isTouched}
          />
          <Label
            htmlFor={field.name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer py-0 gap-0"
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
        </div>
        {description && <p className="text-xs text-muted-foreground ml-6">{description}</p>}
      </div>
      {showErrors && <FormErrorMessages errors={errors} />}
    </div>
  )
}
