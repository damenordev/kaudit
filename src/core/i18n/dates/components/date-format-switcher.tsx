'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { setCookie } from '@/core/utils'
import { DATE_FORMATS, DATE_FORMAT_COOKIE_NAME, type TDateFormat } from '../config'
import { DateFormatCard } from './date-format-card'

export interface IDateFormatSwitcherProps {
  initialValue: TDateFormat
}

export function DateFormatSwitcher({ initialValue }: IDateFormatSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState<TDateFormat>(initialValue)

  const handleSelect = (newValue: TDateFormat) => {
    if (newValue === value) return

    setValue(newValue)
    setCookie(DATE_FORMAT_COOKIE_NAME, newValue)

    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {DATE_FORMATS.map(f => (
        <DateFormatCard
          key={f.value}
          formatValue={f.value as TDateFormat}
          isActive={value === f.value}
          onClick={() => handleSelect(f.value as TDateFormat)}
          disabled={isPending}
        />
      ))}
    </div>
  )
}
