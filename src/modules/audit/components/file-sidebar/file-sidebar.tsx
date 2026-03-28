'use client'

import { Search, Filter } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/core/ui/badge'
import { Input } from '@/core/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/ui/select'
import { cn } from '@/core/utils/cn.utils'

import type { IChangedFile, TFileStatus } from '@/modules/audit/types'

export interface IFileSidebarProps {
  files: IChangedFile[]
  selectedPath?: string
  onFileSelect: (file: IChangedFile) => void
}

const STATUS_STYLES: Record<TFileStatus, string> = {
  added: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  modified: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  deleted: 'bg-red-500/10 text-red-600 border-red-500/20',
  renamed: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
}

const STATUS_LABELS: Record<TFileStatus, string> = { added: 'A', modified: 'M', deleted: 'D', renamed: 'R' }

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'added', label: 'Añadidos' },
  { value: 'modified', label: 'Modificados' },
  { value: 'deleted', label: 'Eliminados' },
  { value: 'renamed', label: 'Renombrados' },
]

function truncatePath(path: string, maxLength = 40): string {
  if (path.length <= maxLength) return path
  const fileName = path.split('/').pop() ?? path
  const dirPath = path.substring(0, path.lastIndexOf('/'))
  if (fileName.length >= maxLength) return `...${fileName.slice(-maxLength + 3)}`
  return `${dirPath.slice(0, maxLength - fileName.length - 4)}/...${fileName}`
}

export function FileSidebar({ files, selectedPath, onFileSelect }: IFileSidebarProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFiles = useMemo(() => {
    let result = files
    if (statusFilter !== 'all') result = result.filter(f => f.status === statusFilter)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(f => f.path.toLowerCase().includes(query))
    }
    return result
  }, [files, statusFilter, searchQuery])

  return (
    <aside className="flex h-full flex-col border-r bg-muted/30">
      <div className="border-b p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar archivo..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-8 pl-7 text-xs"
          />
        </div>
      </div>

      <div className="border-b px-3 py-1.5 text-xs text-muted-foreground">
        {filteredFiles.length} de {files.length} archivos
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredFiles.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No se encontraron archivos</div>
        ) : (
          <ul className="divide-y">
            {filteredFiles.map(file => (
              <li key={file.path}>
                <button
                  type="button"
                  onClick={() => onFileSelect(file)}
                  className={cn(
                    'w-full px-3 py-2 text-left hover:bg-muted/50 transition-colors',
                    selectedPath === file.path && 'bg-primary/10 border-l-2 border-primary'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn('h-5 w-5 p-0 justify-center text-[10px] font-bold', STATUS_STYLES[file.status])}
                    >
                      {STATUS_LABELS[file.status]}
                    </Badge>
                    <span className="flex-1 truncate text-xs font-mono" title={file.path}>
                      {truncatePath(file.path)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    {file.additions > 0 && <span className="text-emerald-600">+{file.additions}</span>}
                    {file.deletions > 0 && <span className="text-red-600">-{file.deletions}</span>}
                    {file.issueCount > 0 && (
                      <Badge variant="outline" className="h-4 px-1 text-[10px] text-orange-600 border-orange-500/20">
                        {file.issueCount} issues
                      </Badge>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
