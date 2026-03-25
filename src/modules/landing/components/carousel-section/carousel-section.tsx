'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { CAROUSEL_ITEMS } from '../../constants/landing.constants'
import { useCarouselSection } from './use-carousel-section'

export function CarouselSection() {
  const container = useRef<HTMLElement>(null)

  useCarouselSection(container)

  return (
    <section className="carousel relative w-full h-screen bg-background overflow-hidden" id="carousel" ref={container}>
      {CAROUSEL_ITEMS.map(item => (
        <div
          key={item.id}
          className="project absolute top-0 left-0 w-full h-svh"
          style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
        >
          <div className="project-bg absolute inset-0 z-0">
            <img src={item.bg} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          </div>

          <div className="project-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[80%] md:w-[40%] aspect-3/4 z-10 border border-white/20 overflow-hidden rounded-sm">
            <img src={item.main} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="project-header absolute top-32 left-0 w-full flex flex-col md:flex-row justify-between items-center gap-4 px-8 z-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest opacity-50">Archive {item.id}</h2>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest max-w-[30vw] text-right">
              {item.title}
            </h2>
          </div>

          <Link href={item.url} className="absolute inset-0 z-40" aria-label={`Ver proyecto ${item.title}`} />
        </div>
      ))}
    </section>
  )
}
