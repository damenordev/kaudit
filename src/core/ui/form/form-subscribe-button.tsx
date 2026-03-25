'use client'

import React from 'react'

import { useFormContext } from './form.context'
import { Button } from '@/core/ui/button'

/**
 * Componente botón que se suscribe al estado de envío del formulario.
 */
export interface IFormSubscribeButtonProps {
  label: string
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const FormSubscribeButton: React.FC<IFormSubscribeButtonProps> = ({ label, className, size }) => {
  const form = useFormContext()
  return (
    <form.Subscribe selector={state => state.isSubmitting}>
      {isSubmitting => (
        <Button type="submit" disabled={isSubmitting} className={className} size={size}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
