/**
 * Hook para obtener el contenido de un archivo desde la API.
 */
import { useCallback, useState } from 'react'

import type { IFileContent } from './file-content.types'

export function useFileContent(auditId: string, filePath: string) {
  const [content, setContent] = useState<IFileContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const encodedPath = encodeURIComponent(filePath)
  const fetchContent = useCallback(async () => {
    if (!filePath) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/audit/${auditId}/files/${encodedPath}?content=true`)
      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`)
      }
      const data: IFileContent = await response.json()
      setContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar archivo')
    } finally {
      setIsLoading(false)
    }
  }, [auditId, encodedPath])

  return { content, isLoading, error, fetchContent }
}
