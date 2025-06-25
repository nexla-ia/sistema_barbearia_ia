import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/Auth/LogoutButton';

export function EmployeeDashboard() {
  const { user } = useAuth();

  const upcoming = [
    { id: 'a1', time: '09:00', client: 'Carlos Oliveira', service: 'Corte + Barba' },
    { id: 'a2', time: '10:30', client: 'Marcos Lima', service: 'Corte de Cabelo' },
    { id: 'a3', time: '14:00', client: 'André Costa', service: 'Barba' },
    { id: 'a4', time: '15:30', client: 'Roberto Silva', service: 'Corte + Barba' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <LogoutButton />
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo, {user?.name}!</h1>
        <p className="text-slate-600">Abaixo seus próximos atendimentos.</p>
      </div>

      <div className="space-y-4">
        {upcoming.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg border border-slate-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{app.service}</p>
                <p className="text-sm text-slate-600">
                  {app.time} • {app.client}
                </p>
              </div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        ))}
      </div>
    </div>
  );
}
