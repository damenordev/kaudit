/**
 * Utilidades para generar mensajes de error amigables al usuario.
 * NUNCA expone stack traces, URLs de API, keys, o detalles internos.
 */

/** Mensajes amigables según el tipo de error detectado */
const FRIENDLY_ERROR_MESSAGES = {
  tokenLimit: 'El diff es demasiado grande para procesarse completamente.',
  rateLimit: 'Error temporal del servicio de IA. Intenta de nuevo más tarde.',
  apiAuth: 'Error temporal del servicio de IA. Intenta de nuevo más tarde.',
  generic: 'Error inesperado durante la auditoría. Intenta de nuevo.',
} as const

/** Patrones para clasificar errores por tipo */
const ERROR_CLASSIFIERS: ReadonlyArray<{
  pattern: RegExp
  key: keyof typeof FRIENDLY_ERROR_MESSAGES
}> = [
  {
    pattern: /context_length_exceeded|too many tokens|token.?limit|max_tokens|exceeds.*context/i,
    key: 'tokenLimit',
  },
  {
    pattern: /rate.?limit|429|quota.?exceeded|too many requests/i,
    key: 'rateLimit',
  },
  {
    pattern: /401|403|authentication|unauthorized|api.?key|invalid.*key|forbidden/i,
    key: 'apiAuth',
  },
]

/**
 * Genera un mensaje de error amigable a partir de un error real.
 * Clasifica el error por su contenido y devuelve un mensaje seguro.
 * NUNCA expone información sensible como stack traces, URLs o keys.
 * @param error - Error original (Error, string, o unknown)
 * @returns Mensaje amigable para mostrar al usuario
 */
export function getFriendlyErrorMessage(error: unknown): string {
  const rawMessage = error instanceof Error ? error.message : String(error ?? '')

  for (const { pattern, key } of ERROR_CLASSIFIERS) {
    if (pattern.test(rawMessage)) {
      return FRIENDLY_ERROR_MESSAGES[key]
    }
  }

  return FRIENDLY_ERROR_MESSAGES.generic
}
