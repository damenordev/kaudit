import Link from 'next/link'
import { ArrowLeft, Github, Clock, GitBranch } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'

/** Variantes visuales del badge según el status */
const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default',
  failed: 'destructive',
  processing: 'secondary',
  pending: 'outline',
  validating: 'secondary',
  generating: 'secondary',
  blocked: 'destructive',
}

export interface IAuditDetailHeaderProps {
  repoName: string
  status: string
  createdAt: Date
  branchName?: string
  prUrl?: string
  backHref?: string
  className?: string
}

/** Cabecera de la página de detalle con el patrón del dashboard */
export function AuditDetailHeader({
  repoName,
  status,
  createdAt,
  branchName,
  prUrl,
  backHref = '/dashboard/audits',
  className,
}: IAuditDetailHeaderProps) {
  const badgeVariant = STATUS_VARIANT[status] ?? 'outline'

  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      {/* Lado izquierdo: botón volver + título y descripción */}
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" asChild className="-ml-2 shrink-0">
            <Link href={backHref}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 truncate">
            <Github className="size-6 shrink-0" />
            <span className="truncate">{repoName}</span>
          </h2>
          <Badge variant={badgeVariant} className="capitalize shrink-0">
            {status}
          </Badge>
        </div>
        {/* Descripción: branch + fecha, mismo patrón que api-keys */}
        <p className="flex items-center gap-3 text-sm text-muted-foreground pl-8">
          {branchName && (
            <span className="flex items-center gap-1">
              <GitBranch className="size-3" />
              <code className="text-xs font-mono">{branchName}</code>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>

      {/* Lado derecho: acciones */}
      <div className="flex items-center gap-2 shrink-0">
        {prUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={prUrl} rel="noopener noreferrer" target="_blank">
              Ver PR
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
