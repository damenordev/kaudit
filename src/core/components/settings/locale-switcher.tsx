'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Check, Globe } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/core/ui/dropdown-menu'
import { setLocale } from '@/core/lib/i18n/i18n.actions'
import { routing } from '@/core/lib/i18n/i18n.routing'

const localeLabels: Record<string, string> = {
  en: 'English',
  es: 'Español',
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleLocaleChange(nextLocale: string) {
    if (nextLocale === locale) return
    startTransition(async () => {
      await setLocale(nextLocale as 'en' | 'es')
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending} className={className}>
          <Globe className="mr-2 h-4 w-4" />
          {localeLabels[locale] ?? locale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map(l => (
          <DropdownMenuItem key={l} onClick={() => handleLocaleChange(l)} className="justify-between">
            <span>{localeLabels[l] ?? l.toUpperCase()}</span>
            {locale === l && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
