'use client'
import { useShuffleText } from './use-shuffle-text'

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
  const { containerRef } = useShuffleText(text, triggerOnScroll)

  return (
    <Component ref={containerRef} className={`block opacity-0 ${className}`.trim()} {...props}>
      {text}
    </Component>
  )
}
