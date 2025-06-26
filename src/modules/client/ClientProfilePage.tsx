import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useClient } from '../../contexts/ClientContext';

export function ClientProfilePage() {
  const { user, updateUser } = useAuth();
  const { state, dispatch } = useClient();

  const client = state.clients.find(c => c.fullName === user?.name);

  const [formData, setFormData] = useState({
    fullName: client?.fullName || '',
    phone: client?.phone || '',
    email: client?.email || '',
    password: user?.password || '',
    street: client?.address?.street || '',
    number: client?.address?.number || '',
    city: client?.address?.city || '',
  });

  if (!client) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
        <p>Dados do cliente não encontrados.</p>
      </div>
    );
  }

  const handleSave = () => {
    const updatedClient = {
      ...client,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: {
        ...(client.address || {}),
        street: formData.street,
        number: formData.number,
        city: formData.city,
      },
    };

    dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
    updateUser({ name: formData.fullName, email: formData.email, password: formData.password });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1527631120902-cb4e2b33f410?auto=format&fit=crop&w=1350&q=80')" }}
    >
      <div className="min-h-screen bg-black/70 backdrop-blur text-white p-6 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome Completo</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#222222] border border-[#444444] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#222222] border border-[#444444] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#222222] border border-[#444444] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#222222] border border-[#444444] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Rua</label>
            <input
              type="text"
              value={formData.street}
              onChange={e => setFormData({ ...formData, street: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#222222] border border-[#444444] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Número</label>
            <input
              type="text"
              value={formData.number}
              onChange={e => setFormData({ ...formData, number: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#222222] border border-[#444444] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cidade</label>
            <input
              type="text"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-[#222222] border border-[#444444] text-white"
            />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button onClick={handleSave} className="px-4 py-2 rounded bg-amber-500 text-black">Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default ClientProfilePage;
