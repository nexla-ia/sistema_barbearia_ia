import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Calendar, BarChart3, Star, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { Professional, ProfessionalSearchFilters } from '../../types/professional';
import { useProfessional } from '../../contexts/ProfessionalContext';
import { ProfessionalRegistration } from './ProfessionalRegistration';
import { ProfessionalSchedule } from './ProfessionalSchedule';
import { ProfessionalReports } from './ProfessionalReports';

export function ProfessionalManagement() {
  const { state, dispatch, searchProfessionals } = useProfessional();
  const [activeView, setActiveView] = useState<'list' | 'registration' | 'schedule' | 'reports'>('list');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [searchFilters, setSearchFilters] = useState<ProfessionalSearchFilters>({});

  const filteredProfessionals = searchProfessionals(searchFilters);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'vacation':
        return 'bg-blue-100 text-blue-800';
      case 'medical_leave':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'employee':
        return 'CLT';
      case 'freelancer':
        return 'Freelancer';
      case 'partner':
        return 'Sócio';
      default:
        return type;
    }
  };

  const handleSaveProfessional = (professional: Professional) => {
    if (editingProfessional) {
      dispatch({ type: 'UPDATE_PROFESSIONAL', payload: professional });
    } else {
      dispatch({ type: 'ADD_PROFESSIONAL', payload: professional });
    }
    setActiveView('list');
    setEditingProfessional(null);
  };

  const handleEditProfessional = (professional: Professional) => {
    setEditingProfessional(professional);
    setActiveView('registration');
  };

  const handleViewSchedule = (professional: Professional) => {
    setSelectedProfessional(professional);
    setActiveView('schedule');
  };

  const handleViewReports = (professional: Professional) => {
    setSelectedProfessional(professional);
    setActiveView('reports');
  };

  const handleDeleteProfessional = (professionalId: string) => {
    if (confirm('Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita.')) {
      dispatch({ type: 'DELETE_PROFESSIONAL', payload: professionalId });
    }
  };

  const hasExpiringDocuments = (professional: Professional) => {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return professional.documents.some(doc => 
      doc.expiresAt && doc.expiresAt <= thirtyDaysFromNow
    );
  };

  if (activeView === 'registration') {
    return (
      <ProfessionalRegistration
        professional={editingProfessional || undefined}
        onSave={handleSaveProfessional}
        onCancel={() => {
          setActiveView('list');
          setEditingProfessional(null);
        }}
      />
    );
  }

  if (activeView === 'schedule' && selectedProfessional) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('list')}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Voltar
          </button>
        </div>
        <ProfessionalSchedule professional={selectedProfessional} />
      </div>
    );
  }

  if (activeView === 'reports' && selectedProfessional) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('list')}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Voltar
          </button>
        </div>
        <ProfessionalReports professional={selectedProfessional} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Profissionais</h1>
        <button
          onClick={() => setActiveView('registration')}
          className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Profissional
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={searchFilters.name || ''}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Buscar por nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Especialidade
            </label>
            <input
              type="text"
              value={searchFilters.specialty || ''}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, specialty: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Buscar por especialidade"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={searchFilters.status?.[0] || ''}
              onChange={(e) => setSearchFilters(prev => ({ 
                ...prev, 
                status: e.target.value ? [e.target.value] : undefined 
              }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="vacation">Férias</option>
              <option value="medical_leave">Licença Médica</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Contrato
            </label>
            <select
              value={searchFilters.contractType?.[0] || ''}
              onChange={(e) => setSearchFilters(prev => ({ 
                ...prev, 
                contractType: e.target.value ? [e.target.value] : undefined 
              }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="employee">CLT</option>
              <option value="freelancer">Freelancer</option>
              <option value="partner">Sócio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total de Profissionais</p>
              <p className="text-2xl font-bold text-slate-900">{state.professionals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Ativos</p>
              <p className="text-2xl font-bold text-slate-900">
                {state.professionals.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Avaliação Média</p>
              <p className="text-2xl font-bold text-slate-900">
                {(state.professionals.reduce((sum, p) => sum + p.metrics.averageRating, 0) / state.professionals.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Documentos Vencendo</p>
              <p className="text-2xl font-bold text-slate-900">
                {state.professionals.filter(hasExpiringDocuments).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Lista de Profissionais ({filteredProfessionals.length})
          </h2>
        </div>

        {filteredProfessionals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Profissional</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Especialidades</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Contrato</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Performance</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProfessionals.map((professional) => (
                  <tr key={professional.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {professional.photo ? (
                          <img
                            src={professional.photo}
                            alt={professional.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 font-medium">
                              {professional.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{professional.fullName}</p>
                          <p className="text-sm text-slate-600">
                            Desde {formatDate(professional.admissionDate)}
                          </p>
                          {hasExpiringDocuments(professional) && (
                            <div className="flex items-center space-x-1 mt-1">
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              <span className="text-xs text-red-600">Documentos vencendo</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {professional.specialties.slice(0, 2).map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                        {professional.specialties.length > 2 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                            +{professional.specialties.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-medium text-slate-900">
                          {getContractTypeLabel(professional.contractType)}
                        </span>
                        <p className="text-sm text-slate-600">
                          {professional.services.length} serviços
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-slate-900">
                            {professional.metrics.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {formatCurrency(professional.metrics.totalRevenue)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {professional.metrics.totalAppointments} atendimentos
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(professional.status)}`}>
                        {professional.status === 'active' ? 'Ativo' :
                         professional.status === 'inactive' ? 'Inativo' :
                         professional.status === 'vacation' ? 'Férias' : 'Licença Médica'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewSchedule(professional)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Ver agenda"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewReports(professional)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="Ver relatórios"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProfessional(professional)}
                          className="p-1 text-amber-600 hover:bg-amber-100 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProfessional(professional.id)}
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
              <Users className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-600 mb-4">
              {Object.keys(searchFilters).length > 0 
                ? 'Nenhum profissional encontrado com os filtros aplicados' 
                : 'Nenhum profissional cadastrado ainda'
              }
            </p>
            <button
              onClick={() => setActiveView('registration')}
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeiro Profissional
            </button>
          </div>
        )}
      </div>
    </div>
  );
}