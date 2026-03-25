'use client'

import React from 'react'
import { CalendarIcon } from 'lucide-react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { Button } from '@/core/ui/button'
import { Calendar } from '@/core/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/core/ui/popover'
import { cn, formatDate } from '@/core/utils'

/**
 * Props para el campo de selector de fecha.
 */
export interface IFormDatePickerFieldProps {
  label: string
  placeholder?: string
  description?: string
  required?: boolean
}

/**
 * Componente de campo date picker para formularios.
 */
export const FormDatePickerField: React.FC<IFormDatePickerFieldProps> = ({
  label,
  placeholder = 'Selecciona una fecha',
  description,
  required,
}) => {
  const field = useFieldContext<Date | undefined>()

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            className={cn('w-full justify-start text-left font-normal', !field.state.value && 'text-muted-foreground')}
          >
            <CalendarIcon />
            {field.state.value ? formatDate(field.state.value) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={date => {
              field.handleChange(date)
              field.handleBlur()
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </FormFieldWrapper>
  )
}
