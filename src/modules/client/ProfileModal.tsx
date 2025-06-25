import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useClient } from '../../contexts/ClientContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const { state } = useClient();

  if (!isOpen) return null;

  const sampleProfile = {
    fullName: 'Carlos Oliveira',
    phone: '11955554444',
    email: 'carlos@email.com',
    address: 'Rua Exemplo, 123 - São Paulo/SP',
  };

  const client = state.clients.find(c => c.fullName === user?.name);

  const profile = client ? {
    fullName: client.fullName,
    phone: client.phone,
    email: client.email,
    address: client.address ? `${client.address.street}, ${client.address.number} - ${client.address.city}/${client.address.state}` : 'Sem endereço cadastrado',
  } : sampleProfile;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222222] rounded-lg p-6 max-w-md w-full border border-[#333333] text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Meu Perfil</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Informações Pessoais</h4>
            <p>Nome: {profile.fullName}</p>
            <p>Telefone: {profile.phone}</p>
            <p>E-mail: {profile.email}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Endereço</h4>
            <p>{profile.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
