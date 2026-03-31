/**
 * Queries de estadísticas para el dashboard.
 * Agrega datos de auditorías para mostrar en el overview.
 */
import 'server-only'

import { desc, sql } from 'drizzle-orm'

import { db } from '@/core/lib/db'

import { audit } from '../models/audit.schema'
import type { IAuditStats, IIssuesBySeverity, IRecentAudit } from '../types/stats.types'

/**
 * Obtiene estadísticas agregadas para el dashboard.
 * Incluye totales, distribución por status e issues por severidad.
 */
export async function getAuditStats(): Promise<IAuditStats> {
  // Total y distribución por status en una sola query
  const statusCounts = await db
    .select({
      status: audit.status,
      count: sql<number>`count(*)::int`,
    })
    .from(audit)
    .groupBy(audit.status)

  const totalAudits = statusCounts.reduce((acc, row) => acc + Number(row.count), 0)

  // Issues por severidad (extraídos del JSONB)
  const issuesResult = await db
    .select({
      severityCounts: sql<IIssuesBySeverity>`
        COALESCE(
          jsonb_object_agg(
            severity,
            cnt
          ) FILTER (WHERE severity IS NOT NULL),
          '{}'::jsonb
        )
      `,
    })
    .from(
      sql`(
        SELECT issue->>'severity' AS severity, COUNT(*)::int AS cnt
        FROM ${audit}, jsonb_array_elements(CASE
          WHEN ${audit.issues} IS NOT NULL THEN ${audit.issues}
          ELSE '[]'::jsonb
        END) AS issue
        GROUP BY issue->>'severity'
      ) sub`
    )

  const severityCounts = issuesResult[0]?.severityCounts ?? {
    critical: 0,
    error: 0,
    warning: 0,
    info: 0,
  }

  const totalIssues = Object.values(severityCounts).reduce((a, b) => a + b, 0)

  // Auditorías recientes (últimas 10)
  const recentRows = await db
    .select({
      id: audit.id,
      repoUrl: audit.repoUrl,
      branchName: audit.branchName,
      status: audit.status,
      createdAt: audit.createdAt,
      issues: audit.issues,
    })
    .from(audit)
    .orderBy(desc(audit.createdAt))
    .limit(10)

  const recentAudits: IRecentAudit[] = recentRows.map(row => ({
    id: row.id,
    repoUrl: row.repoUrl,
    branchName: row.branchName,
    status: row.status,
    createdAt: row.createdAt,
    issueCount: Array.isArray(row.issues) ? row.issues.length : 0,
  }))

  // Tasa de aprobación: auditorías sin issues críticos / total completadas
  const completedRow = statusCounts.find(r => r.status === 'completed')
  const completedCount = completedRow ? Number(completedRow.count) : 0
  const approvalRate = completedCount > 0 ? Math.round((completedCount / totalAudits) * 100) : 0

  return {
    totalAudits,
    auditsByStatus: statusCounts.map(r => ({ status: r.status, count: Number(r.count) })),
    issuesBySeverity: severityCounts,
    totalIssues,
    approvalRate,
    recentAudits,
  }
}
