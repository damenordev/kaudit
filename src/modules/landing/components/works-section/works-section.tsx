import { ShuffleText } from '../shuffle-text'

export function WorksSection() {
  return (
    <>
      <section className="abstract-bg w-full bg-primary text-primary-foreground">
        {[200, 15, 15, 15, 15, 15, 15, 15].map((height, i) => {
          const margins = [5, 10, 20, 30, 50, 80, 120, 0]
          return (
            <div
              key={i}
              className="bg-background w-full"
              style={{ height: `${height}px`, marginBottom: `${margins[i]}px` }}
            />
          )
        })}
      </section>
      <section className="works relative z-10 bg-primary text-primary-foreground py-32" id="works">
        <div className="works-header px-8 md:px-16 mb-24">
          <ShuffleText
            as="h2"
            text="Auditoría Visual & Codificación"
            triggerOnScroll={true}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
          />
        </div>
        <div className="works-content px-8 md:px-16 mt-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="w-full md:w-1/4">
              <p className="font-mono text-xl uppercase tracking-widest">[ El Proceso KAudit ]</p>
            </div>
            <div className="w-full md:w-3/4">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                  Arte atemporal bajo una nueva lente
                </h2>
                <p className="text-lg md:text-xl leading-relaxed">
                  Nuestra IA no solo encuentra errores; descubre la elegancia en la lógica. Cada revisión es una
                  oportunidad para elevar la arquitectura de software al nivel de una obra maestra digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
