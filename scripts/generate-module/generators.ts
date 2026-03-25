import * as fs from 'node:fs'
import * as path from 'node:path'

import type { ModuleConfig } from './config'
import { templates } from './templates'

export function generateComponents(config: ModuleConfig): void {
  const { name, capitalized, camelCase, path: modulePath } = config
  const componentsPath = path.join(process.cwd(), modulePath, 'components')

  fs.mkdirSync(componentsPath, { recursive: true })

  // Only generate form scaffolding if actions are included (form needs action)
  if (config.flags.withActions) {
    const formPath = path.join(componentsPath, `${name}-form`)
    fs.mkdirSync(formPath, { recursive: true })

    fs.writeFileSync(path.join(formPath, `${name}-form.tsx`), templates.components.formComponent(name, capitalized))
    fs.writeFileSync(
      path.join(formPath, `${name}.schema.ts`),
      templates.components.formSchema(name, capitalized, camelCase)
    )
    fs.writeFileSync(
      path.join(formPath, `use-${name}-form.ts`),
      templates.components.formHook(name, capitalized, camelCase)
    )
    fs.writeFileSync(path.join(formPath, 'index.ts'), templates.components.formBarrel(name))

    fs.writeFileSync(path.join(componentsPath, `${name}-list.tsx`), templates.components.listComponent(capitalized))
    fs.writeFileSync(path.join(componentsPath, 'index.ts'), templates.components.barrel(name, capitalized))
  } else {
    // Minimal: just an empty barrel
    fs.writeFileSync(path.join(componentsPath, 'index.ts'), '// Export components here\n')
  }
}

export function generateActions(config: ModuleConfig): void {
  const { name, capitalized, camelCase, path: modulePath } = config
  const actionsPath = path.join(process.cwd(), modulePath, 'actions')

  fs.mkdirSync(actionsPath, { recursive: true })

  fs.writeFileSync(
    path.join(actionsPath, `${name}.actions.ts`),
    templates.actions.content(name, capitalized, camelCase)
  )
  fs.writeFileSync(path.join(actionsPath, 'index.ts'), templates.actions.barrel(name))
}

export function generateServices(config: ModuleConfig): void {
  const { name, capitalized, path: modulePath } = config
  const servicesPath = path.join(process.cwd(), modulePath, 'services')

  fs.mkdirSync(servicesPath, { recursive: true })

  fs.writeFileSync(path.join(servicesPath, `${name}.service.ts`), templates.services.content(capitalized))
  fs.writeFileSync(path.join(servicesPath, 'index.ts'), templates.services.barrel(name))
}

export function generateModels(config: ModuleConfig): void {
  const { name, camelCase, path: modulePath } = config
  const modelsPath = path.join(process.cwd(), modulePath, 'models')

  fs.mkdirSync(modelsPath, { recursive: true })

  fs.writeFileSync(path.join(modelsPath, `${name}.schema.ts`), templates.models.schema(name, camelCase))
  fs.writeFileSync(path.join(modelsPath, 'index.ts'), templates.models.barrel(name))
}

export function generateTypes(config: ModuleConfig): void {
  const { name, capitalized, path: modulePath } = config
  const typesPath = path.join(process.cwd(), modulePath, 'types')

  fs.mkdirSync(typesPath, { recursive: true })

  fs.writeFileSync(path.join(typesPath, `${name}.types.ts`), templates.types.content(capitalized))
  fs.writeFileSync(path.join(typesPath, 'index.ts'), templates.types.barrel(name))
}

export function generateConfig(config: ModuleConfig): void {
  const { name, path: modulePath } = config
  const configPath = path.join(process.cwd(), modulePath, 'config')

  fs.mkdirSync(configPath, { recursive: true })

  fs.writeFileSync(path.join(configPath, `${name}.config.ts`), templates.config.content(name))
  fs.writeFileSync(path.join(configPath, 'index.ts'), templates.config.barrel(name))
}

export function generateLocales(config: ModuleConfig): void {
  const localesPath = path.join(process.cwd(), config.path, 'locales')

  fs.mkdirSync(localesPath, { recursive: true })

  fs.writeFileSync(path.join(localesPath, 'en.json'), JSON.stringify({}, null, 2))
  fs.writeFileSync(path.join(localesPath, 'es.json'), JSON.stringify({}, null, 2))
}

export function generateLib(config: ModuleConfig): void {
  const libPath = path.join(process.cwd(), config.path, 'lib')

  fs.mkdirSync(libPath, { recursive: true })

  fs.writeFileSync(path.join(libPath, 'index.ts'), '')
}

export function generateBarrels(config: ModuleConfig): void {
  const { flags, path: modulePath } = config
  const basePath = path.join(process.cwd(), modulePath)

  fs.writeFileSync(path.join(basePath, 'index.ts'), templates.barrels.clientSafe(flags))

  // Only generate server.ts if there are server-side exports
  const hasServerExports = flags.withActions || flags.withServices || flags.withDb || flags.withTypes
  if (hasServerExports) {
    fs.writeFileSync(path.join(basePath, 'server.ts'), templates.barrels.serverSide(flags))
  }
}
