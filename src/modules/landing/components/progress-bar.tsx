'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import gsap from 'gsap'

export function ProgressBar() {
  const progressRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const animatingRef = useRef(false)
  const isFirstLoadRef = useRef(true)

  useEffect(() => {
    const progressBar = progressRef.current

    if (isFirstLoadRef.current) {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const initialProgress = (documentHeight - windowHeight) > 0 
        ? scrollTop / (documentHeight - windowHeight)
        : 0
      gsap.set(progressBar, { scaleX: initialProgress })
      isFirstLoadRef.current = false
    }

    const updateProgress = () => {
      if (animatingRef.current) return

      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (documentHeight - windowHeight) > 0
        ? scrollTop / (documentHeight - windowHeight)
        : 0

      gsap.to(progressBar, {
        scaleX: progress,
        duration: 0.1,
        ease: 'none',
        overwrite: true,
      })
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  useEffect(() => {
    const progressBar = progressRef.current
    if (!progressBar || isFirstLoadRef.current) return

    const handleRouteChange = () => {
      animatingRef.current = true

      gsap.to(progressBar, {
        scaleX: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          animatingRef.current = false
        },
      })
    }

    handleRouteChange()
  }, [pathname, searchParams])

  return (
    <div 
      ref={progressRef} 
      className="fixed top-0 left-0 w-full h-[7px] bg-foreground z-[10000] will-change-transform scale-x-0 origin-left mix-blend-difference"
    />
  )
}
