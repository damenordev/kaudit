import { tool } from 'ai'

import { calculatorSchema, type CalculatorSchema } from './calculator.schema'

const executeFn = async ({ expression }: CalculatorSchema) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Basic safe evaluation for math expressions
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${expression}`)()

    return {
      expression,
      result: String(result),
      error: undefined,
      message: `El resultado de ${expression} es ${result}.`,
    }
  } catch (error) {
    return {
      expression,
      result: undefined,
      error: 'Expresión inválida',
      message: `No se pudo calcular la expresión: ${expression}`,
    }
  }
}

export const calculatorTool = tool({
  description: 'Evaluate a mathematical expression.',
  parameters: calculatorSchema,
  // @ts-expect-error AI SDK tool override
  execute: executeFn,
})
