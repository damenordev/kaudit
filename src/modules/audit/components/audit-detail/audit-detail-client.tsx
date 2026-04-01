'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { FileCode2 } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import type { IAuditCommit } from '../../types/commit.types'
import type { IChangedFile } from '../../types/diff.types'
import type { IEnrichedIssue } from '../../types/issue.types'
import { FileSidebar } from '../file-sidebar'
import { MonacoDiffViewer } from '../monaco-diff-viewer'
import { DiagramsPanel } from './diagrams-panel'
import { DiffTabBar, type TDiffTab } from './audit-detail-tabs'
import { IssuesPanel } from '../issues-panel'
import { useFileContent } from '../../hooks'

export interface IAuditDetailClientProps {
  auditId: string
  changedFiles: IChangedFile[]
  issues: IEnrichedIssue[]
  commits: IAuditCommit[]
  className?: string
}

export function AuditDetailClient({ auditId, changedFiles, issues, commits, className }: IAuditDetailClientProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const fileFromUrl = searchParams.get('file') ?? ''
  const [selectedFile, setSelectedFile] = useState<string>(fileFromUrl)
  const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>()
  const [activeTab, setActiveTab] = useState<TDiffTab>('diff')

  const fileData = useFileContent(auditId, selectedFile)
  const selectedFileData = useMemo(() => changedFiles.find(f => f.path === selectedFile), [changedFiles, selectedFile])
  const issueLines = useMemo(() => {
    if (!selectedFile || !issues.length) return []
    return issues.filter(i => i.file === selectedFile).map(i => i.line)
  }, [issues, selectedFile])

  const handleFileSelect = useCallback(
    (path: string) => {
      setSelectedFile(path)
      setSelectedIssueId(undefined)
      setActiveTab('diff')
      const params = new URLSearchParams(searchParams.toString())
      params.set('file', path)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  const handleIssueClick = useCallback(
    (issue: IEnrichedIssue) => {
      setSelectedIssueId(issue.id)
      if (issue.file !== selectedFile) handleFileSelect(issue.file)
    },
    [selectedFile, handleFileSelect]
  )

  // Sincronizar selección con param de URL
  useEffect(() => {
    if (fileFromUrl && fileFromUrl !== selectedFile) setSelectedFile(fileFromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileFromUrl])

  // Auto-seleccionar primer archivo si no hay selección
  useEffect(() => {
    if (!selectedFile && !fileFromUrl && changedFiles.length > 0) {
      handleFileSelect(changedFiles[0]?.path ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={cn('flex flex-col lg:flex-row gap-4', className)}>
      <div className="flex-1 flex flex-col min-w-0 rounded-lg border overflow-hidden min-h-[400px]">
        <DiffTabBar active={activeTab} onChange={setActiveTab} />
        <div className="flex flex-1 min-h-0">
          <FileSidebar
            files={changedFiles}
            issues={issues}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            className="w-56 shrink-0 border-r hidden md:flex"
          />
          <div className="flex-1 min-w-0">
            {activeTab === 'diff' ? (
              <DiffView
                selectedFile={selectedFile}
                fileData={fileData}
                selectedFileData={selectedFileData}
                issueLines={issueLines}
              />
            ) : (
              <DiagramsPanel changedFiles={changedFiles} issues={issues} commits={commits} className="flex-1" />
            )}
          </div>
        </div>
      </div>
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 rounded-lg border p-3 overflow-y-auto max-h-[600px] lg:max-h-none">
        <IssuesPanel issues={issues} onIssueClick={handleIssueClick} selectedIssueId={selectedIssueId} />
      </aside>
    </div>
  )
}

/** Vista de diff o placeholder cuando no hay archivo seleccionado */
function DiffView({
  selectedFile,
  fileData,
  selectedFileData,
  issueLines,
}: {
  selectedFile: string
  fileData: ReturnType<typeof useFileContent>
  selectedFileData: IChangedFile | undefined
  issueLines: number[]
}) {
  if (!selectedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-3 text-muted-foreground">
        <FileCode2 className="size-12 opacity-30" />
        <p className="text-sm">Selecciona un archivo para ver el diff</p>
      </div>
    )
  }

  return (
    <MonacoDiffViewer
      originalContent={fileData.originalContent ?? ''}
      modifiedContent={fileData.modifiedContent ?? ''}
      language={(fileData.language || selectedFileData?.language) ?? ''}
      fileName={selectedFile}
      highlightedLines={issueLines}
      isLoading={fileData.isLoading}
      error={fileData.error}
      className="border-0 rounded-none h-full"
    />
  )
}
