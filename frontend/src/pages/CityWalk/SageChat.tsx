import { useState, useRef, useEffect, useCallback } from 'react'
import { sageApi } from '@/lib/api'
import './SageChat.css'

interface Message {
  role: 'user' | 'sage'
  content: string
}

interface Props {
  onClose: () => void
}

export default function SageChat({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'sage', content: "Approche, voyageur… Je suis E-Tsiry. Les rues de Nova-7 t'ont conduit jusqu'à moi — cela n'est jamais un hasard. Quelle question brûle dans ton esprit ?" }
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null!)
  const inputRef  = useRef<HTMLInputElement>(null!)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return
    const userContent = input.trim()
    setInput('')

    const updatedMessages: Message[] = [...messages, { role: 'user', content: userContent }]
    setMessages(updatedMessages)
    setLoading(true)

    // Build history for the API (exclude the initial sage greeting from history)
    const history = updatedMessages
      .filter(m => m.content)
      .map(m => ({ role: m.role === 'sage' ? 'assistant' as const : 'user' as const, content: m.content }))

    try {
      const { data } = await sageApi.chat(history)
      setMessages(prev => [...prev, { role: 'sage', content: data.answer }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'sage',
        content: '⚠ Une perturbation magique a interrompu ma réponse. Réessaie, voyageur.',
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading, messages])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="sage-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sage-panel">
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

        <div className="sage-messages" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`sage-msg sage-msg--${m.role}`}>
              {m.role === 'sage' && <span className="sage-msg-icon">✦</span>}
              <div className="sage-msg-text">
                {m.content}
                {loading && i === messages.length - 1 && m.role === 'user' && (
                  <span className="sage-cursor" style={{ marginLeft: 8 }}>…</span>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="sage-msg sage-msg--sage">
              <span className="sage-msg-icon">✦</span>
              <div className="sage-msg-text">
                <span className="sage-cursor">▌</span>
              </div>
            </div>
          )}
        </div>

        <div className="sage-input-row">
          <input
            ref={inputRef}
            className="sage-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Pose ta question au sage…"
            disabled={loading}
          />
          <button
            className="sage-send"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? '…' : '↵'}
          </button>
        </div>

        <div className="sage-hint">Entrée pour envoyer · Échap pour fermer</div>
      </div>
    </div>
  )
}
