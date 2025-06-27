import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useClient } from '../../contexts/ClientContext';

export function ClientProfilePage() {
  const { user, updateUser } = useAuth();
  const { state, dispatch } = useClient();

  const client = state.clients.find(c => c.fullName === user?.name);

  const defaultProfile = {
    fullName: 'Cliente Exemplo',
    phone: '11999999999',
    email: 'cliente@exemplo.com',
    password: '123456',
    street: 'Rua Exemplo',
    number: '100',
    city: 'São Paulo',
  };

  const [formData, setFormData] = useState({
    fullName: client?.fullName || defaultProfile.fullName,
    phone: client?.phone || defaultProfile.phone,
    email: client?.email || defaultProfile.email,
    password: user?.password || defaultProfile.password,
    street: client?.address?.street || defaultProfile.street,
    number: client?.address?.number || defaultProfile.number,
    city: client?.address?.city || defaultProfile.city,
  });

  const [isEditing, setIsEditing] = useState(false);


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
    setIsEditing(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur text-white">
        <div className="p-6 space-y-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
        <div className="space-y-4">
          {isEditing ? (
            <>
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
            </>
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>Nome:</strong> {formData.fullName}</p>
              <p><strong>Telefone:</strong> {formData.phone}</p>
              <p><strong>E-mail:</strong> {formData.email}</p>
              <p><strong>Rua:</strong> {formData.street}</p>
              <p><strong>Número:</strong> {formData.number}</p>
              <p><strong>Cidade:</strong> {formData.city}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end pt-4 gap-2">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded bg-gray-600 text-white">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-amber-500 text-black">Salvar</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded bg-amber-500 text-black">Editar</button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfilePage;
