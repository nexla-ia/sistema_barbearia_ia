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
    {
      id: 'samp3',
      date: '20/07/2024',
      time: '16:00',
      service: 'Corte + Barba',
      barber: 'Carlos Alberto',
      status: 'confirmado',
    },
    {
      id: 'samp4',
      date: '25/07/2024',
      time: '09:30',
      service: 'Pezinho',
      barber: 'Marcos Paulo',
      status: 'cancelado',
    },
    {
      id: 'samp5',
      date: '30/07/2024',
      time: '11:00',
      service: 'Tratamento Capilar',
      barber: 'Rafael Costa',
      status: 'confirmado',
    },
    {
      id: 'samp6',
      date: '05/08/2024',
      time: '15:00',
      service: 'Hidratação',
      barber: 'Lucas Rocha',
      status: 'pendente',
    },
    {
      id: 'samp7',
      date: '10/08/2024',
      time: '13:30',
      service: 'Coloração',
      barber: 'Fernando Lima',
      status: 'confirmado',
    },
    {
      id: 'samp8',
      date: '15/08/2024',
      time: '17:00',
      service: 'Alisamento',
      barber: 'Bruno Ferreira',
      status: 'cancelado',
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-[#303030] rounded-lg p-6 max-w-md w-full border border-[#444444] text-white">
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
