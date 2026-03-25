import { z } from 'zod'

export const calculatorSchema = z.object({
  expression: z.string().describe('The mathematical expression to evaluate (e.g. "2 + 2", "10 * 5", "100 / 4")'),
})

export type CalculatorSchema = z.infer<typeof calculatorSchema>
