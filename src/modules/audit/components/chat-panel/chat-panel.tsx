'use client'

import { useCallback, useRef, useState } from 'react'
import { Send, Bot, Loader2 } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { Button } from '@/core/ui/button'
import { ScrollArea } from '@/core/ui/scroll-area'
import { Badge } from '@/core/ui/badge'

import type { IChatMessage, IChangedFile, IEnrichedIssue } from '../../types'
import { ChatMessageBubble } from './chat-message-bubble'
import { ChatEmptyState } from './chat-empty-state'

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
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    const viewport = scrollRef.current?.querySelector('[data-slot="scroll-area-viewport"]')
    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTop = viewport.scrollHeight
      })
    }
  }, [])

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
          scrollToBottom()
        }
      } catch {
        setMessages(prev => [...prev, { role: 'assistant', content: translations.connectionError }])
      } finally {
        setIsLoading(false)
        scrollToBottom()
        inputRef.current?.focus()
      }
    },
    [input, isLoading, messages, auditId, scrollToBottom, translations]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  return (
    <div className={cn('flex flex-col border rounded-lg bg-background', className)}>
      <div className="flex items-center gap-2 p-3 border-b">
        <Bot className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">{translations.title}</h3>
        <Badge variant="secondary" className="text-[10px]">
          {translations.badge}
        </Badge>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 h-[400px] p-3">
        {messages.length === 0 ? (
          <ChatEmptyState changedFiles={changedFiles} issues={issues} translations={translations} />
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <ChatMessageBubble key={idx} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="size-3 animate-spin" />
                <span>{translations.thinking}</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 border-t">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={translations.inputPlaceholder}
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
        />
        <Button type="submit" size="sm" disabled={!input.trim() || isLoading}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
