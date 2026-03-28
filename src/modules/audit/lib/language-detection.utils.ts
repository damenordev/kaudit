/**
 * Utilidades para detección de lenguajes basado en extensiones de archivo.
 * Mapea extensiones comunes a lenguajes soportados por Monaco Editor.
 */

/** Mapa de extensiones a lenguajes de Monaco Editor */
const LANGUAGE_MAP: Record<string, string> = {
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'scss',
  '.less': 'less',
  '.vue': 'vue',
  '.svelte': 'svelte',
  '.json': 'json',
  '.jsonc': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.xml': 'xml',
  '.py': 'python',
  '.rb': 'ruby',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.kt': 'kotlin',
  '.kts': 'kotlin',
  '.swift': 'swift',
  '.c': 'c',
  '.cpp': 'cpp',
  '.h': 'c',
  '.hpp': 'cpp',
  '.cs': 'csharp',
  '.php': 'php',
  '.sql': 'sql',
  '.sh': 'shell',
  '.bash': 'shell',
  '.ps1': 'powershell',
  '.md': 'markdown',
  '.dockerfile': 'dockerfile',
  '.graphql': 'graphql',
  '.gql': 'graphql',
}

/**
 * Detecta el lenguaje de programación basado en la extensión del archivo.
 */
export function detectLanguage(filePath: string): string {
  const fileName = filePath.toLowerCase()

  // Caso especial para Dockerfile (sin extensión)
  if (fileName.endsWith('dockerfile') || fileName === 'dockerfile') {
    return 'dockerfile'
  }

  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) return 'plaintext'

  const ext = fileName.substring(lastDotIndex)
  return LANGUAGE_MAP[ext] ?? 'plaintext'
}
