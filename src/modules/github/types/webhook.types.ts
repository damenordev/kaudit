/**
 * Tipos para los webhooks de GitHub App.
 * Define los payloads que recibimos del webhook de pull_request.
 */

// Subset de datos del repositorio enviados en el webhook
export interface IGitHubWebhookRepository {
  full_name: string
  html_url: string
  name: string
  owner: {
    login: string
  }
}

// Subset de datos del Pull Request enviado en el webhook
export interface IGitHubPullRequest {
  number: number
  title: string
  html_url: string
  head: {
    ref: string
    sha: string
    label?: string
    repo: {
      full_name: string
      html_url: string
    }
  }
  base: {
    ref: string
    sha: string
    repo: {
      full_name: string
      html_url: string
    }
  }
}

// Payload del evento pull_request del webhook de GitHub
export interface IGitHubPullRequestEvent {
  action: string
  number: number
  pull_request: IGitHubPullRequest
  repository: IGitHubWebhookRepository
  installation?: {
    id: number
  }
}

// Evento genérico del webhook (para discriminación)
export interface IGitHubWebhookEvent {
  action?: string
  pull_request?: IGitHubPullRequest
  repository?: IGitHubWebhookRepository
  installation?: {
    id: number
  }
}

// Acciones de PR que disparamen auditoría
export type TGitHubPrAction = 'opened' | 'synchronize'
