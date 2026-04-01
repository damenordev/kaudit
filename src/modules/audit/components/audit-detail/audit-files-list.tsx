'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, FileCode2, Plus, Minus } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { Badge } from '@/core/ui/badge'
import { ScrollArea } from '@/core/ui/scroll-area'
import { Separator } from '@/core/ui/separator'

import type { IChangedFile } from '../../types/diff.types'
import type { IEnrichedIssue } from '../../types/issue.types'

export interface IAuditFilesListProps {
  files: IChangedFile[]
  issues: IEnrichedIssue[]
  onFileSelect?: (path: string) => void
  className?: string
}

/** Badge de status del archivo con color semántico */
function FileStatusBadge({ status }: { status: IChangedFile['status'] }) {
  const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    added: 'default',
    modified: 'secondary',
    deleted: 'destructive',
    renamed: 'outline',
  }
  return (
    <Badge variant={variantMap[status] ?? 'outline'} className="text-[10px] px-1.5 py-0 h-4 capitalize">
      {status}
    </Badge>
  )
}

/** Fila expandible de archivo con detalle de issues */
function FileRow({
  file,
  fileIssues,
  isExpanded,
  onToggle,
}: {
  file: IChangedFile
  fileIssues: IEnrichedIssue[]
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-accent/50 transition-colors"
      >
        {isExpanded ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />}
        <FileCode2 className="size-4 shrink-0 text-muted-foreground" />
        <span className="font-mono text-xs truncate flex-1" title={file.path}>
          {file.path}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Plus className="size-3 text-emerald-600" />
          {file.additions}
          <Minus className="size-3 text-red-500" />
          {file.deletions}
        </span>
        <FileStatusBadge status={file.status} />
        {fileIssues.length > 0 && (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem] shrink-0">
            {fileIssues.length}
          </Badge>
        )}
      </button>
      {isExpanded && fileIssues.length > 0 && (
        <div className="pl-12 pr-3 pb-2 space-y-1.5">
          {fileIssues.map(issue => (
            <div key={issue.id} className="flex items-start gap-2 text-xs py-1 px-2 rounded bg-muted/50">
              <Badge
                variant={issue.severity === 'critical' || issue.severity === 'error' ? 'destructive' : 'secondary'}
                className="text-[9px] px-1 py-0 h-3.5 shrink-0 mt-0.5 capitalize"
              >
                {issue.severity}
              </Badge>
              <div className="min-w-0">
                <p className="font-medium truncate">{issue.title}</p>
                {issue.message && <p className="text-muted-foreground line-clamp-2">{issue.message}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Lista expandible de archivos auditados con detalles de issues */
export function AuditFilesList({ files, issues, onFileSelect, className }: IAuditFilesListProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null)

  /** Agrupa issues por ruta de archivo */
  function getFileIssues(filePath: string): IEnrichedIssue[] {
    return issues.filter(i => i.file === filePath)
  }

  if (files.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground', className)}>
        <FileCode2 className="size-10 opacity-30" />
        <p className="text-sm">No se encontraron archivos en esta auditoría</p>
      </div>
    )
  }

  return (
    <div className={cn('border rounded-lg', className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-semibold">Archivos analizados</h3>
        <Badge variant="secondary" className="text-xs">
          {files.length} archivos
        </Badge>
      </div>
      <ScrollArea className="max-h-[400px]">
        <div>
          {files.map((file, idx) => (
            <div key={file.path}>
              {idx > 0 && <Separator />}
              <FileRow
                file={file}
                fileIssues={getFileIssues(file.path)}
                isExpanded={expandedFile === file.path}
                onToggle={() => {
                  setExpandedFile(prev => (prev === file.path ? null : file.path))
                  onFileSelect?.(file.path)
                }}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
