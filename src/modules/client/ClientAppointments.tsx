import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useScheduling } from '../../contexts/SchedulingContext';

export function ClientAppointments() {
  const { user } = useAuth();
  const { state } = useScheduling();

  const appointments = state.appointments.filter(a => a.clientName === user?.name);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-6 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#222222]">
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
              <tr key={apt.id} className="border-b border-[#333333]">
                <td className="px-4 py-2">{apt.date}</td>
                <td className="px-4 py-2">{apt.startTime}</td>
                <td className="px-4 py-2">{apt.services.map(s => s.name).join(', ')}</td>
                <td className="px-4 py-2">{apt.barberName}</td>
                <td className="px-4 py-2 capitalize">{apt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default ClientAppointments;
