'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { setCookie } from '@/core/utils'
import { getAllTimezones, TIMEZONE_COOKIE_NAME } from '../config'
import { Combobox } from '@/core/ui/forms/combobox'

export interface ITimezoneSwitcherProps {
  initialValue: string
}

export function TimezoneSwitcher({ initialValue }: ITimezoneSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState<string>(initialValue)

  const timezones = useMemo(() => {
    return getAllTimezones().map(tz => ({
      value: tz.value,
      label: tz.label.replace(/_/g, ' '),
    }))
  }, [])

  const handleSelect = (newValue: string) => {
    setValue(newValue)
    setCookie(TIMEZONE_COOKIE_NAME, newValue)

    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <Combobox
      items={timezones}
      value={value}
      onSelect={handleSelect}
      placeholder="Select timezone..."
      searchPlaceholder="Search timezone..."
      disabled={isPending}
    />
  )
}
