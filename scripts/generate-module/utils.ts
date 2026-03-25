import * as fs from 'node:fs'
import * as path from 'node:path'

import type { ModuleConfig } from './config'
import { DEFAULT_FOLDERS, OPTIONAL_FOLDERS } from './config'

export function validateModuleName(name: string): void {
  if (!name) {
    console.error(
      'Usage: pnpm run g:module <name> [--with-actions] [--with-services] [--with-lib] [--with-db] [--with-config] [--with-types] [--full]'
    )
    process.exit(1)
  }

  const modulePath = path.join(process.cwd(), 'src', 'modules', name)
  if (fs.existsSync(modulePath)) {
    console.error(`Module "${name}" already exists`)
    process.exit(1)
  }
}

export function getFoldersToCreate(config: ModuleConfig): string[] {
  const basePath = path.join(process.cwd(), config.path)
  const folders: string[] = [basePath]

  for (const folder of DEFAULT_FOLDERS) {
    folders.push(path.join(basePath, folder))
  }

  for (const [folder, flag] of Object.entries(OPTIONAL_FOLDERS)) {
    if (config.flags[flag]) {
      folders.push(path.join(basePath, folder))
    }
  }

  return folders
}
