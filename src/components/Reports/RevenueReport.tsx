import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, PieChart } from 'lucide-react';

interface RevenueReportProps {
  dateRange: { start: string; end: string };
  selectedProfessional: string;
  selectedService: string;
}

export function RevenueReport({ dateRange, selectedProfessional, selectedService }: RevenueReportProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Mock data for revenue analysis
  const revenueData = {
    current: {
      total: 45680,
      services: 38200,
      products: 7480,
      growth: 12.5,
    },
    previous: {
      total: 40600,
      services: 34100,
      products: 6500,
    },
    byPeriod: [
      { period: 'Jan', revenue: 38500, target: 35000 },
      { period: 'Fev', revenue: 42300, target: 38000 },
      { period: 'Mar', revenue: 45680, target: 42000 },
      { period: 'Abr', revenue: 41200, target: 40000 },
      { period: 'Mai', revenue: 47800, target: 45000 },
      { period: 'Jun', revenue: 52100, target: 48000 },
    ],
    byService: [
      { name: 'Corte + Barba', revenue: 18500, percentage: 40.5 },
      { name: 'Corte Simples', revenue: 12300, percentage: 26.9 },
      { name: 'Barba', revenue: 8900, percentage: 19.5 },
      { name: 'Sobrancelha', revenue: 3200, percentage: 7.0 },
      { name: 'Outros', revenue: 2780, percentage: 6.1 },
    ],
    byPaymentMethod: [
      { method: 'PIX', amount: 18500, percentage: 40.5 },
      { method: 'Cartão Débito', amount: 15200, percentage: 33.3 },
      { method: 'Cartão Crédito', amount: 8900, percentage: 19.5 },
      { method: 'Dinheiro', amount: 3080, percentage: 6.7 },
    ],
  };

  const maxRevenue = Math.max(...revenueData.byPeriod.map(item => Math.max(item.revenue, item.target)));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Faturamento Total</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(revenueData.current.total)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+{revenueData.current.growth}%</span>
                <span className="text-slate-500 text-sm ml-1">vs período anterior</span>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Receita de Serviços</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(revenueData.current.services)}</p>
              <p className="text-sm text-slate-500 mt-1">
                {((revenueData.current.services / revenueData.current.total) * 100).toFixed(1)}% do total
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Receita de Produtos</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(revenueData.current.products)}</p>
              <p className="text-sm text-slate-500 mt-1">
                {((revenueData.current.products / revenueData.current.total) * 100).toFixed(1)}% do total
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Evolução do Faturamento</h3>
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'daily' ? 'Diário' : 
                 mode === 'weekly' ? 'Semanal' : 
                 mode === 'monthly' ? 'Mensal' : 'Anual'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 flex items-end justify-between space-x-2">
          {revenueData.byPeriod.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div className="w-full flex flex-col items-center space-y-1">
                {/* Target line */}
                <div
                  className="w-full bg-slate-200 rounded-t-lg opacity-50"
                  style={{ height: `${(item.target / maxRevenue) * 250}px` }}
                  title={`Meta: ${formatCurrency(item.target)}`}
                />
                {/* Actual revenue */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-80 ${
                    item.revenue >= item.target ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ height: `${(item.revenue / maxRevenue) * 250}px` }}
                  title={`Faturamento: ${formatCurrency(item.revenue)}`}
                />
              </div>
              <span className="text-xs text-slate-600 font-medium">{item.period}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-600">Faturamento Real</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
            <span className="text-slate-600">Meta</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Service */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Faturamento por Serviço</h3>
          <div className="space-y-4">
            {revenueData.byService.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{service.name}</span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(service.revenue)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-1">{service.percentage}% do total</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Payment Method */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Faturamento por Forma de Pagamento</h3>
          <div className="space-y-4">
            {revenueData.byPaymentMethod.map((payment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{payment.method}</span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${payment.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-1">{payment.percentage}% do total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Análise Comparativa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Período Atual</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Faturamento Total:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(revenueData.current.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Serviços:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(revenueData.current.services)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Produtos:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(revenueData.current.products)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Período Anterior</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Faturamento Total:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(revenueData.previous.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Serviços:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(revenueData.previous.services)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Produtos:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(revenueData.previous.products)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="font-medium text-slate-900 mb-3">Variação</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-xl font-bold text-green-600">+{revenueData.current.growth}%</p>
              <p className="text-xs text-slate-500">
                +{formatCurrency(revenueData.current.total - revenueData.previous.total)}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-slate-600">Serviços</p>
              <p className="text-xl font-bold text-blue-600">
                +{(((revenueData.current.services - revenueData.previous.services) / revenueData.previous.services) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500">
                +{formatCurrency(revenueData.current.services - revenueData.previous.services)}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-slate-600">Produtos</p>
              <p className="text-xl font-bold text-purple-600">
                +{(((revenueData.current.products - revenueData.previous.products) / revenueData.previous.products) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500">
                +{formatCurrency(revenueData.current.products - revenueData.previous.products)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}