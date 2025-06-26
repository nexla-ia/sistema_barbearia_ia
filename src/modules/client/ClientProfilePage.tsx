import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useClient } from '../../contexts/ClientContext';

export function ClientProfilePage() {
  const { user } = useAuth();
  const { state } = useClient();

  const client = state.clients.find(c => c.fullName === user?.name);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1527631120902-cb4e2b33f410?auto=format&fit=crop&w=1350&q=80')" }}>
      <div className="min-h-screen bg-white/80 backdrop-blur text-gray-800 p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
      {client ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Informações Pessoais</h2>
            <p>Nome: {client.fullName}</p>
            <p>Telefone: {client.phone}</p>
            <p>E-mail: {client.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Endereço</h2>
            {client.address ? (
              <p>
                {client.address.street}, {client.address.number} - {client.address.city}
              </p>
            ) : (
              <p>Sem endereço cadastrado.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Dados do cliente não encontrados.</p>
      )}
      </div>
    </div>
  );
}

export default ClientProfilePage;
