'use client'

import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { sileo } from 'sileo'

import { Button } from '@/core/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/core/ui/alert-dialog'

export interface IDeleteApiKeyButtonProps {
  translations: {
    confirmTitle: string
    confirmDescription: string
    cancel: string
    delete: string
    error: string
  }
  keyId: string
  keyName: string
  /** Se ejecuta tras eliminar exitosamente. */
  onDeleted: () => void
}

/** Botón con diálogo de confirmación para revocar una API key */
export function DeleteApiKeyButton({ translations: t, keyId, keyName, onDeleted }: IDeleteApiKeyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch('/api/auth/api-key', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId }),
      })
      if (!res.ok) throw new Error('Failed to delete')
      sileo.success({ title: 'API key eliminada' })
      onDeleted()
    } catch {
      sileo.error({ title: t.error })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" disabled={isDeleting}>
          <Trash2Icon className="size-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{keyName}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            {t.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
