#!/usr/bin/env npx tsx
import * as fs from 'node:fs'

import { parseArgs, createConfig } from './config'
import { validateModuleName, getFoldersToCreate } from './utils'
import {
  generateComponents,
  generateActions,
  generateServices,
  generateModels,
  generateTypes,
  generateConfig,
  generateLocales,
  generateLib,
  generateBarrels,
} from './generators'

const { moduleName, flags } = parseArgs()

validateModuleName(moduleName)

const config = createConfig(moduleName, flags)

const folders = getFoldersToCreate(config)
folders.forEach(dir => fs.mkdirSync(dir, { recursive: true }))

// Always generated (minimal contract)
generateComponents(config)
generateLocales(config)

// Optional generators
if (flags.withActions) {
  generateActions(config)
}

if (flags.withServices) {
  generateServices(config)
}

if (flags.withLib) {
  generateLib(config)
}

if (flags.withDb) {
  generateModels(config)
}

if (flags.withTypes) {
  generateTypes(config)
}

if (flags.withConfig) {
  generateConfig(config)
}

// Always generated (barrels adapt based on flags)
generateBarrels(config)

console.log(`Module "${moduleName}" created at src/modules/${moduleName}`)

const generated = ['components/', 'locales/']
if (flags.withActions) generated.push('actions/')
if (flags.withServices) generated.push('services/')
if (flags.withLib) generated.push('lib/')
if (flags.withDb) generated.push('models/')
if (flags.withTypes) generated.push('types/')
if (flags.withConfig) generated.push('config/')
console.log(`  Folders: ${generated.join(', ')}`)

const nextSteps: string[] = []
if (flags.withDb) {
  nextSteps.push('1. Add the table to src/core/db/schema.ts')
  nextSteps.push('2. Run: pnpm run db:push')
  nextSteps.push('3. Run: pnpm run db:sync')
}

if (nextSteps.length > 0) {
  console.log('\nNext steps:')
  nextSteps.forEach(step => console.log(step))
}
