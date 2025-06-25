import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LogoutButtonProps {
  variant?: 'solid' | 'outline';
  onLogout?: () => void;
  className?: string;
}

export default function LogoutButton({ variant = 'outline', onLogout, className = '' }: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const base = 'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ';
  const styles =
    variant === 'solid'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white';

  return (
    <button onClick={handleLogout} className={`${base}${styles} ${className}`.trim()}>
      <LogOut className="w-4 h-4" />
      <span>Sair</span>
    </button>
  );
}