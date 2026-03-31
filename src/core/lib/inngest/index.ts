/**
 * Entry point para el módulo de Inngest.
 * Exporta el cliente, tipos y funciones disponibles.
 */
import { processAudit } from '@/modules/audit/inngest'

export { inngest, type IInngestEvents, type TInngestEventIds } from './client'

// Array de funciones para registrar en Inngest
export const functions = [processAudit]
