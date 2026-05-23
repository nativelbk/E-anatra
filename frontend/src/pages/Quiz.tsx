import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, CheckCircle2, XCircle, Trophy, RotateCcw, Loader2, ChevronRight,
} from 'lucide-react';
import { quizApi } from '@/lib/api';
import type { Quiz, QuizQuestion } from '@/types';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const subjects = [
  { value: 'MATH',             label: 'Mathématiques', emoji: '📐' },
  { value: 'SCIENCE',          label: 'Sciences',       emoji: '🔬' },
  { value: 'COMPUTER_SCIENCE', label: 'Informatique',   emoji: '💻' },
  { value: 'FRENCH',           label: 'Français',       emoji: '📖' },
  { value: 'HISTORY',          label: 'Histoire',       emoji: '🏛️' },
  { value: 'ENGLISH',          label: 'Anglais',        emoji: '🌍' },
];

const levels = [
  { value: 'PRIMARY',    label: 'Primaire',    color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
  { value: 'MIDDLE',     label: 'Collège',     color: 'bg-sky-500/20 border-sky-500/40 text-sky-300' },
  { value: 'HIGH',       label: 'Lycée',       color: 'bg-violet-500/20 border-violet-500/40 text-violet-300' },
  { value: 'UNIVERSITY', label: 'Université',  color: 'bg-amber-500/20 border-amber-500/40 text-amber-300' },
];

type Stage = 'config' | 'quiz' | 'result';

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>('config');
  const [subject, setSubject] = useState('MATH');
  const [level, setLevel] = useState('MIDDLE');
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await quizApi.generate(subject, level, count);
      setQuiz(data);
      setCurrentIdx(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setAnswered(false);
      setStage('quiz');
    } catch {
      toast.error('Erreur lors de la génération du quiz');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    setAnswers((prev) => [...prev, idx]);
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (currentIdx + 1 >= quiz.questions.length) {
      setStage('result');
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const reset = () => {
    setStage('config');
    setQuiz(null);
    setAnswers([]);
    setSelectedAnswer(null);
    setAnswered(false);
    setCurrentIdx(0);
  };

  const score = answers.filter((a, i) => quiz?.questions[i]?.correctIndex === a).length;

  if (stage === 'config') return <ConfigStage {...{ subject, setSubject, level, setLevel, count, setCount, generate, loading }} />;
  if (stage === 'quiz' && quiz) return (
    <QuizStage
      question={quiz.questions[currentIdx]}
      questionNumber={currentIdx + 1}
      total={quiz.questions.length}
      selectedAnswer={selectedAnswer}
      answered={answered}
      onSelect={selectAnswer}
      onNext={nextQuestion}
    />
  );
  if (stage === 'result' && quiz) return (
    <ResultStage quiz={quiz} answers={answers} score={score} onReset={reset} onRetry={generate} loading={loading} />
  );
  return null;
}

// ── Config ────────────────────────────────────────────────────────────────────
function ConfigStage({ subject, setSubject, level, setLevel, count, setCount, generate, loading }: any) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary-400" /> Générateur de Quiz IA
        </h1>
        <p className="text-slate-400 mt-1">L'IA génère un quiz personnalisé selon votre niveau</p>
      </div>

      <div className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Matière</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {subjects.map((s) => (
              <button
                key={s.value}
                onClick={() => setSubject(s.value)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  subject === s.value
                    ? 'bg-primary-600/20 border-primary-500 text-primary-300'
                    : 'bg-surface-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200',
                )}
              >
                <span>{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Niveau</label>
          <div className="grid grid-cols-2 gap-2">
            {levels.map((l) => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className={clsx(
                  'px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  level === l.value ? l.color : 'bg-surface-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Nombre de questions : <span className="text-primary-400">{count}</span>
          </label>
          <input
            type="range"
            min={3}
            max={15}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>3</span><span>15</span>
          </div>
        </div>

        <button onClick={generate} disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération en cours...</> : <><Brain className="w-4 h-4" /> Générer le quiz</>}
        </button>
      </div>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function QuizStage({ question, questionNumber, total, selectedAnswer, answered, onSelect, onNext }: {
  question: QuizQuestion;
  questionNumber: number;
  total: number;
  selectedAnswer: number | null;
  answered: boolean;
  onSelect: (i: number) => void;
  onNext: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">Question {questionNumber} / {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                'h-1.5 rounded-full transition-all',
                i < questionNumber - 1 ? 'bg-primary-500 w-6' : i === questionNumber - 1 ? 'bg-primary-400 w-8' : 'bg-slate-700 w-6',
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questionNumber}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="card space-y-5"
        >
          <p className="text-lg font-semibold text-slate-100 leading-snug">{question.question}</p>

          <div className="space-y-2">
            {question.options.map((opt, i) => {
              const isCorrect  = i === question.correctIndex;
              const isSelected = i === selectedAnswer;
              return (
                <button
                  key={i}
                  onClick={() => onSelect(i)}
                  disabled={answered}
                  className={clsx(
                    'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                    !answered && 'hover:border-primary-500 hover:bg-primary-600/10',
                    answered && isCorrect  && 'bg-emerald-500/20 border-emerald-500 text-emerald-300',
                    answered && isSelected && !isCorrect && 'bg-red-500/20 border-red-500 text-red-300',
                    !answered             ? 'bg-surface-900 border-slate-700 text-slate-300' : '',
                    answered && !isCorrect && !isSelected && 'opacity-50 border-slate-700 text-slate-400 bg-surface-900',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {answered && isCorrect  && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />}
                    {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-auto shrink-0" />}
                  </span>
                </button>
              );
            })}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-surface-900 border border-slate-700"
            >
              <p className="text-xs font-medium text-slate-300 mb-1">Explication</p>
              <p className="text-sm text-slate-400">{question.explanation}</p>
            </motion.div>
          )}

          {answered && (
            <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2">
              Continuer <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Result ────────────────────────────────────────────────────────────────────
function ResultStage({ quiz, answers, score, onReset, onRetry, loading }: any) {
  const pct = Math.round((score / quiz.questions.length) * 100);
  const grade = pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien !' : pct >= 40 ? 'Peut mieux faire' : 'À revoir';
  const gradeColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-sky-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card text-center space-y-4">
        <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
        <div>
          <p className="text-4xl font-extrabold text-slate-100">{score}/{quiz.questions.length}</p>
          <p className={`text-lg font-semibold mt-1 ${gradeColor}`}>{grade}</p>
          <p className="text-slate-400 text-sm mt-1">Score : {pct}%</p>
        </div>
        <div className="h-2 bg-surface-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          />
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={onReset} className="btn-secondary flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Nouveau quiz
          </button>
          <button onClick={onRetry} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            Réessayer
          </button>
        </div>
      </motion.div>

      {/* Review */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300">Détail des réponses</h3>
        {quiz.questions.map((q: QuizQuestion, i: number) => {
          const correct = answers[i] === q.correctIndex;
          return (
            <div key={i} className={`card !p-4 border ${correct ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <div className="flex items-start gap-3">
                {correct
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{q.question}</p>
                  {!correct && (
                    <p className="text-xs text-slate-400 mt-1">
                      Bonne réponse : <span className="text-emerald-400 font-medium">{q.options[q.correctIndex]}</span>
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">{q.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
