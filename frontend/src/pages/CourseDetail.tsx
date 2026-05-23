import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
import {
  ArrowLeft, BookOpen, User, Calendar, Sparkles, Send, Bot, Loader2,
} from 'lucide-react';
import { courseApi } from '@/lib/api';
import type { Course } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const subjectColors: Record<string, string> = {
  MATH:             'bg-blue-500/20 text-blue-300 border-blue-500/30',
  SCIENCE:          'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  COMPUTER_SCIENCE: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  FRENCH:           'bg-rose-500/20 text-rose-300 border-rose-500/30',
  HISTORY:          'bg-amber-500/20 text-amber-300 border-amber-500/30',
  ENGLISH:          'bg-sky-500/20 text-sky-300 border-sky-500/30',
  OTHER:            'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const subjectEmoji: Record<string, string> = {
  MATH: '📐', SCIENCE: '🔬', COMPUTER_SCIENCE: '💻',
  FRENCH: '📖', HISTORY: '🏛️', ENGLISH: '🌍', OTHER: '📚',
};

const subjectLabel: Record<string, string> = {
  MATH: 'Mathématiques', SCIENCE: 'Sciences', COMPUTER_SCIENCE: 'Informatique',
  FRENCH: 'Français', HISTORY: 'Histoire', ENGLISH: 'Anglais', OTHER: 'Autre',
};

const levelLabel: Record<string, string> = {
  PRIMARY: 'Primaire', MIDDLE: 'Collège', HIGH: 'Lycée', UNIVERSITY: 'Université',
};

interface QAPair {
  question: string;
  answer: string;
}

const mdComponents: Components = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code({ node: _node, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className ?? '');
    const isBlock = !!match;
    return isBlock ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        className="!rounded-xl !text-sm !my-4 !border !border-slate-700"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="text-primary-300 bg-slate-800/70 px-1.5 py-0.5 rounded text-[0.8em] font-mono" {...props}>
        {children}
      </code>
    );
  },
  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-slate-100 mt-6 mb-3 pb-2 border-b border-slate-700">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-slate-100 mt-5 mb-2.5 pb-1.5 border-b border-slate-700/60">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-primary-300 mt-4 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-slate-200 mt-3 mb-1.5">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-slate-300 leading-7 my-3">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-3 space-y-1.5 pl-5 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 space-y-1.5 pl-5 list-decimal marker:text-primary-400">{children}</ol>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  li: ({ children, ...props }: any) => {
    const isTask = props.node?.properties?.className?.includes('task-list-item');
    return (
      <li className={`text-slate-300 flex gap-2 items-start ${isTask ? '' : 'before:content-["▸"] before:text-primary-500 before:text-xs before:mt-1 before:flex-shrink-0'}`}>
        {children}
      </li>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-primary-500/50 bg-primary-900/10 rounded-r-lg py-3 pr-4">
      <div className="text-slate-400 italic [&>p]:my-0">{children}</div>
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-800/80">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-700/50">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-slate-800/40 transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="text-slate-200 font-semibold px-4 py-2.5 text-left border-b border-slate-700">{children}</th>
  ),
  td: ({ children }) => (
    <td className="text-slate-300 px-4 py-2.5">{children}</td>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors">
      {children}
    </a>
  ),
  hr: () => <hr className="my-5 border-slate-700" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-100">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-300">{children}</em>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ''} className="my-4 rounded-xl max-w-full border border-slate-700" />
  ),
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    courseApi
      .get(id)
      .then(({ data }) => setCourse(data))
      .catch(() => {
        toast.error('Cours introuvable');
        navigate('/library');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !id || aiLoading) return;
    const q = question.trim();
    setQuestion('');
    setAiLoading(true);
    try {
      const { data } = await courseApi.explain(id, q);
      setQaPairs((prev) => [...prev, { question: q, answer: data.answer }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      toast.error("Erreur lors de la réponse de l'IA");
    } finally {
      setAiLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk(e as unknown as React.FormEvent);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate('/library')}
          className="btn-secondary !p-2 mt-0.5 flex-shrink-0"
          aria-label="Retour à la bibliothèque"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-100 leading-snug">{course.title}</h1>
          <p className="text-slate-400 text-sm mt-1">{course.description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`badge border ${subjectColors[course.subject] ?? ''}`}>
              {subjectEmoji[course.subject]} {subjectLabel[course.subject] ?? course.subject}
            </span>
            <span className="badge bg-surface-900 border border-slate-700 text-slate-400">
              {levelLabel[course.level] ?? course.level}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <User className="w-3 h-3" />
              {course.author?.name ?? 'Anonyme'}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              {format(new Date(course.createdAt), 'd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>
      </div>

      {/* Course content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
          <BookOpen className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-slate-300">Contenu du cours</span>
        </div>
        <div className="min-w-0">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {course.content}
          </ReactMarkdown>
        </div>
      </motion.div>

      {/* AI Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card space-y-4"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-semibold text-slate-200">Demander à l'IA</span>
          <span className="text-xs text-slate-500 ml-1">— pose une question sur ce cours</span>
        </div>

        {/* Q&A history */}
        {qaPairs.length === 0 && !aiLoading && (
          <p className="text-xs text-slate-500 text-center py-2">
            Pose une question pour obtenir une explication personnalisée sur ce cours.
          </p>
        )}

        <div className="space-y-5">
          {qaPairs.map((qa, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* User question */}
              <div className="flex justify-end">
                <div className="bg-primary-600/25 border border-primary-500/20 text-slate-200 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%]">
                  {qa.question}
                </div>
              </div>

              {/* AI answer */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-primary-400" />
                </div>
                <div className="flex-1 bg-surface-900 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 min-w-0">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                    {qa.answer}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}

          {aiLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-primary-400" />
              </div>
              <div className="bg-surface-900 border border-slate-700 rounded-2xl rounded-tl-sm px-4">
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />

        {/* Input */}
        <form onSubmit={handleAsk} className="flex gap-2 pt-1">
          <input
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex : Explique-moi le discriminant en détail..."
            className="input-field flex-1 !py-2.5 text-sm"
            disabled={aiLoading}
          />
          <button
            type="submit"
            className="btn-primary !px-3 !py-2.5 flex-shrink-0"
            disabled={aiLoading || !question.trim()}
          >
            {aiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
