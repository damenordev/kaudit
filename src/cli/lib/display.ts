/**
 * Utilidades de visualización para el CLI.
 * Maneja spinners, colores y formato de salida.
 */
import chalk from 'chalk'
import ora from 'ora'

import type { IAuditStatusResponse } from '@/modules/audit/types/api.types'
import type { TCliStatus } from '../types/cli.types'

// Instancia global del spinner
let spinner: ReturnType<typeof ora> | null = null

// Flag para deshabilitar colores
let noColor = false

/**
 * Configura si se deben deshabilitar los colores.
 */
export function setNoColor(value: boolean): void {
  noColor = value
}

/**
 * Muestra un spinner con un mensaje.
 */
export function showSpinner(message: string): void {
  if (!spinner) {
    spinner = ora(message).start()
  } else {
    spinner.text = message
  }
}

/**
 * Actualiza el mensaje del spinner.
 */
export function updateSpinner(message: string): void {
  if (spinner) {
    spinner.text = message
  }
}

/**
 * Detiene el spinner y muestra mensaje de éxito.
 */
export function showSuccess(message: string): void {
  if (spinner) {
    spinner.succeed(message)
    spinner = null
  } else {
    console.log(chalk.green('✓'), message)
  }
}

/**
 * Detiene el spinner y muestra mensaje de error.
 */
export function showError(message: string): void {
  if (spinner) {
    spinner.fail(message)
    spinner = null
  } else {
    console.log(chalk.red('✗'), message)
  }
}

/**
 * Muestra un mensaje informativo.
 */
export function showInfo(message: string): void {
  console.log(chalk.blue('ℹ'), message)
}

/**
 * Muestra el resultado final de la auditoría.
 */
export function showResult(audit: IAuditStatusResponse): void {
  console.log()
  console.log(chalk.bold('━'.repeat(50)))
  console.log(chalk.bold('  Resultado de la Auditoría'))
  console.log(chalk.bold('━'.repeat(50)))
  console.log()

  // Calcular tokens totales
  const validationTokens = audit.validationResult?.tokenUsage
  const generationTokens = audit.generatedContent?.tokenUsage
  const totalInput = (validationTokens?.inputTokens ?? 0) + (generationTokens?.inputTokens ?? 0)
  const totalOutput = (validationTokens?.outputTokens ?? 0) + (generationTokens?.outputTokens ?? 0)
  const totalTokens = totalInput + totalOutput

  if (audit.status === 'completed') {
    console.log(chalk.green('  ✓ Auditoría completada exitosamente!'))
    console.log()
    if (audit.prUrl) {
      console.log(chalk.cyan('  PR URL:'), audit.prUrl)
    }
  } else if (audit.status === 'blocked') {
    console.log(chalk.yellow('  ⚠ Auditoría bloqueada por problemas de seguridad'))
    console.log()
    if (audit.validationResult?.issues?.length) {
      console.log(chalk.yellow('  Issues encontrados:'), audit.validationResult.issues.length)
      for (const issue of audit.validationResult.issues) {
        console.log(chalk.gray(`    - [${issue.severity}] ${issue.message}`))
      }
    }
    if (audit.errorMessage) {
      console.log(chalk.gray('  Error:'), audit.errorMessage)
    }
  } else if (audit.status === 'failed') {
    console.log(chalk.red('  ✗ Auditoría fallida'))
    console.log()
    if (audit.errorMessage) {
      console.log(chalk.gray('  Error:'), audit.errorMessage)
    }
  }

  // Mostrar uso de tokens
  if (totalTokens > 0) {
    console.log()
    console.log(chalk.magenta('  📊 Tokens consumidos:'))
    console.log(chalk.gray(`     Input:  ${totalInput.toLocaleString()}`))
    console.log(chalk.gray(`     Output: ${totalOutput.toLocaleString()}`))
    console.log(chalk.gray(`     Total:  ${totalTokens.toLocaleString()}`))
  }

  console.log()
  console.log(chalk.gray('━'.repeat(50)))
}

/**
 * Traduce el status a un mensaje legible.
 */
export function getStatusMessage(status: TCliStatus): string {
  const messages: Record<TCliStatus, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    validating: 'Validando seguridad',
    generating: 'Generando contenido',
    completed: 'Completado',
    failed: 'Fallido',
    blocked: 'Bloqueado',
  }
  return messages[status] || status
}
