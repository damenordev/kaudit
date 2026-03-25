'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const ANIMATION_DURATION = 15

export function Marquee() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const directionRef = useRef(-1)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const content = wrapper.children[0] as HTMLElement

    for (let i = 0; i < 3; i++) {
      const clone = content.cloneNode(true)
      wrapper.appendChild(clone)
    }

    const singleWidth = content.offsetWidth
    const totalWidth = singleWidth * 2

    const createAnimation = () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }

      let currentX = gsap.getProperty(wrapper, 'x') as number

      if (currentX <= -totalWidth) {
        currentX = currentX % singleWidth
        gsap.set(wrapper, { x: currentX })
      } else if (currentX >= 0) {
        currentX = -singleWidth + (currentX % singleWidth)
        gsap.set(wrapper, { x: currentX })
      }

      const targetX =
        directionRef.current === -1
          ? currentX - singleWidth
          : currentX + singleWidth

      const remainingDistance = Math.abs(targetX - currentX)
      const remainingDuration =
        (remainingDistance / singleWidth) * ANIMATION_DURATION

      animationRef.current = gsap.to(wrapper, {
        x: targetX,
        duration: remainingDuration,
        ease: 'none',
        repeat: -1,
        onRepeat: () => {
          let resetX = gsap.getProperty(wrapper, 'x') as number

          if (directionRef.current === -1 && resetX <= -totalWidth) {
            resetX = resetX % singleWidth
          } else if (directionRef.current === 1 && resetX >= 0) {
            resetX = -singleWidth + (resetX % singleWidth)
          }

          gsap.set(wrapper, { x: resetX })
        },
      })
    }

    createAnimation()

    let lastScrollTop = 0
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop
      const newDirection = st > lastScrollTop ? -1 : 1

      if (newDirection !== directionRef.current) {
        directionRef.current = newDirection
        createAnimation()
      }

      lastScrollTop = st <= 0 ? 0 : st
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [])

  return (
    <div className="relative w-full overflow-hidden py-16 md:py-32 bg-transparent backface-hidden transform-gpu">
      <div className="flex relative w-fit will-change-transform backface-hidden transform-gpu" ref={wrapperRef}>
        <div className="shrink-0">
          <h1 className="uppercase font-mono font-normal text-6xl md:text-8xl lg:text-9xl leading-[0.9] -tracking-[0.05em] whitespace-nowrap pr-8 md:pr-12 will-change-transform text-foreground">
            The Evolution of AI — The Evolution of AI — The Evolution of AI —
            The Evolution of AI —
          </h1>
        </div>
      </div>
    </div>
  )
}
