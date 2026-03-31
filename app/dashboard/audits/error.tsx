/**
 * Error boundary para el listado de auditorías.
 * Captura errores y permite reintentar la carga.
 */
'use client'

import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/core/ui/button'

interface IAuditsErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuditsError({ error, reset }: IAuditsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
      <AlertCircle className="size-12 text-destructive/60" />
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-xl font-bold">Error al cargar las auditorías</h2>
        <p className="text-sm text-muted-foreground">
          {error.message || 'No se pudieron obtener las auditorías. Intenta de nuevo.'}
        </p>
        {error.digest && <p className="text-xs text-muted-foreground/60">Error ID: {error.digest}</p>}
      </div>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RotateCcw className="size-4" />
        Reintentar
      </Button>
    </div>
  )
}
