import { z } from 'zod'

export const examplesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export type TExamplesForm = z.infer<typeof examplesSchema>
