'use client'

import type { RefObject } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useCarouselSection(container: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (typeof window === 'undefined') return

      const projects = gsap.utils.toArray('.project') as HTMLElement[]

      ScrollTrigger.create({
        trigger: container.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * projects.length}`,
        pin: true,
        scrub: 1,
        onUpdate: self => {
          const progress = self.progress * (projects.length - 1)
          const currentSlide = Math.floor(progress)
          const slideProgress = progress - currentSlide

          projects.forEach((slide, index) => {
            if (index < currentSlide) {
              gsap.set(slide, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' })
            } else if (index === currentSlide) {
              const p = slideProgress * 100
              gsap.set(slide, { clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)` })

              const nextProject = projects[index + 1]
              if (nextProject) {
                const nextP = (1 - slideProgress) * 100
                gsap.set(nextProject, {
                  clipPath: `polygon(0% ${nextP}%, 100% ${nextP}%, 100% 100%, 0% 100%)`,
                })
              }
            } else if (index > currentSlide + 1) {
              gsap.set(slide, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' })
            }
          })
        },
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
}
