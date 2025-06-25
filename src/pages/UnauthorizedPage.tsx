import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    // Redirect based on user role
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'employee') {
      navigate('/employee');
    } else if (user?.role === 'client') {
      navigate('/client');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Acesso Negado</h1>
        
        <p className="text-slate-600 mb-6">
          Você não tem permissão para acessar esta página. Esta área requer privilégios adicionais.
        </p>
        
        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para área permitida
        </button>
      </div>
    </div>
  );
}