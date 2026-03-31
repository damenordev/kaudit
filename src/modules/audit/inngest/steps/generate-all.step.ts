/**
 * Step 3 del workflow: generación paralela de contenido.
 * Ejecuta PR description, docstrings y tests con Promise.allSettled
 * para que un fallo no bloquee los demás.
 */
import type {
  IChangedFile,
  IDocstringResult,
  IGeneratedContent,
  IGeneratedTest,
  IValidationIssue,
  IValidationResult,
} from '../../types'
import { getAuditById, updateAuditStatus } from '../../queries/audit.queries'
import { generatePrDescription } from '../../services/generation.service'
import { generateDocstrings } from '../../services/docstring-generation.service'
import { generateTestsForAudit } from '../../services/test-generation.service'

/** Resultado del step de generación paralela */
export interface IGenerateAllResult {
  content: IGeneratedContent | null
  docstringResults: IDocstringResult[]
  generatedTests: IGeneratedTest[]
  prDescriptionFailed: boolean
}

/** Lenguajes soportados para docstrings */
const DOCSTRING_LANGUAGES = new Set(['TypeScript', 'JavaScript', 'ts', 'js'])

/** Opciones para omitir tareas de generación */
export interface IGenerateOptions {
  skipPRDescription?: boolean
  skipDocstrings?: boolean
  skipTests?: boolean
}

/**
 * Ejecuta las 3 generaciones en paralelo con Promise.allSettled.
 * Un fallo individual no bloquea los demás. PR description es esencial.
 */
export async function runGenerateAll(
  auditId: string,
  validationResult: IValidationResult,
  options?: IGenerateOptions
): Promise<IGenerateAllResult> {
  await updateAuditStatus(auditId, 'generating')
  const auditRecord = await getAuditById(auditId)
  if (!auditRecord?.gitDiff) throw new Error('No se encontró git diff')

  const files = (auditRecord.changedFiles ?? []) as IChangedFile[]
  const issues = (validationResult.issues ?? []) as IValidationIssue[]

  // Promise.allSettled: un fallo no bloquea los demás
  const [prResult, docResult, testResult] = await Promise.allSettled([
    options?.skipPRDescription ? Promise.resolve(null) : generatePrDescription(auditRecord.gitDiff, validationResult),
    options?.skipDocstrings ? Promise.resolve<IDocstringResult[]>([]) : runDocstringGeneration(files),
    options?.skipTests ? Promise.resolve<IGeneratedTest[]>([]) : generateTestsForAudit(files, issues),
  ])

  // Procesar resultado de PR description (esencial)
  let content: IGeneratedContent | null = null
  let prDescriptionFailed = false
  if (prResult.status === 'fulfilled') {
    content = prResult.value
  } else {
    prDescriptionFailed = true
    console.error(`[audit:${auditId}] PR description falló:`, prResult.reason)
  }

  // Docstrings: no crítico, loguear y continuar
  const docstringResults = docResult.status === 'fulfilled' ? docResult.value : []
  if (docResult.status === 'rejected') {
    console.error(`[audit:${auditId}] Docstrings falló (no crítico):`, docResult.reason)
  }

  // Tests: no crítico, loguear y continuar
  const generatedTests = testResult.status === 'fulfilled' ? testResult.value : []
  if (testResult.status === 'rejected') {
    console.error(`[audit:${auditId}] Tests falló (no crítico):`, testResult.reason)
  }

  return { content, docstringResults, generatedTests, prDescriptionFailed }
}

/** Genera docstrings para archivos TS/JS soportados */
async function runDocstringGeneration(files: IChangedFile[]): Promise<IDocstringResult[]> {
  const supportedFiles = files.filter(f => DOCSTRING_LANGUAGES.has(f.language))
  const allDocstrings = await Promise.all(supportedFiles.map(f => generateDocstrings(f)))
  return allDocstrings.flat()
}
