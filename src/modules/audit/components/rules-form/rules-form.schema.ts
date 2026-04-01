import { z } from 'zod'

export const rulesFormSchema = z.object({
  customRules: z.string().max(2000, 'Las reglas no pueden exceder los 2000 caracteres').optional(),
})

export type TRulesForm = z.infer<typeof rulesFormSchema>
