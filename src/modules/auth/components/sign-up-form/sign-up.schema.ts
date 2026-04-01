import { z } from 'zod'

export const signUpSchema = z
  .object({
    name: z.string().min(2, 'auth.errors.nameTooShort'),
    email: z.string().email('auth.errors.invalidEmail'),
    password: z.string().min(8, 'auth.errors.passwordTooShort'),
    confirmPassword: z.string().min(8, 'auth.errors.passwordTooShort'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'auth.errors.passwordsDontMatch',
    path: ['confirmPassword'],
  })

export type TSignUpForm = z.infer<typeof signUpSchema>
