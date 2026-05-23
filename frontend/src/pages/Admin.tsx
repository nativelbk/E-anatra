import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Users, BookOpen, Brain, Trash2, Edit2, Loader2,
  UserCheck, TrendingUp,
} from 'lucide-react';
import { usersApi } from '@/lib/api';
import type { User } from '@/types';
import toast from 'react-hot-toast';

const roleColors: Record<string, string> = {
  STUDENT: 'bg-sky-500/20 text-sky-400',
  TEACHER: 'bg-emerald-500/20 text-emerald-400',
  ADMIN:   'bg-rose-500/20 text-rose-400',
};
const roleLabels: Record<string, string> = { STUDENT: 'Élève', TEACHER: 'Enseignant', ADMIN: 'Admin' };

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState('STUDENT');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    usersApi.list()
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:    users.length,
    students: users.filter((u) => u.role === 'STUDENT').length,
    teachers: users.filter((u) => u.role === 'TEACHER').length,
    admins:   users.filter((u) => u.role === 'ADMIN').length,
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await usersApi.delete(id);
    setUsers((u) => u.filter((x) => x.id !== id));
    toast.success('Utilisateur supprimé');
  };

  const openEdit = (u: User) => { setEditUser(u); setEditRole(u.role); };

  const saveEdit = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const { data } = await usersApi.update(editUser.id, { role: editRole });
      setUsers((prev) => prev.map((u) => (u.id === editUser.id ? data : u)));
      toast.success('Rôle mis à jour');
      setEditUser(null);
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-rose-400" />
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Administration</h1>
          <p className="text-slate-400 text-sm">Gestion des utilisateurs et de la plateforme</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users,     label: 'Total utilisateurs', value: stats.total,    color: 'text-primary-400', bg: 'bg-primary-500/10' },
          { icon: UserCheck, label: 'Élèves',             value: stats.students, color: 'text-sky-400',     bg: 'bg-sky-500/10' },
          { icon: BookOpen,  label: 'Enseignants',        value: stats.teachers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: Shield,    label: 'Admins',             value: stats.admins,   color: 'text-rose-400',    bg: 'bg-rose-500/10' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-100">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Users table */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-400" /> Utilisateurs
          </h2>
          <span className="badge bg-primary-600/20 text-primary-300">{users.length}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Utilisateur</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Rôle</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide hidden md:table-cell">Inscrit le</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800 hover:bg-surface-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge ${roleColors[u.role] ?? 'bg-slate-700 text-slate-300'}`}>
                        {roleLabels[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400 hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(u)} className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card w-full max-w-sm space-y-4"
          >
            <h3 className="text-base font-semibold text-slate-100">Modifier {editUser.name}</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Rôle</label>
              <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="input-field">
                <option value="STUDENT">Élève</option>
                <option value="TEACHER">Enseignant</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditUser(null)} className="btn-secondary flex-1">Annuler</button>
              <button onClick={saveEdit} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Sauvegarder
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
