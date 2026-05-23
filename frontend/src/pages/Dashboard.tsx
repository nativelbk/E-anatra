import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, BookOpen, Trophy, Flame, MessageSquare, ArrowRight,
  TrendingUp, Target, Star,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip,
} from 'recharts';
import { progressApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { Progress, Recommendation } from '@/types';

const subjectLabels: Record<string, string> = {
  MATH: 'Maths', SCIENCE: 'Sciences', COMPUTER_SCIENCE: 'Info',
  FRENCH: 'Français', HISTORY: 'Histoire', ENGLISH: 'Anglais',
};

const levelColors: Record<string, string> = {
  PRIMARY: 'bg-emerald-500/20 text-emerald-400',
  MIDDLE:  'bg-sky-500/20 text-sky-400',
  HIGH:    'bg-violet-500/20 text-violet-400',
  UNIVERSITY: 'bg-amber-500/20 text-amber-400',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([progressApi.get(), progressApi.getRecommendations()])
      .then(([p, r]) => {
        setProgress(p.data);
        setRecommendations(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: Flame,      label: 'Série',         value: `${progress?.streak ?? 0}j`,   color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { icon: Trophy,     label: 'Points',         value: progress?.points ?? 0,          color: 'text-amber-400',  bg: 'bg-amber-500/10' },
    { icon: Brain,      label: 'Quiz réalisés',  value: progress?.quizzesTaken ?? 0,    color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { icon: BookOpen,   label: 'Cours terminés', value: progress?.coursesCompleted ?? 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const activityData = progress?.recentActivity?.map((a) => ({
    date: a.date,
    sessions: 1,
  })) ?? [];

  const radarData = progress?.subjectProgress?.map((s) => ({
    subject: subjectLabels[s.subject] ?? s.subject,
    score: s.score,
  })) ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Bonjour, {user?.name?.split(' ')[0]} ! 👋
        </h1>
        <p className="text-slate-400 mt-1">Continuez votre progression aujourd'hui.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
          >
            <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-100">{card.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar matières */}
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary-400" /> Performance par matière
          </h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
              Commencez des quiz pour voir vos stats
            </div>
          )}
        </div>

        {/* Activité */}
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Activité récente
          </h3>
          {activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="sessions" stroke="#6366f1" fill="url(#grad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
              Aucune activité récente
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/chat" className="card hover:border-primary-600/50 transition-colors group flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary-600/20 flex items-center justify-center shrink-0 group-hover:bg-primary-600/30 transition-colors">
            <MessageSquare className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-200">Poser une question à l'IA</p>
            <p className="text-xs text-slate-400">Obtenir une explication maintenant</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-primary-400 transition-colors" />
        </Link>

        <Link to="/quiz" className="card hover:border-accent-600/50 transition-colors group flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent-600/20 flex items-center justify-center shrink-0 group-hover:bg-accent-600/30 transition-colors">
            <Brain className="w-5 h-5 text-accent-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-200">Générer un quiz</p>
            <p className="text-xs text-slate-400">Testez vos connaissances</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-accent-400 transition-colors" />
        </Link>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> Recommandations pour vous
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="card hover:border-slate-600 transition-colors">
                <span className={`badge mb-3 ${levelColors[rec.level] ?? 'bg-slate-700 text-slate-300'}`}>
                  {rec.type}
                </span>
                <p className="text-sm font-medium text-slate-200 mb-1">{rec.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
