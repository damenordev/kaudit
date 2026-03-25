export interface Flags {
  withActions: boolean
  withServices: boolean
  withLib: boolean
  withDb: boolean
  withConfig: boolean
  withTypes: boolean
  full: boolean
}

export interface ModuleConfig {
  name: string
  capitalized: string
  camelCase: string
  path: string
  flags: Flags
}

export const DEFAULT_FOLDERS = ['components', 'locales'] as const
export const OPTIONAL_FOLDERS: Record<string, keyof Flags> = {
  actions: 'withActions',
  services: 'withServices',
  lib: 'withLib',
  models: 'withDb',
  config: 'withConfig',
  types: 'withTypes',
}

export function parseArgs(): { moduleName: string; flags: Flags } {
  const args = process.argv.slice(2)
  const moduleName = args.find(arg => !arg.startsWith('--'))

  const flags: Flags = {
    withActions: args.includes('--with-actions'),
    withServices: args.includes('--with-services'),
    withLib: args.includes('--with-lib'),
    withDb: args.includes('--with-db'),
    withConfig: args.includes('--with-config'),
    withTypes: args.includes('--with-types'),
    full: args.includes('--full'),
  }

  if (flags.full) {
    flags.withActions = true
    flags.withServices = true
    flags.withLib = true
    flags.withDb = true
    flags.withConfig = true
    flags.withTypes = true
  }

  return { moduleName: moduleName || '', flags }
}

export function createConfig(moduleName: string, flags: Flags): ModuleConfig {
  return {
    name: moduleName,
    capitalized: capitalize(moduleName),
    camelCase: toCamelCase(moduleName),
    path: `src/modules/${moduleName}`,
    flags,
  }
}

function capitalize(str: string): string {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function toCamelCase(str: string): string {
  return str
    .split('-')
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('')
}
