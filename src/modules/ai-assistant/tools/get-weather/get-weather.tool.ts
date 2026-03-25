import { tool } from 'ai'

import { getWeatherSchema, type GetWeatherSchema } from './get-weather.schema'

const executeFn = async ({ location, unit }: GetWeatherSchema) => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  const temperatures = {
    celsius: Math.floor(Math.random() * 30) + 5,
    fahrenheit: Math.floor(Math.random() * 86) + 41,
  } as Record<'celsius' | 'fahrenheit', number>

  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy']
  const condition = conditions[Math.floor(Math.random() * conditions.length)] || 'Sunny'

  return {
    location,
    temperature: temperatures[unit as 'celsius' | 'fahrenheit'],
    unit,
    condition,
    message: `El tiempo actual en ${location} es ${temperatures[unit as 'celsius' | 'fahrenheit']}º ${unit === 'celsius' ? 'C' : 'F'} y está ${condition.toLowerCase()}.`,
  }
}

export const getWeatherTool = tool({
  description: 'Get the current weather for a specific location.',
  parameters: getWeatherSchema,
  // @ts-expect-error AI SDK tool override
  execute: executeFn,
})
