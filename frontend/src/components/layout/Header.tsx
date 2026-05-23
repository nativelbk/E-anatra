import { Menu, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Props {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: Props) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Déconnecté avec succès');
    navigate('/');
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-slate-800 bg-surface-950 shrink-0">
      <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg">
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-slate-400">
          Bonjour, <span className="text-slate-200 font-medium">{user?.name}</span> 👋
        </p>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="p-2 text-slate-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
