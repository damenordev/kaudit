'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { sileo } from 'sileo'

import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/ui/dialog'

export interface ICreateApiKeyDialogProps {
  translations: {
    trigger: string
    title: string
    description: string
    nameLabel: string
    namePlaceholder: string
    cancel: string
    submit: string
    submitting: string
    error: string
  }
  /** Se ejecuta al crear exitosamente. Recibe el plain text key. */
  onCreated: (plainKey: string) => void
}

/** Diálogo para crear una nueva API key */
export function CreateApiKeyDialog({ translations: t, onCreated }: ICreateApiKeyDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async () => {
    setIsCreating(true)
    try {
      const res = await fetch('/api/auth/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'CLI API Key' }),
      })
      if (!res.ok) throw new Error('Failed to create')

      const data = (await res.json()) as { key: { key: string } }
      onCreated(data.key.key)
      setName('')
      setOpen(false)
      sileo.success({ title: 'API key creada' })
    } catch {
      sileo.error({ title: t.error })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          {t.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <Input
          placeholder={t.namePlaceholder}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSubmit()
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? t.submitting : t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
