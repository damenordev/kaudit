import { calculatorTool } from './calculator'
import { getWeatherTool } from './get-weather'

export const tools = {
  getWeather: getWeatherTool,
  calculator: calculatorTool,
}

export * from './calculator'
export * from './get-weather'
