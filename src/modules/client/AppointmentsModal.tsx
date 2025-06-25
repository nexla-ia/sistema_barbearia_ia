import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useScheduling } from '../../contexts/SchedulingContext';

interface AppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentsModal({ isOpen, onClose }: AppointmentsModalProps) {
  const { user } = useAuth();
  const { state } = useScheduling();

  if (!isOpen) return null;

  const sampleAppointments = [
    {
      id: 'samp1',
      date: '10/07/2024',
      time: '10:00',
      service: 'Corte de Cabelo',
      barber: 'João Silva',
      status: 'confirmado',
    },
    {
      id: 'samp2',
      date: '15/07/2024',
      time: '14:00',
      service: 'Barba',
      barber: 'Pedro Santos',
      status: 'pendente',
    },
  ];

  const appointments = state.appointments.filter(a => a.clientName === user?.name);

  const list = appointments.length > 0 ? appointments.map(a => ({
    id: a.id,
    date: a.date,
    time: a.startTime,
    service: a.services.map(s => s.name).join(', '),
    barber: a.barberName,
    status: a.status,
  })) : sampleAppointments;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222222] rounded-lg p-6 max-w-md w-full border border-[#333333] text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Meus Agendamentos</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {list.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-[#1f1f1f] p-4 rounded-lg">
              <div>
                <h4 className="font-semibold">{item.service}</h4>
                <p className="text-sm text-gray-400">{item.date} • {item.time} • {item.barber}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'confirmado' ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppointmentsModal;
