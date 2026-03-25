import { cn } from '@/core/utils/cn.utils'

export interface IAmbientBackgroundProps {
  className?: string
}

export function AmbientBackground({ className }: IAmbientBackgroundProps) {
  return (
    <div className={cn('fixed inset-0 -z-10 overflow-hidden', className)}>
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/15 rounded-full blur-[150px]" />

      {/* Accent glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      {/* Grid */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_50%,transparent_100%)]">
        <div className="absolute inset-0 [background-size:60px_60px] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] opacity-[0.02]" />
      </div>
    </div>
  )
}
