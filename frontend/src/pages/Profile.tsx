import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, Loader2, Star, Trophy, Flame } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const roleLabels: Record<string, string> = {
  STUDENT: 'Élève', TEACHER: 'Enseignant', ADMIN: 'Administrateur',
};
const levelLabels: Record<string, string> = {
  PRIMARY: 'Primaire', MIDDLE: 'Collège', HIGH: 'Lycée', UNIVERSITY: 'Université',
};

const badges = [
  { icon: '🎯', label: 'Premier quiz',   desc: 'Complété votre premier quiz' },
  { icon: '💬', label: 'Curieux',        desc: '10 questions posées à l\'IA' },
  { icon: '📚', label: 'Lecteur',        desc: '5 cours consultés' },
  { icon: '🔥', label: 'Série de 7j',    desc: '7 jours consécutifs d\'apprentissage' },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch(`/users/${user?.id}`, { name });
      updateUser({ name: data.name });
      toast.success('Profil mis à jour !');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
        <User className="w-6 h-6 text-primary-400" /> Mon Profil
      </h1>

      {/* Avatar & name */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-extrabold text-white shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-bold text-slate-100">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="badge bg-primary-600/20 text-primary-300">{roleLabels[user?.role ?? ''] ?? user?.role}</span>
            {user?.level && (
              <span className="badge bg-surface-900 text-slate-400">{levelLabels[user.level] ?? user.level}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Trophy, label: 'Points', value: user?.points ?? 0, color: 'text-amber-400' },
          { icon: Flame,  label: 'Série',  value: '0j',               color: 'text-orange-400' },
          { icon: Star,   label: 'Niveau', value: user?.level ? levelLabels[user.level]?.slice(0,3) : 'N/A', color: 'text-sky-400' },
        ].map((s) => (
          <div key={s.label} className="card !p-3 text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
            <p className="text-xl font-bold text-slate-100">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">Modifier mes informations</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              <User className="inline w-3.5 h-3.5 mr-1" /> Nom complet
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              <Mail className="inline w-3.5 h-3.5 mr-1" /> Email
            </label>
            <input value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              <Shield className="inline w-3.5 h-3.5 mr-1" /> Rôle
            </label>
            <input value={roleLabels[user?.role ?? ''] ?? user?.role} disabled className="input-field opacity-50 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      </div>

      {/* Badges */}
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">Badges & Récompenses</h2>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-900 border border-slate-700"
            >
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="text-xs font-semibold text-slate-200">{b.label}</p>
                <p className="text-xs text-slate-500">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
