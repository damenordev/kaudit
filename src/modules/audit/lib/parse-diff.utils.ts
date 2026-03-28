/**
 * Utilidades para parsear diffs de Git.
 * Convierte el output de diff unificado a estructuras tipadas.
 */
import { parsePatch } from 'diff'
import type { StructuredPatchHunk } from 'diff'
import type { IChangedFile, IHunk, ILineChange, TFileStatus, TLineChangeType } from '../types'
import { detectLanguage } from './language-detection.utils'

/** Detecta el estado del archivo basado en el header del diff */
function detectStatusFromHeader(header: string): TFileStatus {
  if (header.includes('new file')) return 'added'
  if (header.includes('deleted')) return 'deleted'
  if (header.includes('rename')) return 'renamed'
  return 'modified'
}

/** Extrae la ruta del archivo desde el header del diff */
function extractFilePath(header: string): string {
  // Formato: a/path/to/file b/path/to/file
  const match = /b\/(.+?)(?:\s|$)/.exec(header)
  return match?.[1] ?? ''
}

/** Procesa un hunk del diff y retorna la estructura tipada */
function processHunk(hunk: StructuredPatchHunk): IHunk {
  const changes: ILineChange[] = []
  let currentOldLine = hunk.oldStart
  let currentNewLine = hunk.newStart

  for (const line of hunk.lines) {
    // Ignorar líneas de header del hunk (@@ -1,3 +1,4 @@)
    if (line.startsWith('@@')) continue

    const type: TLineChangeType = line.startsWith('+') ? 'add' : line.startsWith('-') ? 'del' : 'normal'

    const change: ILineChange = {
      type,
      content: line.substring(1),
    }

    if (type !== 'add') {
      change.oldLineNumber = currentOldLine
      currentOldLine++
    }
    if (type !== 'del') {
      change.newLineNumber = currentNewLine
      currentNewLine++
    }

    changes.push(change)
  }

  // Construir contenido del hunk
  const hunkHeader = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`

  return {
    oldStart: hunk.oldStart,
    oldLines: hunk.oldLines,
    newStart: hunk.newStart,
    newLines: hunk.newLines,
    content: hunkHeader + '\n' + hunk.lines.join('\n'),
    changes,
  }
}

/**
 * Parsea un diff unificado y retorna los archivos modificados.
 * @param diffText - Texto del diff en formato unificado
 * @param commitSha - SHA del commit asociado
 * @returns Array de archivos modificados con sus cambios
 */
export function parseDiff(diffText: string, commitSha: string): IChangedFile[] {
  // Manejar diff vacío
  if (!diffText?.trim()) return []

  // Detectar archivos binarios
  if (diffText.includes('Binary file')) return []

  const changedFiles: IChangedFile[] = []
  const fileDiffs = diffText.split(/^diff --git /m).filter(Boolean)

  for (const fileDiff of fileDiffs) {
    const headerMatch = /^(.+?)(?=@@)/s.exec(fileDiff)
    if (!headerMatch) continue

    const header = headerMatch[1] ?? ''
    const path = extractFilePath(header)
    if (!path) continue

    const status = detectStatusFromHeader(header)
    const language = detectLanguage(path)

    // Parsear hunks usando la librería diff
    const parsed = parsePatch('diff --git ' + fileDiff)
    const hunks: IHunk[] = []
    let additions = 0
    let deletions = 0

    for (const part of parsed) {
      for (const hunk of part.hunks ?? []) {
        const processedHunk = processHunk(hunk)
        hunks.push(processedHunk)

        // Contar adiciones y eliminaciones
        for (const change of processedHunk.changes) {
          if (change.type === 'add') additions++
          if (change.type === 'del') deletions++
        }
      }
    }

    changedFiles.push({
      path,
      language,
      additions,
      deletions,
      status,
      diff: fileDiff,
      hunks,
      issueCount: 0,
      commitSha,
    })
  }

  return changedFiles
}
