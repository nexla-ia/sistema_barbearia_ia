import React, { useState } from 'react';
import { Star, TrendingUp, TrendingDown, Award, Target, Users, Clock, DollarSign } from 'lucide-react';

interface ServiceAnalysisProps {
  dateRange: { start: string; end: string };
  selectedProfessional: string;
}

export function ServiceAnalysis({ dateRange, selectedProfessional }: ServiceAnalysisProps) {
  const [sortBy, setSortBy] = useState<'volume' | 'revenue' | 'rating'>('volume');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Mock data for top 10 services
  const topServices = [
    {
      id: 1,
      name: 'Corte + Barba',
      category: 'Combo',
      volume: 285,
      revenue: 15675,
      averagePrice: 55,
      rating: 4.9,
      growth: 15.2,
      duration: 50,
      professionals: ['João Silva', 'Pedro Santos'],
    },
    {
      id: 2,
      name: 'Corte Tradicional',
      category: 'Corte',
      volume: 420,
      revenue: 14700,
      averagePrice: 35,
      rating: 4.8,
      growth: 8.5,
      duration: 30,
      professionals: ['João Silva', 'Pedro Santos', 'Carlos Lima'],
    },
    {
      id: 3,
      name: 'Barba Completa',
      category: 'Barba',
      volume: 180,
      revenue: 4500,
      averagePrice: 25,
      rating: 4.7,
      growth: -2.1,
      duration: 25,
      professionals: ['João Silva', 'Pedro Santos'],
    },
    {
      id: 4,
      name: 'Sobrancelha Masculina',
      category: 'Estética',
      volume: 95,
      revenue: 1425,
      averagePrice: 15,
      rating: 4.6,
      growth: 22.8,
      duration: 15,
      professionals: ['Pedro Santos'],
    },
    {
      id: 5,
      name: 'Corte Moderno',
      category: 'Corte',
      volume: 150,
      revenue: 7500,
      averagePrice: 50,
      rating: 4.8,
      growth: 18.7,
      duration: 40,
      professionals: ['Pedro Santos', 'Carlos Lima'],
    },
    {
      id: 6,
      name: 'Hidratação Capilar',
      category: 'Tratamento',
      volume: 65,
      revenue: 1950,
      averagePrice: 30,
      rating: 4.9,
      growth: 35.2,
      duration: 45,
      professionals: ['Carlos Lima'],
    },
    {
      id: 7,
      name: 'Coloração',
      category: 'Química',
      volume: 45,
      revenue: 3600,
      averagePrice: 80,
      rating: 4.7,
      growth: 12.5,
      duration: 90,
      professionals: ['Carlos Lima'],
    },
    {
      id: 8,
      name: 'Relaxamento',
      category: 'Química',
      volume: 30,
      revenue: 2100,
      averagePrice: 70,
      rating: 4.6,
      growth: -5.8,
      duration: 75,
      professionals: ['Carlos Lima'],
    },
    {
      id: 9,
      name: 'Lavagem + Escova',
      category: 'Tratamento',
      volume: 85,
      revenue: 1700,
      averagePrice: 20,
      rating: 4.5,
      growth: 6.2,
      duration: 30,
      professionals: ['João Silva', 'Pedro Santos'],
    },
    {
      id: 10,
      name: 'Bigode',
      category: 'Barba',
      volume: 40,
      revenue: 600,
      averagePrice: 15,
      rating: 4.4,
      growth: -8.3,
      duration: 15,
      professionals: ['João Silva'],
    },
  ];

  const sortedServices = [...topServices].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return b.volume - a.volume;
      case 'revenue':
        return b.revenue - a.revenue;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const categoryStats = [
    { name: 'Combo', volume: 285, revenue: 15675, growth: 15.2, color: 'bg-purple-500' },
    { name: 'Corte', volume: 570, revenue: 22200, growth: 12.1, color: 'bg-blue-500' },
    { name: 'Barba', volume: 220, revenue: 5100, growth: -4.2, color: 'bg-green-500' },
    { name: 'Estética', volume: 95, revenue: 1425, growth: 22.8, color: 'bg-pink-500' },
    { name: 'Tratamento', volume: 150, revenue: 3650, growth: 18.5, color: 'bg-amber-500' },
    { name: 'Química', volume: 75, revenue: 5700, growth: 4.8, color: 'bg-red-500' },
  ];

  const totalVolume = categoryStats.reduce((sum, cat) => sum + cat.volume, 0);
  const totalRevenue = categoryStats.reduce((sum, cat) => sum + cat.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Category Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Análise por Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((category, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <h4 className="font-medium text-slate-900">{category.name}</h4>
                </div>
                <div className={`flex items-center space-x-1 ${
                  category.growth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {category.growth > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {category.growth > 0 ? '+' : ''}{category.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Volume:</span>
                  <span className="text-sm font-semibold text-slate-900">{category.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Receita:</span>
                  <span className="text-sm font-semibold text-slate-900">{formatCurrency(category.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Participação:</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {((category.volume / totalVolume) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Top 10 Serviços Mais Solicitados</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            >
              <option value="volume">Volume</option>
              <option value="revenue">Receita</option>
              <option value="rating">Avaliação</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Posição</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Serviço</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Volume</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Receita</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Preço Médio</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Avaliação</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Crescimento</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Duração</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedServices.map((service, index) => (
                <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-slate-400' :
                      index === 2 ? 'bg-orange-600' : 'bg-slate-300'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{service.name}</p>
                      <p className="text-sm text-slate-600">{service.category}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900">{service.volume}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-green-600">{formatCurrency(service.revenue)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-900">{formatCurrency(service.averagePrice)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-slate-900">{service.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`flex items-center space-x-1 ${
                      service.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {service.growth > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {service.growth > 0 ? '+' : ''}{service.growth}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-900">{service.duration}min</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Growing Services */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            Serviços em Maior Crescimento
          </h3>
          <div className="space-y-3">
            {sortedServices
              .filter(service => service.growth > 0)
              .sort((a, b) => b.growth - a.growth)
              .slice(0, 5)
              .map((service, index) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{service.name}</p>
                    <p className="text-sm text-slate-600">{service.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{service.growth}%</p>
                    <p className="text-sm text-slate-600">{service.volume} atendimentos</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Most Declining Services */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
            Serviços em Declínio
          </h3>
          <div className="space-y-3">
            {sortedServices
              .filter(service => service.growth < 0)
              .sort((a, b) => a.growth - b.growth)
              .slice(0, 5)
              .map((service, index) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{service.name}</p>
                    <p className="text-sm text-slate-600">{service.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{service.growth}%</p>
                    <p className="text-sm text-slate-600">{service.volume} atendimentos</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Service Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Métricas de Serviços</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalVolume}</p>
            <p className="text-sm text-slate-600">Total de Atendimentos</p>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-slate-600">Receita Total</p>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mx-auto mb-2">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue / totalVolume)}</p>
            <p className="text-sm text-slate-600">Ticket Médio</p>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {(sortedServices.reduce((sum, service) => sum + service.rating, 0) / sortedServices.length).toFixed(1)}
            </p>
            <p className="text-sm text-slate-600">Avaliação Média</p>
          </div>
        </div>
      </div>
    </div>
  );
}