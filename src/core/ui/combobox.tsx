'use client'

import { useState, useId } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/core/utils'
import { Button } from '@/core/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/core/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/core/ui/popover'

export interface IComboboxItem {
  value: string
  label: string
}

export interface IComboboxProps {
  items: IComboboxItem[]
  value?: string
  onSelect: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  modal?: boolean
}

export function Combobox({
  items,
  value,
  onSelect,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  className,
  disabled = false,
  modal = false,
}: IComboboxProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const contentId = `${id}-content`

  const selectedItem = items.find(item => item.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls={contentId}
          disabled={disabled}
          className={cn('min-w-[140px] justify-between px-3 font-normal', className)}
        >
          <span className="truncate">{selectedItem ? selectedItem.label : placeholder}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent id={contentId} className="w-[240px] p-0!" align="end">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map(item => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={currentValue => {
                    const originalItem = items.find(i => i.value.toLowerCase() === currentValue.toLowerCase())

                    if (originalItem) {
                      onSelect(originalItem.value)
                      setOpen(false)
                    }
                  }}
                >
                  <Check className={cn('mr-2 size-4 shrink-0', value === item.value ? 'opacity-100' : 'opacity-0')} />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
