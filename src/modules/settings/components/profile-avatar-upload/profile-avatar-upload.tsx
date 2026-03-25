'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'

import { Avatar, AvatarImage, AvatarFallback } from '@/core/ui/primitives/avatar'
import { uploadAvatar } from '../../services/profile.actions'

export interface IProfileAvatarUploadProps {
  currentAvatar: string | null
  userName: string
}

export function ProfileAvatarUpload({ currentAvatar, userName }: IProfileAvatarUploadProps) {
  const t = useTranslations('settings.profile.avatar')
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const result = await uploadAvatar(formData)
      if (result.avatarUrl) {
        setAvatarUrl(result.avatarUrl)
        sileo.success({ title: t('success') })
        router.refresh()
      }
    } catch (error) {
      sileo.error({ title: error instanceof Error ? error.message : t('error') })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="size-20">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <label className="absolute bottom-0 right-0 flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{t('formats')}</p>
        <p className="text-xs text-muted-foreground">{t('maxSize')}</p>
      </div>
    </div>
  )
}
