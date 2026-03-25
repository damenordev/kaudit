'use client'

import type { RefObject } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useIntroSection(container: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: container.current,
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
}
