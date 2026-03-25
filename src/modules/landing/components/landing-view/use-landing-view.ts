import { useEffect } from 'react'
import { useLenis } from '@studio-freight/react-lenis'

export function useLandingView() {
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      ;(window as unknown as { lenis: unknown }).lenis = lenis
    }
    return () => {
      ;(window as unknown as { lenis: unknown }).lenis = null
    }
  }, [lenis])

  return { lenis }
}
