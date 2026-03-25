'use client'

import React from 'react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { Slider } from '@/core/ui/primitives/slider'

/**
 * Props para el campo slider.
 */
export interface IFormSliderFieldProps {
  label: string
  min?: number
  max?: number
  step?: number
  description?: string
  required?: boolean
}

/**
 * Componente de campo slider para formularios.
 */
export const FormSliderField: React.FC<IFormSliderFieldProps> = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  description,
  required,
}) => {
  const field = useFieldContext<number>()

  const currentValue = field.state.value ?? min

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex-1">
          <Slider
            value={[currentValue]}
            min={min}
            max={max}
            step={step}
            onValueChange={values => {
              field.handleChange(values[0] ?? min)
              field.handleBlur()
            }}
            aria-invalid={!field.state.meta.isValid && field.state.meta.isTouched}
          />
        </div>
        <div className="flex h-8 w-12 items-center justify-center rounded-md border bg-muted text-sm font-medium tabular-nums shrink-0">
          {currentValue}
        </div>
      </div>
    </FormFieldWrapper>
  )
}
