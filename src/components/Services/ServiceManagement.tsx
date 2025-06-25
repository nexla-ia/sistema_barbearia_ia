import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Copy, TrendingUp, Package, Star, DollarSign } from 'lucide-react';
import { Service, ServicePackage, ServiceSearchFilters, PackageSearchFilters } from '../../types/service';
import { useService } from '../../contexts/ServiceContext';
import { ServiceRegistration } from './ServiceRegistration';
import { PackageRegistration } from './PackageRegistration';
import { ServiceReports } from './ServiceReports';

export function ServiceManagement() {
  const { state, dispatch, searchServices, searchPackages, duplicateService, duplicatePackage } = useService();
  const [activeTab, setActiveTab] = useState<'services' | 'packages' | 'reports'>('services');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [serviceFilters, setServiceFilters] = useState<ServiceSearchFilters>({});
  const [packageFilters, setPackageFilters] = useState<PackageSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredServices = searchServices(serviceFilters);
  const filteredPackages = searchPackages(packageFilters);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      corte: 'Corte',
      barba: 'Barba',
      quimica: 'Química',
      estetica: 'Estética',
      tratamento: 'Tratamento',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      corte: 'bg-blue-100 text-blue-800',
      barba: 'bg-green-100 text-green-800',
      quimica: 'bg-purple-100 text-purple-800',
      estetica: 'bg-pink-100 text-pink-800',
      tratamento: 'bg-amber-100 text-amber-800',
    };
    return colors[category as keyof typeof colors] || 'bg-slate-100 text-slate-800';
  };

  const handleSaveService = (service: Service) => {
    if (editingService) {
      dispatch({ type: 'UPDATE_SERVICE', payload: service });
    } else {
      dispatch({ type: 'ADD_SERVICE', payload: service });
    }
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleSavePackage = (pkg: ServicePackage) => {
    if (editingPackage) {
      dispatch({ type: 'UPDATE_PACKAGE', payload: pkg });
    } else {
      dispatch({ type: 'ADD_PACKAGE', payload: pkg });
    }
    setShowPackageForm(false);
    setEditingPackage(null);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleEditPackage = (pkg: ServicePackage) => {
    setEditingPackage(pkg);
    setShowPackageForm(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
      dispatch({ type: 'DELETE_SERVICE', payload: serviceId });
    }
  };

  const handleDeletePackage = (packageId: string) => {
    if (confirm('Tem certeza que deseja excluir este pacote? Esta ação não pode ser desfeita.')) {
      dispatch({ type: 'DELETE_PACKAGE', payload: packageId });
    }
  };

  const handleDuplicateService = async (serviceId: string) => {
    try {
      await duplicateService(serviceId);
    } catch (error) {
      console.error('Error duplicating service:', error);
    }
  };

  const handleDuplicatePackage = async (packageId: string) => {
    try {
      await duplicatePackage(packageId);
    } catch (error) {
      console.error('Error duplicating package:', error);
    }
  };

  if (showServiceForm) {
    return (
      <ServiceRegistration
        service={editingService || undefined}
        onSave={handleSaveService}
        onCancel={() => {
          setShowServiceForm(false);
          setEditingService(null);
        }}
      />
    );
  }

  if (showPackageForm) {
    return (
      <PackageRegistration
        package={editingPackage || undefined}
        onSave={handleSavePackage}
        onCancel={() => {
          setShowPackageForm(false);
          setEditingPackage(null);
        }}
      />
    );
  }

  const renderServices = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar serviços..."
              value={serviceFilters.name || ''}
              onChange={(e) => setServiceFilters(prev => ({ ...prev, name: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'border-amber-500 text-amber-600 bg-amber-50' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
            <button
              onClick={() => setShowServiceForm(true)}
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="border-t border-slate-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Categoria</label>
                <select
                  value={serviceFilters.category?.[0] || ''}
                  onChange={(e) => setServiceFilters(prev => ({ 
                    ...prev, 
                    category: e.target.value ? [e.target.value] : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  <option value="corte">Corte</option>
                  <option value="barba">Barba</option>
                  <option value="quimica">Química</option>
                  <option value="estetica">Estética</option>
                  <option value="tratamento">Tratamento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preço Mínimo</label>
                <input
                  type="number"
                  value={serviceFilters.priceMin || ''}
                  onChange={(e) => setServiceFilters(prev => ({ 
                    ...prev, 
                    priceMin: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="R$ 0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preço Máximo</label>
                <input
                  type="number"
                  value={serviceFilters.priceMax || ''}
                  onChange={(e) => setServiceFilters(prev => ({ 
                    ...prev, 
                    priceMax: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="R$ 999,99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={serviceFilters.isActive !== undefined ? serviceFilters.isActive.toString() : ''}
                  onChange={(e) => setServiceFilters(prev => ({ 
                    ...prev, 
                    isActive: e.target.value === '' ? undefined : e.target.value === 'true'
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            {service.image && (
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-52 object-cover"
              />
            )}
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{service.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                    {getCategoryLabel(service.category)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicateService(service.id)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">{service.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 p-3 rounded-lg">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-xs text-slate-500 mb-1">Preço</p>
                  <p className="font-bold text-amber-600 text-lg">{formatCurrency(service.price)}</p>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Duração</p>
                  <p className="font-semibold text-slate-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-slate-500" />
                    {service.duration} min
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{service.metrics.averageRating.toFixed(1)}</span>
                  <span className="text-slate-500">({service.metrics.totalReviews})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-medium">{service.metrics.monthlyBookings}</span>
                </div>
              </div>

              <div className={`mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {service.isActive ? 'Ativo' : 'Inativo'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-600 mb-4">
            {Object.keys(serviceFilters).length > 0 
              ? 'Nenhum serviço encontrado com os filtros aplicados' 
              : 'Nenhum serviço cadastrado ainda'
            }
          </p>
          <button
            onClick={() => setShowServiceForm(true)}
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Primeiro Serviço
          </button>
        </div>
      )}
    </div>
  );

  const renderPackages = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar pacotes..."
              value={packageFilters.name || ''}
              onChange={(e) => setPackageFilters(prev => ({ ...prev, name: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowPackageForm(true)}
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Pacote
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-100">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{pkg.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{pkg.description}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEditPackage(pkg)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicatePackage(pkg.id)}
                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                  title="Duplicar"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Services in Package */}
            <div className="mb-4 bg-slate-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                <Scissors className="w-4 h-4 mr-2 text-amber-600" />
                Serviços Inclusos:
              </h4>
              <div className="space-y-3">
                {pkg.services.map((service) => (
                  <div key={service.serviceId} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-700 font-medium">{service.serviceName}</span>
                    <span className="font-medium text-amber-600">{formatCurrency(service.servicePrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 mb-4 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Preço Original:</span>
                <span className="text-sm line-through text-slate-500">{formatCurrency(pkg.originalPrice)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Desconto:</span>
                <span className="text-sm font-medium text-green-600">{pkg.discountPercentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Preço Final:</span>
                <span className="text-xl font-bold text-amber-600">{formatCurrency(pkg.finalPrice)}</span>
              </div>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 border-t border-slate-100 pt-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-slate-400 mr-2" />
                <div>
                  <p className="text-xs text-slate-500">Validade</p>
                  <p className="font-medium text-slate-900">{pkg.validityPeriod} dias</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-slate-400 mr-2" />
                <div>
                  <p className="text-xs text-slate-500">Limite de Uso</p>
                  <p className="font-medium text-slate-900">{pkg.usageLimit}x por cliente</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{pkg.metrics.averageRating.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">{pkg.metrics.monthlySales} vendas</span>
              </div>
            </div>

            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {pkg.isActive ? 'Ativo' : 'Inativo'}
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-600 mb-4">
            {Object.keys(packageFilters).length > 0 
              ? 'Nenhum pacote encontrado com os filtros aplicados' 
              : 'Nenhum pacote cadastrado ainda'
            }
          </p>
          <button
            onClick={() => setShowPackageForm(true)}
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Pacote
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Serviços</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'services', label: 'Serviços', count: state.services.length },
                { id: 'packages', label: 'Pacotes', count: state.packages.length },
                { id: 'reports', label: 'Relatórios', count: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-amber-600' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'services' && renderServices()}
      {activeTab === 'packages' && renderPackages()}
      {activeTab === 'reports' && <ServiceReports />}
    </div>
  );
}