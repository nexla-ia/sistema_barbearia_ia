import React, { useState } from 'react';
import { Upload, Camera, FileText, Shield, Check, X, AlertCircle } from 'lucide-react';
import { ClientProfile } from '../../types/client';
import { useClient } from '../../contexts/ClientContext';

interface ClientRegistrationProps {
  client?: ClientProfile;
  onSave: (client: ClientProfile) => void;
  onCancel: () => void;
}

export function ClientRegistration({ client, onSave, onCancel }: ClientRegistrationProps) {
  const { addPointsToClient } = useClient();
  const [formData, setFormData] = useState({
    // Campos obrigatórios
    fullName: client?.fullName || '',
    phone: client?.phone || '',
    email: client?.email || '',
    birthDate: client?.birthDate ? client.birthDate.toISOString().split('T')[0] : '',
    anniversaryDate: client?.anniversaryDate ? client.anniversaryDate.toISOString().split('T')[0] : '',
    
    // Campos opcionais
    address: {
      street: client?.address?.street || '',
      number: client?.address?.number || '',
      complement: client?.address?.complement || '',
      neighborhood: client?.address?.neighborhood || '',
      city: client?.address?.city || '',
      state: client?.address?.state || '',
      zipCode: client?.address?.zipCode || '',
    },
    cpf: client?.cpf || '',
    photo: client?.photo || '',
    
    // Preferências
    favoriteServices: client?.preferences.favoriteServices || [],
    preferredProfessional: client?.preferences.preferredProfessional || '',
    specialNotes: client?.preferences.specialNotes || '',
    allergies: client?.preferences.allergies.join(', ') || '',
    restrictions: client?.preferences.restrictions.join(', ') || '',
    preferredFrequency: client?.preferences.preferredFrequency || 'monthly',
    
    // Comunicação
    whatsapp: client?.communicationPreferences.whatsapp ?? true,
    email: client?.communicationPreferences.email ?? true,
    sms: client?.communicationPreferences.sms ?? false,
    marketingConsent: client?.communicationPreferences.marketingConsent ?? false,
    reminderPreference: client?.communicationPreferences.reminderPreference || '1_day',
    
    // LGPD
    dataProcessingConsent: client?.lgpdConsent.dataProcessingConsent ?? false,
    lgpdMarketingConsent: client?.lgpdConsent.marketingConsent ?? false,
    dataRetentionPeriod: client?.lgpdConsent.dataRetentionPeriod || 5,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const services = [
    { id: 's1', name: 'Corte Feminino' },
    { id: 's2', name: 'Coloração' },
    { id: 's3', name: 'Escova' },
    { id: 's4', name: 'Hidratação' },
    { id: 's5', name: 'Manicure' },
    { id: 's6', name: 'Pedicure' },
  ];

  const professionals = [
    { id: 'b1', name: 'Ana Costa' },
    { id: 'b2', name: 'Carla Silva' },
    { id: 'b3', name: 'Fernanda Santos' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone deve ter 10 ou 11 dígitos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!formData.dataProcessingConsent) {
      newErrors.dataProcessingConsent = 'Consentimento para processamento de dados é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const clientData: ClientProfile = {
      id: client?.id || `c_${Date.now()}`,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      birthDate: new Date(formData.birthDate),
      anniversaryDate: formData.anniversaryDate
        ? new Date(formData.anniversaryDate)
        : undefined,
      address: formData.address.street ? formData.address : undefined,
      cpf: formData.cpf || undefined,
      photo: formData.photo || undefined,
      documents: client?.documents || [],
      termsAccepted: client?.termsAccepted || [],
      preferences: {
        favoriteServices: formData.favoriteServices,
        preferredProfessional: formData.preferredProfessional || undefined,
        specialNotes: formData.specialNotes,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        restrictions: formData.restrictions ? formData.restrictions.split(',').map(r => r.trim()) : [],
        preferredFrequency: formData.preferredFrequency as any,
        preferredTimeSlots: client?.preferences.preferredTimeSlots || [],
        preferredDays: client?.preferences.preferredDays || [],
      },
      loyaltyProgram: client?.loyaltyProgram || {
        currentPoints: 0,
        totalPointsEarned: 0,
        totalPointsRedeemed: 0,
        currentLevel: 'bronze',
        nextLevelPoints: 500,
        benefits: [],
        pointsHistory: [],
      },
      serviceHistory: client?.serviceHistory || [],
      productHistory: client?.productHistory || [],
      feedbackHistory: client?.feedbackHistory || [],
      photoGallery: client?.photoGallery || [],
      communicationPreferences: {
        whatsapp: formData.whatsapp,
        email: formData.email,
        sms: formData.sms,
        phone: false,
        marketingConsent: formData.marketingConsent,
        reminderPreference: formData.reminderPreference as any,
        birthdayMessages: true,
        promotionalMessages: formData.marketingConsent,
      },
      createdAt: client?.createdAt || new Date(),
      updatedAt: new Date(),
      lastVisit: client?.lastVisit,
      totalSpent: client?.totalSpent || 0,
      visitCount: client?.visitCount || 0,
      status: client?.status || 'active',
      lgpdConsent: {
        dataProcessingConsent: formData.dataProcessingConsent,
        marketingConsent: formData.lgpdMarketingConsent,
        dataRetentionPeriod: formData.dataRetentionPeriod,
        consentDate: client?.lgpdConsent.consentDate || new Date(),
        lastUpdated: new Date(),
        dataPortabilityRequests: client?.lgpdConsent.dataPortabilityRequests || [],
        deletionRequests: client?.lgpdConsent.deletionRequests || [],
      },
    };

    onSave(clientData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">
          {client ? 'Editar Cliente' : 'Cadastro de Cliente'}
        </h2>
        <p className="text-slate-600 mt-1">
          Preencha as informações do cliente seguindo as normas da LGPD
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Dados Pessoais */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Dados Pessoais (Obrigatórios)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
                Telefone Celular *
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
                placeholder="cliente@email.com"
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data de Aniversário
              </label>
              <input
                type="date"
                value={formData.anniversaryDate}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, anniversaryDate: e.target.value }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Dados Opcionais */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Dados Complementares (Opcionais)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CPF
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Foto do Cliente
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
          </div>

          {/* Endereço */}
          <div className="mt-4">
            <h4 className="font-medium text-slate-900 mb-3">Endereço</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, street: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Rua/Avenida"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.address.number}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, number: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Número"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.address.complement}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, complement: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Complemento"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.address.neighborhood}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, neighborhood: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Bairro"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, city: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Cidade"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, zipCode: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="CEP"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upload de Documentos */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Documentos e Termos
          </h3>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
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
                      onClick={() => removeFile(index)}
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

        {/* Preferências */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Preferências do Cliente
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Serviços Favoritos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {services.map((service) => (
                  <label key={service.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.favoriteServices.includes(service.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            favoriteServices: [...prev.favoriteServices, service.id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            favoriteServices: prev.favoriteServices.filter(id => id !== service.id)
                          }));
                        }
                      }}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-sm text-slate-700">{service.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Profissional Preferido
                </label>
                <select
                  value={formData.preferredProfessional}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredProfessional: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Selecione um profissional</option>
                  {professionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Frequência Preferida
                </label>
                <select
                  value={formData.preferredFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredFrequency: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quinzenal</option>
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observações Especiais
              </label>
              <textarea
                value={formData.specialNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, specialNotes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Preferências de horário, observações sobre o atendimento, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Alergias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Níquel, Parafenilenodiamina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Restrições (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.restrictions}
                  onChange={(e) => setFormData(prev => ({ ...prev, restrictions: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Não usar produtos com amônia"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferências de Comunicação */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Preferências de Comunicação
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">
                Como prefere receber comunicações?
              </p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.checked }))}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-700">WhatsApp</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.checked }))}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-700">E-mail</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.sms}
                    onChange={(e) => setFormData(prev => ({ ...prev, sms: e.target.checked }))}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-700">SMS</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lembrete de Agendamento
                </label>
                <select
                  value={formData.reminderPreference}
                  onChange={(e) => setFormData(prev => ({ ...prev, reminderPreference: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="none">Não enviar lembretes</option>
                  <option value="1_hour">1 hora antes</option>
                  <option value="2_hours">2 horas antes</option>
                  <option value="1_day">1 dia antes</option>
                  <option value="2_days">2 dias antes</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 pt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(e) => setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-700">Aceita receber promoções</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* LGPD */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            Consentimentos LGPD
          </h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.dataProcessingConsent}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataProcessingConsent: e.target.checked }))}
                  className="mt-1 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-900">
                    Consentimento para Processamento de Dados *
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Autorizo o processamento dos meus dados pessoais para prestação de serviços, 
                    agendamentos e comunicações relacionadas ao atendimento.
                  </p>
                </div>
              </label>
              {errors.dataProcessingConsent && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dataProcessingConsent}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.lgpdMarketingConsent}
                  onChange={(e) => setFormData(prev => ({ ...prev, lgpdMarketingConsent: e.target.checked }))}
                  className="mt-1 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-900">
                    Consentimento para Marketing
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Autorizo o uso dos meus dados para envio de promoções, novidades e 
                    comunicações de marketing.
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Período de Retenção de Dados
              </label>
              <select
                value={formData.dataRetentionPeriod}
                onChange={(e) => setFormData(prev => ({ ...prev, dataRetentionPeriod: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value={3}>3 anos</option>
                <option value={5}>5 anos</option>
                <option value={10}>10 anos</option>
              </select>
              <p className="text-xs text-slate-600 mt-1">
                Seus dados serão mantidos pelo período selecionado ou até solicitação de exclusão.
              </p>
            </div>
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
            {client ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}