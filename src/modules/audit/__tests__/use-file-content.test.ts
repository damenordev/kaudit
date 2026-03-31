/**
 * Tests para el hook useFileContent.
 * Verifica fetch, cache y manejo de errores.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

import { useFileContent } from '../hooks/use-file-content'

const mockFetch = vi.fn()

describe('useFileContent', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('inicializa con estado de carga', () => {
    mockFetch.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useFileContent('audit-1', 'src/app.ts'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.originalContent).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('realiza fetch al endpoint correcto', async () => {
    const mockData = {
      originalContent: 'old code',
      modifiedContent: 'new code',
      language: 'TypeScript',
      isLoading: false,
      error: null,
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    renderHook(() => useFileContent('audit-123', 'src/app.ts'))

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/audit/audit-123/files/src%2Fapp.ts?content=true')
  })

  it('retorna contenido correctamente tras fetch exitoso', async () => {
    const mockData = {
      originalContent: 'old code',
      modifiedContent: 'new code',
      language: 'TypeScript',
      isLoading: false,
      error: null,
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const { result } = renderHook(() => useFileContent('audit-1', 'src/app.ts'))

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.originalContent).toBe('old code')
    expect(result.current.modifiedContent).toBe('new code')
    expect(result.current.language).toBe('TypeScript')
  })

  it('maneja errores de respuesta HTTP', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const { result } = renderHook(() => useFileContent('audit-1', 'src/app.ts'))

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toContain('404')
  })

  it('maneja errores de red', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useFileContent('audit-1', 'src/app.ts'))

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })

    expect(result.current.error).toBe('Network error')
  })

  it('codifica correctamente la ruta del archivo', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          originalContent: '',
          modifiedContent: '',
          language: '',
          isLoading: false,
          error: null,
        }),
    })

    renderHook(() => useFileContent('audit-1', 'src/path with spaces/file.ts'))

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/audit/audit-1/files/src%2Fpath%20with%20spaces%2Ffile.ts?content=true')
  })
})
