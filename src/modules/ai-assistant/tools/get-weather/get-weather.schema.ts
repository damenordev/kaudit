import { z } from 'zod'

export const getWeatherSchema = z.object({
  location: z.string().describe('The city or location to get the weather for (e.g. "Madrid", "New York")'),
  unit: z.enum(['celsius', 'fahrenheit']).default('celsius').describe('The temperature unit to use'),
})

export type GetWeatherSchema = z.infer<typeof getWeatherSchema>
