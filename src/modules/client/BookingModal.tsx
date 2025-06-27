import React from 'react';
import { X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-[#303030] rounded-lg p-6 max-w-md w-full border border-[#444444] text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Agendar Horário</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Serviço</label>
            <select className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white">
              <option value="">Selecione um serviço</option>
              <option value="corte">Corte de Cabelo</option>
              <option value="barba">Barba</option>
              <option value="combo">Corte + Barba</option>
              <option value="outros">Outros serviços</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Data</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Horário</label>
              <select className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white">
                <option value="">Selecione</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Observações (opcional)</label>
            <textarea
              className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white"
              rows={3}
              placeholder="Alguma informação adicional?"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#C4A747] text-black py-3 rounded font-bold hover:bg-[#D4B757] transition-colors"
          >
            Confirmar Agendamento
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
