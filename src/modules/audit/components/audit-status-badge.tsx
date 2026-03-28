'use client'

import { Loader2 } from 'lucide-react'

import { Badge } from '@/core/ui/badge'
import { cn } from '@/core/utils/cn.utils'

import type { TAuditStatus } from '../models/audit.schema'

export interface IAuditStatusBadgeProps {
  status: TAuditStatus
  showSpinner?: boolean
}

// Estados que muestran spinner de carga
const LOADING_STATUSES: TAuditStatus[] = ['processing', 'validating', 'generating']

// Mapeo de colores por estado usando clases Tailwind directas
const STATUS_STYLES: Record<TAuditStatus, string> = {
  pending: 'bg-secondary text-secondary-foreground',
  processing: 'bg-primary/10 text-primary border-primary/20',
  validating: 'bg-primary/10 text-primary border-primary/20',
  generating: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
  blocked: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
}

// Etiquetas por estado
const STATUS_LABELS: Record<TAuditStatus, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  validating: 'Validando',
  generating: 'Generando',
  completed: 'Completado',
  failed: 'Fallido',
  blocked: 'Bloqueado',
}

/**
 * Badge que muestra el estado de una auditoría con colores semánticos.
 * Muestra spinner animado para estados de carga.
 */
export function AuditStatusBadge({ status, showSpinner = true }: IAuditStatusBadgeProps) {
  const isLoading = LOADING_STATUSES.includes(status)
  const label = STATUS_LABELS[status]
  const style = STATUS_STYLES[status]

  return (
    <Badge className={cn('border gap-1.5 font-medium', style)}>
      {isLoading && showSpinner && <Loader2 className="size-3 animate-spin" />}
      {label}
    </Badge>
  )
}
