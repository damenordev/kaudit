/**
 * Configuración de modelos disponibles para el selector de modelos del chat
 * Centralizado para evitar duplicación entre la UI y el Agente.
 */

export interface IModel {
  id: string
  name: string
  chef: string
  chefSlug: string
  providers: string[]
}

export const MODELS: IModel[] = [
  {
    id: 'google/gemini-3.1-flash-lite-preview',
    name: 'Gemini 3.1 Flash Lite',
    chef: 'Google',
    chefSlug: 'google',
    providers: ['google'],
  },
  {
    id: 'google/gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    chef: 'Google',
    chefSlug: 'google',
    providers: ['google'],
  },
  {
    id: 'google/gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    chef: 'Google',
    chefSlug: 'google',
    providers: ['google'],
  },
  {
    id: 'novita/deepseek/deepseek-v3.2',
    name: 'DeepSeek V3.2',
    chef: 'Novita',
    chefSlug: 'novita',
    providers: ['novita'],
  },
  {
    id: 'minimaxi/MiniMax-M2.5',
    name: 'MiniMax M2.5',
    chef: 'Minimaxi',
    chefSlug: 'minimaxi',
    providers: ['minimaxi'],
  },
  {
    id: 'moonshot/kimi-k2.5',
    name: 'Kimi K2.5',
    chef: 'Moonshot',
    chefSlug: 'moonshot',
    providers: ['moonshot'],
  },
  { id: 'alibaba/qwen3-max', name: 'Qwen3 Max', chef: 'Alibaba', chefSlug: 'alibaba', providers: ['alibaba'] },
  { id: 'alibaba/qwen3.5', name: 'Qwen3.5', chef: 'Alibaba', chefSlug: 'alibaba', providers: ['alibaba'] },
  {
    id: 'alibaba/qwen3-coder-plus',
    name: 'Qwen3 Coder Plus',
    chef: 'Alibaba',
    chefSlug: 'alibaba',
    providers: ['alibaba'],
  },
  { id: 'zai/GLM-5', name: 'GLM-5', chef: 'Zai', chefSlug: 'zai', providers: ['zai'] },
  { id: 'zai/GLM-4.7', name: 'GLM-4.7', chef: 'Zai', chefSlug: 'zai', providers: ['zai'] },
  {
    id: 'openrouter/free',
    name: 'OpenRouter Free',
    chef: 'OpenRouter',
    chefSlug: 'openrouter',
    providers: ['openrouter'],
  },
]

export const ALLOWED_MODELS = MODELS.map(m => m.id) as [string, ...string[]]

export const CHEFS = Array.from(new Set(MODELS.map(m => m.chef))).sort()

export const DEFAULT_MODEL = MODELS[0]!.id
