/**
 * Cliente de GitHub API usando Octokit.
 * Singleton con inicialización lazy para modo PAT.
 * Soporte dual: PAT (Personal Access Token) y GitHub App (por instalación).
 */
import 'server-only'

import { Octokit } from 'octokit'

import { env } from '@/env'

import { getInstallationOctokit, isGitHubAppConfigured } from './github-app-auth'

// Instancia singleton del cliente Octokit (modo PAT)
let patOctokit: Octokit | null = null

/**
 * Obtiene el cliente de GitHub API usando PAT (Personal Access Token).
 * Retorna null si no hay token configurado.
 * Mantiene la firma síncrona original para compatibilidad con callers existentes.
 */
export const getGitHubClient = (): Octokit | null => {
  // Sin token, no hay cliente
  if (!env.GITHUB_TOKEN) return null

  // Inicialización lazy del singleton
  if (!patOctokit) patOctokit = new Octokit({ auth: env.GITHUB_TOKEN })
  return patOctokit
}

/**
 * Obtiene un cliente Octokit con scope de instalación de GitHub App.
 * Usa autenticación por instalación si la App está configurada,
 * si no, cae a modo PAT (Personal Access Token).
 * @param installationId - ID de la instalación (del webhook payload)
 * @returns Octokit autenticado o null si no hay credenciales
 */
export const getGitHubClientForInstallation = async (installationId?: number | null): Promise<Octokit | null> => {
  // Si hay installationId y la App está configurada, usar modo App
  if (installationId && isGitHubAppConfigured()) {
    return getInstallationOctokit(installationId)
  }

  // Fallback a modo PAT
  return getGitHubClient()
}

/**
 * Verifica si el cliente de GitHub está disponible (PAT o App).
 */
export const isGitHubAvailable = (): boolean => {
  return isGitHubAppConfigured() || (env.GITHUB_TOKEN !== undefined && env.GITHUB_TOKEN !== '')
}
