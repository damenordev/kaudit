'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/core/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/core/ui/dialog'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { useLexKitEditor } from './lexkit.system'

export interface IEditorLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  onUrlChange: (url: string) => void
}

/**
 * Dialog para insertar/editar enlaces en el editor.
 *
 * @example
 * ```tsx
 * <EditorLinkDialog
 *   open={linkDialogOpen}
 *   onOpenChange={setLinkDialogOpen}
 *   url={linkUrl}
 *   onUrlChange={setLinkUrl}
 * />
 * ```
 */
export const EditorLinkDialog = ({ open, onOpenChange, url, onUrlChange }: IEditorLinkDialogProps) => {
  const t = useTranslations('dashboard.editor.linkDialog')
  const { commands } = useLexKitEditor()

  const handleSubmit = () => {
    if (url.trim() === '') {
      commands.removeLink()
    } else {
      commands.insertLink(url.trim())
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="editor-link-url">{t('urlLabel')}</Label>
          <Input
            id="editor-link-url"
            type="url"
            placeholder={t('urlPlaceholder')}
            value={url}
            onChange={e => onUrlChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit}>{t('apply')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
