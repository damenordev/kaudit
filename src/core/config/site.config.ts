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
  name: 'Base Template',
  shortDescription: 'Next.js Template',
  description: 'A modern Next.js template with authentication, i18n, and more.',
  url: 'https://example.com',
  links: {
    github: 'https://github.com/example/base-template',
  },
}

export type TSiteConfig = typeof siteConfig
