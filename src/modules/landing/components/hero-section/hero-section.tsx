import { ShuffleText } from '../shuffle-text'

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
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div className="relative z-20 w-full px-8 md:px-16 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="w-full md:w-3/4">
            <ShuffleText as="h3" text="Un breve viaje a" className="text-primary font-mono text-2xl mb-2" />
            <ShuffleText
              as="h1"
              text="La Fusión de IA y Auditoría"
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9]"
            />
          </div>
          <div className="hidden md:block">
            <div className="w-24 lg:w-32">
              <img src="/logo.png" alt="Logo" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
