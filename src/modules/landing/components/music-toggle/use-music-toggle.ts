'use client'
import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import type { AnimationItem, LottiePlayer } from 'lottie-web'

export function useMusicToggle() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [lottie, setLottie] = useState<LottiePlayer | null>(null)
  const audioRef: MutableRefObject<HTMLAudioElement | null> = useRef(null)
  const lottieRef: MutableRefObject<AnimationItem | null> = useRef(null)
  const containerRef: MutableRefObject<HTMLDivElement | null> = useRef(null)

  useEffect(() => {
    import('lottie-web').then(lottieModule => {
      setLottie(lottieModule.default)
    })
  }, [])

  useEffect(() => {
    if (!lottie || !containerRef.current) return

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: 'https://assets5.lottiefiles.com/packages/lf20_jJJl6i.json',
    })

    lottieRef.current = animation

    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/audio.mp3')
      audioRef.current.volume = 0.15
    }

    return () => {
      animation.destroy()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [lottie])

  const toggleMusic = () => {
    if (!audioRef.current || !lottieRef.current) return

    if (!isPlaying) {
      audioRef.current.play().catch(e => console.error('Audio play failed', e))
      lottieRef.current.playSegments([0, 120], true)
    } else {
      audioRef.current.pause()
      lottieRef.current.stop()
    }
    setIsPlaying(!isPlaying)
  }

  return { isPlaying, containerRef, toggleMusic }
}
