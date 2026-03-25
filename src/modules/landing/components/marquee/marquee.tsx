'use client'
import { useMarquee } from './use-marquee'

export function Marquee() {
  const { wrapperRef } = useMarquee()

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
