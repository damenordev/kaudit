import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
    newPassword: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  })

export type TChangePasswordFormData = z.infer<typeof changePasswordSchema>
