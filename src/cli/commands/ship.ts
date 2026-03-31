/**
 * Comando 'ship' del CLI.
 * Inicia una auditoría del diff actual y crea un PR.
 */
import type { ICliOptions, TCliStatus } from '../types/cli.types'

import { getGitDiff, getCurrentBranch, getRepoUrl, isGitRepo, getStagedDiff, pushBranch } from '../lib/git'
import { pollAuditStatus, startAudit, createPr } from '../lib/api'
import {
  showError,
  showResult,
  showSpinner,
  showSuccess,
  getStatusMessage,
  updateSpinner,
  showInfo,
} from '../lib/display'

/**
 * Ejecuta el comando ship.
 * 1. Verifica que estamos en un repo git
 * 2. Obtiene el diff
 * 3. Inicia la auditoría
 * 4. Hace polling hasta completar
 * 5. Muestra el resultado
 */
export async function shipCommand(options: ICliOptions): Promise<void> {
  const apiUrl = options.url || 'http://localhost:3000'
  const baseBranch = options.base || 'main'
  const timeout = options.timeout || 600_000

  // 1. Verificar que es un repo git
  showSpinner('Verificando repositorio git...')
  const isRepo = await isGitRepo()

  if (!isRepo) {
    showError('No es un repositorio git. Ejecuta desde un directorio git.')
    process.exit(1)
  }

  updateSpinner('Obteniendo información del repositorio...')

  // 2. Obtener info del repo
  const currentBranch = await getCurrentBranch()
  const detectedRepoUrl = await getRepoUrl()

  // Usar URL proporcionada o detectada, o placeholder para repos locales
  const repoUrl = options.repo || detectedRepoUrl || 'https://github.com/local/repository'

  // Obtener diff según modo (staged o commits)
  const gitDiff = options.staged ? await getStagedDiff() : await getGitDiff(baseBranch)

  // 3. Verificar si hay cambios
  if (!gitDiff || gitDiff.trim() === '') {
    showSuccess('No hay cambios para auditar!')
    process.exit(0)
  }

  const modeLabel = options.staged ? 'staged' : 'commits'
  showSpinner(`Rama: ${currentBranch} | Base: ${baseBranch} | Modo: ${modeLabel}`)

  // 4. Iniciar auditoría
  updateSpinner('Iniciando auditoría...')

  // Construir opciones de auditoría según flags del CLI
  const auditOptions = options.fast ? { skipDocstrings: true, skipTests: true } : undefined

  let audit: { auditId: string; status: string }
  try {
    audit = await startAudit(apiUrl, {
      repoUrl,
      branchName: currentBranch,
      targetBranch: baseBranch,
      gitDiff,
      options: auditOptions,
    })
  } catch (error) {
    showError(`Error al iniciar auditoría: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    process.exit(1)
  }

  // 5. Polling hasta completar
  updateSpinner(`Auditoría ${audit.auditId} - ${getStatusMessage(audit.status as TCliStatus)}...`)

  try {
    const result = await pollAuditStatus(
      apiUrl,
      audit.auditId,
      async status => {
        updateSpinner(`Auditoría ${audit.auditId} - ${getStatusMessage(status)}...`)
      },
      { timeout }
    )

    // 6. Mostrar resultado
    showSuccess('Auditoría completada!')
    showResult(result)

    // Exit con código apropiado si falló o bloqueó
    if (result.status === 'failed' || result.status === 'blocked') {
      process.exit(1)
    }

    // 7. Push automático si auditoría exitosa y push habilitado (default: true)
    if (result.status === 'completed' && options.push !== false) {
      showSpinner(`Haciendo push de la rama ${currentBranch}...`)
      try {
        await pushBranch(currentBranch)
        showSuccess(`Rama ${currentBranch} pusheada exitosamente!`)

        // Intentar crear PR automáticamente si hay contenido generado
        if (result.generatedContent?.title) {
          showSpinner('Creando Pull Request...')
          try {
            const prResult = await createPr(apiUrl, audit.auditId)
            if (prResult.success && prResult.prUrl) {
              showSuccess(`Pull Request creado: ${prResult.prUrl}`)
            } else {
              showError(`No se pudo crear el PR: ${prResult.error ?? 'Error desconocido'}`)
              showInfo(`Crea el PR manualmente:`)
              console.log(`  gh pr create --title "${result.generatedContent.title}" --base ${baseBranch}`)
            }
          } catch (prError) {
            showError(`No se pudo crear el PR automáticamente`)
            showInfo(`Crea el PR manualmente:`)
            console.log(`  gh pr create --title "${result.generatedContent.title}" --base ${baseBranch}`)
          }
        }
      } catch (pushError) {
        showError(`No se pudo hacer push: ${pushError instanceof Error ? pushError.message : 'Error desconocido'}`)
        showInfo('Puedes hacer push manualmente con: git push -u origin ' + currentBranch)
      }
    }
  } catch (error) {
    showError(`Error en auditoría: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    process.exit(1)
  }
}
