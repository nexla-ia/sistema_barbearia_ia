import React from 'react';
import { X, Star, History as HistoryIcon } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  if (!isOpen) return null;

  const history = [
    {
      id: 'h1',
      service: 'Corte de Cabelo',
      date: '01/07/2024',
      professional: 'João Silva',
      rating: '5.0',
    },
    {
      id: 'h2',
      service: 'Corte + Barba',
      date: '15/06/2024',
      professional: 'Pedro Santos',
      rating: '4.8',
    },
    {
      id: 'h3',
      service: 'Barba',
      date: '28/05/2024',
      professional: 'Marcos Paulo',
      rating: '4.7',
    },
    {
      id: 'h4',
      service: 'Tratamento Capilar',
      date: '10/05/2024',
      professional: 'Carlos Alberto',
      rating: '5.0',
    },
    {
      id: 'h5',
      service: 'Selagem',
      date: '22/04/2024',
      professional: 'Rafael Costa',
      rating: '4.9',
    },
    {
      id: 'h6',
      service: 'Luzes',
      date: '02/04/2024',
      professional: 'Fernando Lima',
      rating: '4.8',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#303030] rounded-lg p-6 max-w-md w-full border border-[#444444] text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Histórico de Serviços</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {history.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-[#1f1f1f] p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-slate-500/20 p-3 rounded-full">
                  <HistoryIcon className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <h4 className="font-semibold">{item.service}</h4>
                  <p className="text-sm text-gray-400">{item.date} • {item.professional}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;
