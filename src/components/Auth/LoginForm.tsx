import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      await login(email, password);
      const role =
        email === 'admin@example.com'
          ? 'admin'
          : email === 'employee@example.com'
            ? 'employee'
            : 'client';
      navigate(role === 'admin' ? '/admin' : role === 'employee' ? '/employee' : '/client');
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const handleQuickLogin = async (role: 'client' | 'employee' | 'admin') => {
    const credentials = {
      client: 'client@example.com',
      employee: 'employee@example.com',
      admin: 'admin@example.com',
    } as const;

    const email = credentials[role];
    const password = 'password';

    setEmail(email);
    setPassword(password);

    try {
      await login(email, password);
      navigate(role === 'admin' ? '/admin' : role === 'employee' ? '/employee' : '/client');
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{formError || error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            E-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="seu@email.com"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-white">Lembrar-me</span>
          </label>
          <a href="#" className="text-sm text-amber-600 hover:text-amber-500">
            Esqueceu a senha?
          </a>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-center text-sm text-white mb-2">Acesso rápido para demonstração:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('client')}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-black hover:bg-gray-100"
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('employee')}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-black hover:bg-gray-100"
            >
              Funcionário
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-black hover:bg-gray-100"
            >
              Admin
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
