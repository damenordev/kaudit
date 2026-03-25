'use client'

import { useTranslations } from 'next-intl'
import { User } from 'lucide-react'
import { ProfileForm, type TProfileFormData } from '@/modules/settings/components/profile-form'

export interface IProfileStepProps {
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export function ProfileStep({ user }: IProfileStepProps) {
  const t = useTranslations('onboarding.profile')

  const profileFormDefaults: TProfileFormData = {
    name: user.name,
    bio: '',
    phone: '',
    location: '',
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>

      <div className="p-6 rounded-lg border border-border/40 bg-card/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <User className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">{t('yourInfo')}</h3>
            <p className="text-muted-foreground text-[11px]">{t('yourInfoDescription')}</p>
          </div>
        </div>
        <ProfileForm defaultValues={profileFormDefaults} />
      </div>
    </div>
  )
}
