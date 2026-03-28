/**
 * Tests para la utilidad de parseo de diffs.
 * Verifica la conversión de diffs unificados a estructuras tipadas.
 */
import { describe, expect, it } from 'vitest'

import { parseDiff } from './parse-diff.utils'

describe('parseDiff', () => {
  describe('Casos edge', () => {
    it('retorna array vacío para diff vacío', () => {
      expect(parseDiff('', 'abc123')).toEqual([])
    })

    it('retorna array vacío para string con solo espacios', () => {
      expect(parseDiff('   ', 'abc123')).toEqual([])
    })

    it('retorna array vacío para archivos binarios', () => {
      const binaryDiff = 'Binary file /dev/null and b/image.png differ'
      expect(parseDiff(binaryDiff, 'abc123')).toEqual([])
    })
  })

  describe('Archivo nuevo (added)', () => {
    it('parsea correctamente un archivo agregado', () => {
      const diff = `diff --git a/new-file.ts b/new-file.ts
new file mode 100644
index 0000000..abc1234
--- /dev/null
+++ b/new-file.ts
@@ -0,0 +1,3 @@
+const hello = 'world'
+console.log(hello)
+export { hello }`

      const result = parseDiff(diff, 'abc123')

      expect(result).toHaveLength(1)
      expect(result[0]?.path).toBe('new-file.ts')
      expect(result[0]?.status).toBe('added')
      expect(result[0]?.additions).toBe(3)
      expect(result[0]?.deletions).toBe(0)
    })
  })

  describe('Archivo eliminado (deleted)', () => {
    it('parsea correctamente un archivo eliminado', () => {
      const diff = `diff --git a/old-file.ts b/old-file.ts
deleted file mode 100644
index abc1234..0000000
--- a/old-file.ts
+++ /dev/null
@@ -1,2 +0,0 @@
-const old = 'code'
-console.log(old)`

      const result = parseDiff(diff, 'abc123')

      expect(result).toHaveLength(1)
      expect(result[0]?.path).toBe('old-file.ts')
      expect(result[0]?.status).toBe('deleted')
      expect(result[0]?.additions).toBe(0)
      expect(result[0]?.deletions).toBe(2)
    })
  })

  describe('Archivo modificado (modified)', () => {
    it('parsea correctamente un archivo modificado', () => {
      const diff = `diff --git a/src/index.ts b/src/index.ts
index abc1234..def5678 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,3 +1,3 @@
 const old = 'value'
-const removed = 'line'
+const added = 'line'
 const unchanged = 'same'`

      const result = parseDiff(diff, 'abc123')

      expect(result).toHaveLength(1)
      expect(result[0]?.path).toBe('src/index.ts')
      expect(result[0]?.status).toBe('modified')
      expect(result[0]?.additions).toBe(1)
      expect(result[0]?.deletions).toBe(1)
    })
  })

  describe('Archivo renombrado (renamed)', () => {
    it('parsea correctamente un archivo renombrado con cambios', () => {
      // Los renames puros (sin cambios de contenido) no generan hunks
      // Este test usa un rename con cambios de contenido
      const diff = `diff --git a/old-name.ts b/new-name.ts
similarity index 80%
rename from old-name.ts
rename to new-name.ts
--- a/old-name.ts
+++ b/new-name.ts
@@ -1,2 +1,2 @@
 const a = 1
-const old = 2
+const new = 2`

      const result = parseDiff(diff, 'abc123')

      expect(result).toHaveLength(1)
      expect(result[0]?.status).toBe('renamed')
      expect(result[0]?.path).toBe('new-name.ts')
    })
  })

  describe('Múltiples archivos', () => {
    it('parsea correctamente múltiples archivos en un diff', () => {
      const diff = `diff --git a/file1.ts b/file1.ts
index abc..def 100644
--- a/file1.ts
+++ b/file1.ts
@@ -1 +1 @@
-old
+new
diff --git a/file2.ts b/file2.ts
index ghi..jkl 100644
--- a/file2.ts
+++ b/file2.ts
@@ -1 +1 @@
-old2
+new2`

      const result = parseDiff(diff, 'abc123')

      expect(result).toHaveLength(2)
      expect(result[0]?.path).toBe('file1.ts')
      expect(result[1]?.path).toBe('file2.ts')
    })
  })

  describe('Parsing de hunks', () => {
    it('extrae correctamente los hunks con cambios', () => {
      const diff = `diff --git a/test.ts b/test.ts
--- a/test.ts
+++ b/test.ts
@@ -1,4 +1,5 @@
 line1
-removed line
+added line
+another added
 line3
 line4`

      const result = parseDiff(diff, 'abc123')

      expect(result).toHaveLength(1)
      expect(result[0]?.hunks).toHaveLength(1)

      const hunk = result[0]?.hunks[0]
      expect(hunk?.oldStart).toBe(1)
      expect(hunk?.oldLines).toBe(4)
      expect(hunk?.newStart).toBe(1)
      expect(hunk?.newLines).toBe(5)
    })

    it('identifica correctamente los tipos de cambios de línea', () => {
      const diff = `diff --git a/test.ts b/test.ts
--- a/test.ts
+++ b/test.ts
@@ -1,2 +1,2 @@
 normal line
-removed line
+added line`

      const result = parseDiff(diff, 'abc123')
      const changes = result[0]?.hunks[0]?.changes ?? []

      expect(changes[0]?.type).toBe('normal')
      expect(changes[1]?.type).toBe('del')
      expect(changes[2]?.type).toBe('add')
    })
  })
})
