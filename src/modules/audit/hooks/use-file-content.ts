'use client'

import { useCallback, useRef, useState } from 'react'

interface IFileContentResult {
  originalContent: string | null
  modifiedContent: string | null
  language: string
  isLoading: boolean
  error: string | null
}

const cache = new Map<string, IFileContentResult>()

function buildCacheKey(auditId: string, filePath: string): string {
  return `${auditId}::${filePath}`
}

export function useFileContent(auditId: string, filePath: string): IFileContentResult {
  const key = buildCacheKey(auditId, filePath)
  const cached = useRef(cache.get(key))

  const [result, setResult] = useState<IFileContentResult>(
    cached.current ?? {
      originalContent: null,
      modifiedContent: null,
      language: '',
      isLoading: !cached.current,
      error: null,
    }
  )

  const fetchContent = useCallback(async () => {
    if (cache.has(key)) {
      setResult(cache.get(key)!)
      return
    }

    const loadingState: IFileContentResult = {
      originalContent: null,
      modifiedContent: null,
      language: '',
      isLoading: true,
      error: null,
    }
    setResult(loadingState)

    try {
      const encodedPath = filePath.split('/').map(encodeURIComponent).join('/')
      const res = await fetch(`/api/audit/${auditId}/files/${encodedPath}?content=true`)

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data: IFileContentResult = await res.json()
      cache.set(key, data)
      setResult(data)
    } catch (err) {
      const errorResult: IFileContentResult = {
        originalContent: null,
        modifiedContent: null,
        language: '',
        isLoading: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
      }
      setResult(errorResult)
    }
  }, [auditId, filePath, key])

  if (!cached.current && !result.isLoading && !result.error && !result.originalContent) {
    void fetchContent()
  }

  return result
}
