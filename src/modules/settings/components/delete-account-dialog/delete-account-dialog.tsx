'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'
import { Trash2, Loader2 } from 'lucide-react'

import { Button } from '@/core/ui/primitives/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/ui/overlays/dialog'
import { Input } from '@/core/ui/primitives/input'
import { Label } from '@/core/ui/primitives/label'
import { deleteAccount } from '../../services/profile.actions'

export function DeleteAccountDialog() {
  const t = useTranslations('settings.profile.danger.deleteAccount')
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const isConfirmEnabled = confirmText === 'DELETE' || confirmText === 'ELIMINAR'

  const handleDelete = async () => {
    if (!isConfirmEnabled) return

    setIsDeleting(true)
    try {
      await deleteAccount()
      router.push('/')
    } catch {
      sileo.error({ title: t('error') })
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setConfirmText('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 size-4" />
          {t('trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">{t('confirmTitle')}</DialogTitle>
          <DialogDescription>{t('confirmDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirm">{t('confirmLabel')}</Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            {t('cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={!isConfirmEnabled || isDeleting}>
            {isDeleting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
