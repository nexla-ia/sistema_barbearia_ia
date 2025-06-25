import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Upload, Camera, Plus, Trash2 } from 'lucide-react';
import { Service, ServiceValidation } from '../../types/service';
import { useService } from '../../contexts/ServiceContext';
import { useProfessional } from '../../contexts/ProfessionalContext';

interface ServiceRegistrationProps {
  service?: Service;
  onSave: (service: Service) => void;
  onCancel: () => void;
}

export function ServiceRegistration({ service, onSave, onCancel }: ServiceRegistrationProps) {
  const { validateService } = useService();
  const { state: professionalState } = useProfessional();
  
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || 0,
    duration: service?.duration || 30,
    category: service?.category || 'corte',
    isActive: service?.isActive ?? true,
    image: service?.image || '',
    enabledProfessionals: service?.enabledProfessionals || [],
    requirements: service?.requirements || [],
    contraindications: service?.contraindications || [],
    afterCareInstructions: service?.afterCareInstructions || '',
  });

  const [validation, setValidation] = useState<ServiceValidation>({
    name: { isValid: true },
    description: { isValid: true },
    price: { isValid: true },
    duration: { isValid: true },
    category: { isValid: true },
    enabledProfessionals: { isValid: true },
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newContraindication, setNewContraindication] = useState('');

  useEffect(() => {
    const newValidation = validateService(formData);
    setValidation(newValidation);
  }, [formData, validateService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalValidation = validateService(formData);
    setValidation(finalValidation);

    const isValid = Object.values(finalValidation).every(field => field.isValid);
    if (!isValid) {
      return;
    }

    const serviceData: Service = {
      id: service?.id || `s_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      duration: formData.duration,
      category: formData.category as any,
      isActive: formData.isActive,
      image: formData.image || undefined,
      enabledProfessionals: formData.enabledProfessionals,
      requirements: formData.requirements,
      contraindications: formData.contraindications,
      afterCareInstructions: formData.afterCareInstructions,
      createdAt: service?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: service?.createdBy || 'admin',
      priceHistory: service?.priceHistory || [],
      metrics: service?.metrics || {
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
        totalReviews: 0,
        popularityRank: 0,
        monthlyBookings: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
      },
    };

    onSave(serviceData);
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addContraindication = () => {
    if (newContraindication.trim() && !formData.contraindications.includes(newContraindication.trim())) {
      setFormData(prev => ({
        ...prev,
        contraindications: [...prev.contraindications, newContraindication.trim()]
      }));
      setNewContraindication('');
    }
  };

  const removeContraindication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contraindications: prev.contraindications.filter((_, i) => i !== index)
    }));
  };

  const toggleProfessional = (professionalId: string) => {
    setFormData(prev => ({
      ...prev,
      enabledProfessionals: prev.enabledProfessionals.includes(professionalId)
        ? prev.enabledProfessionals.filter(id => id !== professionalId)
        : [...prev.enabledProfessionals, professionalId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">
          {service ? 'Editar Serviço' : 'Cadastro de Serviço'}
        </h2>
        <p className="text-slate-600 mt-1">
          Preencha as informações do serviço seguindo as especificações
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
                Nome do Serviço *
                <span className="text-xs text-slate-500 ml-1">(máximo 50 caracteres)</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                maxLength={50}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  !validation.name.isValid ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Ex: Corte Masculino Tradicional"
              />
              <div className="flex justify-between items-center mt-1">
                {!validation.name.isValid && (
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validation.name.message}
                  </p>
                )}
                <span className="text-xs text-slate-500 ml-auto">
                  {formData.name.length}/50
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preço (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="9999.99"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  !validation.price.isValid ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="35,00"
              />
              {!validation.price.isValid && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duração (minutos) *
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  !validation.duration.isValid ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="30"
              />
              {!validation.duration.isValid && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.duration.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  !validation.category.isValid ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="corte">Corte</option>
                <option value="barba">Barba</option>
                <option value="quimica">Química</option>
                <option value="estetica">Estética</option>
                <option value="tratamento">Tratamento</option>
              </select>
              {!validation.category.isValid && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Imagem do Serviço
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="URL da imagem"
                />
                <button
                  type="button"
                  className="px-4 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição Detalhada *
              <span className="text-xs text-slate-500 ml-1">(máximo 1000 caracteres)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              maxLength={1000}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                !validation.description.isValid ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Descreva detalhadamente o procedimento, técnicas utilizadas e resultado esperado..."
            />
            <div className="flex justify-between items-center mt-1">
              {!validation.description.isValid && (
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validation.description.message}
                </p>
              )}
              <span className="text-xs text-slate-500 ml-auto">
                {formData.description.length}/1000
              </span>
            </div>
          </div>
        </div>

        {/* Profissionais Habilitados */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Profissionais Habilitados *
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionalState.professionals.map((professional) => (
              <label key={professional.id} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enabledProfessionals.includes(professional.id)}
                  onChange={() => toggleProfessional(professional.id)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                {professional.photo ? (
                  <img
                    src={professional.photo}
                    alt={professional.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 text-sm font-medium">
                      {professional.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900">{professional.fullName}</p>
                  <p className="text-sm text-slate-600">{professional.specialties.join(', ')}</p>
                </div>
              </label>
            ))}
          </div>
          {!validation.enabledProfessionals.isValid && (
            <p className="text-red-600 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validation.enabledProfessionals.message}
            </p>
          )}
        </div>

        {/* Requisitos */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Requisitos</h3>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ex: Cabelo limpo"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.requirements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.requirements.map((requirement, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {requirement}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contraindicações */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Contraindicações</h3>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newContraindication}
                onChange={(e) => setNewContraindication(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ex: Feridas no couro cabeludo"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addContraindication())}
              />
              <button
                type="button"
                onClick={addContraindication}
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.contraindications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.contraindications.map((contraindication, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {contraindication}
                    <button
                      type="button"
                      onClick={() => removeContraindication(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cuidados Pós-Atendimento */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cuidados Pós-Atendimento</h3>
          <textarea
            value={formData.afterCareInstructions}
            onChange={(e) => setFormData(prev => ({ ...prev, afterCareInstructions: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Instruções de cuidados que o cliente deve seguir após o atendimento..."
          />
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
            <span className="text-slate-900">Serviço ativo e disponível para agendamento</span>
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
            {service ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
          </button>
        </div>
      </form>
    </div>
  );
}