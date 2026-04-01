/**
 * Componente de confirmación Premium mostrado tras una instalación exitosa de la GitHub App.
 */
import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/core/ui/button'

export function InstallSuccess() {
  return (
    <div className="w-full max-w-lg mx-auto p-10 rounded-3xl border border-border/40 bg-muted/10 shadow-xs text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 className="size-8 text-emerald-500" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          ¡Instalación completada!
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed px-2">
          KAudit ya está vigilando tus repositorios. Los próximos Pull Requests recibirán revisiones automáticas con IA.
        </p>
      </div>

      <div className="pt-2">
        <Button asChild size="lg" className="w-full h-12 rounded-xl text-base font-medium shadow-sm transition-transform active:scale-95 group/btn">
          <Link href="/dashboard" className="flex items-center justify-center gap-2">
            Ir al Dashboard
            <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

