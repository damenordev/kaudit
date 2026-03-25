import { cn } from '@/core/utils/cn.utils'

export interface IFeatureItem {
  icon: React.ElementType
  title: string
  description: string
}

export interface ILandingFeaturesProps {
  title: string
  subtitle: string
  features: IFeatureItem[]
  className?: string
}

export function LandingFeatures({ title, subtitle, features, className }: ILandingFeaturesProps) {
  return (
    <section className={cn('py-24 px-6 border-t border-zinc-800/50', className)}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">Features</p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
          <p className="mt-3 text-zinc-400 max-w-lg">{subtitle}</p>
        </div>

        {/* Features list */}
        <ul className="grid gap-px bg-zinc-800/50 rounded-xl overflow-hidden">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <li
                key={index}
                className="group grid md:grid-cols-4 gap-4 p-6 bg-zinc-900 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-4 md:col-span-1">
                  <span className="text-xs font-mono text-zinc-600 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 group-hover:bg-primary/10 transition-colors">
                    <Icon aria-hidden className="h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h3 className="font-medium text-white">{feature.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
