'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function useNavbar() {
  const [time, setTime] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault()

    if (isHomePage) {
      // @ts-ignore
      const lenis = window.lenis
      if (lenis) {
        const element = document.getElementById(sectionId)
        if (element) {
          lenis.scrollTo(element, {
            offset: 0,
            immediate: false,
            duration: 1.5,
          })
        }
      }
    } else {
      router.push(`/#${sectionId}`)
    }
  }

  return { time, handleNavigation }
}
