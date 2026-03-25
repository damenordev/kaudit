'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { MdArrowOutward } from 'react-icons/md'
import { ShuffleText } from '../shuffle-text'
import { useCaseStudiesSection } from './use-case-studies-section'

export function CaseStudiesSection() {
  const container = useRef<HTMLElement>(null)
  
  useCaseStudiesSection(container)

  return (
    <section ref={container}>
      <div className="case-studies relative bg-background py-16" id="case-studies">
        <div className="case-studies-header w-full md:w-[70%] px-8 md:px-16">
          <ShuffleText
            as="h2"
            text="Sumérgete en Casos de Éxito"
            triggerOnScroll={true}
            className="text-4xl md:text-6xl font-bold uppercase tracking-tighter"
          />
        </div>
        <div className="case-studies-content mt-16 px-8 md:px-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="w-full md:w-1/4">
              <p className="text-primary font-mono text-xl uppercase tracking-widest">[ Casos de Estudio ]</p>
            </div>
            <div className="w-full md:w-3/4">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                  ¿Cómo remodela la IA los límites de la ingeniería?
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                  La IA generativa ha avanzado rápidamente, pasando de sugerir modificaciones menores a reescribir ecosistemas enteros, desafiando nuestra percepción del rol humano en el ciclo del software.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="case-studies-items relative w-full flex flex-col md:flex-row bg-background">
        <div className="case-studies-items-content w-full md:w-1/2 relative z-20">
          {[
            {
              id: 1,
              title: 'Código en la Era Algorítmica',
              subtitle: '[ Lumina Horizon — Zara Lee ]',
              img: '/images/home/case-study-1.jpeg',
              desc: 'La instalación de IA de Zara cautiva audiencias en el Foro Digital Global, planteando preguntas sobre la fusión del deseo humano de perfección y la precisión técnica del sistema.',
            },
            {
              id: 2,
              title: 'El Amanecer del CI Seguro',
              subtitle: '[ Visionary Threads — Elena Marquez ]',
              img: '/images/home/case-study-2.jpeg',
              desc: 'Elena lanza el primer modelo diseñado enteramente por IA para identificar cuellos de botella semánticos en producción masiva. Genera debates sobre la validez de prescindir del ojo humano.',
            },
            {
              id: 3,
              title: 'Premios Arte e Ingeniería',
              subtitle: '[ Synthetic Realities — Sophia Armitage ]',
              img: '/images/home/case-study-3.jpeg',
              desc: 'La exhibición de KAudit resalta el potencial creativo oculto entre refactorizaciones automáticas. Resaltan piezas generadas al analizar los patrones lógicos más bellos dentro de arquitecturas complejas.',
            },
          ].map(item => (
            <div key={item.id} className="case-studies-item w-full h-screen flex flex-col justify-center px-8 md:px-16">
              <div className="max-w-xl">
                <h3 className="text-4xl md:text-6xl font-light mb-4 font-mono">{item.title}</h3>
                <p className="text-primary font-mono text-sm uppercase tracking-widest mb-6">{item.subtitle}</p>

                {/* Mobile only image */}
                <div className="md:hidden relative aspect-square mb-8 overflow-hidden rounded-lg">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <p className="text-muted-foreground text-lg mb-8">{item.desc}</p>

                <Link
                  href={`#project-0${item.id}`}
                  className="group flex items-center gap-2 text-primary uppercase font-mono tracking-widest"
                >
                  <span>Descubre el viaje</span>
                  <MdArrowOutward className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="case-studies-items-images hidden md:block w-1/2 h-screen relative bg-background">
          {[1, 2, 3].map(id => (
            <div key={id} className="case-studies-img absolute inset-0 overflow-hidden z-1" style={{ willChange: 'transform' }}>
              <img
                src={`/images/home/case-study-${id}.jpeg`}
                alt=""
                className="absolute top-1/2 left-1/2 w-full h-full object-cover origin-top transform-gpu"
                style={{ transform: 'translate(-50%, -50%) scale(2)', willChange: 'transform' }}
              />
              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Link href={`#project-0${id}`} className="w-full h-full flex items-center justify-center">
                  <span className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-mono flex items-center gap-2">
                    (&nbsp; Ver Artículo <MdArrowOutward /> &nbsp;)
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
