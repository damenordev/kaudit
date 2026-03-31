/**
 * Utilidad para dividir diffs grandes en chunks que procesar por separado.
 * Evita omitir archivos: cada chunk contiene archivos completos.
 */
import { getMaxDiffInputTokens } from '@/core/config/ai.config'

import { estimateTokenCount, splitDiffByFile, truncateDiffForModel } from './truncate-diff.utils'

/**
 * Divide un git diff en chunks que caben dentro del presupuesto de tokens.
 * Cada chunk contiene archivos completos (nunca corta un archivo a la mitad).
 * Si un archivo individual excede el presupuesto, se trunca como fallback.
 */
export function chunkDiffForModel(diff: string): string[] {
  const budget = getMaxDiffInputTokens()
  const totalTokens = estimateTokenCount(diff)

  // Si el diff completo cabe, un solo chunk
  if (totalTokens <= budget) return [diff]

  const files = splitDiffByFile(diff)
  const chunks: string[] = []
  let currentChunk = ''
  let currentTokens = 0

  for (const fileBlock of files) {
    const fileTokens = estimateTokenCount(fileBlock)

    // Si el archivo actual cabe en el chunk actual, agregarlo
    if (currentTokens + fileTokens <= budget && currentChunk.length > 0) {
      currentChunk += fileBlock
      currentTokens += fileTokens
      continue
    }

    // Guardar chunk anterior si existe
    if (currentChunk.length > 0) chunks.push(currentChunk)

    // Si el archivo individual excede el presupuesto, truncarlo como fallback
    if (fileTokens > budget) {
      console.warn(
        `[ChunkDiff] Archivo individual de ~${fileTokens} tokens excede presupuesto. Truncando como fallback.`
      )
      chunks.push(truncateDiffForModel(fileBlock, budget))
      currentChunk = ''
      currentTokens = 0
      continue
    }

    // Iniciar nuevo chunk con este archivo
    currentChunk = fileBlock
    currentTokens = fileTokens
  }

  // Agregar último chunk si quedó pendiente
  if (currentChunk.length > 0) chunks.push(currentChunk)

  console.log(
    `[ChunkDiff] Diff de ~${totalTokens} tokens dividido en ${chunks.length} chunks (${files.length} archivos totales)`
  )

  return chunks
}
