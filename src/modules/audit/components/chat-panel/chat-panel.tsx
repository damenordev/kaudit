'use client'

import { useCallback, useRef, useState } from 'react'
import { Bot, Loader2 } from 'lucide-react'
import { Badge } from '@/core/ui/badge'
import { cn } from '@/core/utils/cn.utils'

import type { IChatMessage, IChangedFile, IEnrichedIssue } from '../../types'
import { ChatEmptyState } from './chat-empty-state'
import { sileo } from 'sileo'
import { applySuggestionAction } from '../../actions/suggestions.actions'

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/modules/ai-assistant/components/primitives/conversation'
import { Message, MessageContent } from '@/modules/ai-assistant/components/primitives/message'
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/modules/ai-assistant/components/primitives/prompt-input'
import { ChatMarkdown } from './chat-markdown'

export interface IAuditChatPanelProps {
  auditId: string
  changedFiles?: IChangedFile[]
  issues?: IEnrichedIssue[]
  translations: {
    title: string
    badge: string
    placeholder: string
    contextInfo: string
    filesCount: string
    issuesCount: string
    thinking: string
    errorMessage: string
    connectionError: string
    inputPlaceholder: string
  }
  className?: string
}

export function AuditChatPanel({ auditId, changedFiles, issues, translations, className }: IAuditChatPanelProps) {
  const [messages, setMessages] = useState<IChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      const text = input.trim()
      if (!text || isLoading) return

      const userMessage: IChatMessage = { role: 'user', content: text }
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setInput('')
      setIsLoading(true)

      try {
        const response = await fetch(`/api/audit/${auditId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
        })

        if (!response.ok) {
          setMessages(prev => [...prev, { role: 'assistant', content: translations.errorMessage }])
          return
        }

        const reader = response.body?.getReader()
        if (!reader) return

        let accumulated = ''
        setMessages(prev => [...prev, { role: 'assistant', content: '' }])

        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setMessages(prev => {
            const next = [...prev]
            next[next.length - 1] = { role: 'assistant', content: accumulated }
            return next
          })
        }
      } catch {
        setMessages(prev => [...prev, { role: 'assistant', content: translations.connectionError }])
      } finally {
        setIsLoading(false)
        inputRef.current?.focus()
      }
    },
    [input, isLoading, messages, auditId, translations]
  )

  const handleApplySuggestion = useCallback(
    async (code: string) => {
      sileo.info({ title: 'Applying suggestion...' })
      const result = await applySuggestionAction(auditId, code)
      if (result.success) {
        sileo.success({ title: 'Suggestion applied successfully to GitHub!' })
      } else {
        sileo.error({ title: result.error ?? 'Failed to apply suggestion' })
      }
    },
    [auditId]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void handleSubmit()
      }
    },
    [handleSubmit]
  )

  return (
    <div className={cn('flex flex-col border rounded-xl bg-background shadow-sm overflow-hidden', className)}>
      <div className="flex items-center gap-2 p-3.5 border-b bg-muted/30">
        <Bot className="size-4 text-primary" />
        <h3 className="text-sm font-semibold tracking-tight">{translations.title}</h3>
        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider">
          {translations.badge}
        </Badge>
      </div>

      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="p-4">
          {messages.length === 0 ? (
            <ChatEmptyState changedFiles={changedFiles} issues={issues} translations={translations} />
          ) : (
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <Message key={idx} from={msg.role}>
                  <MessageContent>
                    <ChatMarkdown onApplyCode={handleApplySuggestion}>{msg.content}</ChatMarkdown>
                  </MessageContent>
                </Message>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm pl-2">
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                  <span className="animate-pulse">{translations.thinking}</span>
                </div>
              )}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-3 border-t bg-muted/5">
        <PromptInput onSubmit={() => void handleSubmit()}>
          <PromptInputBody>
            <PromptInputTextarea
              ref={inputRef}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={translations.inputPlaceholder}
              disabled={isLoading}
              rows={1}
              className="min-h-[44px] max-h-32"
            />
          </PromptInputBody>
          <div className="flex justify-end mt-2">
            <PromptInputSubmit disabled={!input.trim() || isLoading} />
          </div>
        </PromptInput>
      </div>
    </div>
  )
}
