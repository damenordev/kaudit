'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { ScrollArea } from '@/core/ui/scroll-area'
import { Badge } from '@/core/ui/badge'
import { Input } from '@/core/ui/input'

import type { IChangedFile } from '../../types/diff.types'
import type { IEnrichedIssue } from '../../types/issue.types'
import { StatusIcon } from './status-icon'
import { countIssuesByFile, filterFiles, getFileName } from './file-sidebar.utils'

export interface IFileSidebarProps {
  files: IChangedFile[]
  issues: IEnrichedIssue[]
  selectedFile?: string
  onFileSelect: (path: string) => void
  className?: string
}

export function FileSidebar({ files, issues, selectedFile, onFileSelect, className }: IFileSidebarProps) {
  const [search, setSearch] = useState('')

  const issueCounts = useMemo(() => countIssuesByFile(issues), [issues])
  const filteredFiles = useMemo(() => filterFiles(files, search), [files, search])

  return (
    <aside className={cn('flex flex-col h-full border-r bg-muted/30', className)}>
      {/* Barra de búsqueda */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar archivos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-8 text-sm bg-background"
          />
        </div>
      </div>

      {/* Lista de archivos plana */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {renderFlatFiles(filteredFiles, {
            selectedFile,
            onFileSelect,
            issueCounts,
          })}
        </div>
      </ScrollArea>
    </aside>
  )
}

interface IFileItemProps {
  file: IChangedFile
  isSelected: boolean
  issueCount: number
  onSelect: (path: string) => void
}

/** Fila individual de archivo en la lista */
function FileItem({ file, isSelected, issueCount, onSelect }: IFileItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(file.path)}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors',
        isSelected ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent/50 text-foreground'
      )}
    >
      <StatusIcon status={file.status} />
      <span className="truncate flex-1 font-mono text-xs" title={file.path}>
        {getFileName(file.path)}
      </span>
      {issueCount > 0 && (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 min-w-5">
          {issueCount}
        </Badge>
      )}
    </button>
  )
}


interface IFlatRenderContext {
  selectedFile?: string
  onFileSelect: (path: string) => void
  issueCounts: Map<string, number>
}

/** Renderiza archivos en lista plana */
function renderFlatFiles(files: IChangedFile[], ctx: IFlatRenderContext) {
  return files.map(file => (
    <FileItem
      key={file.path}
      file={file}
      isSelected={ctx.selectedFile === file.path}
      issueCount={ctx.issueCounts.get(file.path) ?? 0}
      onSelect={ctx.onFileSelect}
    />
  ))
}
