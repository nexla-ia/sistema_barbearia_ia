import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, DollarSign, Star, Users } from 'lucide-react';
import { ClientSearchFilters } from '../../types/client';
import { useClient } from '../../contexts/ClientContext';

interface ClientSearchProps {
  onFiltersChange: (filters: ClientSearchFilters) => void;
  onExportResults: () => void;
}

export function ClientSearch({ onFiltersChange, onExportResults }: ClientSearchProps) {
  const { state } = useClient();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<ClientSearchFilters>({});

  const handleFilterChange = (key: keyof ClientSearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Busca Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={filters.name || ''}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`inline-flex items-center px-4 py-3 border rounded-lg transition-colors ${
              showAdvancedFilters || getActiveFiltersCount() > 0
                ? 'border-amber-500 text-amber-600 bg-amber-50'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          
          <button
            onClick={onExportResults}
            className="inline-flex items-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros Avançados */}
      {showAdvancedFilters && (
        <div className="border-t border-slate-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Filtro por Telefone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={filters.phone || ''}
                onChange={(e) => handleFilterChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>

            {/* Filtro por Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={filters.email || ''}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="cliente@email.com"
              />
            </div>

            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={filters.status?.[0] || ''}
                onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value] : [])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="blocked">Bloqueado</option>
              </select>
            </div>

            {/* Filtro por Nível de Fidelidade */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nível de Fidelidade
              </label>
              <select
                value={filters.loyaltyLevel?.[0] || ''}
                onChange={(e) => handleFilterChange('loyaltyLevel', e.target.value ? [e.target.value] : [])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Prata</option>
                <option value="gold">Ouro</option>
                <option value="platinum">Platina</option>
              </select>
            </div>

            {/* Filtro por Data da Última Visita */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Última Visita (De)
              </label>
              <input
                type="date"
                value={filters.lastVisitFrom ? filters.lastVisitFrom.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('lastVisitFrom', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Última Visita (Até)
              </label>
              <input
                type="date"
                value={filters.lastVisitTo ? filters.lastVisitTo.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('lastVisitTo', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Valor Gasto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Valor Gasto (Mínimo)
              </label>
              <input
                type="number"
                value={filters.totalSpentMin || ''}
                onChange={(e) => handleFilterChange('totalSpentMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="R$ 0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Valor Gasto (Máximo)
              </label>
              <input
                type="number"
                value={filters.totalSpentMax || ''}
                onChange={(e) => handleFilterChange('totalSpentMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="R$ 9999,99"
              />
            </div>

            {/* Filtro por Mês de Aniversário */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mês de Aniversário
              </label>
              <select
                value={filters.birthdayMonth || ''}
                onChange={(e) => handleFilterChange('birthdayMonth', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value={1}>Janeiro</option>
                <option value={2}>Fevereiro</option>
                <option value={3}>Março</option>
                <option value={4}>Abril</option>
                <option value={5}>Maio</option>
                <option value={6}>Junho</option>
                <option value={7}>Julho</option>
                <option value={8}>Agosto</option>
                <option value={9}>Setembro</option>
                <option value={10}>Outubro</option>
                <option value={11}>Novembro</option>
                <option value={12}>Dezembro</option>
              </select>
            </div>
          </div>

          {/* Filtros Especiais */}
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasAllergies === true}
                onChange={(e) => handleFilterChange('hasAllergies', e.target.checked ? true : undefined)}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-slate-700">Possui alergias</span>
            </label>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              onClick={clearFilters}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Limpar todos os filtros
            </button>
            
            <div className="text-sm text-slate-600">
              {getActiveFiltersCount()} filtro{getActiveFiltersCount() !== 1 ? 's' : ''} ativo{getActiveFiltersCount() !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{state.clients.length}</p>
          <p className="text-sm text-slate-600">Total de Clientes</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {state.clients.filter(c => c.status === 'active').length}
          </p>
          <p className="text-sm text-slate-600">Clientes Ativos</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mx-auto mb-2">
            <DollarSign className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            R$ {Math.round(state.clients.reduce((sum, c) => sum + c.totalSpent, 0) / state.clients.length)}
          </p>
          <p className="text-sm text-slate-600">Ticket Médio</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {Math.round(state.clients.reduce((sum, c) => sum + c.loyaltyProgram.currentPoints, 0) / state.clients.length)}
          </p>
          <p className="text-sm text-slate-600">Pontos Médios</p>
        </div>
      </div>
    </div>
  );
}