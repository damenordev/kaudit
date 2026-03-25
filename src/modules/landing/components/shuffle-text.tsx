'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

export interface IShuffleTextProps {
  text: string
  as?: React.ElementType
  className?: string
  triggerOnScroll?: boolean
}

export function ShuffleText({
  text,
  as: Component = 'div',
  className = '',
  triggerOnScroll = false,
  ...props
}: IShuffleTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [mounted, setMounted] = useState(false)
  const splitInstance = useRef<SplitType | null>(null)

  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth > 900)
    }

    checkSize()
    setMounted(true)

    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    if (!isDesktop) {
      if (splitInstance.current) {
        splitInstance.current.revert()
        splitInstance.current = null
      }
      gsap.set(containerRef.current, { opacity: 1 })
      return
    }

    splitInstance.current = new SplitType(containerRef.current, {
      types: 'lines,words,chars',
      tagName: 'span',
    })

    const chars = splitInstance.current.chars
    const signs = ['+', '-']

    if (chars) {
      gsap.set(chars, { opacity: 0 })
      
      chars.forEach(char => {
        char.style.display = 'inline-block'
        char.style.textAlign = 'center'
        char.style.position = 'relative'
        char.style.whiteSpace = 'nowrap'
      })
      
      splitInstance.current.words?.forEach(word => {
        word.style.display = 'inline-block'
        word.style.whiteSpace = 'nowrap'
        word.style.marginRight = '0.25em'
      })

      splitInstance.current.lines?.forEach(line => {
        line.style.display = 'block'
        line.style.width = '100%'
      })

      // Crucial: Show container ONLY after chars are hidden
      gsap.set(containerRef.current, { opacity: 1 })
    }

    const animateChars = () => {
      if (!chars) return
      chars.forEach((char) => {
        const originalLetter = char.textContent || ''
        let shuffleCount = 0
        const maxShuffles = 5

        gsap.to(char, {
          opacity: 1,
          duration: 0.1,
          delay: gsap.utils.random(0, 0.75),
          onStart: () => {
            const shuffle = () => {
              if (shuffleCount < maxShuffles) {
                char.textContent = signs[Math.floor(Math.random() * signs.length)] as string
                shuffleCount++
                requestAnimationFrame(() => setTimeout(shuffle, 75))
              } else {
                char.textContent = originalLetter
              }
            }
            shuffle()
          },
        })
      })
    }

    if (triggerOnScroll) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom-=100',
        onEnter: animateChars,
        once: true,
      })
    } else {
      animateChars()
    }

    return () => {
      if (splitInstance.current) {
        splitInstance.current.revert()
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [text, triggerOnScroll, isDesktop, mounted])

  return (
    <Component
      ref={containerRef}
      className={`block opacity-0 ${className}`.trim()}
      {...props}
    >
      {text}
    </Component>
  )
}
