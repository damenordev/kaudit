import { type Metadata } from 'next'

import { siteConfig } from './site.config'

const metadataDefaults = {
  keywords: ['next.js', 'react', 'typescript', 'tailwindcss', 'template'],
  openGraph: {
    locale: 'en_US',
    type: 'website' as const,
  },
  twitter: {
    card: 'summary_large_image' as const,
    creator: '@example',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export interface IMetadataOverrides {
  title?: string
  description?: string
  keywords?: string[]
  url?: string
  image?: string
  type?: 'website' | 'article' | 'book' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: Array<{ name: string; url?: string }>
  noindex?: boolean
  nofollow?: boolean
}

function getTitleString(title: Metadata['title']): string {
  if (typeof title === 'string') return title
  if (title && typeof title === 'object' && 'default' in title) return title.default
  return siteConfig.name
}

/**
 * Genera metadatos para Next.js con opción de sobrescribir valores específicos.
 *
 * @param {IMetadataOverrides} overrides - Valores opcionales para sobrescribir
 * @returns {Metadata} Metadatos configurados
 *
 * @example
 * ```tsx
 * // En app/layout.tsx (metadata base)
 * export const metadata = getMetadata()
 *
 * // En app/page.tsx (página específica)
 * export const metadata = getMetadata({
 *   title: 'Home',
 *   description: 'Welcome to our platform',
 * })
 * ```
 */
export function getMetadata(overrides?: IMetadataOverrides): Metadata {
  const url = overrides?.url ? new URL(overrides.url, siteConfig.url) : new URL(siteConfig.url)
  const title: Metadata['title'] = overrides?.title
    ? {
        default: overrides.title,
        template: `%s | ${siteConfig.name}`,
      }
    : {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
      }

  const description = overrides?.description ?? siteConfig.description ?? ''
  const titleString = getTitleString(title)

  const robots: Metadata['robots'] = {}
  if (overrides?.noindex !== undefined) {
    robots.index = overrides.noindex ? false : true
  }
  if (overrides?.nofollow !== undefined) {
    robots.follow = overrides.nofollow ? false : true
  }

  return {
    title,
    description,
    keywords: overrides?.keywords ?? metadataDefaults.keywords,
    authors: overrides?.authors ?? [{ name: siteConfig.name }],
    creator: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    ...(Object.keys(robots).length > 0 && { robots }),
    openGraph: {
      type: overrides?.type ?? metadataDefaults.openGraph.type,
      locale: metadataDefaults.openGraph.locale,
      url: url.toString(),
      title: titleString,
      description,
      siteName: siteConfig.name,
      ...(overrides?.publishedTime && { publishedTime: overrides.publishedTime }),
      ...(overrides?.modifiedTime && { modifiedTime: overrides.modifiedTime }),
      ...(overrides?.image && {
        images: [{ url: new URL(overrides.image, siteConfig.url).toString() }],
      }),
    },
    twitter: {
      card: metadataDefaults.twitter.card,
      title: titleString,
      description,
      creator: metadataDefaults.twitter.creator,
      ...(overrides?.image && {
        images: [new URL(overrides.image, siteConfig.url).toString()],
      }),
    },
    icons: metadataDefaults.icons,
    manifest: metadataDefaults.manifest,
  }
}
