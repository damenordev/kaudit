/**
 * Página de instalación de la GitHub App dentro del dashboard.
 * Explica qué hace la app y ofrece un botón para instalarla.
 * Muestra confirmación cuando el usuario vuelve tras instalarla en GitHub.
 */
import type { Metadata } from 'next'
import { Github, ShieldCheck, MessageSquareText, FolderGit2 } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { Button } from '@/core/ui/button'
import { Card, CardContent } from '@/core/ui/card'

import { InstallSuccess } from './install-success'

/** URL de instalación de la GitHub App */
const GITHUB_APP_INSTALL_URL = 'https://github.com/apps/kaudit-app/installations/new'

/** Props de cada característica destacada */
interface IFeatureItem {
  icon: React.ReactNode
  title: string
  description: string
}

/** Props de la página con searchParams */
interface IInstallPageProps {
  searchParams: Promise<{ installed?: string }>
}

export const metadata: Metadata = {
  title: 'Instalar KAudit — GitHub App',
  description: 'Instala la GitHub App de KAudit y audita tus Pull Requests automáticamente con IA.',
}

/** Características de la GitHub App */
const FEATURES: IFeatureItem[] = [
  {
    icon: <ShieldCheck className="size-6" />,
    title: 'Auditorías automáticas',
    description: 'Cada PR se analiza en busca de vulnerabilidades, malas prácticas y code smells.',
  },
  {
    icon: <MessageSquareText className="size-6" />,
    title: 'Comentarios con IA',
    description: 'KAudit publica revisiones detalladas directamente en tu PR con sugerencias accionables.',
  },
  {
    icon: <FolderGit2 className="size-6" />,
    title: 'Funciona en cualquier repo',
    description: 'Instala la app en uno o varios repositorios. Sin configuración extra.',
  },
]

/** Etiqueta superior con ícono de GitHub */
function AppBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-mono uppercase tracking-widest text-primary">
      <Github className="size-3.5" />
      GitHub App
    </div>
  )
}

/** Sección de instalación con botón y descripción */
function InstallPrompt() {
  return (
    <>
      <div className="space-y-4">
        <AppBadge />
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
          Instala KAudit en tu repo
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
          Auditorías inteligentes de Pull Requests potenciadas por IA. Instala la app en segundos y mejora la calidad de
          tu código.
        </p>
      </div>
      <div>
        <Button asChild size="lg" className="text-base px-8 h-12">
          <a href={GITHUB_APP_INSTALL_URL} target="_blank" rel="noopener noreferrer">
            <Github className="size-5" />
            Instalar GitHub App
          </a>
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">Serás redirigido a GitHub para autorizar la instalación.</p>
      </div>
    </>
  )
}

/** Grid de tarjetas de características */
function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3 pt-4">
      {FEATURES.map(feature => (
        <Card
          key={feature.title}
          className={cn('bg-background border-border/60 text-left transition-colors', 'hover:border-primary/30')}
        >
          <CardContent className="space-y-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-sm">{feature.title}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function InstallPage({ searchParams }: IInstallPageProps) {
  const params = await searchParams
  const isInstalled = params.installed === 'true'

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center space-y-10">
        {isInstalled ? <InstallSuccess /> : <InstallPrompt />}
        <FeatureGrid />
      </div>
    </div>
  )
}
