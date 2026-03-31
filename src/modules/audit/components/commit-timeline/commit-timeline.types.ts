/**
 * Tipos para el componente CommitTimeline.
 * Define las props, traducciones y estructura de datos agrupada.
 */

import type { IAuditCommit } from '../../types/commit.types'

/** Grupo de commits por fecha */
export interface ICommitGroup {
  /** Fecha en formato legible */
  label: string
  /** Fecha normalizada para agrupar (YYYY-MM-DD) */
  dateKey: string
  /** Commits del grupo */
  commits: IAuditCommit[]
}

/** Traducciones para la UI del timeline */
export interface ICommitTimelineTranslations {
  title: string
  filesChanged: string
  emptyMessage: string
  viewDetails: string
  viewDiff: string
}

/** Props del componente CommitTimeline */
export interface ICommitTimelineProps {
  commits: IAuditCommit[]
  repoUrl: string
  translations: ICommitTimelineTranslations
  selectedSha?: string
  onCommitSelect?: (sha: string) => void
  onFileClick?: (path: string) => void
  className?: string
}
