'use client'

import React from 'react'
import { Upload, X, File } from 'lucide-react'

import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { cn } from '@/core/utils'

/**
 * Props para el campo de carga de archivos.
 */
export interface IFormFileUploadFieldProps {
  label: string
  accept?: string
  multiple?: boolean
  description?: string
  required?: boolean
}

/**
 * Componente de campo file upload para formularios.
 */
export const FormFileUploadField: React.FC<IFormFileUploadFieldProps> = ({
  label,
  accept,
  multiple = false,
  description,
  required,
}) => {
  const field = useFieldContext<FileList | undefined>()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    field.handleChange(files && files.length > 0 ? files : undefined)
    field.handleBlur()
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      field.handleChange(files)
      field.handleBlur()
    }
  }

  const handleRemoveFile = (index: number) => {
    if (!field.state.value) return
    const dt = new DataTransfer()
    Array.from(field.state.value).forEach((file, i) => {
      if (i !== index) dt.items.add(file)
    })
    const newFiles = dt.files.length > 0 ? dt.files : undefined
    field.handleChange(newFiles)
    field.handleBlur()
  }

  const fileCount = field.state.value?.length ?? 0
  const files = field.state.value ? Array.from(field.state.value) : []

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <div className="space-y-2">
        <Input
          ref={fileInputRef}
          id={field.name}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          onBlur={field.handleBlur}
          className="hidden"
          aria-invalid={!field.state.meta.isValid && field.state.meta.isTouched}
        />
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            fileCount > 0 && 'border-primary/50'
          )}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className={cn('rounded-full p-3', fileCount > 0 ? 'bg-primary/10' : 'bg-muted')}>
                <Upload className={cn('h-6 w-6', fileCount > 0 ? 'text-primary' : 'text-muted-foreground')} />
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleButtonClick}
                  className="h-auto p-0 text-sm font-medium"
                >
                  Haz clic para subir
                </Button>
                <span className="text-sm text-muted-foreground"> o arrastra y suelta</span>
              </div>
              {accept && <p className="text-xs text-muted-foreground">Formatos aceptados: {accept}</p>}
            </div>
          </div>
        </div>
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-md border bg-card p-3"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <File className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormFieldWrapper>
  )
}
