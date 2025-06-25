import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, MessageCircle, Gift, Star, Calendar } from 'lucide-react';
import { ClientProfile, ClientSearchFilters } from '../../types/client';
import { useClient } from '../../contexts/ClientContext';
import { ClientSearch } from './ClientSearch';
import { ClientRegistration } from './ClientRegistration';
import { ClientProfile as ClientProfileComponent } from './ClientProfile';

export function ClientManagement() {
  const { state, dispatch, searchClients } = useClient();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [editingClient, setEditingClient] = useState<ClientProfile | null>(null);
  const [searchFilters, setSearchFilters] = useState<ClientSearchFilters>({});

  const filteredClients = searchClients(searchFilters);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const getLoyaltyLevelColor = (level: string) => {
    switch (level) {
      case 'bronze':
        return 'bg-orange-100 text-orange-800';
      case 'silver':
        return 'bg-slate-100 text-slate-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleSaveClient = (client: ClientProfile) => {
    if (editingClient) {
      dispatch({ type: 'UPDATE_CLIENT', payload: client });
    } else {
      dispatch({ type: 'ADD_CLIENT', payload: client });
    }
    setShowRegistration(false);
    setEditingClient(null);
  };

  const handleEditClient = (client: ClientProfile) => {
    setEditingClient(client);
    setShowRegistration(true);
  };

  const handleViewProfile = (client: ClientProfile) => {
    setSelectedClient(client);
    setShowProfile(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      dispatch({ type: 'DELETE_CLIENT', payload: clientId });
    }
  };

  const handleExportResults = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Última Visita', 'Total Gasto', 'Pontos', 'Nível'].join(','),
      ...filteredClients.map(client => [
        client.fullName,
        client.email,
        client.phone,
        client.lastVisit ? formatDate(client.lastVisit) : 'Nunca',
        client.totalSpent.toString(),
        client.loyaltyProgram.currentPoints.toString(),
        client.loyaltyProgram.currentLevel,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (showRegistration) {
    return (
      <ClientRegistration
        client={editingClient || undefined}
        onSave={handleSaveClient}
        onCancel={() => {
          setShowRegistration(false);
          setEditingClient(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Clientes</h1>
        <button
          onClick={() => setShowRegistration(true)}
          className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Search and Filters */}
      <ClientSearch
        onFiltersChange={setSearchFilters}
        onExportResults={handleExportResults}
      />

      {/* Client List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Lista de Clientes ({filteredClients.length})
          </h2>
        </div>

        {filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Cliente</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Contato</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Última Visita</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Total Gasto</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Fidelidade</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {client.photo ? (
                          <img
                            src={client.photo}
                            alt={client.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 font-medium">
                              {client.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{client.fullName}</p>
                          <p className="text-sm text-slate-600">
                            Cliente desde {formatDate(client.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-900">{client.phone}</p>
                        <p className="text-sm text-slate-600">{client.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-900">
                          {client.lastVisit ? formatDate(client.lastVisit) : 'Nunca'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-900">
                        {formatCurrency(client.totalSpent)}
                      </span>
                      <p className="text-sm text-slate-600">{client.visitCount} visitas</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLoyaltyLevelColor(client.loyaltyProgram.currentLevel)}`}>
                          {client.loyaltyProgram.currentLevel.toUpperCase()}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-slate-900">
                            {client.loyaltyProgram.currentPoints}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewProfile(client)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Ver perfil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClient(client)}
                          className="p-1 text-amber-600 hover:bg-amber-100 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="Enviar mensagem"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                          title="Adicionar pontos"
                        >
                          <Gift className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-600 mb-4">
              {Object.keys(searchFilters).length > 0 
                ? 'Nenhum cliente encontrado com os filtros aplicados' 
                : 'Nenhum cliente cadastrado ainda'
              }
            </p>
            <button
              onClick={() => setShowRegistration(true)}
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeiro Cliente
            </button>
          </div>
        )}
      </div>

      {/* Client Profile Modal */}
      {showProfile && selectedClient && (
        <ClientProfileComponent
          client={selectedClient}
          onEdit={() => {
            setShowProfile(false);
            handleEditClient(selectedClient);
          }}
          onClose={() => {
            setShowProfile(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
}