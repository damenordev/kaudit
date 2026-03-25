import { useState } from 'react'

/**
 * Hook para gestionar la subida de imágenes.
 * Maneja el estado de carga y la selección de archivos.
 *
 * @param onUpload - Función opcional para subir la imagen al servidor
 * @returns Objeto con estado de carga y función para manejar la selección de archivos
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const imageUpload = useImageUpload(handleUpload)
 *   return <input type="file" onChange={imageUpload.handleFileSelect} />
 * }
 * ```
 */
export function useImageUpload(onUpload?: (file: File) => Promise<string>) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onUpload) return

    setIsUploading(true)
    try {
      const uploadedUrl = await onUpload(file)
      return uploadedUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return undefined
    } finally {
      setIsUploading(false)
    }
  }

  return {
    isUploading,
    handleFileSelect,
  }
}
