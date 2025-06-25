import React, { useState } from 'react';
import { Calendar, Clock, User, Scissors, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data for today's appointments
  const todayAppointments = [
    {
      id: 'a1',
      time: '09:00',
      client: 'Carlos Oliveira',
      service: 'Corte + Barba',
      status: 'confirmed',
    },
    {
      id: 'a2',
      time: '10:30',
      client: 'Marcos Lima',
      service: 'Corte de Cabelo',
      status: 'confirmed',
    },
    {
      id: 'a3',
      time: '14:00',
      client: 'André Costa',
      service: 'Barba',
      status: 'pending',
    },
    {
      id: 'a4',
      time: '15:30',
      client: 'Roberto Silva',
      service: 'Corte + Barba',
      status: 'confirmed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-slate-600">
          Gerencie sua agenda e atendimentos do dia.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Agendamentos Hoje</p>
              <p className="text-2xl font-bold text-slate-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Concluídos</p>
              <p className="text-2xl font-bold text-slate-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pendentes</p>
              <p className="text-2xl font-bold text-slate-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Comissões Hoje</p>
              <p className="text-2xl font-bold text-slate-900">R$ 120</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Agenda de Hoje</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
              Anterior
            </button>
            <button className="px-3 py-1 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600">
              Hoje
            </button>
            <button className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
              Próximo
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {todayAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-900">{appointment.time}</div>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{appointment.client}</p>
                  <p className="text-sm text-slate-600">{appointment.service}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status === 'confirmed' ? 'Confirmado' : 
                   appointment.status === 'pending' ? 'Pendente' : 'Cancelado'}
                </span>
                <div className="flex space-x-1">
                  <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Management */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Clientes Recentes</h2>
          <button className="text-sm text-amber-600 hover:text-amber-700">Ver todos</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-slate-600">Cliente</th>
                <th className="text-left py-3 px-6 font-medium text-slate-600">Contato</th>
                <th className="text-left py-3 px-6 font-medium text-slate-600">Última Visita</th>
                <th className="text-left py-3 px-6 font-medium text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 99999-9999', lastVisit: '10/07/2024' },
                { name: 'Marcos Lima', email: 'marcos@email.com', phone: '(11) 88888-8888', lastVisit: '08/07/2024' },
                { name: 'André Costa', email: 'andre@email.com', phone: '(11) 77777-7777', lastVisit: '05/07/2024' },
              ].map((client, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-slate-600 font-medium">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-slate-900">{client.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {client.phone}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {client.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-900">
                      {client.lastVisit}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Ver Detalhes
                      </button>
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                        Agendar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}