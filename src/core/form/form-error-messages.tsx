'use client'

import React from 'react'

/**
 * Componente para mostrar mensajes de error en campos de formulario.
 */
export interface IFormErrorMessagesProps {
  id?: string
  errors: Array<string | { message: string }>
}

export const FormErrorMessages: React.FC<IFormErrorMessagesProps> = ({ id, errors }) => {
  return (
    <div id={id} role="alert" aria-live="polite" className="space-y-1">
      {errors.map(error => (
        <div key={typeof error === 'string' ? error : error.message} className="text-destructive text-xs font-medium">
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </div>
  )
}
