import React from 'react';
import { X } from 'lucide-react';

interface AppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentsModal({ isOpen, onClose }: AppointmentsModalProps) {
  if (!isOpen) return null;

  const appointments = [
    { id: 1, date: '25/06/2025', time: '14:00', service: 'Corte de Cabelo', professional: 'João Santos' },
    { id: 2, date: '10/07/2025', time: '16:00', service: 'Barba', professional: 'Pedro Almeida' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222222] rounded-lg p-6 max-w-md w-full border border-[#333333] text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Meus Agendamentos</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#333333]">
              <tr>
                <th className="px-4 py-2 text-left">Dia</th>
                <th className="px-4 py-2 text-left">Horário</th>
                <th className="px-4 py-2 text-left">Serviço</th>
                <th className="px-4 py-2 text-left">Profissional</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.id} className="border-b border-[#333333]">
                  <td className="px-4 py-2">{apt.date}</td>
                  <td className="px-4 py-2">{apt.time}</td>
                  <td className="px-4 py-2">{apt.service}</td>
                  <td className="px-4 py-2">{apt.professional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AppointmentsModal;
