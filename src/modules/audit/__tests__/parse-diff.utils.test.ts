/**
 * Tests para la utilidad parseDiff.
 * Verifica el parseo de diffs unificados a estructuras tipadas.
 */
import { describe, expect, it } from 'vitest'

import { parseDiff } from '../lib/parse-diff.utils'

const SAMPLE_DIFF = [
  'diff --git a/src/app.ts b/src/app.ts',
  'index abc1234..def5678 100644',
  '--- a/src/app.ts',
  '+++ b/src/app.ts',
  '@@ -1,3 +1,5 @@',
  " import { serve } from 'http'",
  "+import { logger } from './logger'",
  '+',
  ' const port = 3000',
  '-serve(port)',
  "+serve(port, () => logger('ready'))",
].join('\n')

const NEW_FILE_DIFF = [
  'diff --git a/new-file.ts b/new-file.ts',
  'new file mode 100644',
  '--- /dev/null',
  '+++ b/new-file.ts',
  '@@ -0,0 +1,3 @@',
  '+export function hello() {',
  "+  return 'world'",
  '+}',
].join('\n')

const DELETED_FILE_DIFF = [
  'diff --git a/old-file.ts b/old-file.ts',
  'deleted file mode 100644',
  '--- a/old-file.ts',
  '+++ /dev/null',
  '@@ -1,2 +0,0 @@',
  '-export function old() {',
  "-  return 'deprecated' }",
].join('\n')

const RENAMED_DIFF = [
  'diff --git a/src/old-name.ts b/src/new-name.ts',
  'similarity index 95%',
  'rename from src/old-name.ts',
  'rename to src/new-name.ts',
  '--- a/src/old-name.ts',
  '+++ b/src/new-name.ts',
  '@@ -1,3 +1,3 @@',
  ' export const value = 1',
  '-const old = true',
  '+const updated = true',
].join('\n')

describe('parseDiff', () => {
  it('retorna array vacío para string vacío', () => {
    expect(parseDiff('')).toEqual([])
  })

  it('retorna array vacío para string con solo espacios', () => {
    expect(parseDiff('   ')).toEqual([])
  })

  it('retorna array vacío para null/undefined', () => {
    expect(parseDiff(null as unknown as string)).toEqual([])
    expect(parseDiff(undefined as unknown as string)).toEqual([])
  })

  it('parsea un diff con archivo modificado', () => {
    const result = parseDiff(SAMPLE_DIFF)

    expect(result).toHaveLength(1)
    const file = result[0]!

    expect(file.path).toBe('src/app.ts')
    expect(file.status).toBe('modified')
    expect(file.language).toBe('TypeScript')
    expect(file.additions).toBe(3)
    expect(file.deletions).toBe(1)
    expect(file.hunks).toHaveLength(1)
  })

  it('detecta el lenguaje correcto según la extensión', () => {
    const result = parseDiff(SAMPLE_DIFF)
    expect(result[0]?.language).toBe('TypeScript')
  })

  it('detecta archivos nuevos (added)', () => {
    const result = parseDiff(NEW_FILE_DIFF)

    expect(result).toHaveLength(1)
    expect(result[0]?.path).toBe('new-file.ts')
    expect(result[0]?.status).toBe('added')
  })

  it('detecta archivos eliminados (deleted)', () => {
    const result = parseDiff(DELETED_FILE_DIFF)

    expect(result).toHaveLength(1)
    expect(result[0]?.path).toBe('old-file.ts')
    expect(result[0]?.status).toBe('deleted')
  })

  it('detecta archivos renombrados (renamed)', () => {
    const result = parseDiff(RENAMED_DIFF)

    expect(result).toHaveLength(1)
    expect(result[0]?.status).toBe('renamed')
  })

  it('parsea hunks con líneas de cambio correctas', () => {
    const result = parseDiff(SAMPLE_DIFF)
    const hunk = result[0]?.hunks[0]

    expect(hunk).toBeDefined()
    expect(hunk!.changes.length).toBeGreaterThan(0)

    const addChanges = hunk!.changes.filter(c => c.type === 'add')
    const delChanges = hunk!.changes.filter(c => c.type === 'del')
    const normalChanges = hunk!.changes.filter(c => c.type === 'normal')

    expect(addChanges.length).toBe(3)
    expect(delChanges.length).toBe(1)
    expect(normalChanges.length).toBe(2)
  })

  it('asigna números de línea correctos a los cambios', () => {
    const result = parseDiff(SAMPLE_DIFF)
    const changes = result[0]?.hunks[0]?.changes ?? []

    const firstAdd = changes.find(c => c.type === 'add')
    const firstDel = changes.find(c => c.type === 'del')

    expect(firstAdd?.newLineNumber).toBeTypeOf('number')
    expect(firstDel?.oldLineNumber).toBeTypeOf('number')
  })

  it('parsea un diff con múltiples archivos', () => {
    const multiDiff = [SAMPLE_DIFF, NEW_FILE_DIFF].join('\n')
    const result = parseDiff(multiDiff)

    expect(result).toHaveLength(2)
  })

  it('incluye el header del hunk en el content', () => {
    const result = parseDiff(SAMPLE_DIFF)
    const hunk = result[0]?.hunks[0]

    expect(hunk?.content).toContain('@@')
  })

  it('detecta lenguajes conocidos por extensión', () => {
    const pyDiff = [
      'diff --git a/main.py b/main.py',
      '--- a/main.py',
      '+++ b/main.py',
      '@@ -1,1 +1,2 @@',
      ' import os',
      '+import sys',
    ].join('\n')
    const result = parseDiff(pyDiff)
    expect(result[0]?.language).toBe('Python')
  })

  it('retorna Unknown para extensiones desconocidas', () => {
    const unknownDiff = [
      'diff --git a/config.xyz b/config.xyz',
      '--- a/config.xyz',
      '+++ b/config.xyz',
      '@@ -1,1 +1,2 @@',
      ' hello',
      '+world',
    ].join('\n')
    const result = parseDiff(unknownDiff)
    expect(result[0]?.language).toBe('Unknown')
  })

  it('inicializa issueCount en 0 y commitSha vacío', () => {
    const result = parseDiff(SAMPLE_DIFF)
    const file = result[0]

    expect(file?.issueCount).toBe(0)
    expect(file?.commitSha).toBe('')
  })

  it('acumula additions y deletions de múltiples hunks', () => {
    const multiHunkDiff = [
      'diff --git a/app.ts b/app.ts',
      '--- a/app.ts',
      '+++ b/app.ts',
      '@@ -1,2 +1,3 @@',
      ' line1',
      '+added1',
      ' line2',
      '@@ -5,2 +6,3 @@',
      ' line5',
      '+added2',
      ' line6',
    ].join('\n')
    const result = parseDiff(multiHunkDiff)

    expect(result[0]?.additions).toBe(2)
    expect(result[0]?.hunks).toHaveLength(2)
  })
})
