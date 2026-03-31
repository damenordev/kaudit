/**
 * Tipos para las estadísticas del dashboard.
 */

export interface IAuditStatusCount {
  status: string
  count: number
}

export interface IIssuesBySeverity {
  critical: number
  error: number
  warning: number
  info: number
}

export interface IAuditStats {
  totalAudits: number
  auditsByStatus: IAuditStatusCount[]
  issuesBySeverity: IIssuesBySeverity
  totalIssues: number
  approvalRate: number
  recentAudits: IRecentAudit[]
}

export interface IRecentAudit {
  id: string
  repoUrl: string
  branchName: string
  status: string
  createdAt: Date
  issueCount: number
}
