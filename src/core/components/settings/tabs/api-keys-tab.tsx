'use client'

import { useCallback, useEffect, useState } from 'react'
import { CopyIcon, CheckIcon, KeyRoundIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { sileo } from 'sileo'

import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { Badge } from '@/core/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/ui/table'
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
import { Alert, AlertDescription } from '@/core/ui/alert'

import type { IMaskedApiKey, ICreateApiKeyResponse, IApiKeysTranslations } from './api-keys-tab.types'

interface IApiKeysTabProps {
  translations: IApiKeysTranslations
}

/** Tab de gestión de API keys: listado, creación y eliminación */
export function ApiKeysTab({ translations: t }: IApiKeysTabProps) {
  const [keys, setKeys] = useState<IMaskedApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [revealKey, setRevealKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  /** Carga las API keys del usuario desde el endpoint */
  const fetchKeys = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/api-key')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = (await res.json()) as { keys: IMaskedApiKey[] }
      setKeys(data.keys)
    } catch {
      sileo.error({ title: t.create.error })
    } finally {
      setIsLoading(false)
    }
  }, [t])

  // Carga inicial al montar el componente
  useEffect(() => {
    fetchKeys()
  }, [fetchKeys])

  /** Crea una nueva API key */
  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const res = await fetch('/api/auth/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName || 'CLI API Key' }),
      })
      if (!res.ok) throw new Error('Failed to create')
      const data = (await res.json()) as ICreateApiKeyResponse
      setRevealKey(data.key.key)
      setNewKeyName('')
      setCreateOpen(false)
      sileo.success({ title: 'API key creada' })
      await fetchKeys()
    } catch {
      sileo.error({ title: t.create.error })
    } finally {
      setIsCreating(false)
    }
  }

  /** Elimina una API key existente */
  const handleDelete = async (keyId: string) => {
    try {
      const res = await fetch('/api/auth/api-key', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId }),
      })
      if (!res.ok) throw new Error('Failed to delete')
      sileo.success({ title: 'API key eliminada' })
      await fetchKeys()
    } catch {
      sileo.error({ title: t.create.error })
    }
  }

  /** Copia la key al portapapeles */
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /** Formatea una fecha para mostrarla en la tabla */
  const formatDate = (date: Date | null) => {
    if (!date) return '—'
    return new Intl.DateTimeFormat('default', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRoundIcon className="size-5" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Diálogo de revelación de la key recién creada */}
        {revealKey && (
          <Alert className="mb-4 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <AlertDescription>
              <p className="mb-2 font-semibold text-amber-700 dark:text-amber-400">{t.reveal.warning}</p>
              <code className="block rounded bg-muted p-2 text-xs break-all font-mono">{revealKey}</code>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleCopy(revealKey)}>
                  {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
                  {copied ? t.reveal.copied : t.reveal.copy}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setRevealKey(null)}>
                  {t.reveal.close}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Botón de crear nueva key */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">
              <PlusIcon className="size-4" />
              {t.createButton}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.create.title}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
            </DialogHeader>
            <Input
              placeholder={t.create.namePlaceholder}
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate()
              }}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                {t.create.cancel}
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? t.create.submitting : t.create.submit}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tabla de API keys */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-4">{t.table.empty}</p>
        ) : keys.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">{t.table.empty}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.table.name}</TableHead>
                <TableHead>{t.table.key}</TableHead>
                <TableHead>{t.table.created}</TableHead>
                <TableHead>{t.table.status}</TableHead>
                <TableHead>{t.table.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map(apiKey => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name || t.table.unnamed}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {apiKey.prefix}****{apiKey.start}
                    </code>
                  </TableCell>
                  <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={apiKey.enabled ? 'default' : 'secondary'}>
                      {apiKey.enabled ? t.table.enabled : t.table.disabled}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <Trash2Icon className="size-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t.table.confirmDelete}</AlertDialogTitle>
                          <AlertDialogDescription>{apiKey.name || t.table.unnamed}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.create.cancel}</AlertDialogCancel>
                          <AlertDialogAction variant="destructive" onClick={() => handleDelete(apiKey.id)}>
                            {t.table.delete}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
