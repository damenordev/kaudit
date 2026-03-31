/**
 * Tipos para la instalación de GitHub App.
 * Define interfaces para OAuth callback, token response y la instalación persistida.
 */

export interface IGitHubInstallation {
  id: string
  userId: string | null
  installationId: number
  accountId: number
  accountLogin: string
  accountType: 'User' | 'Organization'
  accessToken: string | null
  refreshToken: string | null
  expiresAt: Date | null
  repositorySelection: 'all' | 'selected'
  repositories: IGitHubRepository[] | null
  createdAt: Date
  updatedAt: Date
}

export interface IGitHubRepository {
  id: number
  name: string
  fullName: string
  private: boolean
}

export interface IGitHubOAuthCallbackParams {
  code: string
  state?: string
}

export interface IGitHubTokenResponse {
  access_token: string
  token_type: string
  scope: string
  refresh_token?: string
  expires_in?: number
  refresh_token_expires_in?: number
}

export interface IGitHubInstallationTokenResponse {
  token: string
  expires_at: string
  repositories?: IGitHubRepository[]
}
