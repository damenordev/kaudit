import { useRef } from 'react'
import { GeometricBackground } from '../geometric-background'
import { Marquee } from '../marquee'
import { useIntroSection } from './use-intro-section'

export function IntroSection() {
  const container = useRef<HTMLElement>(null)
  
  useIntroSection(container)

  return (
    <section className="intro relative bg-background overflow-x-hidden" id="intro" ref={container}>
      <div className="geo-bg absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2.5] z-0 opacity-25 pointer-events-none">
        <GeometricBackground />
      </div>
      <div className="relative z-10">
        <Marquee />
      </div>
      <div className="relative z-10 w-full pt-40 md:pt-80 pb-16">
        <div className="px-8 md:px-16 flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="w-full md:w-1/4">
            <p className="text-primary font-mono text-xl uppercase tracking-widest">[ Preparando la Escena ]</p>
          </div>
          <div className="w-full md:w-3/4">
            <div className="max-w-2xl mb-16 space-y-8">
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                KAudit ha revolucionado el potencial creativo de la IA, avanzando desde auditorías básicas hasta integraciones profundas de código. Explorando los límites de la seguridad del mañana.
              </p>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                Este progreso ha abierto las puertas a herramientas de revisión de código potentes para ingenieros de todos los niveles. A su vez, ha planteado debates sobre la calidad del código generado, los sesgos en PRs automatizadas y el futuro de la ingeniería.
              </p>
            </div>

            <div className="prompt-example space-y-8">
              <div className="prompt-example-header">
                <h4 className="text-primary font-mono text-xl md:text-2xl max-w-md">
                  // PROMPT: Crea un caso de prueba para la refactorización del módulo central de KAudit.
                </h4>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 group">
                  <div
                    className="relative aspect-square mb-4 overflow-hidden"
                    style={{ clipPath: 'polygon(0 0, 80% 0, 100% 20%, 100% 100%, 10% 100%, 0 90%)' }}
                  >
                    <img
                      src="/images/home/prompt-1.jpeg"
                      alt="Historical Result"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="prompt-example-result-item-title">
                    <h4 className="font-mono text-sm md:text-base uppercase">
                      2016 — Hecho con herramientas rudimentarias
                    </h4>
                  </div>
                </div>
                <div className="flex-1 group">
                  <div
                    className="relative aspect-square mb-4 overflow-hidden"
                    style={{ clipPath: 'polygon(0 0, 80% 0, 100% 20%, 100% 100%, 10% 100%, 0 90%)' }}
                  >
                    <img
                      src="/images/home/prompt-2.jpeg"
                      alt="Current Result"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="prompt-example-result-item-title">
                    <h4 className="font-mono text-sm md:text-base uppercase">2026 — Creado usando KAudit V1</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
