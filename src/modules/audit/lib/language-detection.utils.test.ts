/**
 * Tests para la utilidad de detección de lenguajes.
 * Verifica el mapeo correcto de extensiones a lenguajes de Monaco Editor.
 */
import { describe, expect, it } from 'vitest'

import { detectLanguage } from './language-detection.utils'

describe('detectLanguage', () => {
  describe('Extensiones de JavaScript', () => {
    it('detecta .js como javascript', () => {
      expect(detectLanguage('file.js')).toBe('javascript')
    })

    it('detecta .jsx como javascript', () => {
      expect(detectLanguage('component.jsx')).toBe('javascript')
    })

    it('detecta .mjs como javascript', () => {
      expect(detectLanguage('module.mjs')).toBe('javascript')
    })

    it('detecta .cjs como javascript', () => {
      expect(detectLanguage('commonjs.cjs')).toBe('javascript')
    })
  })

  describe('Extensiones de TypeScript', () => {
    it('detecta .ts como typescript', () => {
      expect(detectLanguage('file.ts')).toBe('typescript')
    })

    it('detecta .tsx como typescript', () => {
      expect(detectLanguage('component.tsx')).toBe('typescript')
    })
  })

  describe('Archivos web', () => {
    it('detecta .html como html', () => {
      expect(detectLanguage('index.html')).toBe('html')
    })

    it('detecta .css como css', () => {
      expect(detectLanguage('styles.css')).toBe('css')
    })

    it('detecta .scss como scss', () => {
      expect(detectLanguage('styles.scss')).toBe('scss')
    })
  })

  describe('Archivos de datos', () => {
    it('detecta .json como json', () => {
      expect(detectLanguage('package.json')).toBe('json')
    })

    it('detecta .yaml como yaml', () => {
      expect(detectLanguage('config.yaml')).toBe('yaml')
    })

    it('detecta .yml como yaml', () => {
      expect(detectLanguage('docker-compose.yml')).toBe('yaml')
    })
  })

  describe('Lenguajes de programación', () => {
    it('detecta .py como python', () => {
      expect(detectLanguage('main.py')).toBe('python')
    })

    it('detecta .go como go', () => {
      expect(detectLanguage('main.go')).toBe('go')
    })

    it('detecta .rs como rust', () => {
      expect(detectLanguage('main.rs')).toBe('rust')
    })

    it('detecta .java como java', () => {
      expect(detectLanguage('Main.java')).toBe('java')
    })
  })

  describe('Scripts de shell', () => {
    it('detecta .sh como shell', () => {
      expect(detectLanguage('script.sh')).toBe('shell')
    })

    it('detecta .bash como shell', () => {
      expect(detectLanguage('script.bash')).toBe('shell')
    })
  })

  describe('Dockerfile', () => {
    it('detecta Dockerfile (sin extensión) como dockerfile', () => {
      expect(detectLanguage('Dockerfile')).toBe('dockerfile')
    })

    it('detecta archivos que terminan en dockerfile', () => {
      expect(detectLanguage('prod.dockerfile')).toBe('dockerfile')
    })

    it('detecta DOCKERFILE (mayúsculas) como dockerfile', () => {
      expect(detectLanguage('DOCKERFILE')).toBe('dockerfile')
    })
  })

  describe('Casos edge', () => {
    it('retorna plaintext para extensión desconocida', () => {
      expect(detectLanguage('file.xyz')).toBe('plaintext')
    })

    it('retorna plaintext para archivo sin extensión', () => {
      expect(detectLanguage('README')).toBe('plaintext')
    })

    it('funciona con rutas completas', () => {
      expect(detectLanguage('/path/to/file.ts')).toBe('typescript')
    })

    it('es case-insensitive', () => {
      expect(detectLanguage('FILE.TS')).toBe('typescript')
    })
  })
})
