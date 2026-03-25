'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MessageSquare, X } from 'lucide-react'
import { cn } from '@/core/utils/cn.utils'
import { Button } from '@/core/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/core/ui/sheet'

import { ChatView } from './chat-view'

export function ChatPanel() {
  const t = useTranslations('aiAssistant')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="icon-lg"
        className="fixed right-6 bottom-20 z-40 rounded-full shadow-lg md:bottom-6"
        aria-label={t('openPanel')}
      >
        <MessageSquare className="size-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className={cn('flex w-full flex-col sm:max-w-md', 'p-0')} showCloseButton={false}>
          <SheetHeader className="flex flex-row items-center justify-end border-b px-4 py-3">
            <SheetTitle className="sr-only">{t('title')}</SheetTitle>
            <Button variant="ghost" size="icon-xs" onClick={() => setIsOpen(false)}>
              <X className="size-4" />
              <span className="sr-only">{t('close')}</span>
            </Button>
          </SheetHeader>

          <ChatView className="flex-1" />
        </SheetContent>
      </Sheet>
    </>
  )
}
