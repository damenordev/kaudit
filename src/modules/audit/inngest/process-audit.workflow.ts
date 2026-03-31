/**
 * Workflow de Inngest para procesar auditorías.
 * Orquesta los pasos de parsing, validación, generación, PR comments y status checks.
 */
import { NonRetriableError } from 'inngest'

import { inngest } from '@/core/lib/inngest/client'
import { fetchCommits } from '@/modules/github/services/commits.service'

import type {
  IAuditCommit,
  IChangedFile,
  IDocstringResult,
  IEnrichedIssue,
  IGeneratedTest,
  IValidationIssue,
} from '../types'
import { parseDiff } from '../lib/parse-diff.utils'
import { getAuditById, updateAuditStatus } from '../queries/audit.queries'
import { enrichIssues } from '../services/enrich-issues.service'
import { generateDocstrings } from '../services/docstring-generation.service'
import { generatePrDescription } from '../services/generation.service'
import { generateTestsForAudit } from '../services/test-generation.service'
import { validateGitDiff } from '../services/validation.service'
import { postAuditStatus, postPrComments } from './workflow-steps.utils'

/** Extrae owner y repo de una URL de GitHub */
function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new NonRetriableError(`URL de repo inválida: ${repoUrl}`)
  return { owner: match[1] ?? '', repo: (match[2] ?? '').replace(/\.git$/, '') }
}

/**
 * Workflow principal para procesar una auditoría.
 * Valida, genera contenido, comenta en PR y publica status check.
 */
export const processAudit = inngest.createFunction(
  {
    id: 'process-audit',
    name: 'Process Audit',
    retries: 3,
    triggers: [{ event: 'audit/created' }],
    onFailure: async ({ event, error }) => {
      const originalData = event.data as unknown as { auditId?: string }
      const auditId = originalData.auditId
      if (!auditId) return

      const errorMessage = typeof error === 'string' ? error : error.message
      const isBlocked = errorMessage.includes('críticos') || errorMessage.includes('critical')
      const status = isBlocked ? 'blocked' : 'failed'

      await updateAuditStatus(auditId, status, { errorMessage })
    },
  },
  async ({ event, step }) => {
    const auditId = event.data.auditId as string

    // Paso 1: Validación de seguridad
    const validationResult = await step.run('validate-security', async () => {
      await updateAuditStatus(auditId, 'validating')
      const auditRecord = await getAuditById(auditId)
      if (!auditRecord?.gitDiff) {
        throw new NonRetriableError('No se encontró git diff para la auditoría')
      }
      return validateGitDiff(auditRecord.gitDiff)
    })

    // Paso 2: Parsear diff, obtener commits y enriquecer issues
    // Se ejecuta siempre, incluso con issues críticos, para poder comentar en el PR
    await step.run('parse-diff-and-commits', async () => {
      await updateAuditStatus(auditId, 'processing')
      const auditRecord = await getAuditById(auditId)
      if (!auditRecord?.gitDiff) throw new NonRetriableError('No se encontró git diff')

      const changedFiles = parseDiff(auditRecord.gitDiff)
      if (changedFiles.length === 0) {
        throw new NonRetriableError('El diff no contiene cambios parseables')
      }

      const { owner, repo } = parseRepoUrl(auditRecord.repoUrl)
      let commits: IAuditCommit[] = []
      try {
        const fetched = await fetchCommits(owner, repo, auditRecord.targetBranch, auditRecord.branchName)
        commits = Array.isArray(fetched) ? fetched : []
      } catch (err) {
        console.error(`[audit:${auditId}] Error obteniendo commits:`, err)
      }

      const commitShas = commits.map((c: IAuditCommit) => c.sha)
      const issues = enrichIssues(validationResult.issues, changedFiles, commitShas)
      await updateAuditStatus(auditId, 'processing', { changedFiles, commits, issues })
    })

    // Determinar si hay issues críticos para condicionar steps posteriores
    const isBlocked = validationResult.issues.some((v: IValidationIssue) => v.severity === 'critical')

    // Paso 3: Generación de contenido (solo si no hay issues críticos)
    let content = null
    if (!isBlocked) {
      content = await step.run('generate-content', async () => {
        await updateAuditStatus(auditId, 'generating')
        const auditRecord = await getAuditById(auditId)
        if (!auditRecord?.gitDiff) throw new NonRetriableError('No se encontró git diff')
        return generatePrDescription(auditRecord.gitDiff, validationResult)
      })
    }

    // Paso 4: Generación de docstrings para funciones sin documentar (opcional, solo si no hay críticos)
    let docstringResults: IDocstringResult[] = []
    if (!isBlocked) {
      docstringResults = await step.run('generate-docstrings', async () => {
        const auditRecord = await getAuditById(auditId)
        if (!auditRecord) return []

        const files = (auditRecord.changedFiles ?? []) as IChangedFile[]
        const supportedFiles = files.filter(
          f => f.language === 'TypeScript' || f.language === 'JavaScript' || f.language === 'ts' || f.language === 'js'
        )

        // Procesar archivos en paralelo con límite de concurrencia
        const allDocstrings = await Promise.all(supportedFiles.map(f => generateDocstrings(f)))
        const flattened = allDocstrings.flat()

        if (flattened.length > 0) {
          await updateAuditStatus(auditId, 'generating', { docstrings: flattened })
        }

        return flattened
      })
    }

    // Paso 5: Generación de tests unitarios (opcional, solo si no hay críticos)
    let generatedTests: IGeneratedTest[] = []
    if (!isBlocked) {
      generatedTests = await step.run('generate-tests', async () => {
        const auditRecord = await getAuditById(auditId)
        if (!auditRecord) return []

        const files = (auditRecord.changedFiles ?? []) as IChangedFile[]
        const tests = await generateTestsForAudit(files, validationResult.issues)

        if (tests.length > 0) {
          await updateAuditStatus(auditId, 'generating', { generatedTests: tests })
        }

        return tests
      })
    }

    // Paso 6: Publicar comentarios en el PR (inline + resumen)
    await step.run('post-pr-comments', async () => {
      const auditRecord = await getAuditById(auditId)
      if (!auditRecord) return

      const issues = (auditRecord.issues ?? []) as IEnrichedIssue[]
      if (issues.length === 0) return

      const { owner, repo } = parseRepoUrl(auditRecord.repoUrl)
      const commits = (auditRecord.commits ?? []) as IAuditCommit[]
      const commitSha = commits[0]?.sha ?? ''

      await postPrComments({
        owner,
        repo,
        prUrl: auditRecord.prUrl,
        issues,
        commitSha,
        summary: auditRecord.generatedContent?.summary ?? undefined,
      })
    })

    // Paso 7: Status check en el commit (bloquea merge si hay críticos)
    await step.run('post-status-check', async () => {
      const auditRecord = await getAuditById(auditId)
      if (!auditRecord) return

      const issues = (auditRecord.issues ?? []) as IEnrichedIssue[]
      const { owner, repo } = parseRepoUrl(auditRecord.repoUrl)
      const commits = (auditRecord.commits ?? []) as IAuditCommit[]
      const commitSha = commits[0]?.sha ?? ''
      if (!commitSha) return

      await postAuditStatus({ owner, repo, commitSha, issues })
    })

    // Estado final: blocked si hay críticos, completed si todo OK
    if (isBlocked) {
      await updateAuditStatus(auditId, 'blocked', { validationResult })
      return { success: false, message: 'Auditoría bloqueada por issues críticos.' }
    }

    await updateAuditStatus(auditId, 'completed', {
      generatedContent: content ?? undefined,
      docstrings: docstringResults,
      generatedTests: generatedTests.length > 0 ? generatedTests : undefined,
      validationResult,
    })
    return { success: true, prUrl: null, prNumber: null, message: 'Auditoría completada.' }
  }
)
