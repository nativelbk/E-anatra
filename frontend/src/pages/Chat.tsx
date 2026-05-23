import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Plus, Trash2, MessageSquare, Sparkles, Bot,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatApi } from '@/lib/api';
import type { Conversation, Message } from '@/types';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span key={i} className="typing-dot" style={{ animationDelay: `${i * 0.16}s` }} />
      ))}
    </div>
  );
}

export default function ChatPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatApi.getConversations().then(({ data }) => {
      setConversations(data);
      if (data.length > 0) selectConversation(data[0].id);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const selectConversation = async (id: string) => {
    setActiveId(id);
    const { data } = await chatApi.getConversation(id);
    setMessages(data.messages ?? []);
  };

  const newConversation = async () => {
    const { data } = await chatApi.createConversation();
    setConversations((prev) => [data, ...prev]);
    setActiveId(data.id);
    setMessages([]);
  };

  const deleteConversation = async (id: string) => {
    await chatApi.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    let convId = activeId;
    if (!convId) {
      const { data } = await chatApi.createConversation(input.slice(0, 60));
      setConversations((prev) => [data, ...prev]);
      convId = data.id;
      setActiveId(convId);
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTyping(true);

    try {
      const { data } = await chatApi.sendMessage(convId!, userMsg.content);
      setTyping(false);
      setMessages((prev) => [...prev, data.assistantMessage]);
      // Update conversation title
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title: data.conversationTitle ?? c.title } : c)),
      );
    } catch {
      setTyping(false);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem-2rem)] lg:h-[calc(100vh-3.5rem-3rem)] gap-4">
      {/* Conversations sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-200">Conversations</h2>
          <button onClick={newConversation} className="p-1.5 text-slate-400 hover:text-white hover:bg-surface-700 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-8">Aucune conversation</p>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                activeId === conv.id ? 'bg-primary-600/20 text-primary-300' : 'text-slate-400 hover:bg-surface-800 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs truncate flex-1">{conv.title || 'Nouvelle conversation'}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex flex-col flex-1 min-w-0 card !p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Assistant e-Anatra</p>
            <p className="text-xs text-emerald-400">En ligne</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !typing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-200">Comment puis-je vous aider ?</p>
                <p className="text-sm text-slate-400 mt-1">Posez n'importe quelle question scolaire</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {[
                  'Explique-moi la photosynthèse',
                  'Résous cette équation : 2x + 5 = 15',
                  'Qu\'est-ce que la Révolution française ?',
                  'Comment fonctionne un algorithme ?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); textareaRef.current?.focus(); }}
                    className="text-left text-xs px-3 py-2.5 rounded-xl bg-surface-900 border border-slate-700 hover:border-primary-600 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-surface-900 border border-slate-700 text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        code: ({ children }) => (
                          <code className="bg-surface-800 px-1.5 py-0.5 rounded text-primary-300 font-mono text-xs">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-surface-800 rounded-xl p-3 my-2 overflow-x-auto text-xs font-mono">
                            {children}
                          </pre>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-surface-900 border border-slate-700 rounded-2xl rounded-bl-sm">
                <TypingDots />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-700">
          <div className="flex items-end gap-2 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-primary-500 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question... (Entrée pour envoyer)"
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-200 placeholder-slate-500 max-h-32"
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-xs text-slate-500 text-center mt-1.5">
            Maj+Entrée pour nouvelle ligne • Entrée pour envoyer
          </p>
        </div>
      </div>
    </div>
  );
}
