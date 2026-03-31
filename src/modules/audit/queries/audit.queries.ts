/**
 * Queries para operaciones de base de datos del módulo audit.
 * Encapsula todas las operaciones CRUD para auditorías.
 */
import 'server-only'

import { and, desc, eq, gte, ilike, lte, sql } from 'drizzle-orm'

import { db } from '@/core/lib/db'

import type {
  IAuditCommit,
  IChangedFile,
  IDocstringResult,
  IEnrichedIssue,
  IGeneratedContent,
  IGeneratedTest,
  IValidationResult,
} from '../types'
import { audit, type TAuditStatus } from '../models/audit.schema'

type TUpdateAuditData = Partial<{
  status: TAuditStatus
  validationResult: IValidationResult
  generatedContent: IGeneratedContent
  docstrings: IDocstringResult[]
  generatedTests: IGeneratedTest[]
  prUrl: string
  errorMessage: string
  changedFiles: IChangedFile[]
  commits: IAuditCommit[]
  issues: IEnrichedIssue[]
  updatedAt: Date
}>

// Tipo para crear un nuevo audit
type TCreateAuditData = {
  id: string
  userId?: string
  repoUrl: string
  branchName: string
  targetBranch?: string
  gitDiff?: string
  gitDiffHash?: string
}

/**
 * Obtiene una auditoría por su ID.
 * @param id - ID de la auditoría
 * @returns La auditoría encontrada o null si no existe
 */
export async function getAuditById(id: string) {
  const result = await db.select().from(audit).where(eq(audit.id, id)).limit(1)
  return result[0] ?? null
}

/**
 * Actualiza el estado de una auditoría.
 * @param id - ID de la auditoría
 * @param status - Nuevo estado
 * @param data - Datos adicionales a actualizar
 * @returns La auditoría actualizada
 */
export async function updateAuditStatus(id: string, status: TAuditStatus, data?: Omit<TUpdateAuditData, 'status'>) {
  const updateData: TUpdateAuditData = {
    status,
    updatedAt: new Date(),
    ...data,
  }

  const result = await db.update(audit).set(updateData).where(eq(audit.id, id)).returning()
  return result[0]
}

/**
 * Crea una nueva auditoría.
 * @param data - Datos de la auditoría a crear
 * @returns La auditoría creada
 */
export async function createAudit(data: TCreateAuditData) {
  const result = await db.insert(audit).values(data).returning()
  return result[0]
}

/**
 * Obtiene una auditoría por el hash del git diff.
 * @param hash - Hash del git diff
 * @returns La auditoría encontrada o null si no existe
 */
export async function getAuditByDiffHash(hash: string) {
  const result = await db.select().from(audit).where(eq(audit.gitDiffHash, hash)).limit(1)
  return result[0] ?? null
}

/**
 * Lista auditorías de un usuario con paginación y filtros.
 * @param userId - ID del usuario
 * @param options - Opciones de paginación y filtro
 * @returns Lista paginada de auditorías
 */
export async function listAudits(userId: string, options?: { page?: number; limit?: number; status?: TAuditStatus }) {
  const page = options?.page ?? 1
  const limit = options?.limit ?? 20
  const offset = (page - 1) * limit

  const whereConditions = [eq(audit.userId, userId)]
  if (options?.status) {
    whereConditions.push(eq(audit.status, options.status))
  }

  // Obtener datos paginados
  const data = await db
    .select()
    .from(audit)
    .where(and(...whereConditions))
    .orderBy(desc(audit.createdAt))
    .limit(limit)
    .offset(offset)

  // Obtener total de registros
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(audit)
    .where(and(...whereConditions))

  const total = countResult[0]?.count ?? 0

  return {
    data,
    page,
    pageCount: Math.ceil(Number(total) / limit),
    total: Number(total),
  }
}

/**
 * Lista todas las auditorías con paginación y filtros avanzados.
 * Incluye auditorías anónimas (del CLI) y de usuarios.
 * Soporta filtrado por status, búsqueda por repo y rango de fechas.
 * @param options - Opciones de paginación y filtros
 * @returns Lista paginada de auditorías
 */
export async function listAllAudits(options?: {
  page?: number
  limit?: number
  status?: TAuditStatus
  search?: string
  dateFrom?: Date
  dateTo?: Date
}) {
  const page = options?.page ?? 1
  const limit = options?.limit ?? 20
  const offset = (page - 1) * limit

  // Construir condiciones de filtrado dinámicamente
  const whereConditions = []
  if (options?.status) {
    whereConditions.push(eq(audit.status, options.status))
  }
  if (options?.search) {
    whereConditions.push(ilike(audit.repoUrl, `%${options.search}%`))
  }
  if (options?.dateFrom) {
    whereConditions.push(gte(audit.createdAt, options.dateFrom))
  }
  if (options?.dateTo) {
    // Incluir todo el día final sumando 23:59:59.999
    const endOfDay = new Date(options.dateTo)
    endOfDay.setHours(23, 59, 59, 999)
    whereConditions.push(lte(audit.createdAt, endOfDay))
  }

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

  // Obtener datos paginados
  const data = await db
    .select()
    .from(audit)
    .where(whereClause)
    .orderBy(desc(audit.createdAt))
    .limit(limit)
    .offset(offset)

  // Obtener total de registros
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(audit)
    .where(whereClause)

  const total = countResult[0]?.count ?? 0

  return {
    data,
    page,
    pageCount: Math.ceil(Number(total) / limit),
    total: Number(total),
  }
}
