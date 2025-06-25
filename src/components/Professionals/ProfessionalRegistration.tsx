import React, { useState } from 'react';
import { Upload, Camera, FileText, Check, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Professional, ProfessionalService } from '../../types/professional';
import { useProfessional } from '../../contexts/ProfessionalContext';

interface ProfessionalRegistrationProps {
  professional?: Professional;
  onSave: (professional: Professional) => void;
  onCancel: () => void;
}

export function ProfessionalRegistration({ professional, onSave, onCancel }: ProfessionalRegistrationProps) {
  const [formData, setFormData] = useState({
    // Dados pessoais
    fullName: professional?.fullName || '',
    cpf: professional?.cpf || '',
    rg: professional?.rg || '',
    birthDate: professional?.birthDate ? professional.birthDate.toISOString().split('T')[0] : '',
    
    // Endereço
    address: {
      street: professional?.address?.street || '',
      number: professional?.address?.number || '',
      complement: professional?.address?.complement || '',
      neighborhood: professional?.address?.neighborhood || '',
      city: professional?.address?.city || '',
      state: professional?.address?.state || '',
      zipCode: professional?.address?.zipCode || '',
    },
    
    // Contatos
    phone: professional?.phone || '',
    email: professional?.email || '',
    whatsapp: professional?.whatsapp || '',
    
    // Profissional
    photo: professional?.photo || '',
    specialties: professional?.specialties || [],
    
    // Dados contratuais
    admissionDate: professional?.admissionDate ? professional.admissionDate.toISOString().split('T')[0] : '',
    contractType: professional?.contractType || 'employee',
    status: professional?.status || 'active',
  });

  const [services, setServices] = useState<ProfessionalService[]>(
    professional?.services || []
  );
  
  const [workingHours, setWorkingHours] = useState(
    professional?.workingHours?.regularHours || {
      monday: { isWorking: true, startTime: '08:00', endTime: '18:00' },
      tuesday: { isWorking: true, startTime: '08:00', endTime: '18:00' },
      wednesday: { isWorking: true, startTime: '08:00', endTime: '18:00' },
      thursday: { isWorking: true, startTime: '08:00', endTime: '18:00' },
      friday: { isWorking: true, startTime: '08:00', endTime: '18:00' },
      saturday: { isWorking: true, startTime: '08:00', endTime: '16:00' },
      sunday: { isWorking: false, startTime: '', endTime: '' },
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');

  const availableServices = [
    { id: 's1', name: 'Corte de Cabelo' },
    { id: 's2', name: 'Barba Completa' },
    { id: 's3', name: 'Corte + Barba' },
    { id: 's4', name: 'Sobrancelha' },
    { id: 's5', name: 'Bigode' },
    { id: 's6', name: 'Lavagem' },
    { id: 's7', name: 'Hidratação' },
    { id: 's8', name: 'Coloração' },
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.rg.trim()) {
      newErrors.rg = 'RG é obrigatório';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.admissionDate) {
      newErrors.admissionDate = 'Data de admissão é obrigatória';
    }

    if (formData.specialties.length === 0) {
      newErrors.specialties = 'Pelo menos uma especialidade é obrigatória';
    }

    if (services.length === 0) {
      newErrors.services = 'Pelo menos um serviço deve ser configurado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const professionalData: Professional = {
      id: professional?.id || `p_${Date.now()}`,
      fullName: formData.fullName,
      cpf: formData.cpf,
      rg: formData.rg,
      birthDate: new Date(formData.birthDate),
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      whatsapp: formData.whatsapp || formData.phone,
      photo: formData.photo,
      specialties: formData.specialties,
      services,
      workingHours: {
        regularHours: workingHours,
        fixedDaysOff: Object.entries(workingHours)
          .filter(([_, hours]) => !hours.isWorking)
          .map(([day, _]) => daysOfWeek.findIndex(d => d.key === day)),
        vacations: professional?.workingHours?.vacations || [],
        absences: professional?.workingHours?.absences || [],
        specialSchedules: professional?.workingHours?.specialSchedules || [],
      },
      admissionDate: new Date(formData.admissionDate),
      contractType: formData.contractType as any,
      status: formData.status as any,
      documents: professional?.documents || [],
      metrics: professional?.metrics || {
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        noShowAppointments: 0,
        totalRevenue: 0,
        totalCommissions: 0,
        averageTicket: 0,
        averageRating: 0,
        totalReviews: 0,
        recommendationRate: 0,
        punctualityRate: 0,
        rebookingRate: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
        lastUpdated: new Date(),
      },
      settings: professional?.settings || {
        notifications: {
          email: true,
          sms: true,
          whatsapp: true,
          push: true,
        },
        schedulePreferences: {
          allowOnlineBooking: true,
          requireConfirmation: false,
          maxAdvanceBookingDays: 30,
          minAdvanceBookingHours: 2,
          allowSameDayBooking: true,
        },
        systemAccess: {
          canViewOwnSchedule: true,
          canEditOwnSchedule: true,
          canViewOwnMetrics: true,
          canViewClientHistory: true,
          canManageOwnServices: false,
        },
      },
      createdAt: professional?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: professional?.createdBy || 'admin',
    };

    onSave(professionalData);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addService = () => {
    const newService: ProfessionalService = {
      serviceId: `temp_${Date.now()}`,
      serviceName: '',
      commissionRate: 50,
      isActive: true,
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (index: number, field: keyof ProfessionalService, value: any) => {
    setServices(prev => prev.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    ));
  };

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  const updateWorkingHours = (day: string, field: string, value: any) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">
          {professional ? 'Editar Profissional' : 'Cadastro de Profissional'}
        </h2>
        <p className="text-slate-600 mt-1">
          Preencha todas as informações do profissional
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Dados Pessoais */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.fullName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Digite o nome completo"
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Foto do Profissional
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="URL da foto"
                />
                <button
                  type="button"
                  className="px-4 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CPF *
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.cpf ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="000.000.000-00"
              />
              {errors.cpf && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.cpf}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                RG *
              </label>
              <input
                type="text"
                value={formData.rg}
                onChange={(e) => setFormData(prev => ({ ...prev, rg: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.rg ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="00.000.000-0"
              />
              {errors.rg && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rg}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data de Nascimento *
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.birthDate ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.birthDate && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.birthDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rua/Avenida
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, street: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Nome da rua ou avenida"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Número
              </label>
              <input
                type="text"
                value={formData.address.number}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, number: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Complemento
              </label>
              <input
                type="text"
                value={formData.address.complement}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, complement: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Apto, sala, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bairro
              </label>
              <input
                type="text"
                value={formData.address.neighborhood}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, neighborhood: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Nome do bairro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cidade
              </label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Nome da cidade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CEP
              </label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, zipCode: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>

        {/* Contatos */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Contatos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="(11) 99999-9999"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="profissional@email.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </div>

        {/* Especialidades */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Especialidades</h3>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Digite uma especialidade"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <button
                type="button"
                onClick={addSpecialty}
                className="px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-2 text-amber-600 hover:text-amber-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {errors.specialties && (
              <p className="text-red-600 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.specialties}
              </p>
            )}
          </div>
        </div>

        {/* Serviços e Comissões */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Serviços e Comissões</h3>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Serviço
                    </label>
                    <select
                      value={service.serviceId}
                      onChange={(e) => {
                        const selectedService = availableServices.find(s => s.id === e.target.value);
                        updateService(index, 'serviceId', e.target.value);
                        updateService(index, 'serviceName', selectedService?.name || '');
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Selecione um serviço</option>
                      {availableServices.map((availableService) => (
                        <option key={availableService.id} value={availableService.id}>
                          {availableService.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Comissão (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={service.commissionRate}
                      onChange={(e) => updateService(index, 'commissionRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preço Mínimo
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={service.minimumPrice || ''}
                      onChange={(e) => updateService(index, 'minimumPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="R$ 0,00"
                    />
                  </div>

                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ativo
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={service.isActive}
                          onChange={(e) => updateService(index, 'isActive', e.target.checked)}
                          className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">Ativo</span>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addService}
              className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-amber-500 hover:text-amber-600 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Serviço
            </button>

            {errors.services && (
              <p className="text-red-600 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.services}
              </p>
            )}
          </div>
        </div>

        {/* Horários de Trabalho */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Horários de Trabalho</h3>
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day.key} className="border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={workingHours[day.key]?.isWorking || false}
                        onChange={(e) => updateWorkingHours(day.key, 'isWorking', e.target.checked)}
                        className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="ml-2 font-medium text-slate-900">{day.label}</span>
                    </label>
                  </div>

                  {workingHours[day.key]?.isWorking && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Início
                        </label>
                        <input
                          type="time"
                          value={workingHours[day.key]?.startTime || ''}
                          onChange={(e) => updateWorkingHours(day.key, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Fim
                        </label>
                        <input
                          type="time"
                          value={workingHours[day.key]?.endTime || ''}
                          onChange={(e) => updateWorkingHours(day.key, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Intervalo Início
                        </label>
                        <input
                          type="time"
                          value={workingHours[day.key]?.breakStart || ''}
                          onChange={(e) => updateWorkingHours(day.key, 'breakStart', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Intervalo Fim
                        </label>
                        <input
                          type="time"
                          value={workingHours[day.key]?.breakEnd || ''}
                          onChange={(e) => updateWorkingHours(day.key, 'breakEnd', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dados Contratuais */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Dados Contratuais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data de Admissão *
              </label>
              <input
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, admissionDate: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.admissionDate ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.admissionDate && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.admissionDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Contrato
              </label>
              <select
                value={formData.contractType}
                onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="employee">Funcionário CLT</option>
                <option value="freelancer">Freelancer</option>
                <option value="partner">Sócio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="vacation">Férias</option>
                <option value="medical_leave">Licença Médica</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload de Documentos */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Documentos</h3>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-sm text-slate-500 mb-4">
                Certificados, diplomas, contratos, etc.
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setUploadedFiles(prev => [...prev, ...files]);
                }}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 mr-2" />
                Selecionar Arquivos
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-sm text-slate-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
            {professional ? 'Atualizar Profissional' : 'Cadastrar Profissional'}
          </button>
        </div>
      </form>
    </div>
  );
}