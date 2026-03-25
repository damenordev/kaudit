/**
 * Configuración global del sitio web.
 * Contiene información básica sobre la aplicación, metadatos y enlaces
 * a redes sociales y recursos externos.
 *
 * @example
 * ```tsx
 * import { siteConfig } from '@/core/config/site.config'
 * <title>{siteConfig.name}</title>
 * <meta name="description" content={siteConfig.description} />
 * ```
 */
export const siteConfig = {
  name: 'KAudit',
  shortDescription: 'GitHub Auditor',
  description: 'Analiza y audita repositorios de GitHub con inteligencia artificial.',
  url: 'https://kaudit.dev',
}

export type TSiteConfig = typeof siteConfig
