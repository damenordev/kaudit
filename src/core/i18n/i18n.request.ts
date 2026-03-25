import fs from 'fs/promises'
import path from 'path'
import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

import { defaultLocale, locales, type TLocale } from './i18n.config'

type TMessages = Record<string, unknown>

const messagesCache = new Map<string, { messages: TMessages; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minuto en desarrollo

async function loadMessages(locale: TLocale): Promise<TMessages> {
  const cacheKey = locale
  const cached = messagesCache.get(cacheKey)
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.messages
  }

  const messages: TMessages = {}

  // Cargar mensajes globales
  const corePath = path.join(process.cwd(), 'src/core/locales', `${locale}.json`)
  try {
    const content = await fs.readFile(corePath, 'utf-8')
    Object.assign(messages, JSON.parse(content) as TMessages)
  } catch {
    // Archivo no existe, continuar
  }

  // Cargar mensajes de cada módulo
  const modulesPath = path.join(process.cwd(), 'src/modules')
  try {
    const modules = await fs.readdir(modulesPath, { withFileTypes: true })

    for (const dirent of modules) {
      if (!dirent.isDirectory()) continue

      const moduleName = dirent.name
      const moduleLocalePath = path.join(modulesPath, moduleName, 'locales', `${locale}.json`)

      try {
        const content = await fs.readFile(moduleLocalePath, 'utf-8')
        const moduleMessages = JSON.parse(content) as TMessages
        Object.assign(messages, moduleMessages)
      } catch {
        // Módulo sin traducciones, continuar
      }
    }
  } catch {
    // Directorio modules no existe, continuar
  }

  messagesCache.set(cacheKey, { messages, timestamp: now })
  return messages
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value
  const locale = locales.includes(cookieLocale as TLocale) ? (cookieLocale as TLocale) : defaultLocale

  const messages = await loadMessages(locale)

  return { locale, messages }
})
