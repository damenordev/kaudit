/**
 * Servicio de generación de tests unitarios con IA.
 * Analiza archivos modificados y genera tests usando vitest.
 */
import 'server-only'

import { generateObject } from 'ai'

import { AI_CALL_TIMEOUT_MS, getLightModelInstance } from '@/core/config/ai.config'

import { truncateDiffForModel } from '../lib/truncate-diff.utils'
import { testGenerationPrompt, testGenerationSchema } from '../lib/prompts/test-generation.prompt'
import type { IChangedFile, IGeneratedTest, IValidationIssue } from '../types'

/**
 * Genera tests unitarios para un archivo modificado.
 * Usa el modelo de IA configurado para producir tests con vitest.
 * Trunca el diff del archivo si excede el contexto del modelo.
 *
 * @param file - Archivo modificado detectado en la auditoría
 * @param issues - Issues de validación asociados al archivo
 * @returns Test generado o null si el archivo no es testeable
 */
export async function generateTestsForFile(
  file: IChangedFile,
  issues: IValidationIssue[]
): Promise<IGeneratedTest | null> {
  // No generar tests para archivos eliminados o sin diff
  if (file.status === 'deleted' || !file.diff || file.diff.trim().length === 0) {
    return null
  }

  // No generar tests para archivos de configuración o estáticos
  const skipPatterns = ['.json', '.md', '.css', '.scss', '.png', '.svg', '.lock', '.env']
  if (skipPatterns.some(ext => file.path.endsWith(ext))) {
    return null
  }

  // Truncar diff del archivo si excede el presupuesto de tokens
  const safeDiff = truncateDiffForModel(file.diff)

  try {
    const result = await generateObject({
      model: getLightModelInstance(),
      schema: testGenerationSchema,
      prompt: testGenerationPrompt(
        file.path,
        safeDiff,
        file.language,
        issues.map(i => ({ type: i.type, severity: i.severity, message: i.message }))
      ),
      abortSignal: AbortSignal.timeout(AI_CALL_TIMEOUT_MS),
    })

    // Registrar uso de tokens
    console.log(`[TestGen] ${file.path} - Tokens: ${result.usage.totalTokens ?? 0}`)

    return {
      filePath: file.path,
      testFilePath: result.object.testFilePath,
      testCode: result.object.testCode,
      framework: result.object.framework,
      description: result.object.description,
    }
  } catch (error) {
    console.error(`[TestGen] Error generando tests para ${file.path}:`, error)
    return null
  }
}

/**
 * Genera tests unitarios para todos los archivos modificados en la auditoría.
 * Filtra archivos no testeables y maneja errores por archivo individual.
 *
 * @param files - Lista de archivos modificados
 * @param issues - Issues de validación detectados
 * @returns Lista de tests generados exitosamente
 */
export async function generateTestsForAudit(
  files: IChangedFile[],
  issues: IValidationIssue[]
): Promise<IGeneratedTest[]> {
  const results = await Promise.all(files.map(file => generateTestsForFile(file, issues)))

  // Filtrar nulls (archivos no testeables o con errores)
  return results.filter((test): test is IGeneratedTest => test !== null)
}
