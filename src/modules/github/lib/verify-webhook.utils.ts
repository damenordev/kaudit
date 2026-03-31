/**
 * Utilidad para verificar la firma HMAC-SHA256 de webhooks de GitHub.
 * GitHub envía la firma en el header X-Hub-Signature-256.
 */
import { createHmac } from 'crypto'

/**
 * Verifica que el payload del webhook fue enviado por GitHub.
 * Compara la firma HMAC-SHA256 del header con la firma calculada localmente.
 * @param payload - Body crudo del request como string
 * @param signature - Valor del header X-Hub-Signature-256 (formato "sha256=<hex>")
 * @param secret - Secreto configurado en la GitHub App
 * @returns true si la firma es válida
 */
export function verifyGitHubWebhook(payload: string, signature: string, secret: string): boolean {
  if (!payload || !signature || !secret) return false

  // La firma de GitHub tiene el prefijo "sha256="
  const PREFIX = 'sha256='
  if (!signature.startsWith(PREFIX)) return false

  const expectedSignature = signature.slice(PREFIX.length)

  // Calcular HMAC-SHA256 del payload con el secreto
  const computed = createHmac('sha256', secret).update(payload, 'utf8').digest('hex')

  // Comparación timing-safe para evitar timing attacks
  return timingSafeEqual(computed, expectedSignature)
}

/**
 * Comparación timing-safe de dos strings hexadecimales.
 * Compara carácter por carácter en tiempo constante.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}
