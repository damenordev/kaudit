'use client'

import { useMemo, useState } from 'react'
import { FolderTree, GitBranch, ArrowRightLeft } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'

import type { IAuditCommit } from '../../types/commit.types'
import type { IChangedFile } from '../../types/diff.types'
import type { IEnrichedIssue } from '../../types/issue.types'
import { MermaidViewer } from '../mermaid-viewer'
import {
  generateFileDiagram,
  generateCommitFlowDiagram,
  generateCommitSequenceDiagram,
} from '../../lib/generate-mermaid.utils'

type TDiagramType = 'files' | 'commitFlow' | 'commitSequence'

export interface IDiagramsPanelProps {
  changedFiles: IChangedFile[]
  issues: IEnrichedIssue[]
  commits: IAuditCommit[]
  className?: string
}

const DIAGRAM_OPTIONS: { key: TDiagramType; label: string; icon: React.ReactNode }[] = [
  { key: 'files', label: 'Archivos', icon: <FolderTree className="size-3.5" /> },
  { key: 'commitFlow', label: 'Commits', icon: <GitBranch className="size-3.5" /> },
  { key: 'commitSequence', label: 'Secuencia', icon: <ArrowRightLeft className="size-3.5" /> },
]

export function DiagramsPanel({ changedFiles, issues, commits, className }: IDiagramsPanelProps) {
  const [activeDiagram, setActiveDiagram] = useState<TDiagramType>('files')

  const diagramCode = useMemo(() => {
    switch (activeDiagram) {
      case 'files':
        return generateFileDiagram(changedFiles, issues)
      case 'commitFlow':
        return generateCommitFlowDiagram(commits)
      case 'commitSequence':
        return generateCommitSequenceDiagram(commits)
    }
  }, [activeDiagram, changedFiles, issues, commits])

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex gap-1 p-2 border-b bg-muted/30">
        {DIAGRAM_OPTIONS.map(({ key, label, icon }) => (
          <DiagramTabBtn key={key} active={activeDiagram === key} onClick={() => setActiveDiagram(key)} icon={icon}>
            {label}
          </DiagramTabBtn>
        ))}
      </div>
      <MermaidViewer code={diagramCode} className="flex-1 border-0 rounded-none" />
    </div>
  )
}

interface IDiagramTabBtnProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}

function DiagramTabBtn({ active, onClick, icon, children }: IDiagramTabBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
      )}
    >
      {icon}
      {children}
    </button>
  )
}
