import React, { useState } from 'react';
import { Calendar, Users, Clock, TrendingUp, Phone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useScheduling } from '../../contexts/SchedulingContext';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

export function SchedulingDashboard() {
  const { state } = useScheduling();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'today' | 'upcoming' | 'history'>('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-slate-600 bg-slate-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'no_show':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const todayAppointments = state.appointments.filter(apt => 
    isToday(new Date(apt.date)) && apt.status !== 'cancelled'
  );
  
  const tomorrowAppointments = state.appointments.filter(apt => 
    isTomorrow(new Date(apt.date)) && apt.status !== 'cancelled'
  );

  const upcomingAppointments = state.appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return aptDate >= today && aptDate <= nextWeek && apt.status !== 'cancelled';
  });

  const todayRevenue = todayAppointments.reduce((sum, apt) => sum + apt.totalPrice, 0);
  const pendingAppointments = state.appointments.filter(apt => apt.status === 'pending');
  const confirmedAppointments = state.appointments.filter(apt => apt.status === 'confirmed');

  const stats = [
    {
      title: 'Agendamentos Hoje',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'blue',
      subtitle: `Receita: ${formatCurrency(todayRevenue)}`,
    },
    {
      title: 'Confirmados',
      value: confirmedAppointments.length,
      icon: CheckCircle,
      color: 'green',
      subtitle: 'Este mês',
    },
    {
      title: 'Pendentes',
      value: pendingAppointments.length,
      icon: AlertCircle,
      color: 'yellow',
      subtitle: 'Aguardando confirmação',
    },
    {
      title: 'Taxa de Ocupação',
      value: '78%',
      icon: TrendingUp,
      color: 'purple',
      subtitle: 'Média semanal',
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            yellow: 'bg-yellow-50 text-yellow-600',
            purple: 'bg-purple-50 text-purple-600',
          };
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Agenda de Hoje</h3>
          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-slate-900">{appointment.startTime}</div>
                      <div className="text-xs text-slate-500">{appointment.endTime}</div>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{appointment.clientName}</p>
                      <p className="text-sm text-slate-600">
                        {appointment.services.map(s => s.name).join(', ')}
                      </p>
                      <p className="text-xs text-slate-500">com {appointment.barberName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1">
                        {appointment.status === 'confirmed' ? 'Confirmado' : 
                         appointment.status === 'pending' ? 'Pendente' : 
                         appointment.status}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
              {todayAppointments.length > 5 && (
                <button
                  onClick={() => setSelectedTab('today')}
                  className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium py-2"
                >
                  Ver todos os {todayAppointments.length} agendamentos
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Nenhum agendamento para hoje</p>
            </div>
          )}
        </div>

        {/* Pending Confirmations */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Confirmações Pendentes</h3>
          {pendingAppointments.length > 0 ? (
            <div className="space-y-3">
              {pendingAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium text-slate-900">{appointment.clientName}</p>
                    <p className="text-sm text-slate-600">
                      {format(new Date(appointment.date), 'dd/MM')} às {appointment.startTime}
                    </p>
                    <p className="text-xs text-slate-500">
                      {appointment.services.map(s => s.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-600">Todas as confirmações em dia!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTodayAppointments = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Agendamentos de Hoje ({todayAppointments.length})
      </h3>
      {todayAppointments.length > 0 ? (
        <div className="space-y-4">
          {todayAppointments.map((appointment) => (
            <div key={appointment.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{appointment.startTime}</div>
                    <div className="text-sm text-slate-500">{appointment.endTime}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{appointment.clientName}</h4>
                    <p className="text-sm text-slate-600">com {appointment.barberName}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  <span className="ml-2">
                    {appointment.status === 'confirmed' ? 'Confirmado' : 
                     appointment.status === 'pending' ? 'Pendente' : 
                     appointment.status}
                  </span>
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <h5 className="text-sm font-medium text-slate-700 mb-1">Serviços</h5>
                  <p className="text-sm text-slate-600">
                    {appointment.services.map(s => s.name).join(', ')}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-slate-700 mb-1">Contato</h5>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{appointment.clientPhone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{appointment.clientEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span>Duração: {appointment.totalDuration} min</span>
                  <span className="font-semibold text-slate-900">
                    Total: {formatCurrency(appointment.totalPrice)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                    Editar
                  </button>
                  <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded">
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Nenhum agendamento para hoje</p>
        </div>
      )}
    </div>
  );

  const renderUpcomingAppointments = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Próximos Agendamentos ({upcomingAppointments.length})
      </h3>
      {upcomingAppointments.length > 0 ? (
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-900">
                      {format(new Date(appointment.date), 'dd/MM')}
                    </div>
                    <div className="text-lg font-bold text-slate-900">{appointment.startTime}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{appointment.clientName}</h4>
                    <p className="text-sm text-slate-600">
                      {appointment.services.map(s => s.name).join(', ')}
                    </p>
                    <p className="text-xs text-slate-500">com {appointment.barberName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span className="ml-1">
                      {appointment.status === 'confirmed' ? 'Confirmado' : 
                       appointment.status === 'pending' ? 'Pendente' : 
                       appointment.status}
                    </span>
                  </span>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {formatCurrency(appointment.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Nenhum agendamento próximo</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Agendamentos</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'today', label: 'Hoje' },
            { id: 'upcoming', label: 'Próximos' },
            { id: 'history', label: 'Histórico' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {selectedTab === 'overview' && renderOverview()}
      {selectedTab === 'today' && renderTodayAppointments()}
      {selectedTab === 'upcoming' && renderUpcomingAppointments()}
      {selectedTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Histórico de Agendamentos</h3>
          <p className="text-slate-600">Módulo em desenvolvimento</p>
        </div>
      )}
    </div>
  );
}