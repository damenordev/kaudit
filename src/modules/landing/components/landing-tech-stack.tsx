import { NextJsIcon, ReactIcon, TypeScriptIcon, TailwindIcon, PrismaIcon } from './icons'
import { cn } from '@/core/utils/cn.utils'

export interface ILandingTechStackProps {
  title: string
  subtitle: string
  className?: string
}

const technologies = [
  { name: 'Next.js', Icon: NextJsIcon },
  { name: 'React', Icon: ReactIcon },
  { name: 'TypeScript', Icon: TypeScriptIcon },
  { name: 'Tailwind', Icon: TailwindIcon },
  { name: 'Prisma', Icon: PrismaIcon },
]

export function LandingTechStack({ title, subtitle, className }: ILandingTechStackProps) {
  return (
    <section className={cn('py-16 px-6', className)}>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{title}</p>
            <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-6">
            {technologies.map(({ name, Icon }) => (
              <li key={name} className="flex items-center gap-2 text-zinc-500 transition-colors hover:text-white">
                <Icon aria-hidden className="h-5 w-5" />
                <span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
