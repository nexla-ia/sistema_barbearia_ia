import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useClient } from '../../contexts/ClientContext';
import { Star } from 'lucide-react';

export function ClientHistoryPage() {
  const { user } = useAuth();
  const { state } = useClient();

  const client = state.clients.find(c => c.fullName === user?.name);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}>
      <div className="min-h-screen bg-black/50 backdrop-blur text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Histórico de Serviços</h1>
      {client && client.serviceHistory.length > 0 ? (
        <div className="space-y-4">
          {client.serviceHistory.map(service => (
            <div key={service.id} className="bg-[#222222] border border-[#333333] rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{service.serviceName}</h3>
                <p className="text-sm text-gray-400">
                  {service.date.toLocaleDateString('pt-BR')} • {service.professionalName}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{service.pointsEarned}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum serviço encontrado.</p>
      )}
      </div>
    </div>
  );
}

export default ClientHistoryPage;
