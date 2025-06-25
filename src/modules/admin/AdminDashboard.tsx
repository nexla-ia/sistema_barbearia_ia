import React from 'react';
import { DollarSign, Calendar, Users, TrendingUp, BarChart3, Scissors, User } from 'lucide-react';
import LogoutButton from '@/components/Auth/LogoutButton';
import { useAuth } from '../../contexts/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-slate-600">
          Aqui está um resumo do desempenho do seu negócio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">Receita Hoje</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(1250)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+15%</span>
                <span className="text-slate-500 text-sm ml-1">este mês</span>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">Agendamentos Hoje</p>
              <p className="text-3xl font-bold text-slate-900">24</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+8%</span>
                <span className="text-slate-500 text-sm ml-1">este mês</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">Clientes Ativos</p>
              <p className="text-3xl font-bold text-slate-900">156</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+12%</span>
                <span className="text-slate-500 text-sm ml-1">este mês</span>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">Ticket Médio</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(52)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+5%</span>
                <span className="text-slate-500 text-sm ml-1">este mês</span>
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Receita dos Últimos 7 Dias</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {Array.from({ length: 7 }, (_, i) => {
              const height = Math.random() * 100 + 20;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-amber-500 rounded-t-lg transition-all duration-300 hover:bg-amber-600"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-slate-600 mt-2">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Próximos Agendamentos</h3>
          <div className="space-y-4">
            {[
              { client: 'Carlos Oliveira', service: 'Corte + Barba', time: '10:00', barber: 'João Silva' },
              { client: 'Marcos Lima', service: 'Corte de Cabelo', time: '10:30', barber: 'Pedro Santos' },
              { client: 'André Costa', service: 'Barba', time: '11:00', barber: 'João Silva' },
              { client: 'Roberto Silva', service: 'Corte + Barba', time: '11:30', barber: 'Pedro Santos' },
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{appointment.client}</p>
                  <p className="text-sm text-slate-600">{appointment.service}</p>
                  <p className="text-xs text-slate-500">com {appointment.barber}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">{appointment.time}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Confirmado
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Agendamentos</h3>
          </div>
          <p className="text-slate-600 mb-4">Gerencie todos os agendamentos, confirme ou cancele horários.</p>
          <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
            Acessar Módulo →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Clientes</h3>
          </div>
          <p className="text-slate-600 mb-4">Cadastre novos clientes, gerencie perfis e histórico de serviços.</p>
          <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
            Acessar Módulo →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Relatórios</h3>
          </div>
          <p className="text-slate-600 mb-4">Visualize relatórios detalhados de vendas, serviços e desempenho.</p>
          <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
            Acessar Módulo →
          </button>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Desempenho da Equipe</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-slate-600">Profissional</th>
                <th className="text-left py-3 px-6 font-medium text-slate-600">Atendimentos</th>
                <th className="text-left py-3 px-6 font-medium text-slate-600">Receita</th>
                <th className="text-left py-3 px-6 font-medium text-slate-600">Avaliação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { name: 'João Silva', appointments: 45, revenue: 2250, rating: 4.8 },
                { name: 'Pedro Santos', appointments: 38, revenue: 1900, rating: 4.6 },
                { name: 'Carlos Lima', appointments: 32, revenue: 1600, rating: 4.7 },
              ].map((professional, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <span className="ml-3 font-medium text-slate-900">{professional.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-900">{professional.appointments}</td>
                  <td className="py-4 px-6 font-medium text-green-600">{formatCurrency(professional.revenue)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="ml-1 font-medium text-slate-900">{professional.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <LogoutButton />
      </div>
    </div>
  );
}
