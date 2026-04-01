'use client'

import { useState } from 'react'
import { CopyIcon, CheckIcon } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { Alert, AlertDescription } from '@/core/ui/alert'

export interface IApiKeyRevealAlertProps {
  translations: {
    warning: string
    copy: string
    copied: string
    close: string
  }
  /** La API key en texto plano (solo se muestra una vez). */
  revealKey: string
  /** Callback para cerrar la alerta. */
  onDismiss: () => void
}

/** Alerta que muestra la API key recién creada con botón de copiar */
export function ApiKeyRevealAlert({ translations: t, revealKey, onDismiss }: IApiKeyRevealAlertProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(revealKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Alert className="mb-4 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
      <AlertDescription>
        <p className="mb-2 font-semibold text-amber-700 dark:text-amber-400">{t.warning}</p>
        <code className="block rounded bg-muted p-2 text-xs break-all font-mono">{revealKey}</code>
        <div className="mt-2 flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
            {copied ? t.copied : t.copy}
          </Button>
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            {t.close}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
