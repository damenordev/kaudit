import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export type TSignInForm = z.infer<typeof signInSchema>
