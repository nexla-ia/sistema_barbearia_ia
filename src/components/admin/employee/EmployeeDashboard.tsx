import React from 'react';
import { Clock, Scissors, User } from 'lucide-react';
import LogoutButton from '@/components/Auth/LogoutButton';

interface Appointment {
  time: string;
  service: string;
  client: string;
}

const appointments: Appointment[] = [
  { time: '09:00', service: 'Corte de Cabelo', client: 'Carlos Almeida' },
  { time: '10:30', service: 'Barba', client: 'Marcos Lima' },
  { time: '13:00', service: 'Corte + Barba', client: 'Roberto Silva' },
];

export function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Próximos Agendamentos</h1>
      <div className="space-y-4">
        {appointments.map((apt, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Scissors className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-semibold text-slate-900">{apt.service}</p>
                <div className="flex items-center text-sm text-slate-600 gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{apt.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <User className="w-4 h-4" />
              <span>{apt.client}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <LogoutButton />
      </div>
    </div>
  );
}

export default EmployeeDashboard;

