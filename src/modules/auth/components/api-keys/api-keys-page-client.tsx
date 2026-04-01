'use client'

import { useCallback, useState } from 'react'
import { KeyRoundIcon } from 'lucide-react'

import { Badge } from '@/core/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/ui/table'

import type { IApiKeyRow } from '../../queries/api-key.queries'
import { CreateApiKeyDialog } from './create-api-key-dialog'
import { ApiKeyRevealAlert } from './api-key-reveal-alert'
import { DeleteApiKeyButton } from './delete-api-key-button'

export interface IApiKeysPageClientProps {
  initialKeys: IApiKeyRow[]
  translations: {
    title: string
    description: string
    table: {
      name: string
      key: string
      created: string
      status: string
      actions: string
      empty: string
      enabled: string
      disabled: string
      unnamed: string
      confirmDelete: string
      delete: string
      cancel: string
    }
    create: {
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
    reveal: { warning: string; copy: string; copied: string; close: string }
  }
}

/** Formatea una fecha para mostrarla en la tabla */
function formatDate(date: Date | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('default', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

/** Componente cliente principal: tabla de API keys + diálogos */
export function ApiKeysPageClient({ initialKeys, translations: t }: IApiKeysPageClientProps) {
  const [keys, setKeys] = useState<IApiKeyRow[]>(initialKeys)
  const [revealKey, setRevealKey] = useState<string | null>(null)

  /** Recarga las keys desde el servidor tras crear/eliminar */
  const refreshKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/api-key')
      if (!res.ok) return
      const data = (await res.json()) as { keys: IApiKeyRow[] }
      setKeys(data.keys)
    } catch {
      /* silencioso — mantiene el estado actual */
    }
  }, [])

  const handleCreated = (plainKey: string) => {
    setRevealKey(plainKey)
    refreshKeys()
  }

  return (
    <>
      {/* Alerta de key recién creada */}
      {revealKey && (
        <ApiKeyRevealAlert translations={t.reveal} revealKey={revealKey} onDismiss={() => setRevealKey(null)} />
      )}

      {/* Header con botón crear */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <KeyRoundIcon className="size-6" />
            {t.title}
          </h2>
          <p className="text-muted-foreground mt-1">{t.description}</p>
        </div>
        <CreateApiKeyDialog translations={t.create} onCreated={handleCreated} />
      </div>

      {/* Tabla o estado vacío */}
      {keys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <KeyRoundIcon className="size-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">{t.table.empty}</p>
        </div>
      ) : (
        <div className="rounded-md border">
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
                  <TableCell className="text-muted-foreground">{formatDate(apiKey.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={apiKey.enabled ? 'default' : 'secondary'}>
                      {apiKey.enabled ? t.table.enabled : t.table.disabled}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DeleteApiKeyButton
                      translations={{
                        confirmTitle: t.table.confirmDelete,
                        confirmDescription: apiKey.name || t.table.unnamed,
                        cancel: t.table.cancel,
                        delete: t.table.delete,
                        error: t.create.error,
                      }}
                      keyId={apiKey.id}
                      keyName={apiKey.name || t.table.unnamed}
                      onDeleted={refreshKeys}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
