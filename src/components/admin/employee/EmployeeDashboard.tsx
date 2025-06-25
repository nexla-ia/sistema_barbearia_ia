import React from 'react';
import { Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/Auth/LogoutButton';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const appointments = [
    { time: '09:00', service: 'Corte de Cabelo', client: 'Carlos Oliveira' },
    { time: '10:30', service: 'Barba', client: 'Marcos Lima' },
    { time: '13:00', service: 'Corte + Barba', client: 'Ana Souza' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Olá, {user?.name}</h1>
      <div className="grid gap-4">
        {appointments.map((appt, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
          >
            <Calendar className="w-5 h-5 text-amber-500" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {appt.time} • {appt.service}
              </p>
              <p className="text-gray-600 flex items-center">
                <User className="w-4 h-4 mr-1" /> {appt.client}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <LogoutButton variant="outline" onLogout={() => navigate('/')} />
      </div>
    </div>
  );
}
