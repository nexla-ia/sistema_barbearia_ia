import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, CreditCard, Banknote, 
  Smartphone, AlertTriangle, Calendar, BarChart3, PieChart,
  ArrowUpRight, ArrowDownRight, Eye, EyeOff
} from 'lucide-react';
import { useFinancial } from '../../contexts/FinancialContext';
import { CashFlow, DRE, PerformanceMetrics } from '../../types/financial';

export function FinancialDashboard() {
  const { state, generateCashFlow, generateDRE, generatePerformanceReport } = useFinancial();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [cashFlow, setCashFlow] = useState<CashFlow | null>(null);
  const [dre, setDre] = useState<DRE | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [showValues, setShowValues] = useState(true);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value: number) => {
    if (!showValues) return '••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    if (!showValues) return '••••';
    return `${value.toFixed(1)}%`;
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate: Date;
      let endDate = now;

      switch (selectedPeriod) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const [cashFlowData, dreData, performanceData] = await Promise.all([
        generateCashFlow(startDate, endDate),
        generateDRE(startDate, endDate),
        generatePerformanceReport(startDate, endDate),
      ]);

      setCashFlow(cashFlowData);
      setDre(dreData);
      setPerformance(performanceData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'Esta Semana';
      case 'month': return 'Este Mês';
      case 'quarter': return 'Este Trimestre';
      case 'year': return 'Este Ano';
      default: return 'Este Mês';
    }
  };

  // Mock data for demonstration
  const mockFinancialData = {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Financeiro</h2>
          <button
            onClick={() => setShowValues(!showValues)}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            title={showValues ? 'Ocultar valores' : 'Mostrar valores'}
          >
            {showValues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex items-center space-x-4">
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
      </div>

      {/* Alerts */}
      {state.alerts.filter(a => !a.isRead).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-900">Alertas Financeiros</h3>
          </div>
          <div className="space-y-1">
            {state.alerts.filter(a => !a.isRead).slice(0, 3).map((alert) => (
              <p key={alert.id} className="text-sm text-yellow-800">{alert.message}</p>
            ))}
          </div>
        </div>
      )}

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Receita Total</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(mockFinancialData.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+{formatPercentage(mockFinancialData.revenueGrowth)}</span>
                <span className="text-slate-500 text-sm ml-1">{getPeriodLabel().toLowerCase()}</span>
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
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(mockFinancialData.totalExpenses)}</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">{mockFinancialData.expenseGrowth}%</span>
                <span className="text-slate-500 text-sm ml-1">{getPeriodLabel().toLowerCase()}</span>
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
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(mockFinancialData.netProfit)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+{formatPercentage(mockFinancialData.profitGrowth)}</span>
                <span className="text-slate-500 text-sm ml-1">{getPeriodLabel().toLowerCase()}</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Ticket Médio</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(mockFinancialData.averageTicket)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+5.2%</span>
                <span className="text-slate-500 text-sm ml-1">{getPeriodLabel().toLowerCase()}</span>
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Receita vs Despesas</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">Receita</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-slate-600">Despesas</span>
              </div>
            </div>
          </div>
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
                    {((mockFinancialData.paymentMethods.cash / mockFinancialData.totalRevenue) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(mockFinancialData.paymentMethods.cash)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Cartão</p>
                  <p className="text-sm text-slate-600">
                    {((mockFinancialData.paymentMethods.card / mockFinancialData.totalRevenue) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(mockFinancialData.paymentMethods.card)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">PIX</p>
                  <p className="text-sm text-slate-600">
                    {((mockFinancialData.paymentMethods.pix / mockFinancialData.totalRevenue) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(mockFinancialData.paymentMethods.pix)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span className="font-bold text-lg text-slate-900">{formatCurrency(mockFinancialData.commissionsTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Métricas Importantes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Margem de Lucro</span>
              <span className="font-bold text-green-600">
                {formatPercentage((mockFinancialData.netProfit / mockFinancialData.totalRevenue) * 100)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Custo por Atendimento</span>
              <span className="font-bold text-slate-900">{formatCurrency(18.5)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">ROI do Período</span>
              <span className="font-bold text-green-600">+24.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Crescimento</span>
              <span className="font-bold text-green-600">+{formatPercentage(mockFinancialData.revenueGrowth)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Próximos Vencimentos</h3>
          <div className="space-y-3">
            {state.accounts.filter(a => a.status === 'pending').slice(0, 4).map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{account.description}</p>
                  <p className="text-xs text-slate-600">
                    Vence em {Math.ceil((account.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                  </p>
                </div>
                <span className="font-bold text-slate-900 text-sm">{formatCurrency(account.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cash Register Status */}
      {state.currentCashRegister && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Status do Caixa</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Aberto
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">Abertura</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(state.currentCashRegister.openingBalance)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Entradas</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(
                  state.currentCashRegister.transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Saídas</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(
                  state.currentCashRegister.transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Saldo Atual</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(state.currentCashRegister.expectedBalance)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}