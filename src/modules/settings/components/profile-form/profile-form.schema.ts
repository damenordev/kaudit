import { z } from 'zod'

export const profileFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  bio: z.string().max(500, 'La biografia no puede exceder 500 caracteres').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[\d\s-]{7,15}$/, 'Formato de telefono invalido')
    .optional()
    .or(z.literal('')),
  location: z.string().max(100, 'La ubicacion no puede exceder 100 caracteres').optional().or(z.literal('')),
})

export type TProfileFormData = z.infer<typeof profileFormSchema>
