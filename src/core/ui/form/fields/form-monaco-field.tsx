'use client'

import React from 'react'
import Editor from '@monaco-editor/react'

import { useThemePalette } from '@/core/components/theme/palette/palette-provider'
import { useFieldContext } from '../form.context'
import { FormFieldWrapper } from '../form-field-wrapper'

/**
 * Props para el campo Monaco Editor.
 */
export interface IFormMonacoFieldProps {
  label: string
  height?: string
  language?: string
  placeholder?: string
  description?: string
  required?: boolean
  options?: Record<string, unknown>
}

/**
 * Componente de campo Monaco Editor para formularios.
 */
export const FormMonacoField: React.FC<IFormMonacoFieldProps> = ({
  label,
  height = '400px',
  language = 'text',
  description,
  required,
  options = {},
}) => {
  const field = useFieldContext<string>()
  const { isDark } = useThemePalette()

  return (
    <FormFieldWrapper label={label} description={description} required={required}>
      <div className="rounded-md border overflow-hidden bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-shadow shadow-sm">
        <Editor
          height={height}
          language={language}
          theme={isDark ? 'vs-dark' : 'vs'}
          value={field.state.value}
          onChange={value => field.handleChange(value ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
            },
            ...options,
          }}
        />
      </div>
    </FormFieldWrapper>
  )
}
