'use client'

import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { RotateCcwIcon } from 'lucide-react'
import { sileo } from 'sileo'

import { Button } from '@/core/ui/button'
import { fixStaleAuditsAction } from '../../actions/fix-stale-audits.actions'

/**
 * Botón para limpiar auditorías atascadas en estados intermedios.
 * Ejecuta una server action que marca auditorías stale como 'failed'
 * y muestra el resultado mediante un toast.
 */
export const FixStaleAuditsButton = () => {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('dashboard.audits.fixStale')

  const handleFixStale = () => {
    startTransition(async () => {
      const result = await fixStaleAuditsAction()

      if (result.success) {
        const message = result.fixedCount > 0 ? t('fixedCount', { count: result.fixedCount }) : t('noStale')
        sileo.success({ title: message })

        // Refrescar datos si hubo correcciones
        if (result.fixedCount > 0) {
          window.location.reload()
        }
      } else {
        sileo.error({ title: result.error })
      }
    })
  }

  return (
    <Button variant="outline" size="sm" className="h-8" disabled={isPending} onClick={handleFixStale}>
      <RotateCcwIcon className={`mr-1 h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? t('cleaning') : t('button')}
    </Button>
  )
}
