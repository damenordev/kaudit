/**
 * Utilidades para generar diagramas Mermaid válidos.
 * Funciones puras sin dependencias externas.
 */
import type { IChangedFile } from '../types/diff.types'
import type { IAuditCommit } from '../types/commit.types'
import type { IEnrichedIssue } from '../types/issue.types'

const MERMAID_SPECIAL_CHARS = /["\[\](){}<>#]/g

function escapeMermaid(text: string): string {
  return text.replace(MERMAID_SPECIAL_CHARS, '').replace(/\n/g, ' ').trim()
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 3)}...`
}

function getFileName(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1] || path
}

function getParentDir(path: string): string {
  const parts = path.split('/')
  return parts.length <= 1 ? 'root' : parts.slice(0, -1).join('/')
}

function getStatusEmoji(status: string): string {
  const map: Record<string, string> = { added: '➕', modified: '📝', deleted: '❌', renamed: '🔀' }
  return map[status] || '📄'
}

function generateNodeId(path: string, idx: number): string {
  return `file_${idx}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`.slice(0, 50)
}

/** Genera un diagrama `graph TD` con nodos por archivo */
export function generateFileDiagram(files: IChangedFile[], _issues?: IEnrichedIssue[]): string {
  if (!files.length) return 'graph TD\n  empty["No hay archivos para mostrar"]'

  const lines: string[] = ['graph TD']
  const dirs = new Set<string>()
  files.forEach(f => dirs.add(getParentDir(f.path)))

  const dirArray = Array.from(dirs)
  dirArray.forEach((dir, dirIdx) => {
    const dirId = `dir_${dirIdx}`
    const dirLabel = escapeMermaid(dir)
    const filesInDir = files.filter(f => getParentDir(f.path) === dir)

    const nodes = filesInDir
      .map((f, i) => {
        const id = generateNodeId(f.path, dirIdx * 100 + i)
        const emoji = getStatusEmoji(f.status)
        const name = truncate(escapeMermaid(getFileName(f.path)), 30)
        return `    ${id}["${emoji} ${name}<br/>+${f.additions}/-${f.deletions}"]`
      })
      .join('\n')

    if (dirArray.length > 1) {
      lines.push(`  subgraph ${dirId} ["📁 ${dirLabel}"]`, nodes, '  end')
    } else {
      lines.push(nodes)
    }
  })

  files.forEach((f, i) => {
    const next = files[i + 1]
    if (next && getParentDir(f.path) === getParentDir(next.path)) {
      lines.push(`  ${generateNodeId(f.path, i)} -.-> ${generateNodeId(next.path, i + 1)}`)
    }
  })

  return lines.join('\n')
}

/** Genera un diagrama `gitGraph` con la secuencia de commits */
export function generateCommitFlowDiagram(commits: IAuditCommit[]): string {
  if (!commits.length) return 'gitGraph\n  commit id: "No hay commits"'

  const lines = ['gitGraph']
  commits.forEach(c => {
    lines.push(`  commit id: "${c.sha.slice(0, 7)}" tag: "${truncate(escapeMermaid(c.author.name), 20)}"`)
  })
  return lines.join('\n')
}

/** Genera un diagrama `sequenceDiagram` con detalle de autores y fechas */
export function generateCommitSequenceDiagram(commits: IAuditCommit[]): string {
  if (!commits.length) return 'sequenceDiagram\n  participant Repo\n  Repo->>Repo: Sin commits'

  const lines = ['sequenceDiagram']
  const authors = new Set(commits.map(c => c.author.name))

  lines.push('  participant Repo as 📦 Repository')
  authors.forEach(a => {
    const id = escapeMermaid(a).replace(/\s+/g, '_')
    lines.push(`  participant ${id} as ${truncate(escapeMermaid(a), 15)}`)
  })

  commits.forEach(c => {
    const authorId = escapeMermaid(c.author.name).replace(/\s+/g, '_')
    const sha = c.sha.slice(0, 7)
    const msg = truncate(escapeMermaid(c.message), 35)
    const date = new Date(c.date).toLocaleDateString('es-ES')
    lines.push(`  ${authorId}->>Repo: ${sha}`, `  Note right of Repo: ${msg}<br/>${date}`)
  })

  return lines.join('\n')
}

/** @deprecated Usar generateFileDiagram */
export const generateArchitectureDiagram = generateFileDiagram
