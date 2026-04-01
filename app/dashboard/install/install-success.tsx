/**
 * Componente de confirmación mostrado tras una instalación exitosa de la GitHub App.
 */
import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

import { Button } from '@/core/ui/button'

export function InstallSuccess() {
  return (
    <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <CheckCircle2 className="size-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">¡App instalada correctamente!</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          KAudit ya está activo en tu repositorio. Los próximos Pull Requests se auditarán automáticamente.
        </p>
      </div>
      <Button asChild size="lg" className="text-base px-8 h-12">
        <Link href="/dashboard">
          Ir al Dashboard
          <ArrowRight className="size-4 ml-2" />
        </Link>
      </Button>
    </div>
  )
}
