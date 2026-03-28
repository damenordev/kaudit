/**
 * Tipos y schemas para los endpoints de la API de auditoría.
 * Define validación con Zod y tipos de request/response.
 */
import { z } from 'zod'

import type { IGeneratedContent, IValidationResult } from './index'

// Schema para iniciar una auditoría
export const auditStartSchema = z.object({
  repoUrl: z.string().url(),
  branchName: z.string().min(1),
  targetBranch: z.string().default('main'),
  gitDiff: z.string().max(1_000_000), // 1MB máximo
})

// Schema para query params del listado de auditorías
export const auditListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['pending', 'processing', 'validating', 'generating', 'completed', 'failed', 'blocked']).optional(),
})

// Tipos inferidos de los schemas
export type IAuditStartRequest = z.infer<typeof auditStartSchema>
export type IAuditListQuery = z.infer<typeof auditListQuerySchema>

// Response types
export interface IAuditStartResponse {
  auditId: string
  status: string
}

export interface IAuditStatusResponse {
  id: string
  status: string
  repoUrl: string
  branchName: string
  targetBranch: string
  validationResult?: IValidationResult
  generatedContent?: IGeneratedContent
  prUrl?: string
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

export interface IAuditListResponse {
  data: IAuditStatusResponse[]
  page: number
  pageCount: number
  total: number
}
