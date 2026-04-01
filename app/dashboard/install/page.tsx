/**
 * Página de instalación de la GitHub App — Diseño Limpio y Elegante (Vercel-like).
 */
import type { Metadata } from 'next'
import { Github, ShieldCheck, MessageSquareText, FolderGit2 } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { InstallSuccess } from './install-success'

const GITHUB_APP_INSTALL_URL = 'https://github.com/apps/kaudit-app/installations/new'

interface IFeatureItem {
  icon: React.ReactNode
  title: string
  description: string
}

export const metadata: Metadata = {
  title: 'Instalar KAudit — GitHub App',
  description: 'Instala la GitHub App de KAudit y audita tus Pull Requests.',
}

const FEATURES: IFeatureItem[] = [
  {
    icon: <ShieldCheck className="size-5 text-primary" />,
    title: 'Auditorías automáticas',
    description: 'Análisis de vulnerabilidades, malas prácticas y code smells en cada PR.',
  },
  {
    icon: <MessageSquareText className="size-5 text-primary" />,
    title: 'Revisiones con IA',
    description: 'Comentarios detallados directamente en GitHub con sugerencias accionables.',
  },
  {
    icon: <FolderGit2 className="size-5 text-primary" />,
    title: 'Zero config',
    description: 'Instala una vez y audita cualquier repositorio de tu organización.',
  },
]

function InstallPrompt() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center space-y-6 pt-10 pb-8">
        <div className="p-3 bg-muted/30 rounded-2xl border border-border/40 shadow-xs">
          <Github className="size-8 text-foreground/80" />
        </div>
        
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Conecta KAudit con GitHub
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Mejora tu flujo de trabajo de desarrollo con auditorías de código inteligentes. 
            Permite que nuestra IA revise tus Pull Requests automáticamente y garantice la máxima calidad de tu código.
          </p>
        </div>
        
        <div className="pt-4">
          <Button asChild size="lg" className="h-11 px-8 rounded-full font-medium shadow-sm transition-transform active:scale-95">
            <a href={GITHUB_APP_INSTALL_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Github className="size-4" />
              Instalar GitHub App
            </a>
          </Button>
          <p className="text-[13px] text-muted-foreground mt-4 font-medium">
            Serás redirigido a GitHub de forma segura.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 pt-8 border-t border-border/30">
        {FEATURES.map(feature => (
          <div key={feature.title} className="flex flex-col gap-3 p-5 rounded-2xl border border-border/30 bg-muted/10">
            <div className="size-10 rounded-xl bg-background border border-border/40 flex items-center justify-center shadow-xs">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-[13px] leading-relaxed mt-1.5">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface IInstallPageProps {
  searchParams: Promise<{ installed?: string }>
}

export default async function InstallPage({ searchParams }: IInstallPageProps) {
  const params = await searchParams
  const isInstalled = params.installed === 'true'

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6">
      <div className="w-full">
        {isInstalled ? <InstallSuccess /> : <InstallPrompt />}
      </div>
    </div>
  )
}
