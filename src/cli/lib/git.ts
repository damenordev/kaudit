/**
 * Utilidades para interactuar con Git y GitHub CLI.
 */
import { spawn } from 'node:child_process'

/** Ejecuta un comando y retorna la salida. */
function execCmd(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', d => (stdout += d))
    proc.stderr.on('data', d => (stderr += d))
    proc.on('close', c => (c === 0 ? resolve(stdout.trim()) : reject(new Error(stderr || `Exit ${c}`))))
    proc.on('error', reject)
  })
}

// ============ GIT ============

/** Verifica si es un repositorio git. */
export async function isGitRepo(): Promise<boolean> {
  try {
    await execCmd('git', ['rev-parse', '--is-inside-work-tree'])
    return true
  } catch {
    return false
  }
}

/** Obtiene el diff de cambios staged. */
export async function getStagedDiff(): Promise<string> {
  return execCmd('git', ['diff', '--cached', '--no-color'])
}

/** Obtiene el nombre de la rama actual. */
export async function getCurrentBranch(): Promise<string> {
  return execCmd('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
}

/** Obtiene la URL del remote. */
export async function getRepoUrl(): Promise<string | null> {
  try {
    return (await execCmd('git', ['config', '--get', 'remote.origin.url'])) || null
  } catch {
    return null
  }
}

/** Hace push de la rama al remote. */
export async function pushBranch(branch: string, remote = 'origin'): Promise<boolean> {
  try {
    await execCmd('git', ['push', '-u', remote, branch])
    return true
  } catch (e) {
    throw new Error(`Push falló: ${e instanceof Error ? e.message : e}`)
  }
}

/** Helpers internos */
async function hasRemote(): Promise<boolean> {
  try {
    return !!(await execCmd('git', ['remote']))
  } catch {
    return false
  }
}

async function branchExists(b: string): Promise<boolean> {
  try {
    await execCmd('git', ['rev-parse', '--verify', b])
    return true
  } catch {
    return false
  }
}

async function tryDiff(args: string[]): Promise<string | null> {
  try {
    const d = await execCmd('git', ['diff', ...args, '--no-color'])
    return d.trim() || null
  } catch {
    return null
  }
}

/** Obtiene diff entre rama actual y base. */
export async function getGitDiff(baseBranch: string): Promise<string> {
  const current = await getCurrentBranch()
  const remote = await hasRemote()

  if (current === baseBranch) {
    const d = await tryDiff(['HEAD~1...HEAD'])
    if (d) return d
  }

  if (remote && current !== baseBranch) {
    try {
      await execCmd('git', ['fetch', 'origin', baseBranch, '--depth=1'])
    } catch {}
    const d = await tryDiff([`origin/${baseBranch}...HEAD`])
    if (d) return d
  }

  if (current !== baseBranch && (await branchExists(baseBranch))) {
    const d = await tryDiff([`${baseBranch}...HEAD`])
    if (d) return d
  }

  return (await tryDiff(['HEAD~1...HEAD'])) || ''
}
