import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Calendar, Users, Clock, 
  Download, Filter, Mail, Settings, Star, DollarSign, Activity,
  FileText, PieChart, LineChart, Target, AlertTriangle, CheckCircle
} from 'lucide-react';
import { RevenueReport } from './RevenueReport';
import { ServiceAnalysis } from './ServiceAnalysis';
import { ProfessionalRanking } from './ProfessionalRanking';
import { HeatmapAnalysis } from './HeatmapAnalysis';
import { OccupancyMetrics } from './OccupancyMetrics';
import { InteractiveDashboard } from './InteractiveDashboard';
import { ExportManager } from './ExportManager';

export function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'revenue' | 'services' | 'professionals' | 'heatmap' | 'occupancy' | 'export'>('dashboard');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data for KPIs
  const kpis = {
    totalRevenue: 45680,
    revenueGrowth: 12.5,
    totalAppointments: 1250,
    appointmentGrowth: 8.3,
    averageTicket: 36.54,
    ticketGrowth: 4.2,
    occupancyRate: 78.5,
    occupancyGrowth: -2.1,
    customerSatisfaction: 4.8,
    satisfactionGrowth: 0.3,
    cancellationRate: 8.2,
    cancellationChange: -1.5,
  };

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Taxa de Ocupação Baixa',
      message: 'Quinta-feira das 14h às 16h com apenas 45% de ocupação',
      priority: 'medium',
    },
    {
      id: 2,
      type: 'success',
      title: 'Meta de Faturamento Atingida',
      message: 'Faturamento mensal superou a meta em 15%',
      priority: 'high',
    },
    {
      id: 3,
      type: 'info',
      title: 'Novo Recorde de Avaliações',
      message: 'João Silva atingiu 4.9 de média nas avaliações',
      priority: 'low',
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (value: number) => {
    return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-slate-600';
  };

  const getGrowthIcon = (value: number) => {
    return value > 0 ? TrendingUp : value < 0 ? TrendingDown : Activity;
  };

  const renderKPICard = (title: string, value: string, growth: number, icon: React.ElementType, color: string) => {
    const Icon = icon;
    const GrowthIcon = getGrowthIcon(growth);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <div className="flex items-center mt-2">
              <GrowthIcon className={`w-4 h-4 mr-1 ${getGrowthColor(growth)}`} />
              <span className={`text-sm font-medium ${getGrowthColor(growth)}`}>
                {formatPercentage(growth)}
              </span>
              <span className="text-slate-500 text-sm ml-1">vs mês anterior</span>
            </div>
          </div>
          <div className={`${color} p-3 rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const renderAlerts = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
        Alertas e Notificações
      </h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
            alert.type === 'warning' ? 'bg-amber-50 border-amber-400' :
            alert.type === 'success' ? 'bg-green-50 border-green-400' :
            'bg-blue-50 border-blue-400'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className={`font-medium ${
                  alert.type === 'warning' ? 'text-amber-900' :
                  alert.type === 'success' ? 'text-green-900' :
                  'text-blue-900'
                }`}>
                  {alert.title}
                </h4>
                <p className={`text-sm mt-1 ${
                  alert.type === 'warning' ? 'text-amber-700' :
                  alert.type === 'success' ? 'text-green-700' :
                  'text-blue-700'
                }`}>
                  {alert.message}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-slate-100 text-slate-800'
              }`}>
                {alert.priority === 'high' ? 'Alta' : alert.priority === 'medium' ? 'Média' : 'Baixa'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Exportar Relatório</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
          <Mail className="w-4 h-4" />
          <span className="text-sm font-medium">Enviar por Email</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Configurar Alertas</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
          <Target className="w-4 h-4" />
          <span className="text-sm font-medium">Definir Metas</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Relatórios e Análises</h1>
        <div className="flex items-center space-x-4">
          {/* Date Range Selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            />
            <span className="text-slate-500">até</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            />
          </div>
          
          <button className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex space-x-8 min-w-max">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'revenue', label: 'Faturamento', icon: DollarSign },
            { id: 'services', label: 'Serviços', icon: Star },
            { id: 'professionals', label: 'Profissionais', icon: Users },
            { id: 'heatmap', label: 'Mapa de Calor', icon: Activity },
            { id: 'occupancy', label: 'Ocupação', icon: Clock },
            { id: 'export', label: 'Exportação', icon: FileText },
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
      <div className="overflow-x-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderKPICard('Faturamento Total', formatCurrency(kpis.totalRevenue), kpis.revenueGrowth, DollarSign, 'bg-green-500')}
              {renderKPICard('Total de Atendimentos', kpis.totalAppointments.toString(), kpis.appointmentGrowth, Users, 'bg-blue-500')}
              {renderKPICard('Ticket Médio', formatCurrency(kpis.averageTicket), kpis.ticketGrowth, TrendingUp, 'bg-purple-500')}
              {renderKPICard('Taxa de Ocupação', `${kpis.occupancyRate}%`, kpis.occupancyGrowth, Clock, 'bg-amber-500')}
              {renderKPICard('Satisfação do Cliente', kpis.customerSatisfaction.toString(), kpis.satisfactionGrowth, Star, 'bg-pink-500')}
              {renderKPICard('Taxa de Cancelamento', `${kpis.cancellationRate}%`, kpis.cancellationChange, AlertTriangle, 'bg-red-500')}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderAlerts()}
              {renderQuickActions()}
            </div>

            <InteractiveDashboard dateRange={dateRange} />
          </div>
        )}

        {activeTab === 'revenue' && (
          <RevenueReport 
            dateRange={dateRange}
            selectedProfessional={selectedProfessional}
            selectedService={selectedService}
          />
        )}

        {activeTab === 'services' && (
          <ServiceAnalysis 
            dateRange={dateRange}
            selectedProfessional={selectedProfessional}
          />
        )}

        {activeTab === 'professionals' && (
          <ProfessionalRanking 
            dateRange={dateRange}
            selectedService={selectedService}
          />
        )}

        {activeTab === 'heatmap' && (
          <HeatmapAnalysis 
            dateRange={dateRange}
          />
        )}

        {activeTab === 'occupancy' && (
          <OccupancyMetrics 
            dateRange={dateRange}
            selectedProfessional={selectedProfessional}
          />
        )}

        {activeTab === 'export' && (
          <ExportManager 
            dateRange={dateRange}
            selectedProfessional={selectedProfessional}
            selectedService={selectedService}
          />
        )}
      </div>
    </div>
  );
}