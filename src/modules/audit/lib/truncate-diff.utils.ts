/**
 * Utilidad para truncar git diffs grandes y evitar exceder
 * el límite de contexto del modelo de IA.
 *
 * Estrategia de truncamiento:
 * 1. Estimar tokens del diff completo
 * 2. Si excede el presupuesto, dividir por archivos (bloques diff)
 * 3. Mantener todos los headers de archivo (nombres, modo)
 * 4. Truncar hunks de cada archivo desde el final
 */
import { getMaxDiffInputTokens, MODEL_CONTEXT_LIMITS } from '@/core/config/ai.config'

/**
 * Ratio conservador: ~3 caracteres por token.
 * Usar 4 subestima tokens (código tiende a 2-3 chars/token),
 * lo que causa que NO se trunque cuando debería.
 */
const CHARS_PER_TOKEN = 3

/**
 * Estima la cantidad de tokens de un texto.
 * Usa ratio conservador de ~3 chars/token para evitar subestimar.
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

/**
 * Divide un git diff en bloques por archivo.
 * Cada bloque comienza con "diff --git" y contiene todo su contenido.
 */
export function splitDiffByFile(diff: string): string[] {
  const blocks = diff.split(/(?=^diff --git )/m)
  return blocks.filter(block => block.trim().length > 0)
}

/**
 * Reconstruye un diff a partir de bloques truncando hunks
 * de los últimos archivos hasta caber en el presupuesto de tokens.
 *
 * @param diff - El git diff completo
 * @param maxTokens - Máximo de tokens permitidos para el diff (overrides scaleFactor)
 * @param scaleFactor - Multiplicador del presupuesto de tokens (0.0-1.0). Default: 1.0
 * @returns El diff truncado con nota informativa si fue necesario
 */
export function truncateDiffForModel(diff: string, maxTokens?: number, scaleFactor: number = 1.0): string {
  const baseBudget = maxTokens ?? getMaxDiffInputTokens()
  const budget = Math.floor(baseBudget * scaleFactor)
  const estimatedTokens = estimateTokenCount(diff)

  // Si cabe completo, devolver sin cambios
  if (estimatedTokens <= budget) {
    return diff
  }

  console.warn(
    `[TruncateDiff] Diff de ~${estimatedTokens} tokens excede presupuesto de ${budget}. ` +
      'Truncando manteniendo headers de archivos.'
  )

  // Separar en bloques por archivo para truncado inteligente
  const fileBlocks = splitDiffByFile(diff)
  const resultBlocks: string[] = []
  let usedTokens = 0
  const headerOverhead = MODEL_CONTEXT_LIMITS.reservedPromptTokens

  for (const block of fileBlocks) {
    const blockTokens = estimateTokenCount(block)

    // Si el bloque completo cabe, incluirlo entero
    if (usedTokens + blockTokens + headerOverhead <= budget) {
      resultBlocks.push(block)
      usedTokens += blockTokens
      continue
    }

    // Si no cabe completo, intentar incluir un truncado del archivo
    const remainingTokens = budget - usedTokens - headerOverhead
    if (remainingTokens < 200) break

    // Mantener header del archivo + primeras líneas del hunk
    const truncatedBlock = truncateBlock(block, remainingTokens)
    if (truncatedBlock) {
      resultBlocks.push(truncatedBlock.block)
      usedTokens += truncatedBlock.tokens
    }

    // Una vez truncamos un archivo, no seguimos con más
    break
  }

  const truncatedDiff = resultBlocks.join('')
  const finalTokens = estimateTokenCount(truncatedDiff)

  console.warn(
    `[TruncateDiff] Truncado completado: ${fileBlocks.length} archivos → ` +
      `${resultBlocks.length} incluidos, ~${finalTokens} tokens. ` +
      `${fileBlocks.length - resultBlocks.length} archivos omitidos.`
  )

  return truncatedDiff + '\n\n// ... diff truncado: algunos archivos fueron omitidos por exceder el límite de contexto'
}

/**
 * Trunca un bloque de diff de archivo manteniendo el header
 * y las primeras líneas significativas del hunk.
 */
function truncateBlock(block: string, maxTokens: number): { block: string; tokens: number } | null {
  const lines = block.split('\n')
  const headerEndIdx = lines.findIndex(line => line.startsWith('@@'))

  // Si no hay hunks, es solo header
  if (headerEndIdx === -1) {
    const headerBlock = lines.join('\n')
    const headerTokens = estimateTokenCount(headerBlock)
    return headerTokens <= maxTokens ? { block: headerBlock, tokens: headerTokens } : null
  }

  // Construir resultado: header completo + primeras líneas del hunk
  const headerLines = lines.slice(0, headerEndIdx)
  const hunkLines = lines.slice(headerEndIdx)
  const resultLines: string[] = [...headerLines]
  let usedTokens = estimateTokenCount(resultLines.join('\n'))

  for (const line of hunkLines) {
    const lineTokens = estimateTokenCount(line + '\n')
    if (usedTokens + lineTokens > maxTokens) break
    resultLines.push(line)
    usedTokens += lineTokens
  }

  const result = resultLines.join('\n')
  return { block: result, tokens: estimateTokenCount(result) }
}
