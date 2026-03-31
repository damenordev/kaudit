/**
 * Error boundary para el dashboard overview.
 * Captura errores de Server Components y muestra un mensaje recuperable.
 */
'use client'

import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/core/ui/button'

interface IDashboardErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: IDashboardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
      <AlertCircle className="size-12 text-destructive/60" />
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-xl font-bold">Error al cargar el dashboard</h2>
        <p className="text-sm text-muted-foreground">
          {error.message || 'Ocurrió un error inesperado al obtener las estadísticas.'}
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
