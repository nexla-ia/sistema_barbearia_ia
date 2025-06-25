import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function FinancialDashboard() {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Mock financial data
  const financialData = {
    totalRevenue: 15420,
    totalExpenses: 4820,
    netProfit: 10600,
    revenueGrowth: 12.5,
    expenseGrowth: -8.2,
    profitGrowth: 18.3,
    paymentMethods: {
      cash: 6200,
      card: 7800,
      pix: 1420,
    },
    commissionsTotal: 8650,
    averageTicket: 42,
  };

  const revenueData = [
    { day: 'Seg', value: 850, expenses: 320 },
    { day: 'Ter', value: 1200, expenses: 450 },
    { day: 'Qua', value: 950, expenses: 380 },
    { day: 'Qui', value: 1800, expenses: 520 },
    { day: 'Sex', value: 2100, expenses: 680 },
    { day: 'Sáb', value: 2800, expenses: 780 },
    { day: 'Dom', value: 1600, expenses: 420 },
  ];

  const maxValue = Math.max(...revenueData.map(d => Math.max(d.value, d.expenses)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Financeiro</h2>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="week">Esta Semana</option>
          <option value="month">Este Mês</option>
          <option value="quarter">Este Trimestre</option>
          <option value="year">Este Ano</option>
        </select>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Receita Total</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(financialData.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+{financialData.revenueGrowth}%</span>
                <span className="text-slate-500 text-sm ml-1">este mês</span>
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
              <p className="text-sm font-medium text-slate-600 mb-1">Despesas</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(financialData.totalExpenses)}</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">{financialData.expenseGrowth}%</span>
                <span className="text-slate-500 text-sm ml-1">este mês</span>
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Lucro Líquido</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(financialData.netProfit)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+{financialData.profitGrowth}%</span>
                <span className="text-slate-500 text-sm ml-1">este mês</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Receita vs Despesas</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                <div className="w-full flex flex-col items-center space-y-1">
                  <div
                    className="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                    style={{ height: `${(item.value / maxValue) * 200}px` }}
                    title={`Receita: ${formatCurrency(item.value)}`}
                  />
                  <div
                    className="w-full bg-red-400 rounded-t-lg transition-all duration-300 hover:bg-red-500"
                    style={{ height: `${(item.expenses / maxValue) * 200}px` }}
                    title={`Despesas: ${formatCurrency(item.expenses)}`}
                  />
                </div>
                <span className="text-xs text-slate-600 mt-2">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Receita</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-sm text-slate-600">Despesas</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Métodos de Pagamento</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg">
                  <Banknote className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Dinheiro</p>
                  <p className="text-sm text-slate-600">
                    {((financialData.paymentMethods.cash / financialData.totalRevenue) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(financialData.paymentMethods.cash)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Cartão</p>
                  <p className="text-sm text-slate-600">
                    {((financialData.paymentMethods.card / financialData.totalRevenue) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(financialData.paymentMethods.card)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">PIX</p>
                  <p className="text-sm text-slate-600">
                    {((financialData.paymentMethods.pix / financialData.totalRevenue) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(financialData.paymentMethods.pix)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Comissões dos Profissionais</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">João Silva</p>
                <p className="text-sm text-slate-600">60% de comissão</p>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(5190)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Pedro Santos</p>
                <p className="text-sm text-slate-600">50% de comissão</p>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(3460)}</span>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total em Comissões</span>
                <span className="font-bold text-lg text-slate-900">{formatCurrency(financialData.commissionsTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Métricas Importantes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Ticket Médio</span>
              <span className="font-bold text-slate-900">{formatCurrency(financialData.averageTicket)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Margem de Lucro</span>
              <span className="font-bold text-green-600">
                {((financialData.netProfit / financialData.totalRevenue) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Custo por Atendimento</span>
              <span className="font-bold text-slate-900">{formatCurrency(18.5)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">ROI do Mês</span>
              <span className="font-bold text-green-600">+24.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}