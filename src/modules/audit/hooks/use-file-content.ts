/**
 * Hook para obtener contenido de archivos vía Server Action.
 * Reemplaza la llamada fetch al endpoint HTTP por una llamada directa,
 * eliminando la capa de red y simplificando el manejo de errores.
 */
'use client'

import { useCallback, useRef, useState } from 'react'

import { getFileContentAction } from '../actions/file-content.actions'
import type { IFileContentActionData } from '../actions/file-content.actions'

// Interfaz pública del hook (se mantiene igual para los consumidores)
export interface IFileContentResult {
  originalContent: string | null
  modifiedContent: string | null
  language: string
  isLoading: boolean
  error: string | null
}

// Caché en memoria para evitar llamadas repetidas al server action
const cache = new Map<string, IFileContentResult>()

function buildCacheKey(auditId: string, filePath: string): string {
  return `${auditId}::${filePath}`
}

/**
 * Mapea la respuesta exitosa del action al formato del hook.
 */
function mapActionDataToResult(data: IFileContentActionData): IFileContentResult {
  return {
    originalContent: data.originalContent,
    modifiedContent: data.modifiedContent,
    language: data.language,
    isLoading: false,
    error: null,
  }
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

    setResult({
      originalContent: null,
      modifiedContent: null,
      language: '',
      isLoading: true,
      error: null,
    })

    // Llamada directa al server action (sin HTTP)
    const actionResult = await getFileContentAction(auditId, filePath)

    if (actionResult.success) {
      const mapped = mapActionDataToResult(actionResult.data)
      cache.set(key, mapped)
      setResult(mapped)
    } else {
      setResult({
        originalContent: null,
        modifiedContent: null,
        language: '',
        isLoading: false,
        error: actionResult.error,
      })
    }
  }, [auditId, filePath, key])

  // Trigger fetch automático si no hay datos en caché ni en vuelo
  if (!cached.current && !result.isLoading && !result.error && !result.originalContent) {
    void fetchContent()
  }

  return result
}
