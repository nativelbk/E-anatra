import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Brain, BookOpen, User, Shield, X, Sparkles, Globe,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/chat',      icon: MessageSquare,   label: 'Assistant IA' },
  { to: '/quiz',      icon: Brain,           label: 'Quiz IA' },
  { to: '/library',   icon: BookOpen,        label: 'Bibliothèque' },
  { to: '/profile',   icon: User,            label: 'Profil' },
  { to: '/world',     icon: Globe,           label: 'Nova-7' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const { user } = useAuthStore();

  const content = (
    <div className="flex flex-col h-full bg-surface-950 border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">e-Anatra</p>
            <p className="text-xs text-slate-500">Éducation IA</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              clsx('sidebar-link', isActive && 'active')
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {label}
          </NavLink>
        ))}

        {user?.role === 'ADMIN' && (
          <NavLink
            to="/admin"
            onClick={onClose}
            className={({ isActive }) => clsx('sidebar-link mt-2', isActive && 'active')}
          >
            <Shield className="w-4.5 h-4.5 shrink-0" />
            Administration
          </NavLink>
        )}
      </nav>

      {/* User card */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-60 shrink-0">{content}</aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-30 w-60 lg:hidden"
          >
            {content}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
