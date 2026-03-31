/**
 * Configuración centralizada de modelos de IA.
 * Define perfiles heavy/light con fallbacks, timeouts y context-aware budgets.
 */
import 'server-only'

import { openrouter } from '@/modules/ai-assistant/lib/openrouter'

// --- Timeouts ---

/** Timeout para llamadas con modelo light (30 segundos) */
export const AI_CALL_TIMEOUT_MS = 30_000

/** Timeout para llamadas con modelo heavy (120 segundos). Modelos gratuitos pueden tardar 45-90s en diffs grandes. */
export const AI_HEAVY_CALL_TIMEOUT_MS = 120_000

/** Timeout total del CLI para polling (10 minutos) */
export const CLI_TIMEOUT_MS = 600_000

// --- Límites de contexto por modelo ---

/** Mapa de modelo → contexto máximo en tokens */
export const MODEL_CONTEXT_LIMITS: Record<string, number> = {
  'qwen/qwen3.6-plus-preview:free': 1_000_000,
  'google/gemini-3-flash-preview': 1_000_000,
  'deepseek/deepseek-v3.2': 128_000,
  'openrouter/free': 128_000, // conservador
}

/** Tokens reservados para output del modelo */
export const RESERVED_OUTPUT_TOKENS = 4_096
/** Tokens reservados para el prompt template (instrucciones sin diff) */
export const RESERVED_PROMPT_TOKENS = 1_024
/** Margen de seguridad */
export const SAFETY_MARGIN = 512

// --- Selectores de modelo ---

/** Fallbacks para modelo heavy */
export const HEAVY_MODEL_FALLBACKS = ['google/gemini-3-flash-preview', 'deepseek/deepseek-v3.2']

/** Fallbacks para modelo light */
export const LIGHT_MODEL_FALLBACKS = ['qwen/qwen3.6-plus-preview:free', 'deepseek/deepseek-v3.2']

/**
 * Retorna el modelo heavy primario (env override o default).
 * Para tareas pesadas: validación, generación de PR description.
 */
export function getHeavyModel(): string {
  return process.env.AI_HEAVY_MODEL ?? 'qwen/qwen3.6-plus-preview:free'
}

/**
 * Retorna el modelo light primario (env override o default).
 * Para tareas livianas: docstrings, tests, chat.
 */
export function getLightModel(): string {
  return process.env.AI_LIGHT_MODEL ?? 'openrouter/free'
}

/** Lista de modelos heavy disponibles (primario + fallbacks) */
export const HEAVY_MODELS = [getHeavyModel(), ...HEAVY_MODEL_FALLBACKS] as const

/** Lista de modelos light disponibles (primario + fallbacks) */
export const LIGHT_MODELS = [getLightModel(), ...LIGHT_MODEL_FALLBACKS] as const

/**
 * Retorna el contexto máximo de un modelo.
 * Si no está mapeado, usa un valor conservador de 128K.
 */
export function getModelContextLimit(model: string): number {
  return MODEL_CONTEXT_LIMITS[model] ?? 128_000
}

/**
 * Calcula el presupuesto de tokens para diff según el modelo.
 * Usa tiers: >= 1M → ~800K, >= 128K → ~100K, default ~90K.
 */
export function getMaxDiffInputTokens(model?: string): number {
  const activeModel = model ?? getHeavyModel()
  const contextLimit = getModelContextLimit(activeModel)
  if (contextLimit >= 1_000_000) return 800_000
  if (contextLimit >= 128_000) return 100_000
  return 90_000
}

// --- Instancias AI SDK ---

/** Retorna la instancia AI SDK del modelo heavy */
export function getHeavyModelInstance() {
  return openrouter(getHeavyModel())
}

/** Retorna la instancia AI SDK del modelo light */
export function getLightModelInstance() {
  return openrouter(getLightModel())
}

/**
 * Retorna el modelo primario general (legacy).
 * @deprecated Usar getHeavyModel() o getLightModel() según la tarea.
 */
export function getAIModel(): string {
  return getLightModel()
}

/**
 * Retorna la instancia del modelo general (legacy).
 * @deprecated Usar getHeavyModelInstance() o getLightModelInstance().
 */
export function getAIProvider() {
  return openrouter(getLightModel())
}

/** Modelos disponibles (legacy) */
export const AI_MODELS = {
  free: getLightModel(),
  heavy: getHeavyModel(),
} as const

export type TAIModelId = (typeof AI_MODELS)[keyof typeof AI_MODELS]
