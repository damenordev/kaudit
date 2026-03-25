import { getTranslations } from 'next-intl/server'

import { ChatView } from '@/modules/ai-assistant/components'

export default async function AIChatPage() {
  const t = await getTranslations('aiAssistant')

  return (
    <section className="flex h-full flex-col overflow-hidden" aria-labelledby="ai-chat-heading">
      <h1 id="ai-chat-heading" className="sr-only">
        {t('title')}
      </h1>
      <ChatView className="flex-1 overflow-hidden" />
    </section>
  )
}
