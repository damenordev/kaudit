'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { FileCode2, GitBranch, Network } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'

import type { IAuditCommit } from '../../types/commit.types'
import type { IChangedFile } from '../../types/diff.types'
import type { IEnrichedIssue } from '../../types/issue.types'
import { FileSidebar } from '../file-sidebar'
import { MonacoDiffViewer } from '../monaco-diff-viewer'
import { DiagramsPanel } from './diagrams-panel'
import { IssuesPanel } from '../issues-panel'
import { useFileContent } from '../../hooks'

type TTab = 'diff' | 'diagrams'

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
  const [activeTab, setActiveTab] = useState<TTab>('diff')

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

  useEffect(() => {
    if (fileFromUrl && fileFromUrl !== selectedFile) setSelectedFile(fileFromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileFromUrl])

  return (
    <div className={cn('flex h-[calc(100vh-8rem)] gap-0 overflow-hidden rounded-lg border', className)}>
      <FileSidebar
        files={changedFiles}
        issues={issues}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        className="w-64 shrink-0 hidden md:flex"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex border-b bg-muted/30">
          <TabBtn
            active={activeTab === 'diff'}
            onClick={() => setActiveTab('diff')}
            icon={<GitBranch className="size-3.5" />}
          >
            Diff
          </TabBtn>
          <TabBtn
            active={activeTab === 'diagrams'}
            onClick={() => setActiveTab('diagrams')}
            icon={<Network className="size-3.5" />}
          >
            Diagramas
          </TabBtn>
        </div>
        {activeTab === 'diff' ? (
          selectedFile ? (
            <MonacoDiffViewer
              originalContent={fileData.originalContent ?? ''}
              modifiedContent={fileData.modifiedContent ?? ''}
              language={(fileData.language || selectedFileData?.language) ?? ''}
              fileName={selectedFile}
              highlightedLines={issueLines}
              isLoading={fileData.isLoading}
              error={fileData.error}
              className="flex-1 border-0 rounded-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <FileCode2 className="size-12 opacity-30" />
              <p className="text-sm">Selecciona un archivo para ver el diff</p>
            </div>
          )
        ) : (
          <DiagramsPanel changedFiles={changedFiles} issues={issues} commits={commits} className="flex-1" />
        )}
      </div>
      <aside className="w-80 shrink-0 border-l p-3 overflow-y-auto hidden lg:block">
        <IssuesPanel issues={issues} onIssueClick={handleIssueClick} selectedIssueId={selectedIssueId} />
      </aside>
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
      )}
    >
      {icon}
      {children}
    </button>
  )
}
