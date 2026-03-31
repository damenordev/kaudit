import type { IChangedFile } from '../../types/diff.types'
import type { IEnrichedIssue } from '../../types/issue.types'

/** Agrupa archivos por su carpeta padre */
export function groupFilesByFolder(files: IChangedFile[]): Map<string, IChangedFile[]> {
  const groups = new Map<string, IChangedFile[]>()

  for (const file of files) {
    const parts = file.path.split('/')
    const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : '(raíz)'

    if (!groups.has(folder)) {
      groups.set(folder, [])
    }
    groups.get(folder)!.push(file)
  }

  return groups
}

/** Cuenta issues por archivo a partir de la lista de issues */
export function countIssuesByFile(issues: IEnrichedIssue[]): Map<string, number> {
  const counts = new Map<string, number>()

  for (const issue of issues) {
    const current = counts.get(issue.file) ?? 0
    counts.set(issue.file, current + 1)
  }

  return counts
}

/** Filtra archivos por término de búsqueda */
export function filterFiles(files: IChangedFile[], searchTerm: string): IChangedFile[] {
  if (!searchTerm.trim()) return files

  const term = searchTerm.toLowerCase()
  return files.filter(file => file.path.toLowerCase().includes(term))
}

/** Extrae el nombre del archivo de una ruta completa */
export function getFileName(filePath: string): string {
  const parts = filePath.split('/')
  return parts.at(-1) ?? filePath
}
