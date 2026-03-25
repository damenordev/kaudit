'use server'

import { examplesSchema, type TExamplesForm } from '../components/examples-form/examples.schema'

export async function createExamplesAction(data: TExamplesForm) {
  const parsed = examplesSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  // TODO: Implement creation logic
  return { success: true }
}
