'use client'

import { GitBranch, Network } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'

export type TDiffTab = 'diff' | 'diagrams'

export interface IDiffTabBarProps {
  active: TDiffTab
  onChange: (tab: TDiffTab) => void
  className?: string
}

/** Barra de tabs para alternar entre Diff y Diagramas */
export function DiffTabBar({ active, onChange, className }: IDiffTabBarProps) {
  return (
    <div className={cn('flex border-b bg-muted/30', className)}>
      <DiffTabBtn active={active === 'diff'} onClick={() => onChange('diff')} icon={<GitBranch className="size-3.5" />}>
        Diff
      </DiffTabBtn>
      <DiffTabBtn
        active={active === 'diagrams'}
        onClick={() => onChange('diagrams')}
        icon={<Network className="size-3.5" />}
      >
        Diagramas
      </DiffTabBtn>
    </div>
  )
}

/** Botón individual de tab */
function DiffTabBtn({
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
