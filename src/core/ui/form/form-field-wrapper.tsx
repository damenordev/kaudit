'use client'

import React from 'react'
import { useStore } from '@tanstack/react-form'

import { Label } from '@/core/ui/label'
import { useFieldContext } from './form.context'
import { FormErrorMessages } from './form-error-messages'

/**
 * Props para el wrapper de campos de formulario.
 */
export interface IFormFieldWrapperProps {
  label: string
  children: React.ReactNode
  description?: string
  required?: boolean
}

/**
 * Wrapper reutilizable para todos los campos de formulario.
 * Maneja label, descripción, errores y estructura común.
 */
export const FormFieldWrapper: React.FC<IFormFieldWrapperProps> = ({ label, children, description, required }) => {
  const field = useFieldContext()
  const errors = useStore(field.store, state => state.meta.errors)
  const showErrors = field.state.meta.isTouched && errors.length > 0
  const descriptionId = description ? `${field.name}-description` : undefined
  const errorId = `${field.name}-error`

  return (
    <div className="space-y-1.5">
      <div className="space-y-0.5">
        <Label htmlFor={field.name} className="py-0 gap-0">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {description && (
          <p id={descriptionId} className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
      {showErrors && <FormErrorMessages id={errorId} errors={errors} />}
    </div>
  )
}
