'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ImageIcon, Link, Upload } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/core/ui/dialog'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { cn } from '@/core/utils'
import { useImageUpload } from './use-image-upload'
import { useLexKitEditor } from './lexkit.system'

export interface IEditorImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  onUrlChange: (url: string) => void
  onImageUpload?: (file: File) => Promise<string>
}

/**
 * Dialog para insertar imágenes en el editor.
 * Ofrece dos modos: insertar por URL o subir un archivo.
 */
export function EditorImageDialog({ open, onOpenChange, url, onUrlChange, onImageUpload }: IEditorImageDialogProps) {
  const t = useTranslations('dashboard.editor.imageDialog')
  const { commands } = useLexKitEditor()
  const imageUpload = useImageUpload(onImageUpload)
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [dragOver, setDragOver] = useState(false)

  const handleSubmitUrl = async () => {
    if (!url.trim()) return
    commands.insertImage({ src: url.trim(), alt: '' })
    onOpenChange(false)
    onUrlChange('')
  }

  const handleFileChange = async (file: File) => {
    if (!onImageUpload) return
    try {
      const src = await onImageUpload(file)
      commands.insertImage({ src, alt: file.name })
      onOpenChange(false)
      onUrlChange('')
    } catch {
      // Upload failed
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) handleFileChange(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        {/* Mode Tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            type="button"
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              mode === 'url' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMode('url')}
          >
            <Link className="h-3.5 w-3.5" />
            URL
          </button>
          {onImageUpload && (
            <button
              type="button"
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                mode === 'upload'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setMode('upload')}
            >
              <Upload className="h-3.5 w-3.5" />
              {t('uploadLabel')}
            </button>
          )}
        </div>

        {/* URL Mode */}
        {mode === 'url' && (
          <div className="grid gap-2">
            <Label htmlFor="editor-image-url">{t('urlLabel')}</Label>
            <Input
              id="editor-image-url"
              type="url"
              placeholder={t('urlPlaceholder')}
              value={url}
              onChange={e => onUrlChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmitUrl()}
            />
          </div>
        )}

        {/* Upload Mode */}
        {mode === 'upload' && onImageUpload && (
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors',
              dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'
            )}
            onDragOver={e => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {imageUpload.isUploading ? 'Uploading...' : 'Drop image here'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </div>
            <Input
              id="editor-image-file"
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleFileChange(file)
              }}
              disabled={imageUpload.isUploading}
              className="cursor-pointer opacity-0 absolute inset-0 w-full h-full"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={imageUpload.isUploading}>
            {t('cancel')}
          </Button>
          {mode === 'url' && (
            <Button onClick={handleSubmitUrl} disabled={!url.trim() || imageUpload.isUploading}>
              {t('insert')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
