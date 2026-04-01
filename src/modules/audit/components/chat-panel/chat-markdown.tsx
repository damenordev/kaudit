import React from 'react'
import { Copy, Check, Terminal, ExternalLink, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'
import type { Components } from 'react-markdown'

import { cn } from '@/core/utils/cn.utils'
import { Button } from '@/core/ui/button'

import 'highlight.js/styles/github-dark.css'

interface ISuggestionBlockProps {
  code: string
  language?: string
  onApply?: (code: string) => Promise<void>
}

/**
 * Bloque de sugerencia de código con acciones interactivas.
 */
export function SuggestionBlock({ code, language = 'typescript', onApply }: ISuggestionBlockProps) {
  const t = useTranslations('dashboard.audits.detail.chat.suggestion')
  const [copied, setCopied] = React.useState(false)
  const [isApplying, setIsApplying] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      sileo.success({ title: t('copy') })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      sileo.error({ title: 'Failed to copy' })
    }
  }

  const handleApply = async () => {
    if (!onApply || isApplying) return
    setIsApplying(true)
    try {
      await onApply(code)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="my-4 rounded-lg border border-border/50 bg-muted/30 overflow-hidden shadow-sm text-foreground">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border/50">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Terminal className="size-3.5" />
          <span>{language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-7" onClick={handleCopy} title={t('copy')}>
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          </Button>
          {onApply && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 px-2 text-[10px] gap-1.5"
              onClick={handleApply}
              disabled={isApplying}
            >
              {isApplying ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <ExternalLink className="size-3" />
              )}
              {isApplying ? t('applying') : t('apply')}
            </Button>
          )}
        </div>
      </div>
      <div className="p-0 text-sm overflow-x-auto">
        <pre className="p-4 bg-transparent outline-none">
          <code className={cn('language-' + language, 'block w-full')}>{code}</code>
        </pre>
      </div>
    </div>
  )
}

interface IChatMarkdownProps {
  children: string
  onApplyCode?: (code: string) => Promise<void>
}

/**
 * Renderizador de Markdown personalizado para el chat de la IA.
 */
export function ChatMarkdown({ children, onApplyCode }: IChatMarkdownProps) {
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className ?? '')
      const codeString = Array.isArray(children) 
        ? children.join('') 
        : typeof children === 'string' 
          ? children.replace(/\n$/, '') 
          : ''

      // @ts-expect-error - inline is passed by react-markdown but not in types
      const isInline = props.inline as boolean | undefined

      if (!isInline && match) {
        return <SuggestionBlock code={codeString} language={match[1]} onApply={onApplyCode} />
      }

      return (
        <code className={cn('bg-muted px-1.5 py-0.5 rounded text-xs font-mono', className)} {...props}>
          {children}
        </code>
      )
    },
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline underline-offset-4"
      >
        {children}
      </a>
    ),
  }

  return (
    <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={components}>
      {children}
    </ReactMarkdown>
  )
}
