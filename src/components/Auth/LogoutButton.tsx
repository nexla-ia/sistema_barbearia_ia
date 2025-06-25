import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Sair</span>
    </button>
  );
}
