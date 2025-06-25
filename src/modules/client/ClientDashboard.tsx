import React from 'react';
import { Calendar, Clock, User, Scissors, History, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LogoutButton from '@/components/Auth/LogoutButton';

export function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <LogoutButton />
      </div>
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-slate-600">
          Gerencie seus agendamentos e acompanhe seu histórico de serviços.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Agendar</h3>
              <p className="text-sm text-slate-600">Marque um novo horário</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Meus Agendamentos</h3>
              <p className="text-sm text-slate-600">Visualize ou cancele</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Meu Perfil</h3>
              <p className="text-sm text-slate-600">Atualize suas informações</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Próximos Agendamentos</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Scissors className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Corte + Barba</h3>
                <p className="text-sm text-slate-600">Hoje, 15:30 • João Silva</p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Confirmado
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Scissors className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Barba</h3>
                <p className="text-sm text-slate-600">15/07, 14:00 • Pedro Santos</p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pendente
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Service History */}
      <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Histórico de Serviços</h2>
          <button className="text-sm text-amber-600 hover:text-amber-700">Ver todos</button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-200 p-3 rounded-full">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Corte de Cabelo</h3>
                <p className="text-sm text-slate-600">01/07/2024 • João Silva</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">5.0</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-200 p-3 rounded-full">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Corte + Barba</h3>
                <p className="text-sm text-slate-600">15/06/2024 • Pedro Santos</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Program */}
      <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Programa de Fidelidade</h2>
        
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Nível Bronze</h3>
              <p className="text-sm text-slate-600">150 pontos acumulados</p>
            </div>
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              150 pts
            </div>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
          </div>
          
          <p className="text-sm text-slate-600 mb-4">
            Faltam 350 pontos para o próximo nível (Prata)
          </p>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">Benefícios Disponíveis</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span>5% de desconto em todos os serviços</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span>Presente de aniversário</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}