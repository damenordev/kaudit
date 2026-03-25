import type { UIMessage } from 'ai'

export type AssistantUIMessage = UIMessage

export type ToolPartState = 'input-streaming' | 'input-available' | 'output-available' | 'output-error'

export interface IToolPart {
  type: `tool-${string}`
  state: ToolPartState
  input?: unknown
  output?: unknown
  errorText?: string
}

export interface ITextPart {
  type: 'text'
  text: string
}

export interface IReasoningPart {
  type: 'reasoning'
  reasoning: string
}

export function isTextPart(part: unknown): part is ITextPart {
  return typeof part === 'object' && part !== null && (part as { type?: string }).type === 'text'
}

export function isReasoningPart(part: unknown): part is IReasoningPart {
  return typeof part === 'object' && part !== null && (part as { type?: string }).type === 'reasoning'
}

export function isToolPart(part: unknown): part is IToolPart {
  if (typeof part !== 'object' || part === null) return false
  const p = part as { type?: string; state?: string }
  return typeof p.type === 'string' && p.type.startsWith('tool-') && isValidToolState(p.state)
}

function isValidToolState(state: unknown): state is ToolPartState {
  return (
    state === 'input-streaming' ||
    state === 'input-available' ||
    state === 'output-available' ||
    state === 'output-error'
  )
}
