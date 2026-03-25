'use client'

import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type ChatStatus } from 'ai'
import type { PromptInputMessage } from '../primitives/prompt-input'

import type { AssistantUIMessage } from '../../lib/types'
import { DEFAULT_MODEL, MODELS } from './chat-view.constants'

/** Hook que encapsula toda la lógica de estado del ChatView */
export function useChatView() {
  const t = useTranslations('aiAssistant')

  const [model, setModel] = useState<string>(DEFAULT_MODEL)
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [text, setText] = useState('')

  const selectedModelData = useMemo(() => MODELS.find(m => m.id === model), [model])

  const { messages, sendMessage, status } = useChat<AssistantUIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { model },
    }),
  })

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }, [])

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(message.text?.trim())
      const hasFiles = Boolean(message.files?.length)

      if (!hasText && !hasFiles) return
      if (status === 'streaming') return

      sendMessage({ text: message.text || '', files: message.files }, { body: { model } })
      setText('')
    },
    [sendMessage, status, model]
  )

  const suggestions = useMemo(
    () => [t('suggestions.s1'), t('suggestions.s2'), t('suggestions.s3'), t('suggestions.s4')],
    [t]
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage({ text: suggestion }, { body: { model } })
    },
    [sendMessage, model]
  )

  const handleTranscriptionChange = useCallback((transcript: string) => {
    setText(prev => (prev ? `${prev} ${transcript}` : transcript))
  }, [])

  const toggleWebSearch = useCallback(() => {
    setUseWebSearch(prev => !prev)
  }, [])

  const handleModelSelect = useCallback((modelId: string) => {
    setModel(modelId)
    setModelSelectorOpen(false)
  }, [])

  const isSubmitDisabled = useMemo(() => !text.trim() || status === 'streaming', [text, status])
  const isAssistantThinking = status === 'submitted'
  const chatStatus: ChatStatus = status === 'streaming' ? 'streaming' : status === 'submitted' ? 'submitted' : 'ready'

  return {
    t,
    model,
    modelSelectorOpen,
    setModelSelectorOpen,
    useWebSearch,
    text,
    selectedModelData,
    messages,
    handleTextChange,
    handleSubmit,
    suggestions,
    handleSuggestionClick,
    handleTranscriptionChange,
    toggleWebSearch,
    handleModelSelect,
    isSubmitDisabled,
    isAssistantThinking,
    chatStatus,
  }
}
