import React, { useState } from 'react';
import { Users, Star, DollarSign, Calendar, TrendingUp, TrendingDown, Award, Target, Clock } from 'lucide-react';

interface ProfessionalRankingProps {
  dateRange: { start: string; end: string };
  selectedService: string;
}

export function ProfessionalRanking({ dateRange, selectedService }: ProfessionalRankingProps) {
  const [rankingCriteria, setRankingCriteria] = useState<'revenue' | 'appointments' | 'rating' | 'retention'>('revenue');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Mock data for professional ranking
  const professionals = [
    {
      id: 'p1',
      name: 'João Silva',
      photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      metrics: {
        revenue: 18750,
        appointments: 425,
        rating: 4.8,
        retentionRate: 78,
        cancellationRate: 3.2,
        punctualityRate: 98,
        averageTicket: 44.12,
        topService: 'Corte + Barba',
        growth: 15.2,
      },
      specialties: ['Corte Tradicional', 'Barba', 'Bigode', 'Sobrancelha'],
      performance: {
        lastMonth: 16200,
        thisMonth: 18750,
        growth: 15.7,
        target: 18000,
        targetAchievement: 104.2,
      },
    },
    {
      id: 'p2',
      name: 'Pedro Santos',
      photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
      metrics: {
        revenue: 16800,
        appointments: 305,
        rating: 4.6,
        retentionRate: 72,
        cancellationRate: 4.8,
        punctualityRate: 95,
        averageTicket: 55.08,
        topService: 'Corte Moderno',
        growth: 8.3,
      },
      specialties: ['Corte Moderno', 'Fade', 'Desenho', 'Coloração'],
      performance: {
        lastMonth: 15500,
        thisMonth: 16800,
        growth: 8.4,
        target: 17000,
        targetAchievement: 98.8,
      },
    },
    {
      id: 'p3',
      name: 'Carlos Lima',
      photo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
      metrics: {
        revenue: 12500,
        appointments: 280,
        rating: 4.7,
        retentionRate: 75,
        cancellationRate: 3.8,
        punctualityRate: 97,
        averageTicket: 44.64,
        topService: 'Corte Tradicional',
        growth: 22.5,
      },
      specialties: ['Corte Tradicional', 'Barba', 'Tratamento Capilar'],
      performance: {
        lastMonth: 10200,
        thisMonth: 12500,
        growth: 22.5,
        target: 12000,
        targetAchievement: 104.2,
      },
    },
    {
      id: 'p4',
      name: 'André Costa',
      photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      metrics: {
        revenue: 9800,
        appointments: 210,
        rating: 4.5,
        retentionRate: 68,
        cancellationRate: 5.2,
        punctualityRate: 92,
        averageTicket: 46.67,
        topService: 'Corte Moderno',
        growth: -3.8,
      },
      specialties: ['Corte Moderno', 'Coloração', 'Relaxamento'],
      performance: {
        lastMonth: 10200,
        thisMonth: 9800,
        growth: -3.9,
        target: 11000,
        targetAchievement: 89.1,
      },
    },
    {
      id: 'p5',
      name: 'Marcos Oliveira',
      photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
      metrics: {
        revenue: 8500,
        appointments: 195,
        rating: 4.4,
        retentionRate: 65,
        cancellationRate: 6.5,
        punctualityRate: 90,
        averageTicket: 43.59,
        topService: 'Corte Tradicional',
        growth: 5.2,
      },
      specialties: ['Corte Tradicional', 'Barba', 'Sobrancelha'],
      performance: {
        lastMonth: 8080,
        thisMonth: 8500,
        growth: 5.2,
        target: 9000,
        targetAchievement: 94.4,
      },
    },
  ];

  const sortedProfessionals = [...professionals].sort((a, b) => {
    switch (rankingCriteria) {
      case 'revenue':
        return b.metrics.revenue - a.metrics.revenue;
      case 'appointments':
        return b.metrics.appointments - a.metrics.appointments;
      case 'rating':
        return b.metrics.rating - a.metrics.rating;
      case 'retention':
        return b.metrics.retentionRate - a.metrics.retentionRate;
      default:
        return 0;
    }
  });

  const toggleDetails = (id: string) => {
    if (showDetails === id) {
      setShowDetails(null);
    } else {
      setShowDetails(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ranking Criteria Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Critérios de Ranking</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setRankingCriteria('revenue')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              rankingCriteria === 'revenue'
                ? 'border-green-500 bg-green-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-medium text-center text-slate-900">Faturamento</p>
            <p className="text-xs text-center text-slate-600 mt-1">Ranking por receita gerada</p>
          </button>
          
          <button
            onClick={() => setRankingCriteria('appointments')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              rankingCriteria === 'appointments'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-medium text-center text-slate-900">Atendimentos</p>
            <p className="text-xs text-center text-slate-600 mt-1">Ranking por volume</p>
          </button>
          
          <button
            onClick={() => setRankingCriteria('rating')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              rankingCriteria === 'rating'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mx-auto mb-2">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <p className="font-medium text-center text-slate-900">Avaliação</p>
            <p className="text-xs text-center text-slate-600 mt-1">Ranking por satisfação</p>
          </button>
          
          <button
            onClick={() => setRankingCriteria('retention')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              rankingCriteria === 'retention'
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-medium text-center text-slate-900">Retenção</p>
            <p className="text-xs text-center text-slate-600 mt-1">Ranking por fidelização</p>
          </button>
        </div>
      </div>

      {/* Professional Ranking */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Ranking de Profissionais por {
            rankingCriteria === 'revenue' ? 'Faturamento' :
            rankingCriteria === 'appointments' ? 'Atendimentos' :
            rankingCriteria === 'rating' ? 'Avaliação' : 'Retenção'
          }
        </h3>

        <div className="space-y-4">
          {sortedProfessionals.map((professional, index) => (
            <div key={professional.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleDetails(professional.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-slate-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-slate-300'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <img 
                    src={professional.photo} 
                    alt={professional.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  
                  <div>
                    <p className="font-medium text-slate-900">{professional.name}</p>
                    <p className="text-sm text-slate-600">
                      {professional.specialties.slice(0, 2).join(', ')}
                      {professional.specialties.length > 2 && '...'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Faturamento</p>
                    <p className="font-semibold text-slate-900">{formatCurrency(professional.metrics.revenue)}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Atendimentos</p>
                    <p className="font-semibold text-slate-900">{professional.metrics.appointments}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Avaliação</p>
                    <div className="flex items-center justify-end space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <p className="font-semibold text-slate-900">{professional.metrics.rating}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Retenção</p>
                    <p className="font-semibold text-slate-900">{professional.metrics.retentionRate}%</p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${
                      professional.metrics.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {professional.metrics.growth > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {professional.metrics.growth > 0 ? '+' : ''}{professional.metrics.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {showDetails === professional.id && (
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Performance Metrics */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900 mb-2">Métricas de Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Ticket Médio:</span>
                          <span className="text-sm font-medium text-slate-900">
                            {formatCurrency(professional.metrics.averageTicket)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Taxa de Cancelamento:</span>
                          <span className="text-sm font-medium text-slate-900">
                            {professional.metrics.cancellationRate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Taxa de Pontualidade:</span>
                          <span className="text-sm font-medium text-slate-900">
                            {professional.metrics.punctualityRate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Serviço Mais Realizado:</span>
                          <span className="text-sm font-medium text-slate-900">
                            {professional.metrics.topService}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Target Achievement */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900 mb-2">Atingimento de Metas</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Meta do Mês:</span>
                          <span className="text-sm font-medium text-slate-900">
                            {formatCurrency(professional.performance.target)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Realizado:</span>
                          <span className="text-sm font-medium text-slate-900">
                            {formatCurrency(professional.performance.thisMonth)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Atingimento:</span>
                          <span className={`text-sm font-medium ${
                            professional.performance.targetAchievement >= 100 ? 'text-green-600' : 'text-amber-600'
                          }`}>
                            {professional.performance.targetAchievement}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              professional.performance.targetAchievement >= 100 ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(professional.performance.targetAchievement, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Growth Comparison */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900 mb-2">Comparativo de Crescimento</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Mês Anterior:</span>
                          <span className="text-sm font-medium text-slate-900">
                            {formatCurrency(professional.performance.lastMonth)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Mês Atual:</span>
                          <span className="text-sm font-medium text-slate-900">
                            {formatCurrency(professional.performance.thisMonth)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Crescimento:</span>
                          <span className={`text-sm font-medium ${
                            professional.performance.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {professional.performance.growth > 0 ? '+' : ''}
                            {professional.performance.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Team Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumo de Performance da Equipe</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(professionals.reduce((sum, p) => sum + p.metrics.revenue, 0))}
            </p>
            <p className="text-sm text-slate-600">Faturamento Total</p>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {professionals.reduce((sum, p) => sum + p.metrics.appointments, 0)}
            </p>
            <p className="text-sm text-slate-600">Total de Atendimentos</p>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mx-auto mb-2">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {(professionals.reduce((sum, p) => sum + p.metrics.rating, 0) / professionals.length).toFixed(1)}
            </p>
            <p className="text-sm text-slate-600">Avaliação Média</p>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {(professionals.reduce((sum, p) => sum + p.metrics.retentionRate, 0) / professionals.length).toFixed(1)}%
            </p>
            <p className="text-sm text-slate-600">Taxa de Retenção</p>
          </div>
        </div>
      </div>
    </div>
  );
}