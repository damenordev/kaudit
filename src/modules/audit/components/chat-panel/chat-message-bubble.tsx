import { Bot, User } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'

import type { IChatMessage } from '../../types'

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
          'max-w-[80%] rounded-lg px-3 py-2 text-sm',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
      </div>
      {isUser && (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary">
          <User className="size-3 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}
