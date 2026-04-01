/**
 * Queries de estadísticas para el dashboard.
 * Agrega datos de auditorías para mostrar en el overview.
 */
import 'server-only'

import { desc, sql } from 'drizzle-orm'

import { db } from '@/core/lib/db'

import { audit } from '../models/audit.schema'
import type { IEnrichedIssue } from '../types/issue.types'

export interface IIssuesBySeverity {
  critical: number
  error: number
  warning: number
  info: number
}

export interface IRecentAudit {
  id: string
  repoUrl: string
  branchName: string
  issueCount: number
  status: string
  createdAt: Date
}

export interface IAuditStats {
  totalAudits: number
  totalIssues: number
  approvalRate: number
  auditsByStatus: { status: string; count: number }[]
  issuesBySeverity: IIssuesBySeverity
  recentAudits: IRecentAudit[]
}

/**
 * Obtiene estadísticas agregadas para el dashboard.
 * Incluye totales, distribución por status e issues por severidad.
 */
export async function getAuditStats(): Promise<IAuditStats> {
  const statusCounts = await db
    .select({
      status: audit.status,
      count: sql<number>`count(*)::int`,
    })
    .from(audit)
    .groupBy(audit.status)

  const totalAudits = statusCounts.reduce((acc, row) => acc + Number(row.count), 0)

  // Obtener severidad de forma más robusta simplificando la query
  const severityCounts: IIssuesBySeverity = { critical: 0, error: 0, warning: 0, info: 0 }
  
  try {
    const rawIssues = await db
      .select({
        issues: audit.issues,
      })
      .from(audit)
      .where(sql`issues IS NOT NULL`)

    rawIssues.forEach(row => {
      const issues = (row.issues ?? []) as IEnrichedIssue[]
      issues.forEach(issue => {
        const sev = (issue.severity ?? '').toLowerCase()
        if (sev === 'critical' || sev === 'crítico') severityCounts.critical++
        else if (sev === 'error') severityCounts.error++
        else if (sev === 'warning' || sev === 'advertencia') severityCounts.warning++
        else if (sev === 'info') severityCounts.info++
      })
    })
  } catch (error) {
    console.error('Error calculating severity stats:', error)
  }


  const totalIssues = Object.values(severityCounts).reduce((acc, val) => acc + Number(val ?? 0), 0)

  // Auditorías recientes
  const recentAudits = await db
    .select({
      id: audit.id,
      repoUrl: audit.repoUrl,
      branchName: audit.branchName,
      issueCount: sql<number>`jsonb_array_length(COALESCE(issues, '[]'::jsonb))`,
      status: audit.status,
      createdAt: audit.createdAt,
    })
    .from(audit)
    .orderBy(desc(audit.createdAt))
    .limit(10)

  return {
    totalAudits,
    totalIssues,
    approvalRate: totalAudits > 0 ? 0 : 0, // Placeholder para lógica futura
    auditsByStatus: statusCounts as { status: string; count: number }[],
    issuesBySeverity: {
      critical: Number(severityCounts.critical || 0),
      error: Number(severityCounts.error || 0),
      warning: Number(severityCounts.warning || 0),
      info: Number(severityCounts.info || 0),
    },
    recentAudits: recentAudits as IRecentAudit[],
  }
}
