/**
 * Utilidades para agrupar y formatear commits en el timeline.
 */

import type { IAuditCommit } from '../../types/commit.types'
import type { ICommitGroup } from './commit-timeline.types'
import { formatDate } from '@/core/utils/date'

/** Agrupa commits por fecha (YYYY-MM-DD), ordenados de más reciente a más antiguo */
export function groupCommitsByDate(commits: IAuditCommit[]): ICommitGroup[] {
  const map = new Map<string, IAuditCommit[]>()

  for (const commit of commits) {
    const dateKey = new Date(commit.date).toISOString().slice(0, 10)
    const group = map.get(dateKey) ?? []
    group.push(commit)
    map.set(dateKey, group)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, groupedCommits]) => ({
      dateKey,
      label: formatDate(dateKey, 'es', { dateStyle: 'long' }),
      commits: groupedCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }))
}

/** Acorta un SHA a 7 caracteres */
export function shortSha(sha: string): string {
  return sha.slice(0, 7)
}
