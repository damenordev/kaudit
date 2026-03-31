/**
 * Tipos para el sistema de chat contextual sobre auditorías.
 * Define mensajes, requests y responses del chat con IA.
 */

/** Rol del emisor del mensaje */
export type TChatRole = 'user' | 'assistant'

/** Representa un mensaje individual del chat */
export interface IChatMessage {
  /** Rol del emisor */
  role: TChatRole
  /** Contenido del mensaje */
  content: string
}

/** Request para enviar mensajes al endpoint de chat */
export interface IChatRequest {
  /** Historial de mensajes del chat */
  messages: IChatMessage[]
}

/** Response del endpoint de chat (streaming) */
export interface IChatResponse {
  /** Indica si la respuesta fue exitosa */
  ok: boolean
  /** Mensaje de error si aplica */
  error?: string
}
