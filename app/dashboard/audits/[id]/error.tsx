/**
 * Error boundary para el detalle de auditoría.
 * Muestra un mensaje de error con opción de volver al listado.
 */
'use client'

import Link from 'next/link'
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/core/ui/button'

interface IAuditDetailErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuditDetailError({ error, reset }: IAuditDetailErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
      <AlertCircle className="size-12 text-destructive/60" />
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-xl font-bold">Error al cargar la auditoría</h2>
        <p className="text-sm text-muted-foreground">
          {error.message || 'No se pudo obtener el detalle de la auditoría.'}
        </p>
        {error.digest && <p className="text-xs text-muted-foreground/60">Error ID: {error.digest}</p>}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline" className="gap-2">
          <RotateCcw className="size-4" />
          Reintentar
        </Button>
        <Button asChild variant="secondary" className="gap-2">
          <Link href="/dashboard/audits">
            <ArrowLeft className="size-4" />
            Volver al listado
          </Link>
        </Button>
      </div>
    </div>
  )
}
