/**
 * Constantes compartidas del módulo de auditoría.
 * Seguro para usar en Client Components (sin imports de DB).
 */

// Estados posibles de una auditoría
export const auditStatusEnum = [
  'pending',
  'processing',
  'validating',
  'generating',
  'completed',
  'failed',
  'blocked',
] as const

export type TAuditStatus = (typeof auditStatusEnum)[number]
