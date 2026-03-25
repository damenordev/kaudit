import { useState } from 'react'

/**
 * Hook para gestionar el estado del editor y sus dialogs.
 * Separa la lógica de estado del componente Editor para mejor testabilidad.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const editorState = useEditorState()
 *   return <Editor {...editorState} />
 * }
 * ```
 */
export function useEditorState() {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const openLinkDialog = (url: string) => {
    setLinkUrl(url)
    setLinkDialogOpen(true)
  }

  const closeLinkDialog = () => {
    setLinkDialogOpen(false)
  }

  const openImageDialog = () => {
    setImageUrl('')
    setImageDialogOpen(true)
  }

  const closeImageDialog = () => {
    setImageDialogOpen(false)
  }

  return {
    linkDialogOpen,
    setLinkDialogOpen,
    linkUrl,
    setLinkUrl,
    imageDialogOpen,
    setImageDialogOpen,
    imageUrl,
    setImageUrl,
    openLinkDialog,
    closeLinkDialog,
    openImageDialog,
    closeImageDialog,
  }
}
