'use client'

import { useState, useMemo } from 'react'
import { Search, FolderOpen, FolderClosed } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { ScrollArea } from '@/core/ui/scroll-area'
import { Badge } from '@/core/ui/badge'
import { Input } from '@/core/ui/input'

import type { IChangedFile } from '../../types/diff.types'
import type { IEnrichedIssue } from '../../types/issue.types'
import { StatusIcon } from './status-icon'
import { groupFilesByFolder, countIssuesByFile, filterFiles, getFileName } from './file-sidebar.utils'

export interface IFileSidebarProps {
  files: IChangedFile[]
  issues: IEnrichedIssue[]
  selectedFile?: string
  onFileSelect: (path: string) => void
  className?: string
}

export function FileSidebar({ files, issues, selectedFile, onFileSelect, className }: IFileSidebarProps) {
  const [search, setSearch] = useState('')
  const [grouped, setGrouped] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const issueCounts = useMemo(() => countIssuesByFile(issues), [issues])
  const filteredFiles = useMemo(() => filterFiles(files, search), [files, search])
  const folderGroups = useMemo(() => (grouped ? groupFilesByFolder(filteredFiles) : null), [filteredFiles, grouped])

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folder)) next.delete(folder)
      else next.add(folder)
      return next
    })
  }

  return (
    <aside className={cn('flex flex-col border-r bg-muted/30', className)}>
      {/* Barra de búsqueda y toggle de agrupación */}
      <div className="p-3 border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar archivos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setGrouped(!grouped)}
          className={cn(
            'text-xs px-2 py-1 rounded transition-colors',
            grouped ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
          )}
        >
          {grouped ? 'Agrupados' : 'Planos'}
        </button>
      </div>

      {/* Lista de archivos */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {grouped && folderGroups
            ? renderGroupedFiles(folderGroups, {
                selectedFile,
                onFileSelect,
                issueCounts,
                expandedFolders,
                toggleFolder,
              })
            : renderFlatFiles(filteredFiles, {
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
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem]">
          {issueCount}
        </Badge>
      )}
    </button>
  )
}

interface IGroupedRenderContext {
  selectedFile?: string
  onFileSelect: (path: string) => void
  issueCounts: Map<string, number>
  expandedFolders: Set<string>
  toggleFolder: (folder: string) => void
}

/** Renderiza archivos agrupados por carpeta */
function renderGroupedFiles(groups: Map<string, IChangedFile[]>, ctx: IGroupedRenderContext) {
  const entries = Array.from(groups.entries())

  return entries.map(([folder, files]) => {
    const isExpanded = ctx.expandedFolders.has(folder)
    const folderIssues = files.reduce((sum, f) => sum + (ctx.issueCounts.get(f.path) ?? 0), 0)

    return (
      <div key={folder}>
        <button
          type="button"
          onClick={() => ctx.toggleFolder(folder)}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent/50 transition-colors"
        >
          {isExpanded ? <FolderOpen className="size-3.5" /> : <FolderClosed className="size-3.5" />}
          <span className="truncate flex-1">{folder}</span>
          {folderIssues > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {folderIssues}
            </Badge>
          )}
        </button>
        {isExpanded &&
          files.map(file => (
            <FileItem
              key={file.path}
              file={file}
              isSelected={ctx.selectedFile === file.path}
              issueCount={ctx.issueCounts.get(file.path) ?? 0}
              onSelect={ctx.onFileSelect}
            />
          ))}
      </div>
    )
  })
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
