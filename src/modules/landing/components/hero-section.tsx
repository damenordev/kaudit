import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/core/ui/button'
import { ShuffleText } from './shuffle-text'

export function HeroSection() {
  return (
    <section className="relative w-screen h-screen overflow-hidden flex items-end">
      <div className="absolute inset-0 z-0">
        <img src="/images/home/hero.jpeg" alt="Hero" className="w-full h-full object-cover" />
      </div>

      {/* Scanning Line Background Effects */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-30"
        style={{
          background:
            'linear-gradient(rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.075) 4px, transparent 4px, transparent 9px)',
          backgroundSize: '100% 9px',
          animation: 'pan-overlay 22s infinite linear',
        }}
      />
      <div className="absolute inset-0 z-10 pointer-events-none bg-linear-to-t from-black via-black/20 to-transparent" />

      <div className="relative z-20 w-full p-6 md:p-24">
        <div className="flex flex-col gap-3 max-w-4xl">
          <ShuffleText as="h3" text="Un breve viaje a" className="text-primary font-mono text-2xl " />
          <ShuffleText
            as="h1"
            text="La Fusión de IA y Auditoría"
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]"
          />
        </div>

        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-3000 fill-mode-forwards mt-8">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Comenzar Auditoría
              <ArrowRight />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/docs">
              <FileText />
              Documentación
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
