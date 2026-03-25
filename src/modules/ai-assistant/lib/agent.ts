import 'server-only'

import { ToolLoopAgent, wrapLanguageModel, extractReasoningMiddleware, type InferAgentUIMessage } from 'ai'

import { DEFAULT_MODEL, ALLOWED_MODELS, MODELS } from '../config/models.config'
import { AGENT_INSTRUCTIONS } from '../config/agent.instructions'
import { requesty, openrouter } from './'
import { tools } from '../tools'

/**
 * Crea una nueva instancia del agente de IA con el modelo seleccionado.
 */
export function createAgent(modelId: string = DEFAULT_MODEL) {
  const validatedModelId = ALLOWED_MODELS.includes(modelId) ? modelId : DEFAULT_MODEL
  const modelConfig = MODELS.find(m => m.id === validatedModelId)

  // Seleccionar el proveedor basado en la configuración del modelo
  const providerSlug = modelConfig?.providers[0]

  let model = providerSlug === 'openrouter' ? openrouter(validatedModelId) : requesty(validatedModelId)

  return new ToolLoopAgent({
    model,
    instructions: AGENT_INSTRUCTIONS,
    tools,
  })
}

/** Agente por defecto para exportaciones directas */
export const assistantAgent = createAgent()

/** Tipo inferido para los mensajes de la UI del asistente */
export type AssistantUIMessage = InferAgentUIMessage<typeof assistantAgent>
