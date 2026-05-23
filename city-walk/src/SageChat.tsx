import { useState, useRef, useEffect, useCallback } from 'react'
import './SageChat.css'

interface Message {
  role: 'user' | 'sage'
  content: string
}

const SYSTEM_PROMPT = `Tu es E-Tsiry, un sage immortel qui réside depuis des siècles dans la cité cyberpunk de Nova-7. Tu es l'équilibre entre la magie ancienne et la technologie du futur. Ton savoir est immense : philosophie, sciences, mystique, code, histoire, art — rien ne t'est étranger. Tu réponds avec sagesse, une touche de mystère, et parfois un humour subtil. Tes réponses sont concises mais profondes (3-5 phrases). Tu tutoies ton interlocuteur et parles toujours en français. Tu fais parfois référence à la ville de Nova-7 ou à des artefacts magiques.`

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined

interface Props {
  onClose: () => void
}

export default function SageChat({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'sage', content: 'Approche, voyageur… Je suis E-Tsiry. Les rues de Nova-7 t\'ont conduit jusqu\'à moi — cela n\'est jamais un hasard. Quelle question brûle dans ton esprit ?' }
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [noKey, setNoKey] = useState(!API_KEY)
  const scrollRef  = useRef<HTMLDivElement>(null!)
  const inputRef   = useRef<HTMLInputElement>(null!)
  const abortRef   = useRef<AbortController | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || streaming) return
    if (!API_KEY) { setNoKey(true); return }

    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setStreaming(true)

    // Placeholder for streaming response
    setMessages(prev => [...prev, { role: 'sage', content: '' }])

    const history = [...messages, userMsg]
      .filter(m => m.content)
      .map(m => ({ role: m.role === 'sage' ? 'assistant' : 'user', content: m.content }))

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/anthropic/v1/messages', {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          stream: true,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(`API ${res.status}: ${err}`)
      }

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer    = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // Parse SSE lines
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              const token = parsed.delta.text as string
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = {
                  ...next[next.length - 1],
                  content: next[next.length - 1].content + token,
                }
                return next
              })
            }
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'sage', content: '⚠ Une perturbation magique a interrompu ma réponse. Réessaie, voyageur.' }
        return next
      })
    } finally {
      setStreaming(false)
    }
  }, [input, streaming, messages])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="sage-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sage-panel">
        {/* Header */}
        <div className="sage-header">
          <div className="sage-title-group">
            <div className="sage-avatar">✦</div>
            <div>
              <div className="sage-name">E-Tsiry</div>
              <div className="sage-subtitle">Sage Éternel de Nova-7</div>
            </div>
          </div>
          <button className="sage-close" onClick={onClose}>✕</button>
        </div>

        {/* No API key warning */}
        {noKey && (
          <div className="sage-nokey">
            <p>Clé API manquante.</p>
            <p>Crée <code>.env.local</code> dans <code>city-walk/</code> et ajoute&nbsp;:</p>
            <code>VITE_ANTHROPIC_API_KEY=sk-ant-...</code>
            <p>Puis redémarre le serveur.</p>
          </div>
        )}

        {/* Messages */}
        <div className="sage-messages" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`sage-msg sage-msg--${m.role}`}>
              {m.role === 'sage' && <span className="sage-msg-icon">✦</span>}
              <div className="sage-msg-text">
                {m.content}
                {streaming && i === messages.length - 1 && m.role === 'sage' && (
                  <span className="sage-cursor">▌</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="sage-input-row">
          <input
            ref={inputRef}
            className="sage-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Pose ta question au sage…"
            disabled={streaming || noKey}
          />
          <button
            className="sage-send"
            onClick={sendMessage}
            disabled={streaming || !input.trim() || noKey}
          >
            {streaming ? '…' : '↵'}
          </button>
        </div>

        <div className="sage-hint">Entrée pour envoyer · Échap pour fermer</div>
      </div>
    </div>
  )
}
