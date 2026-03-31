/**
 * Gestor de configuración del CLI.
 * Lee y escribe ~/.kaudit/config.json para persistir credenciales y preferencias.
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

import type { IKauditConfig } from '../types/cli.types'

// Rutas del directorio y archivo de configuración
const CONFIG_DIR = join(homedir(), '.kaudit')
const CONFIG_FILE = join(CONFIG_DIR, 'config.json')

/**
 * Lee la configuración desde ~/.kaudit/config.json.
 * Retorna objeto vacío si no existe o hay error de parseo.
 */
export function readConfig(): IKauditConfig {
  if (!existsSync(CONFIG_FILE)) {
    return {}
  }

  try {
    const raw = readFileSync(CONFIG_FILE, 'utf-8')
    return JSON.parse(raw) as IKauditConfig
  } catch {
    return {}
  }
}

/**
 * Escribe la configuración en ~/.kaudit/config.json.
 * Crea el directorio si no existe.
 */
export function writeConfig(config: IKauditConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true })
  }

  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
}

/**
 * Obtiene la API key desde la configuración o variable de entorno.
 * Prioridad: config file > KAUDIT_API_KEY env var.
 */
export function getApiKey(): string | undefined {
  const config = readConfig()
  return config.apiKey || process.env.KAUDIT_API_KEY
}

/**
 * Verifica si el usuario está autenticado.
 * Requiere que exista una API key válida.
 */
export function isAuthenticated(): boolean {
  return !!getApiKey()
}

/**
 * Detecta si una URL apunta a un servidor local (desarrollo).
 * Retorna true para localhost, 127.0.0.1, ::1 o [::1].
 */
export function isLocalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]'
  } catch {
    // Si la URL no es válida, asumimos que no es local
    return false
  }
}

/**
 * Elimina el archivo de configuración (logout).
 */
export function clearConfig(): void {
  if (existsSync(CONFIG_FILE)) {
    unlinkSync(CONFIG_FILE)
  }
}
