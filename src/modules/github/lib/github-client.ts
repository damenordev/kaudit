/**
 * Cliente de GitHub API usando Octokit.
 * Singleton con inicialización lazy para optimizar recursos.
 */
import 'server-only'

import { Octokit } from 'octokit'

import { env } from '@/env'

// Instancia singleton del cliente Octokit
let octokit: Octokit | null = null

/**
 * Obtiene el cliente de GitHub API.
 * Retorna null si no hay token configurado.
 * @returns Instancia de Octokit o null
 */
export const getGitHubClient = (): Octokit | null => {
  // Sin token, no hay cliente
  if (!env.GITHUB_TOKEN) return null

  // Inicialización lazy del singleton
  if (!octokit) octokit = new Octokit({ auth: env.GITHUB_TOKEN })
  return octokit
}

/**
 * Verifica si el cliente de GitHub está disponible.
 * @returns true si hay token configurado
 */
export const isGitHubAvailable = (): boolean => {
  return env.GITHUB_TOKEN !== undefined && env.GITHUB_TOKEN !== ''
}
