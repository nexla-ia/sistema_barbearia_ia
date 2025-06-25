import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();

  if (!isOpen) return null;

  const profile = {
    name: user?.name || 'Cliente Exemplo',
    phone: '(69) 99999-0000',
    email: 'cliente@example.com',
    address: 'Rua das Flores, 123 - Porto Velho',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222222] rounded-lg p-6 max-w-md w-full border border-[#333333] text-white space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Meu Perfil</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-2">
          <p><span className="font-semibold">Nome:</span> {profile.name}</p>
          <p><span className="font-semibold">Telefone:</span> {profile.phone}</p>
          <p><span className="font-semibold">E-mail:</span> {profile.email}</p>
          <p><span className="font-semibold">Endereço:</span> {profile.address}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
