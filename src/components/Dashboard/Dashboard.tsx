import React from 'react';
import { DollarSign, Calendar, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { StatsCard } from './StatsCard';

export function Dashboard() {
  const { state } = useApp();
  const { dashboardStats } = state;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Receita Hoje"
          value={formatCurrency(dashboardStats.todayRevenue)}
          icon={DollarSign}
          trend={{
            value: dashboardStats.revenueGrowth,
            isPositive: dashboardStats.revenueGrowth > 0,
          }}
          color="green"
        />
        <StatsCard
          title="Agendamentos Hoje"
          value={dashboardStats.todayAppointments}
          icon={Calendar}
          trend={{
            value: dashboardStats.appointmentGrowth,
            isPositive: dashboardStats.appointmentGrowth > 0,
          }}
          color="blue"
        />
        <StatsCard
          title="Clientes Ativos"
          value={dashboardStats.activeClients}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Ticket Médio"
          value={formatCurrency(dashboardStats.averageTicket)}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Receita dos Últimos 7 Dias</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {Array.from({ length: 7 }, (_, i) => {
              const height = Math.random() * 100 + 20;
              const value = Math.random() * 500 + 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-amber-500 rounded-t-lg transition-all duration-300 hover:bg-amber-600"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-slate-600 mt-2">
                    {new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { 
                      weekday: 'short' 
                    })}
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Novo Agendamento</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Cadastrar Cliente</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Registrar Pagamento</span>
          </button>
        </div>
      </div>
    </div>
  );
}