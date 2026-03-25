'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import { MdArrowOutward } from 'react-icons/md'

import { Marquee, ShuffleText, GeometricBackground, Navbar, ProgressBar, Footer, AmbientBackground } from './index'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export interface ILandingViewProps {
  session: any
  labels: {
    hero: any
    features: any
    cta: any
  }
}

const carouselItems = [
  {
    id: '01',
    title: 'Visión Perímetral',
    bg: '/images/carousel/carousel1.jpeg',
    main: '/images/carousel/carousel1.jpeg',
    url: '#archive-1',
  },
  {
    id: '02',
    title: 'Análisis Profundo',
    bg: '/images/carousel/carousel2.jpeg',
    main: '/images/carousel/carousel2.jpeg',
    url: '#archive-2',
  },
  {
    id: '03',
    title: 'Seguridad Cuántica',
    bg: '/images/carousel/carousel3.jpeg',
    main: '/images/carousel/carousel3.jpeg',
    url: '#archive-3',
  },
]

export function LandingView({ session, labels }: ILandingViewProps) {
  const container = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      // @ts-ignore
      window.lenis = lenis
    }
    return () => {
      // @ts-ignore
      window.lenis = null
    }
  }, [lenis])

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: '.intro',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: self => {
          const progress = self.progress
          const yMove = -750 * progress
          const rotation = 360 * progress

          gsap.to('.geo-bg', {
            y: yMove,
            rotation: rotation,
            duration: 0.1,
            ease: 'none',
            overwrite: true,
          })
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    },
    { scope: container }
  )

  useGSAP(
    () => {
      const images = gsap.utils.toArray('.case-studies-img') as HTMLElement[]
      const items = gsap.utils.toArray('.case-studies-item') as HTMLElement[]

      // Main pin for the images container
      ScrollTrigger.create({
        trigger: '.case-studies-items',
        start: 'top top',
        end: 'bottom bottom',
        pin: '.case-studies-items-images',
        pinSpacing: false,
      })

      // Image reveal and scale logic
      images.forEach((img, i) => {
        const imgElement = img.querySelector('img')
        const item = items[i]

        if (i > 0) {
          gsap.set(img, { clipPath: 'inset(100% 0% 0% 0%)' })
          
          gsap.to(img, {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            }
          })
        }

        if (imgElement) {
          gsap.fromTo(imgElement, 
            { scale: 2 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
              }
            }
          )
        }
      })

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    },
    { scope: container }
  )

  useGSAP(
    () => {
      if (typeof window === 'undefined') return

      const projects = gsap.utils.toArray('.project') as HTMLElement[]

      ScrollTrigger.create({
        trigger: '.carousel',
        start: 'top top',
        end: () => `+=${window.innerHeight * projects.length}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress * (projects.length - 1)
          const currentSlide = Math.floor(progress)
          const slideProgress = progress - currentSlide

          projects.forEach((slide, index) => {
            if (index < currentSlide) {
              gsap.set(slide, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' })
            } else if (index === currentSlide) {
              const p = slideProgress * 100
              gsap.set(slide, { clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)` })
              
              if (projects[index + 1]) {
                const nextP = (1 - slideProgress) * 100
                gsap.set(projects[index + 1], { 
                  clipPath: `polygon(0% ${nextP}%, 100% ${nextP}%, 100% 100%, 0% 100%)` 
                })
              }
            } else if (index > currentSlide + 1) {
              gsap.set(slide, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' })
            }
          })
        }
      })

      if (projects[0]) {
        gsap.set(projects[0], {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        })
      }

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    },
    { scope: container }
  )

  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2,
      }}
    >
      <ProgressBar />
      <Navbar />
      <AmbientBackground />

      <div className="relative z-10 overflow-x-hidden" ref={container}>
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
                <div className="w-24 lg:w-32 animate-pulse">
                  <img
                    src="/images/home/hero-abstract-icon.png"
                    alt="Abstract Icon"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="intro relative bg-background overflow-x-hidden" id="intro">
          <div className="geo-bg absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2.5] z-0 opacity-25 pointer-events-none">
            <GeometricBackground />
          </div>
          <div className="relative z-10">
            <Marquee />
          </div>
          <div className="relative z-10 w-full pt-[10rem] md:pt-[20rem] pb-16">
            <div className="px-8 md:px-16 flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="w-full md:w-1/4">
                <p className="text-primary font-mono text-xl uppercase tracking-widest">[ Preparando la Escena ]</p>
              </div>
              <div className="w-full md:w-3/4">
                <div className="max-w-2xl mb-16 space-y-8">
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                    KAudit ha revolucionado el potencial creativo de la IA, avanzando desde auditorías básicas hasta
                    integraciones profundas de código. Explorando los límites de la seguridad del mañana.
                  </p>
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                    Este progreso ha abierto las puertas a herramientas de revisión de código potentes para ingenieros
                    de todos los niveles. A su vez, ha planteado debates sobre la calidad del código generado, los
                    sesgos en PRs automatizadas y el futuro de la ingeniería.
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

        <section className="case-studies relative bg-background py-16" id="case-studies">
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
                    La IA generativa ha avanzado rápidamente, pasando de sugerir modificaciones menores a reescribir
                    ecosistemas enteros, desafiando nuestra percepción del rol humano en el ciclo del software.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="case-studies-items relative w-full flex flex-col md:flex-row bg-background">
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
              <div
                key={item.id}
                className="case-studies-item w-full h-screen flex flex-col justify-center px-8 md:px-16"
              >
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
              <div
                key={id}
                className="case-studies-img absolute inset-0 overflow-hidden z-[1]"
                style={{ willChange: 'transform' }}
              >
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
        </section>

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
        <section className="works relative z-10 bg-background py-32" id="works">
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
                <p className="text-primary font-mono text-xl uppercase tracking-widest">[ El Proceso KAudit ]</p>
              </div>
              <div className="w-full md:w-3/4">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                    Arte atemporal bajo una nueva lente
                  </h2>
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                    Nuestra IA no solo encuentra errores; descubre la elegancia en la lógica. Cada revisión es una
                    oportunidad para elevar la arquitectura de software al nivel de una obra maestra digital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="carousel relative w-full h-screen bg-background overflow-hidden" id="carousel">
            {carouselItems.map(item => (
            <div
              key={item.id}
              className="project absolute top-0 left-0 w-full h-[100svh]"
              style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
            >
              <div className="project-bg absolute inset-0 z-0">
                <img src={item.bg} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              </div>

              <div className="project-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[80%] md:w-[40%] aspect-[3/4] z-10 border border-white/20 overflow-hidden rounded-sm">
                <img src={item.main} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="project-header absolute top-[15%] left-0 w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-16 px-8 z-20">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest opacity-50">
                  Archive {item.id}
                </h2>
                <div className="hidden md:block w-[30vw]"></div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest">{item.title}</h2>
              </div>

              <div className="absolute top-[80%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <Link
                  href={item.url}
                  className="text-white font-mono text-lg uppercase tracking-[0.5em] hover:text-primary transition-colors"
                >
                  ( El Viaje )
                </Link>
              </div>

              <Link href={item.url} className="absolute inset-0 z-40" aria-label={`Ver proyecto ${item.title}`} />
            </div>
          ))}
        </section>

        <section className="h-svh pointer-events-none" />
      </div>
      <Footer />
    </ReactLenis>
  )
}
