/**
 * Hook para obtener contenido de archivos vía Server Action.
 * Reemplaza la llamada fetch al endpoint HTTP por una llamada directa,
 * eliminando la capa de red y simplificando el manejo de errores.
 */
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

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

/** Estado inicial por defecto (sin datos, no cargando) */
const INITIAL_STATE: IFileContentResult = {
  originalContent: null,
  modifiedContent: null,
  language: '',
  isLoading: false,
  error: null,
}

/** Estado de carga (sin datos, cargando) */
const LOADING_STATE: IFileContentResult = {
  originalContent: null,
  modifiedContent: null,
  language: '',
  isLoading: true,
  error: null,
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
  const prevKeyRef = useRef(key)
  const inFlightRef = useRef(false)

  // Inicializar desde caché si existe, sino estado de carga
  const cached = cache.get(key)
  const [result, setResult] = useState<IFileContentResult>(cached ?? (filePath ? LOADING_STATE : INITIAL_STATE))

  const fetchContent = useCallback(async () => {
    if (!filePath) return
    if (inFlightRef.current) return

    // Retornar desde caché si ya existe
    if (cache.has(key)) {
      setResult(cache.get(key)!)
      return
    }

    inFlightRef.current = true
    setResult(LOADING_STATE)

    try {
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
    } catch {
      setResult({
        originalContent: null,
        modifiedContent: null,
        language: '',
        isLoading: false,
        error: 'Error inesperado al cargar el archivo',
      })
    } finally {
      inFlightRef.current = false
    }
  }, [auditId, filePath, key])

  // Efecto para detectar cambios de archivo y disparar fetch
  useEffect(() => {
    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key
      inFlightRef.current = false
    }

    const cachedResult = cache.get(key)
    if (cachedResult) {
      setResult(cachedResult)
      return
    }

    void fetchContent()
  }, [key, fetchContent])

  return result
}
