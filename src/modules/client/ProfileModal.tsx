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

  const defaultProfile = {
    fullName: 'Cliente Exemplo',
    phone: '11999999999',
    email: 'cliente@exemplo.com',
    password: '123456',
  };

  const [formData, setFormData] = useState({
    fullName: client?.fullName || defaultProfile.fullName,
    phone: client?.phone || defaultProfile.phone,
    email: client?.email || defaultProfile.email,
    password: user?.password || defaultProfile.password,
  });

  const [isEditing, setIsEditing] = useState(false);

  const address = client?.address
    ? `${client.address.street}, ${client.address.number} - ${client.address.city}/${client.address.state}`
    : 'Sem endereço cadastrado';

  const handleSave = () => {
    if (!client) return;
    const updatedClient = { ...client, fullName: formData.fullName, phone: formData.phone, email: formData.email };
    dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
    updateUser({ name: formData.fullName, email: formData.email, password: formData.password });
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-[#303030] rounded-lg p-6 max-w-md w-full text-white space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Meu Perfil</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Nome Completo</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded bg-[#333333] border border-[#444444] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Telefone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded bg-[#333333] border border-[#444444] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded bg-[#333333] border border-[#444444] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Senha</label>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded bg-[#333333] border border-[#444444] text-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p><strong>Nome:</strong> {formData.fullName}</p>
            <p><strong>Telefone:</strong> {formData.phone}</p>
            <p><strong>E-mail:</strong> {formData.email}</p>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded bg-gray-600 text-white">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-amber-500 text-black">Salvar</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded bg-amber-500 text-black">Editar</button>
          )}
        </div>
        <p className="text-sm text-gray-300">Endereço: {address}</p>
      </div>
    </div>
  );
}

export default ProfileModal;
