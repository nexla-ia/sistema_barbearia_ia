import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Plus, Trash2, Calendar, Users } from 'lucide-react';
import { ServicePackage, PackageValidation, PackageService } from '../../types/service';
import { useService } from '../../contexts/ServiceContext';

interface PackageRegistrationProps {
  package?: ServicePackage;
  onSave: (pkg: ServicePackage) => void;
  onCancel: () => void;
}

export function PackageRegistration({ package: pkg, onSave, onCancel }: PackageRegistrationProps) {
  const { state, validatePackage } = useService();
  
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    description: pkg?.description || '',
    services: pkg?.services || [],
    discountPercentage: pkg?.discountPercentage || 10,
    validityPeriod: pkg?.validityPeriod || 30,
    usageLimit: pkg?.usageLimit || 1,
    isActive: pkg?.isActive ?? true,
    startDate: pkg?.startDate ? pkg.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: pkg?.endDate ? pkg.endDate.toISOString().split('T')[0] : '',
    minimumAdvanceBooking: pkg?.minimumAdvanceBooking || 2,
    allowedDays: pkg?.allowedDays || [1, 2, 3, 4, 5, 6],
    allowedTimeSlots: pkg?.allowedTimeSlots || [],
  });

  const [validation, setValidation] = useState<PackageValidation>({
    name: { isValid: true },
    services: { isValid: true },
    discountPercentage: { isValid: true },
    validityPeriod: { isValid: true },
    usageLimit: { isValid: true },
  });

  const [selectedServiceId, setSelectedServiceId] = useState('');

  useEffect(() => {
    const newValidation = validatePackage(formData);
    setValidation(newValidation);
  }, [formData, validatePackage]);

  const originalPrice = formData.services.reduce((sum, service) => sum + service.servicePrice, 0);
  const finalPrice = originalPrice * (1 - formData.discountPercentage / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalValidation = validatePackage(formData);
    setValidation(finalValidation);

    const isValid = Object.values(finalValidation).every(field => field.isValid);
    if (!isValid) {
      return;
    }

    const packageData: ServicePackage = {
      id: pkg?.id || `pkg_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      services: formData.services,
      originalPrice,
      discountPercentage: formData.discountPercentage,
      finalPrice,
      validityPeriod: formData.validityPeriod,
      usageLimit: formData.usageLimit,
      isActive: formData.isActive,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      minimumAdvanceBooking: formData.minimumAdvanceBooking,
      allowedDays: formData.allowedDays,
      allowedTimeSlots: formData.allowedTimeSlots,
      createdAt: pkg?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: pkg?.createdBy || 'admin',
      metrics: pkg?.metrics || {
        totalSales: 0,
        totalRevenue: 0,
        averageRating: 0,
        conversionRate: 0,
        popularityRank: 0,
        monthlySales: 0,
        monthlyRevenue: 0,
      },
    };

    onSave(packageData);
  };

  const addService = () => {
    if (!selectedServiceId) return;

    const service = state.services.find(s => s.id === selectedServiceId);
    if (!service) return;

    const isAlreadyAdded = formData.services.some(s => s.serviceId === selectedServiceId);
    if (isAlreadyAdded) return;

    const packageService: PackageService = {
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration,
      isRequired: true,
      canBeReplaced: false,
    };

    setFormData(prev => ({
      ...prev,
      services: [...prev.services, packageService]
    }));
    setSelectedServiceId('');
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index: number, field: keyof PackageService, value: any) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      allowedDays: prev.allowedDays.includes(day)
        ? prev.allowedDays.filter(d => d !== day)
        : [...prev.allowedDays, day].sort()
    }));
  };

  const daysOfWeek = [
    { value: 1, label: 'Segunda' },
    { value: 2, label: 'Terça' },
    { value: 3, label: 'Quarta' },
    { value: 4, label: 'Quinta' },
    { value: 5, label: 'Sexta' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">
          {pkg ? 'Editar Pacote' : 'Criar Pacote Promocional'}
        </h2>
        <p className="text-slate-600 mt-1">
          Configure um pacote com 2 a 5 serviços e defina o desconto aplicado
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Informações Básicas */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Informações Básicas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome do Pacote *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  !validation.name.isValid ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Ex: Combo Completo"
              />
              {!validation.name.isValid && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.name.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Descreva o pacote e seus benefícios..."
              />
            </div>
          </div>
        </div>

        {/* Serviços do Pacote */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Serviços do Pacote *
            <span className="text-sm font-normal text-slate-600 ml-2">(2 a 5 serviços)</span>
          </h3>
          
          {/* Adicionar Serviço */}
          <div className="flex space-x-2 mb-4">
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Selecione um serviço</option>
              {state.services
                .filter(service => !formData.services.some(s => s.serviceId === service.id))
                .map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - R$ {service.price.toFixed(2)} ({service.duration}min)
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={addService}
              disabled={!selectedServiceId}
              className="px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Serviços */}
          {formData.services.length > 0 && (
            <div className="space-y-3">
              {formData.services.map((service, index) => (
                <div key={service.serviceId} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{service.serviceName}</h4>
                      <p className="text-sm text-slate-600">
                        R$ {service.servicePrice.toFixed(2)} • {service.serviceDuration} minutos
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={service.isRequired}
                          onChange={(e) => updateService(index, 'isRequired', e.target.checked)}
                          className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-sm text-slate-700">Obrigatório</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={service.canBeReplaced}
                          onChange={(e) => updateService(index, 'canBeReplaced', e.target.checked)}
                          className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-sm text-slate-700">Substituível</span>
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!validation.services.isValid && (
            <p className="text-red-600 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validation.services.message}
            </p>
          )}
        </div>

        {/* Configurações de Preço */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Configurações de Preço</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Desconto (%) *
                <span className="text-xs text-slate-500 ml-1">(máximo 70%)</span>
              </label>
              <input
                type="number"
                min="1"
                max="70"
                value={formData.discountPercentage}
                onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  !validation.discountPercentage.isValid ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="15"
              />
              {!validation.discountPercentage.isValid && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.discountPercentage.message}
                </p>
              )}
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3">Resumo de Preços</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Preço Original:</span>
                  <span className="font-medium">R$ {originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Desconto ({formData.discountPercentage}%):</span>
                  <span className="text-red-600 font-medium">-R$ {(originalPrice * formData.discountPercentage / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-semibold text-slate-900">Preço Final:</span>
                  <span className="text-lg font-bold text-amber-600">R$ {finalPrice.toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Economia de R$ {(originalPrice - finalPrice).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Validade */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Configurações de Validade</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Período de Validade (dias) *
                <span className="text-xs text-slate-500 ml-1">(15 a 90 dias)</span>
              </label>
              <input
                type="number"
                min="15"
                max="90"
                value={formData.validityPeriod}
                onChange={(e) => setFormData(prev => ({ ...prev, validityPeriod: parseInt(e.target.value) || 30 }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  !validation.validityPeriod.isValid ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="30"
              />
              {!validation.validityPeriod.isValid && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.validityPeriod.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Limite de Uso por Cliente *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.usageLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 1 }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  !validation.usageLimit.isValid ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="1"
              />
              {!validation.usageLimit.isValid && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.usageLimit.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Antecedência Mínima (horas)
              </label>
              <input
                type="number"
                min="0"
                max="168"
                value={formData.minimumAdvanceBooking}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumAdvanceBooking: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data de Início
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data de Fim (opcional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Restrições de Agendamento */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Restrições de Agendamento</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Dias Permitidos
            </label>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <label key={day.value} className="flex flex-col items-center space-y-2">
                  <input
                    type="checkbox"
                    checked={formData.allowedDays.includes(day.value)}
                    onChange={() => toggleDay(day.value)}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs text-slate-700">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Status</h3>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-slate-900">Pacote ativo e disponível para venda</span>
          </label>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
          >
            <Check className="w-4 h-4 mr-2" />
            {pkg ? 'Atualizar Pacote' : 'Criar Pacote'}
          </button>
        </div>
      </form>
    </div>
  );
}