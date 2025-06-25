// src/components/Auth/AuthModal.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import LogoutButton from '@/components/Auth/LogoutButton';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialView }: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState(initialView !== 'register');
  useEffect(() => {
    setIsLoginView(initialView !== 'register');
  }, [initialView]);
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] text-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Botão de logout, aparece apenas se o usuário estiver logado */}
        {user && (
          <div className="absolute top-4 left-4">
            <LogoutButton />
          </div>
        )}

        {/* Abas de navegação */}
        <div className="flex mb-4 border-b">
          <button
            className={`flex-1 py-2 font-medium ${isLoginView ? 'border-b-2 border-amber-400 text-amber-400' : 'text-white'}`}
            onClick={() => setIsLoginView(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-medium ${!isLoginView ? 'border-b-2 border-amber-400 text-amber-400' : 'text-white'}`}
            onClick={() => setIsLoginView(false)}
          >
            Cadastro
          </button>
        </div>

        {/* Formulário de login ou cadastro */}
        {isLoginView ? (
          <LoginForm />
        ) : (
          <RegisterForm onSuccess={() => setIsLoginView(true)} />
        )}
      </div>
    </div>
  );
}
