import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface ISettingsSectionProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  children?: ReactNode
}

export function SettingsSection({ icon: Icon, title, description, action, children }: ISettingsSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Icon className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <p className="text-muted-foreground text-[11px]">{description}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
