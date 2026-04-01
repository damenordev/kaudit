import { Bot, User } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import type { IChatMessage } from '../../types'
import { ChatMarkdown } from './chat-markdown'

interface IMessageBubbleProps {
  message: IChatMessage
}

export function ChatMessageBubble({ message }: IMessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-2', isUser && 'justify-end')}>
      {!isUser && (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bot className="size-3 text-primary" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-4 py-3 text-sm prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent',
          isUser ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/60 border border-border/40'
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap wrap-break-word">{message.content}</div>
        ) : (
          <ChatMarkdown>{message.content}</ChatMarkdown>
        )}
      </div>
      {isUser && (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary">
          <User className="size-3 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}
