/**
 * Entry point para el módulo de Inngest.
 * Exporta el cliente, tipos y funciones disponibles.
 */
export { inngest, type IInngestEvents, type TInngestEventIds } from './client'

// Array de funciones para registrar en Inngest
// Por ahora está vacío, se poblará cuando implementemos las funciones de auditoría
export const functions: never[] = []
