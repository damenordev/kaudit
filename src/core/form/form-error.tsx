'use client'

import { cn } from '@/core/utils'

/**
 * Componente para mostrar errores globales del formulario.
 */
export interface IFormErrorProps {
  errors: string | string[] | undefined
  className?: string
}

export const FormError: React.FC<IFormErrorProps> = ({ errors, className }) => {
  if (!errors) return null

  const errorArray: string[] = Array.isArray(errors) ? errors : [errors]
  const validErrors: string[] = errorArray.filter(
    (errorMsg): errorMsg is string => typeof errorMsg === 'string' && errorMsg.trim() !== ''
  )

  if (validErrors.length === 0) return null

  return (
    <div className={cn('space-y-1', className)}>
      {validErrors.map(errorMessage => (
        <p key={errorMessage} className="text-destructive text-sm font-medium" role="alert">
          {errorMessage}
        </p>
      ))}
    </div>
  )
}
