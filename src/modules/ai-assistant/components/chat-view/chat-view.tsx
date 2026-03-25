'use client'

import { GlobeIcon, Loader2, CheckIcon } from 'lucide-react'
import { useCallback } from 'react'
import { cn } from '@/core/utils'

import { Conversation, ConversationContent, ConversationScrollButton } from '../primitives/conversation'
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
  ModelSelectorItem,
  ModelSelectorLogoGroup,
} from '../primitives/model-selector'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from '../primitives/prompt-input'
import { SpeechInput } from '../primitives/speech-input'
import { Suggestion, Suggestions } from '../primitives/suggestion'
import {
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
  Attachments,
  type AttachmentData,
} from '../primitives/attachments'

import { ChatMessage } from '../chat-message'
import { CHEFS, MODELS, type IModel } from './chat-view.constants'
import { useChatView } from './use-chat-view'

interface IModelItemProps {
  model: IModel
  isSelected: boolean
  onSelect: (id: string) => void
}

function ModelItem({ model, isSelected, onSelect }: IModelItemProps) {
  const handleSelect = useCallback(() => {
    onSelect(model.id)
  }, [onSelect, model.id])

  return (
    <ModelSelectorItem onSelect={handleSelect} value={model.id}>
      {isSelected ? <CheckIcon className="ml-auto size-4" /> : <div className="ml-auto size-4" />}
      <ModelSelectorName>{model.name}</ModelSelectorName>
      <ModelSelectorLogoGroup>
        {model.providers.map(provider => (
          <ModelSelectorLogo key={provider} provider={provider} />
        ))}
      </ModelSelectorLogoGroup>
    </ModelSelectorItem>
  )
}

function AttachmentsDisplay() {
  const attachments = usePromptInputAttachments()

  if (attachments.files.length === 0) return null

  return (
    <Attachments className="pt-2" variant="inline">
      {attachments.files.map(file => (
        <Attachment data={file as AttachmentData} key={file.id} onRemove={() => attachments.remove(file.id)}>
          <AttachmentPreview />
          <AttachmentInfo />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  )
}

// --- Main Component ---

export interface IChatViewProps {
  className?: string
}

export function ChatView({ className }: IChatViewProps) {
  const {
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
  } = useChatView()

  return (
    <div className={cn('relative flex size-full flex-col overflow-hidden', className)}>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto flex w-full flex-col px-4 pb-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center space-y-8 py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative flex size-20 items-center justify-center rounded-3xl bg-primary/10 shadow-inner ring-1 ring-primary/20 backdrop-blur-xl">
                <ModelSelectorLogo
                  provider={selectedModelData?.chefSlug || 'assistant'}
                  className="size-10 text-primary drop-shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <h1 className="font-bold text-3xl tracking-tight sm:text-4xl text-foreground">{t('welcome')}</h1>
                <p className="mx-auto max-w-lg text-lg text-muted-foreground/70 leading-relaxed">{t('welcomeHint')}</p>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isAssistantThinking && (
              <div className="flex items-center gap-3 py-2 text-muted-foreground/60">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span className="font-medium text-sm animate-pulse">{t('thinking')}</span>
              </div>
            )}
          </div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="sticky bottom-0 z-10 mx-auto w-full p-3">
        {messages.length === 0 && (
          <Suggestions className="pb-2">
            {suggestions.map(suggestion => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
                className="shadow-sm hover:shadow-md transition-shadow"
              />
            ))}
          </Suggestions>
        )}

        <PromptInput globalDrop multiple onSubmit={handleSubmit}>
          <PromptInputHeader className="p-0">
            <AttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              aria-label={t('messageInputLabel')}
              onChange={handleTextChange}
              placeholder={t('placeholder')}
              value={text}
              className="min-h-16 border-none bg-transparent px-4 py-3 text-lg focus-visible:ring-0"
            />
          </PromptInputBody>
          <PromptInputFooter className="flex items-center justify-between px-2 pb-2">
            <PromptInputTools className="gap-2">
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger aria-label={t('actionsMenuLabel')} className="hover:bg-primary/5" />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              {/* <SpeechInput onTranscriptionChange={handleTranscriptionChange} size="icon-xs" variant="ghost" /> */}
              <PromptInputButton
                onClick={toggleWebSearch}
                variant={useWebSearch ? 'default' : 'ghost'}
                size="xs"
                className={cn(
                  useWebSearch && 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                )}
              >
                <GlobeIcon size={14} className={cn(useWebSearch && 'animate-spin-slow')} />
                <span className="text-xs font-bold tracking-wide uppercase">{t('search')}</span>
              </PromptInputButton>

              <ModelSelector onOpenChange={setModelSelectorOpen} open={modelSelectorOpen}>
                <ModelSelectorTrigger asChild>
                  <PromptInputButton className="gap-2">
                    {selectedModelData?.chefSlug && (
                      <ModelSelectorLogo provider={selectedModelData.chefSlug} className="size-4" />
                    )}
                    {selectedModelData?.name && (
                      <ModelSelectorName className="text-xs font-bold tracking-wide uppercase">
                        {selectedModelData.name}
                      </ModelSelectorName>
                    )}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder={t('searchModels')} />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>{t('noModelsFound')}</ModelSelectorEmpty>
                    {CHEFS.map(chef => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {MODELS.filter(m => m.chef === chef).map(m => (
                          <ModelItem isSelected={model === m.id} key={m.id} model={m} onSelect={handleModelSelect} />
                        ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit disabled={isSubmitDisabled} status={chatStatus} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
