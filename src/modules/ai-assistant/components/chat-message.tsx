'use client'

import { Message, MessageContent, MessageResponse } from './primitives/message'
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from './primitives/tool'
import { Reasoning, ReasoningContent, ReasoningTrigger } from './primitives/reasoning'

import {
  isTextPart,
  isToolPart,
  isReasoningPart,
  type AssistantUIMessage,
  type ITextPart,
  type IToolPart,
  type IReasoningPart,
} from '../lib/types'
import { cn } from '@/core/utils'

function getPartKey(part: ITextPart | IToolPart | IReasoningPart, index: number): string {
  if (isTextPart(part)) {
    return `text-${part.text.slice(0, 20).replace(/\s/g, '_')}-${index}`
  }
  if (isReasoningPart(part)) {
    return `reasoning-${index}`
  }
  if (isToolPart(part)) {
    return `tool-${part.type}-${part.state}-${index}`
  }
  return `part-${index}`
}

export interface IChatMessageProps {
  message: AssistantUIMessage
}

export function ChatMessage({ message }: IChatMessageProps) {
  return (
    <Message from={message.role}>
      <MessageContent className={cn(message.role === 'assistant' && 'w-full')}>
        {message.parts?.map((part, index) => {
          const key = getPartKey(part as ITextPart | IToolPart | IReasoningPart, index)
          if (isTextPart(part)) {
            return <MessageResponse key={key}>{part.text}</MessageResponse>
          }

          if (isReasoningPart(part)) {
            return (
              <Reasoning key={key}>
                <ReasoningTrigger />
                <ReasoningContent>{(part as IReasoningPart).reasoning}</ReasoningContent>
              </Reasoning>
            )
          }

          if (isToolPart(part)) {
            return (
              <Tool key={key} defaultOpen={false} className="w-full">
                <ToolHeader type={part.type as any} state={part.state} />
                <ToolContent>
                  {part.input !== undefined && <ToolInput input={part.input as Record<string, unknown>} />}
                  <ToolOutput output={part.output as Record<string, unknown> | undefined} errorText={part.errorText} />
                </ToolContent>
              </Tool>
            )
          }

          return null
        })}
      </MessageContent>
    </Message>
  )
}
