import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useClient } from '../../contexts/ClientContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUser } = useAuth();
  const { state, dispatch } = useClient();

  if (!isOpen) return null;

  const client = state.clients.find(c => c.fullName === user?.name);

  const [formData, setFormData] = useState({
    fullName: client?.fullName || '',
    phone: client?.phone || '',
    email: client?.email || '',
    password: user?.password || '',
  });

  const address = client?.address
    ? `${client.address.street}, ${client.address.number} - ${client.address.city}/${client.address.state}`
    : 'Sem endereço cadastrado';

  const handleSave = () => {
    if (!client) return;
    const updatedClient = { ...client, fullName: formData.fullName, phone: formData.phone, email: formData.email };
    dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
    updateUser({ name: formData.fullName, email: formData.email, password: formData.password });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-gray-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Meu Perfil</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Nome Completo</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-amber-500 text-black">Salvar</button>
        </div>
        <p className="text-sm text-gray-600">Endereço: {address}</p>
      </div>
    </div>
  );
}

export default ProfileModal;
