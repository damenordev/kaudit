/**
 * CLI Entry Point para GitHub Auditor.
 * Define el programa principal con commander.
 */
import { Command } from 'commander'

import { shipCommand } from './commands/ship'
import { createLoginCommand, createLogoutCommand } from './commands/login'
import type { ICliOptions } from './types/cli.types'
import { setNoColor } from './lib/display'

// Crear el programa principal
const program = new Command()

program
  .name('github-auditor')
  .description('CLI para GitHub Auditor AI - Audita tus PRs automáticamente')
  .version('1.0.0')
  .option('--base <branch>', 'Rama base para comparar', 'main')
  .option('--url <url>', 'URL de la API', 'http://localhost:3000')
  .option('--timeout <ms>', 'Timeout máximo de polling en ms', '600000')
  .option('--no-color', 'Deshabilitar colores', false)
  .option('--staged', 'Auditar cambios staged (git add) en lugar de commits', false)
  .option('--repo <url>', 'URL del repositorio (requerido si no hay remote)')
  .option('--no-push', 'No hacer push automático después de auditoría exitosa', false)
  .option('--fast', 'Modo rápido: omite generación de docstrings y tests', false)
  .action(async options => {
    // Configurar colores
    if (options.noColor) {
      setNoColor(true)
    }

    // Parsear opciones
    const cliOptions: ICliOptions = {
      base: options.base,
      url: options.url,
      timeout: parseInt(options.timeout, 10),
      noColor: options.noColor,
      staged: options.staged,
      repo: options.repo,
      // push es true por defecto, solo false si --no-push está presente
      push: !options.noPush,
      fast: options.fast,
    }

    // Ejecutar comando ship
    await shipCommand(cliOptions)
  })

// Registrar comandos de autenticación
program.addCommand(createLoginCommand())
program.addCommand(createLogoutCommand())

// Parsear argumentos y ejecutar
program.parse()
