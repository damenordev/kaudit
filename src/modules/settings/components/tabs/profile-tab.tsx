'use client'

import { User, Key, Trash2, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/primitives/card'
import { ProfileAvatarUpload } from '../profile-avatar-upload'
import { ProfileForm, type TProfileFormData } from '../profile-form'
import { ChangePasswordForm } from '../change-password-form'
import { DeleteAccountDialog } from '../delete-account-dialog'
import type { TUserProfile } from '../../models/profile.schema'

export interface IProfileTabProps {
  profile: TUserProfile | null
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export function ProfileTab({ profile, user }: IProfileTabProps) {
  const t = useTranslations('settings.profile')

  const profileFormDefaults: TProfileFormData = {
    name: user.name,
    bio: profile?.bio ?? '',
    phone: profile?.phone ?? '',
    location: profile?.location ?? '',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Columna Principal: Identidad (8/12) */}
      <Card className="md:col-span-8 border-border/40 bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/10 bg-muted/5">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-black tracking-widest uppercase opacity-70 italic">
              {t('personal.title')}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold text-primary tracking-tight uppercase">
              {t('personal.description')}
            </CardDescription>
          </div>
          <div className="size-8 rounded-lg border border-border/50 flex items-center justify-center bg-background shadow-xs">
            <User className="size-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="shrink-0 space-y-4">
              <div className="p-1 rounded-2xl border border-border/50 bg-muted/30 shadow-inner inline-block">
                <ProfileAvatarUpload currentAvatar={user.image} userName={user.name} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">User ID</p>
                <code className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border/50 text-muted-foreground">
                  {user.id.slice(0, 12)}...
                </code>
              </div>
            </div>
            <div className="flex-1 w-full">
              <ProfileForm defaultValues={profileFormDefaults} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Columna Lateral: Seguridad (4/12) */}
      <div className="md:col-span-4 space-y-6">
        <Card className="border-border/40 bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/10 bg-muted/5 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black tracking-widest uppercase opacity-60 italic">
              {t('security.title')}
            </CardTitle>
            <ShieldCheck className="size-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground mb-4 uppercase font-bold tracking-tight">
              {t('security.description')}
            </p>
            <ChangePasswordForm />
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5 shadow-xs overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive/50" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest uppercase text-destructive italic flex items-center gap-2">
              <Trash2 className="size-3" /> {t('danger.title')}
            </CardTitle>
            <CardDescription className="text-[9px] font-bold text-destructive/70 uppercase">
              {t('danger.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <DeleteAccountDialog />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
