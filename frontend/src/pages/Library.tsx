import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, ExternalLink, Clock, User, ChevronRight } from 'lucide-react';
import { courseApi } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import type { Course, Subject, Level } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const subjectOptions = [
  { value: '',                label: 'Toutes les matières' },
  { value: 'MATH',            label: '📐 Mathématiques' },
  { value: 'SCIENCE',         label: '🔬 Sciences' },
  { value: 'COMPUTER_SCIENCE',label: '💻 Informatique' },
  { value: 'FRENCH',          label: '📖 Français' },
  { value: 'HISTORY',         label: '🏛️ Histoire' },
  { value: 'ENGLISH',         label: '🌍 Anglais' },
];

const levelOptions = [
  { value: '',           label: 'Tous les niveaux' },
  { value: 'PRIMARY',    label: 'Primaire' },
  { value: 'MIDDLE',     label: 'Collège' },
  { value: 'HIGH',       label: 'Lycée' },
  { value: 'UNIVERSITY', label: 'Université' },
];

const subjectColors: Record<string, string> = {
  MATH:             'bg-blue-500/20 text-blue-300',
  SCIENCE:          'bg-emerald-500/20 text-emerald-300',
  COMPUTER_SCIENCE: 'bg-violet-500/20 text-violet-300',
  FRENCH:           'bg-rose-500/20 text-rose-300',
  HISTORY:          'bg-amber-500/20 text-amber-300',
  ENGLISH:          'bg-sky-500/20 text-sky-300',
  OTHER:            'bg-slate-500/20 text-slate-300',
};

const subjectEmoji: Record<string, string> = {
  MATH: '📐', SCIENCE: '🔬', COMPUTER_SCIENCE: '💻',
  FRENCH: '📖', HISTORY: '🏛️', ENGLISH: '🌍', OTHER: '📚',
};

export default function LibraryPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await courseApi.list({ subject: subject || undefined, level: level || undefined, search: search || undefined });
      setCourses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [subject, level]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchCourses(); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-400" /> Bibliothèque Pédagogique
        </h1>
        <p className="text-slate-400 mt-1">Cours, documents et ressources organisés par matière</p>
      </div>

      {/* Filters */}
      <div className="card !p-4 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un cours..."
              className="input-field pl-9 !py-2"
            />
          </div>
          <button type="submit" className="btn-secondary flex items-center gap-2 !py-2">
            <Filter className="w-4 h-4" /> Filtrer
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field !py-1.5 !px-3 text-sm w-auto">
            {subjectOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="input-field !py-1.5 !px-3 text-sm w-auto">
            {levelOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucun cours trouvé</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate(`/library/${course.id}`)}
              className="card hover:border-primary-500/50 hover:bg-surface-800/60 transition-all cursor-pointer group flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${subjectColors[course.subject] ?? 'bg-slate-700 text-slate-300'}`}>
                  {subjectEmoji[course.subject]} {course.subject}
                </span>
                <span className="badge bg-surface-900 text-slate-400 text-xs">{course.level}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-2 group-hover:text-primary-300 transition-colors line-clamp-2">
                {course.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">
                {course.description}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3 h-3" />
                  {course.author?.name ?? 'Anonyme'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {format(new Date(course.createdAt), 'd MMM', { locale: fr })}
                </div>
                {course.videoUrl ? (
                  <a href={course.videoUrl} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                    Vidéo <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
