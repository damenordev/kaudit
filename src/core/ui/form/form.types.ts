/**
 * Tipos compartidos para el módulo de formularios.
 */

export type TFormFieldValue = string | number | boolean | null | undefined

export interface IFormFieldBaseProps {
  label: string
  description?: string
  required?: boolean
}
