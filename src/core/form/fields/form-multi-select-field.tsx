'use client'

import React, { useId } from 'react'
import { Check, X } from 'lucide-react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { Badge } from '@/core/ui/primitives/badge'
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
 * Props para el campo multi select.
 */
export interface IFormMultiSelectFieldProps {
  label: string
  options: Array<{ label: string; value: string }>
  placeholder?: string
  searchPlaceholder?: string
  description?: string
  required?: boolean
}

/**
 * Componente de campo multi select para formularios.
 */
export const FormMultiSelectField: React.FC<IFormMultiSelectFieldProps> = ({
  label,
  options,
  placeholder = 'Selecciona opciones...',
  searchPlaceholder = 'Buscar...',
  description,
  required,
}) => {
  const field = useFieldContext<string[]>()
  const [open, setOpen] = React.useState(false)
  const id = useId()
  const contentId = `${id}-content`

  const selectedValues = field.state.value ?? []
  const selectedOptions = options.filter(option => selectedValues.includes(option.value))

  const handleSelect = (value: string) => {
    const currentValues = field.state.value ?? []
    const newValues = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value]
    field.handleChange(newValues)
    field.handleBlur()
  }

  const handleRemove = (value: string) => {
    const currentValues = field.state.value ?? []
    field.handleChange(currentValues.filter(v => v !== value))
    field.handleBlur()
  }

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
            className="w-full justify-between min-h-10 h-auto"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map(option => (
                  <Badge key={option.value} variant="secondary" className="mr-1">
                    {option.label}
                    <span
                      role="button"
                      tabIndex={0}
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemove(option.value)
                        }
                      }}
                      onMouseDown={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemove(option.value)
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </span>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent id={contentId} className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>No se encontraron opciones.</CommandEmpty>
              <CommandGroup>
                {options.map(option => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormFieldWrapper>
  )
}
