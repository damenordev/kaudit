'use client'

import React, { useId } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { Button } from '@/core/ui/primitives/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/core/ui/primitives/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/core/ui/overlays/popover'
import { cn } from '@/core/utils'

/**
 * Props para el campo combobox.
 */
export interface IFormComboboxFieldProps {
  label: string
  options: Array<{ label: string; value: string }>
  placeholder?: string
  searchPlaceholder?: string
  description?: string
  required?: boolean
}

/**
 * Componente de campo combobox para formularios.
 */
export const FormComboboxField: React.FC<IFormComboboxFieldProps> = ({
  label,
  options,
  placeholder = 'Selecciona una opción...',
  searchPlaceholder = 'Buscar...',
  description,
  required,
}) => {
  const field = useFieldContext<string>()
  const [open, setOpen] = React.useState(false)
  const id = useId()
  const contentId = `${id}-content`
  const selectedOption = options.find(option => option.value === field.state.value)

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls={contentId}
            className="w-full justify-between"
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent id={contentId} className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>No se encontraron opciones.</CommandEmpty>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      field.handleChange(option.value)
                      field.handleBlur()
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn('mr-2 h-4 w-4', field.state.value === option.value ? 'opacity-100' : 'opacity-0')}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormFieldWrapper>
  )
}
