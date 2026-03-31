/**
 * Utilidad para parsear un raw git diff (unified diff format)
 * y convertirlo en estructuras tipadas (IChangedFile[]).
 */
import { parsePatch } from 'diff'

import type { IChangedFile, IHunk, ILineChange, TFileStatus } from '../types/diff.types'

/** Mapea extensiones de archivo a lenguajes conocidos */
const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TypeScript',
  js: 'JavaScript',
  jsx: 'JavaScript',
  py: 'Python',
  rb: 'Ruby',
  go: 'Go',
  rs: 'Rust',
  java: 'Java',
  css: 'CSS',
  scss: 'SCSS',
  html: 'HTML',
  md: 'Markdown',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  sql: 'SQL',
  sh: 'Shell',
}

/** Detecta el lenguaje a partir de la ruta del archivo */
function detectLanguage(filePath: string): string {
  const fileName = filePath.split('/').pop() ?? ''
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  return EXTENSION_TO_LANGUAGE[ext] ?? 'Unknown'
}

/** Determina el status del archivo según los nombres old/new */
function resolveStatus(oldPath: string, newPath: string): TFileStatus {
  const isAdded = oldPath === '/dev/null' || oldPath === ''
  const isDeleted = newPath === '/dev/null' || newPath === ''
  const isRenamed = !isAdded && !isDeleted && oldPath !== newPath

  if (isAdded) return 'added'
  if (isDeleted) return 'deleted'
  if (isRenamed) return 'renamed'
  return 'modified'
}

/** Convierte las líneas crudas de un hunk en ILineChange[] */
function parseLines(rawLines: string[], oldStart: number, newStart: number): ILineChange[] {
  const changes: ILineChange[] = []
  let oldLine = oldStart
  let newLine = newStart

  for (const raw of rawLines) {
    const prefix = raw.charAt(0)
    const content = raw.slice(1)

    if (prefix === '+') {
      changes.push({ type: 'add', newLineNumber: newLine, content })
      newLine++
    } else if (prefix === '-') {
      changes.push({ type: 'del', oldLineNumber: oldLine, content })
      oldLine++
    } else {
      changes.push({ type: 'normal', oldLineNumber: oldLine, newLineNumber: newLine, content })
      oldLine++
      newLine++
    }
  }

  return changes
}

/**
 * Parsea un raw git diff string y devuelve un array de IChangedFile.
 * Soporta archivos binarios, renombrados y cambios de modo.
 */
export function parseDiff(diffString: string): IChangedFile[] {
  if (!diffString?.trim()) return []

  const patches = parsePatch(diffString)
  const changedFiles: IChangedFile[] = []

  for (const patch of patches) {
    const oldPath = (patch.oldFileName ?? '').replace(/^a\//, '')
    const newPath = (patch.newFileName ?? '').replace(/^b\//, '')
    const status = resolveStatus(oldPath, newPath)
    const filePath = status === 'deleted' ? oldPath : newPath
    const language = detectLanguage(filePath)

    let additions = 0
    let deletions = 0
    const hunks: IHunk[] = []

    for (const hunk of patch.hunks) {
      const changes = parseLines(hunk.lines, hunk.oldStart, hunk.newStart)
      const hunkAdd = changes.filter(c => c.type === 'add').length
      const hunkDel = changes.filter(c => c.type === 'del').length
      additions += hunkAdd
      deletions += hunkDel

      const header = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`
      hunks.push({
        oldStart: hunk.oldStart,
        oldLines: hunk.oldLines,
        newStart: hunk.newStart,
        newLines: hunk.newLines,
        content: [header, ...hunk.lines].join('\n'),
        changes,
      })
    }

    changedFiles.push({
      path: filePath,
      language,
      additions,
      deletions,
      status,
      diff: diffString,
      hunks,
      issueCount: 0,
      commitSha: '',
    })
  }

  return changedFiles
}
