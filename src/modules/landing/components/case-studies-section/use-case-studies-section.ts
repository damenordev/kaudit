'use client'

import type { RefObject } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useCaseStudiesSection(container: RefObject<HTMLElement | null>) {
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
            },
          })
        }

        if (imgElement) {
          gsap.fromTo(
            imgElement,
            { scale: 2 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
              },
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
}
