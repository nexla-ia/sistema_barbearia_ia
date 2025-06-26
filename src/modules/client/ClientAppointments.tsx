import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useScheduling } from '../../contexts/SchedulingContext';

export function ClientAppointments() {
  const { user } = useAuth();
  const { state } = useScheduling();

  const appointments = state.appointments.filter(a => a.clientName === user?.name);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur text-white">
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Dia</th>
              <th className="px-4 py-2 text-left">Horário</th>
              <th className="px-4 py-2 text-left">Serviço</th>
              <th className="px-4 py-2 text-left">Profissional</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id} className="border-b border-gray-700">
                <td className="px-4 py-2 text-gray-200">{apt.date}</td>
                <td className="px-4 py-2 text-gray-200">{apt.startTime}</td>
                <td className="px-4 py-2 text-gray-200">{apt.services.map(s => s.name).join(', ')}</td>
                <td className="px-4 py-2 text-gray-200">{apt.barberName}</td>
                <td className="px-4 py-2 capitalize text-gray-200">{apt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
      </div>
    </div>
  );
}

export default ClientAppointments;
