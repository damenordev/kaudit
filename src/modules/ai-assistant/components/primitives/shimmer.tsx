'use client'

import { memo, useMemo, type CSSProperties, type JSX } from 'react'
import { LazyMotion, m, useReducedMotion, domAnimation } from 'motion/react'

import { cn } from '@/core/utils/cn.utils'

export interface TextShimmerProps {
  children: string
  className?: string
  duration?: number
  spread?: number
}

const ShimmerComponent = ({ children, className, duration = 2, spread = 2 }: TextShimmerProps) => {
  const shouldReduceMotion = useReducedMotion()

  const dynamicSpread = useMemo(() => (children?.length ?? 0) * spread, [children, spread])

  if (shouldReduceMotion) {
    return <span className={cn('text-muted-foreground', className)}>{children}</span>
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.span
        animate={{ backgroundPosition: '0% center' }}
        className={cn(
          'relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent',
          '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
          className
        )}
        initial={{ backgroundPosition: '100% center' }}
        style={
          {
            '--spread': `${dynamicSpread}px`,
            backgroundImage: 'var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))',
          } as CSSProperties
        }
        transition={{
          duration,
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {children}
      </m.span>
    </LazyMotion>
  )
}

export const Shimmer = memo(ShimmerComponent)
