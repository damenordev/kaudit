/**
 * Tests para el componente AuditChatPanel.
 * Verifica renderizado, envío de mensajes y manejo de estados.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

vi.mock('@/core/utils/cn.utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}))

vi.mock('@/core/ui/scroll-area', () => ({
  ScrollArea: ({ children, ref }: { children: React.ReactNode; ref?: React.Ref<HTMLDivElement> }) => (
    <div data-testid="scroll-area" ref={ref}>
      {children}
    </div>
  ),
}))

vi.mock('@/core/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span data-testid="badge">{children}</span>,
}))

vi.mock('@/core/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: 'submit' | 'reset' | 'button'
  }) => (
    <button data-testid="submit-btn" onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  ),
}))

vi.mock('lucide-react', () => ({
  Send: () => <span>Send</span>,
  Bot: () => <span>Bot</span>,
  User: () => <span>User</span>,
  Loader2: () => <span data-testid="loader">Loading</span>,
}))

function createFetchMock(response: { ok: boolean; body?: ReadableStream | null; status?: number }) {
  return vi.fn().mockResolvedValue(response)
}

async function renderChat() {
  const { AuditChatPanel } = await import('../components/chat-panel/chat-panel')
  return render(
    <AuditChatPanel
      auditId="audit-123"
      translations={{
        title: 'Chat con IA',
        badge: 'Contextual',
        placeholder: 'Pregunta sobre los issues o cambios del PR',
        contextInfo: 'La IA tiene contexto completo',
        filesCount: '{count} archivos',
        issuesCount: '{count} issues',
        thinking: 'Pensando...',
        errorMessage: 'Error: no se pudo obtener respuesta.',
        connectionError: 'Error: conexión fallida.',
        inputPlaceholder: 'Pregunta sobre los issues o cambios...',
      }}
    />
  )
}

describe('AuditChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', createFetchMock({ ok: true, body: null }))
  })

  it('renderiza el header del chat', async () => {
    await renderChat()

    expect(screen.getByText('Chat con IA')).toBeDefined()
    expect(screen.getByText('Contextual')).toBeDefined()
  })

  it('muestra estado vacío inicial', async () => {
    await renderChat()

    expect(screen.getByText('Pregunta sobre los issues o cambios del PR')).toBeDefined()
  })

  it('renderiza el textarea de input', async () => {
    await renderChat()

    const textarea = screen.getByPlaceholderText('Pregunta sobre los issues o cambios...')
    expect(textarea).toBeDefined()
  })

  it('deshabilita el botón de envío cuando el input está vacío', async () => {
    await renderChat()

    const btn = screen.getByTestId('submit-btn') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('habilita el botón cuando hay texto', async () => {
    await renderChat()

    const textarea = screen.getByPlaceholderText('Pregunta sobre los issues o cambios...')
    fireEvent.change(textarea, { target: { value: 'Hola' } })

    const btn = screen.getByTestId('submit-btn') as HTMLButtonElement
    expect(btn.disabled).toBe(false)
  })

  it('envía mensaje al hacer submit', async () => {
    const mockBody = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('Respuesta del bot'))
        controller.close()
      },
    })
    vi.stubGlobal('fetch', createFetchMock({ ok: true, body: mockBody }))

    await renderChat()

    const textarea = screen.getByPlaceholderText('Pregunta sobre los issues o cambios...')
    fireEvent.change(textarea, { target: { value: '¿Qué issues hay?' } })

    const form = textarea.closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/audit/audit-123/chat',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })
  })

  it('muestra mensaje de error cuando fetch falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    await renderChat()

    const textarea = screen.getByPlaceholderText('Pregunta sobre los issues o cambios...')
    fireEvent.change(textarea, { target: { value: 'Test' } })

    const form = textarea.closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText('Error: conexión fallida.')).toBeDefined()
    })
  })

  it('muestra error cuando response no es ok', async () => {
    vi.stubGlobal('fetch', createFetchMock({ ok: false, status: 500 }))

    await renderChat()

    const textarea = screen.getByPlaceholderText('Pregunta sobre los issues o cambios...')
    fireEvent.change(textarea, { target: { value: 'Test' } })

    const form = textarea.closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText('Error: no se pudo obtener respuesta.')).toBeDefined()
    })
  })
})
