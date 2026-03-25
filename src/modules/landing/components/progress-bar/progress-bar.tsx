'use client'
import { useProgressBar } from './use-progress-bar'

export function ProgressBar() {
  const { progressRef } = useProgressBar()

  return (
    <div 
      ref={progressRef} 
      className="fixed top-0 left-0 w-full h-[7px] bg-foreground z-10000 will-change-transform scale-x-0 origin-left mix-blend-difference"
    />
  )
}
