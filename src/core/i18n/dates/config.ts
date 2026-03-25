import type { DateTimeFormatOptions } from 'next-intl'

export const TIMEZONE_COOKIE_NAME = 'NEXT_TIMEZONE'
export const DATE_FORMAT_COOKIE_NAME = 'NEXT_DATE_FORMAT'

export const DATE_FORMATS = [
  { value: 'PP', label: 'Estándar', description: 'Formato localizado con texto' },
  { value: 'dd/MM/yyyy', label: 'Europeo', description: 'Día / Mes / Año' },
  { value: 'MM/dd/yyyy', label: 'Americano', description: 'Mes / Día / Año' },
  { value: 'yyyy-MM-dd', label: 'ISO', description: 'Año - Mes - Día' },
] as const

export type TDateFormat = (typeof DATE_FORMATS)[number]['value']
export const DEFAULT_DATE_FORMAT: TDateFormat = 'dd/MM/yyyy'

export const COMMON_TIMEZONES = [
  { value: 'Europe/Madrid', label: 'Europe/Madrid' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'Europe/Paris', label: 'Europe/Paris' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin' },
  { value: 'America/New_York', label: 'America/New York' },
  { value: 'America/Chicago', label: 'America/Chicago' },
  { value: 'America/Denver', label: 'America/Denver' },
  { value: 'America/Los_Angeles', label: 'America/Los Angeles' },
  { value: 'America/Mexico_City', label: 'America/Mexico City' },
  { value: 'America/Bogota', label: 'America/Bogota' },
  { value: 'America/Lima', label: 'America/Lima' },
  { value: 'America/Santiago', label: 'America/Santiago' },
  { value: 'America/Buenos_Aires', label: 'America/Buenos Aires' },
  { value: 'America/Sao_Paulo', label: 'America/Sao Paulo' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland' },
  { value: 'UTC', label: 'UTC' },
] as const

export const getAllTimezones = () => {
  if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
    try {
      return Intl.supportedValuesOf('timeZone').map(tz => ({
        value: tz,
        label: tz.replace(/_/g, ' '),
      }))
    } catch {
      console.warn('Intl.supportedValuesOf not supported')
    }
  }
  return COMMON_TIMEZONES.map(tz => ({ value: tz.value, label: tz.label }))
}

export type TTimezone = string
export const DEFAULT_TIMEZONE: TTimezone = 'Europe/Madrid'

export const NEXT_INTL_DATE_FORMAT_KEY = 'date' as const

export const DATE_FORMAT_TO_INTL_OPTIONS: Record<TDateFormat, DateTimeFormatOptions> = {
  PP: { month: 'long', day: 'numeric', year: 'numeric' },
  'dd/MM/yyyy': { day: '2-digit', month: '2-digit', year: 'numeric' },
  'MM/dd/yyyy': { month: '2-digit', day: '2-digit', year: 'numeric' },
  'yyyy-MM-dd': { year: 'numeric', month: '2-digit', day: '2-digit' },
}
