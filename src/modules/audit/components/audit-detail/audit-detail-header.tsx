'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
  backHref?: string
  className?: string
}

/** Cabecera de la página de detalle: botón atrás, repo, status y fecha */
export function AuditDetailHeader({
  repoName,
  status,
  createdAt,
  backHref = '/dashboard/audits',
  className,
}: IAuditDetailHeaderProps) {
  return (
    <div className={cn('flex items-center gap-3 flex-wrap', className)}>
      <Button variant="ghost" size="sm" asChild>
        <Link href={backHref}>
          <ArrowLeft className="size-4" />
        </Link>
      </Button>
      <h2 className="text-lg font-semibold truncate">{repoName}</h2>
      <Badge variant={STATUS_VARIANT[status] ?? 'outline'} className="capitalize shrink-0">
        {status}
      </Badge>
      <span className="text-xs text-muted-foreground ml-auto shrink-0">{new Date(createdAt).toLocaleDateString()}</span>
    </div>
  )
}
