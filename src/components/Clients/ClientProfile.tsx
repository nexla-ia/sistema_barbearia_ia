import React, { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, Calendar, Star, Gift, 
  History, Camera, MessageCircle, Download, Edit, 
  Shield, AlertTriangle, Award, TrendingUp 
} from 'lucide-react';
import { ClientProfile as ClientProfileType } from '../../types/client';
import { useClient } from '../../contexts/ClientContext';

interface ClientProfileProps {
  client: ClientProfileType;
  onEdit: () => void;
  onClose: () => void;
}

export function ClientProfile({ client, onEdit, onClose }: ClientProfileProps) {
  const { exportClientData, sendMessage } = useClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'loyalty' | 'communication' | 'lgpd'>('overview');
  const [isExporting, setIsExporting] = useState(false);

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

  const getLoyaltyLevelIcon = (level: string) => {
    switch (level) {
      case 'bronze':
        return '🥉';
      case 'silver':
        return '🥈';
      case 'gold':
        return '🥇';
      case 'platinum':
        return '💎';
      default:
        return '⭐';
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const blob = await exportClientData(client.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dados-cliente-${client.fullName.replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Informações Pessoais</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-slate-900">{client.fullName}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-slate-500" />
              <span className="text-slate-900">{client.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-slate-900">{client.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-900">{formatDate(client.birthDate)}</span>
            </div>
            {client.anniversaryDate && (
              <div className="flex items-center space-x-3">
                <Gift className="w-4 h-4 text-slate-500" />
                <span className="text-slate-900">{formatDate(client.anniversaryDate)}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                <span className="text-slate-900">
                  {client.address.street}, {client.address.number}
                  {client.address.complement && `, ${client.address.complement}`}
                  <br />
                  {client.address.neighborhood}, {client.address.city} - {client.address.state}
                  <br />
                  CEP: {client.address.zipCode}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Estatísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{client.visitCount}</p>
              <p className="text-sm text-slate-600">Visitas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(client.totalSpent)}</p>
              <p className="text-sm text-slate-600">Total Gasto</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{client.loyaltyProgram.currentPoints}</p>
              <p className="text-sm text-slate-600">Pontos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {client.lastVisit ? formatDate(client.lastVisit) : 'Nunca'}
              </p>
              <p className="text-sm text-slate-600">Última Visita</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferências */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Preferências</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Serviços Favoritos</h4>
            <div className="flex flex-wrap gap-2">
              {client.preferences.favoriteServices.map((serviceId) => (
                <span
                  key={serviceId}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                >
                  Serviço {serviceId}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Frequência Preferida</h4>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {client.preferences.preferredFrequency === 'weekly' ? 'Semanal' :
               client.preferences.preferredFrequency === 'biweekly' ? 'Quinzenal' :
               client.preferences.preferredFrequency === 'monthly' ? 'Mensal' : 'Trimestral'}
            </span>
          </div>

          {client.preferences.allergies.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Alergias</h4>
              <div className="flex flex-wrap gap-2">
                {client.preferences.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {client.preferences.specialNotes && (
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Observações</h4>
              <p className="text-sm text-slate-600 bg-white p-3 rounded border">
                {client.preferences.specialNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      {/* Histórico de Serviços */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Histórico de Serviços</h3>
        {client.serviceHistory.length > 0 ? (
          <div className="space-y-3">
            {client.serviceHistory.map((service) => (
              <div key={service.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{service.serviceName}</h4>
                    <p className="text-sm text-slate-600">
                      com {service.professionalName} • {formatDate(service.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(service.finalPrice)}</p>
                    <p className="text-sm text-amber-600">+{service.pointsEarned} pontos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <History className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Nenhum serviço realizado ainda</p>
          </div>
        )}
      </div>

      {/* Feedback */}
      {client.feedbackHistory.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Avaliações</h3>
          <div className="space-y-3">
            {client.feedbackHistory.map((feedback) => (
              <div key={feedback.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">{formatDate(feedback.createdAt)}</span>
                </div>
                <p className="text-slate-700">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLoyalty = () => (
    <div className="space-y-6">
      {/* Status Atual */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Programa de Fidelidade</h3>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getLoyaltyLevelIcon(client.loyaltyProgram.currentLevel)}</span>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLoyaltyLevelColor(client.loyaltyProgram.currentLevel)}`}>
                  {client.loyaltyProgram.currentLevel.toUpperCase()}
                </span>
                <p className="text-sm text-slate-600 mt-1">
                  {client.loyaltyProgram.nextLevelPoints > 0 
                    ? `Faltam ${client.loyaltyProgram.nextLevelPoints} pontos para o próximo nível`
                    : 'Nível máximo atingido!'
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-amber-600">{client.loyaltyProgram.currentPoints}</p>
            <p className="text-sm text-slate-600">Pontos Disponíveis</p>
          </div>
        </div>
      </div>

      {/* Estatísticas de Pontos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{client.loyaltyProgram.totalPointsEarned}</p>
          <p className="text-sm text-slate-600">Total Ganho</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <Gift className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{client.loyaltyProgram.totalPointsRedeemed}</p>
          <p className="text-sm text-slate-600">Total Resgatado</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{client.loyaltyProgram.benefits.length}</p>
          <p className="text-sm text-slate-600">Benefícios Ativos</p>
        </div>
      </div>

      {/* Benefícios */}
      {client.loyaltyProgram.benefits.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Benefícios Ativos</h3>
          <div className="space-y-3">
            {client.loyaltyProgram.benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{benefit.description}</h4>
                    <p className="text-sm text-slate-600">
                      {benefit.type === 'discount' ? `${benefit.value}% de desconto` : 
                       benefit.type === 'free_service' ? 'Serviço gratuito' : 
                       benefit.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    benefit.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {benefit.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico de Pontos */}
      {client.loyaltyProgram.pointsHistory.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Histórico de Pontos</h3>
          <div className="space-y-2">
            {client.loyaltyProgram.pointsHistory.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div>
                  <p className="font-medium text-slate-900">{transaction.description}</p>
                  <p className="text-sm text-slate-600">{formatDate(transaction.createdAt)}</p>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'earned' ? '+' : '-'}{transaction.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCommunication = () => (
    <div className="space-y-6">
      {/* Preferências de Comunicação */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Preferências de Comunicação</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
              client.communicationPreferences.whatsapp ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
            }`}>
              <MessageCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">WhatsApp</p>
            <p className="text-xs text-slate-600">
              {client.communicationPreferences.whatsapp ? 'Ativo' : 'Inativo'}
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
              client.communicationPreferences.email ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
            }`}>
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">E-mail</p>
            <p className="text-xs text-slate-600">
              {client.communicationPreferences.email ? 'Ativo' : 'Inativo'}
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
              client.communicationPreferences.sms ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'
            }`}>
              <Phone className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">SMS</p>
            <p className="text-xs text-slate-600">
              {client.communicationPreferences.sms ? 'Ativo' : 'Inativo'}
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
              client.communicationPreferences.marketingConsent ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
            }`}>
              <Gift className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">Marketing</p>
            <p className="text-xs text-slate-600">
              {client.communicationPreferences.marketingConsent ? 'Autorizado' : 'Não autorizado'}
            </p>
          </div>
        </div>
      </div>

      {/* Ações de Comunicação */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Enviar Mensagem</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <MessageCircle className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-slate-900">WhatsApp</h4>
            <p className="text-sm text-slate-600">Enviar mensagem via WhatsApp</p>
          </button>
          
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <Mail className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-slate-900">E-mail</h4>
            <p className="text-sm text-slate-600">Enviar e-mail personalizado</p>
          </button>
          
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <Phone className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-slate-900">SMS</h4>
            <p className="text-sm text-slate-600">Enviar mensagem de texto</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderLGPD = () => (
    <div className="space-y-6">
      {/* Status dos Consentimentos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          Status dos Consentimentos LGPD
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Processamento de Dados</p>
              <p className="text-sm text-slate-600">Autorização para uso dos dados pessoais</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              client.lgpdConsent.dataProcessingConsent 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {client.lgpdConsent.dataProcessingConsent ? 'Autorizado' : 'Não Autorizado'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Marketing</p>
              <p className="text-sm text-slate-600">Autorização para comunicações promocionais</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              client.lgpdConsent.marketingConsent 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {client.lgpdConsent.marketingConsent ? 'Autorizado' : 'Não Autorizado'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Período de Retenção</p>
              <p className="text-sm text-slate-600">Tempo de armazenamento dos dados</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">
              {client.lgpdConsent.dataRetentionPeriod} anos
            </span>
          </div>
        </div>
      </div>

      {/* Informações de Consentimento */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Histórico de Consentimentos</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Data do primeiro consentimento:</span>
            <span className="font-medium text-slate-900">{formatDate(client.lgpdConsent.consentDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Última atualização:</span>
            <span className="font-medium text-slate-900">{formatDate(client.lgpdConsent.lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Ações LGPD */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Direitos do Titular</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left disabled:opacity-50"
          >
            <Download className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-slate-900">Exportar Dados</h4>
            <p className="text-sm text-slate-600">
              {isExporting ? 'Exportando...' : 'Baixar todos os dados do cliente'}
            </p>
          </button>
          
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
            <h4 className="font-medium text-slate-900">Solicitar Exclusão</h4>
            <p className="text-sm text-slate-600">Processar solicitação de exclusão de dados</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {client.photo ? (
                <img
                  src={client.photo}
                  alt={client.fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-500" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{client.fullName}</h2>
                <p className="text-slate-600">Cliente desde {formatDate(client.createdAt)}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLoyaltyLevelColor(client.loyaltyProgram.currentLevel)}`}>
                    {getLoyaltyLevelIcon(client.loyaltyProgram.currentLevel)} {client.loyaltyProgram.currentLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: User },
              { id: 'history', label: 'Histórico', icon: History },
              { id: 'loyalty', label: 'Fidelidade', icon: Star },
              { id: 'communication', label: 'Comunicação', icon: MessageCircle },
              { id: 'lgpd', label: 'LGPD', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'history' && renderHistory()}
          {activeTab === 'loyalty' && renderLoyalty()}
          {activeTab === 'communication' && renderCommunication()}
          {activeTab === 'lgpd' && renderLGPD()}
        </div>
      </div>
    </div>
  );
}