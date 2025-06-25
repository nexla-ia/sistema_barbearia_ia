import React, { useState } from 'react';
import { BarChart3, DollarSign, TrendingUp, TrendingDown, Calendar, Star, Users, Download, Filter } from 'lucide-react';
import { Professional, CommissionReport, PerformanceReport } from '../../types/professional';
import { useProfessional } from '../../contexts/ProfessionalContext';

interface ProfessionalReportsProps {
  professional?: Professional;
}

export function ProfessionalReports({ professional }: ProfessionalReportsProps) {
  const { state, generateCommissionReport, generatePerformanceReport } = useProfessional();
  const [selectedProfessional, setSelectedProfessional] = useState(professional?.id || '');
  const [reportType, setReportType] = useState<'commission' | 'performance' | 'ranking'>('commission');
  const [period, setPeriod] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [commissionReport, setCommissionReport] = useState<CommissionReport | null>(null);
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const generateReport = async () => {
    if (!selectedProfessional) return;

    setLoading(true);
    try {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);

      if (reportType === 'commission') {
        const report = await generateCommissionReport(selectedProfessional, startDate, endDate);
        setCommissionReport(report);
      } else if (reportType === 'performance') {
        const report = await generatePerformanceReport(selectedProfessional, startDate, endDate);
        setPerformanceReport(report);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (reportType === 'commission' && commissionReport) {
      const csvContent = [
        ['Serviço', 'Atendimentos', 'Receita Total', 'Taxa Comissão (%)', 'Comissão (R$)'].join(','),
        ...commissionReport.services.map(service => [
          service.serviceName,
          service.appointmentCount.toString(),
          service.totalRevenue.toString(),
          service.commissionRate.toString(),
          service.commissionAmount.toString(),
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `comissoes-${commissionReport.professionalName}-${period.start}-${period.end}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderCommissionReport = () => {
    if (!commissionReport) return null;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Receita Total</p>
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(commissionReport.totalRevenue)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Comissão Total</p>
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(commissionReport.totalCommission)}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Comissão Líquida</p>
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(commissionReport.netCommission)}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Status: <span className={`font-medium ${
                    commissionReport.paymentStatus === 'paid' ? 'text-green-600' :
                    commissionReport.paymentStatus === 'partial' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {commissionReport.paymentStatus === 'paid' ? 'Pago' :
                     commissionReport.paymentStatus === 'partial' ? 'Parcial' : 'Pendente'}
                  </span>
                </p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Services Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Detalhamento por Serviço</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Serviço</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Atendimentos</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Receita Total</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Taxa (%)</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Comissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {commissionReport.services.map((service) => (
                  <tr key={service.serviceId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{service.serviceName}</td>
                    <td className="py-3 px-4 text-slate-600">{service.appointmentCount}</td>
                    <td className="py-3 px-4 text-slate-600">{formatCurrency(service.totalRevenue)}</td>
                    <td className="py-3 px-4 text-slate-600">{service.commissionRate}%</td>
                    <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(service.commissionAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPerformanceReport = () => {
    if (!performanceReport) return null;

    return (
      <div className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Atendimentos</p>
                <p className="text-3xl font-bold text-slate-900">{performanceReport.metrics.totalAppointments}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+{performanceReport.comparison.growth.appointments}%</span>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Receita</p>
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(performanceReport.metrics.totalRevenue)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+{performanceReport.comparison.growth.revenue}%</span>
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
                <p className="text-sm font-medium text-slate-600 mb-1">Avaliação Média</p>
                <p className="text-3xl font-bold text-slate-900">{performanceReport.metrics.averageRating.toFixed(1)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+{performanceReport.comparison.growth.rating}%</span>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Taxa de Conclusão</p>
                <p className="text-3xl font-bold text-slate-900">{performanceReport.metrics.completionRate.toFixed(1)}%</p>
                <p className="text-sm text-slate-500 mt-1">
                  {performanceReport.metrics.completedAppointments} de {performanceReport.metrics.totalAppointments}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Métricas de Qualidade</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Taxa de Pontualidade</span>
                <span className="font-semibold text-slate-900">{performanceReport.metrics.punctualityRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Taxa de Reagendamento</span>
                <span className="font-semibold text-slate-900">{performanceReport.metrics.rebookingRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Taxa de Não Comparecimento</span>
                <span className="font-semibold text-slate-900">{performanceReport.metrics.noShowRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Taxa de Cancelamento</span>
                <span className="font-semibold text-slate-900">{performanceReport.metrics.cancellationRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Ranking</h3>
            <div className="text-center">
              <div className="text-6xl font-bold text-amber-600 mb-2">#{performanceReport.ranking.position}</div>
              <p className="text-slate-600 mb-4">
                de {performanceReport.ranking.totalProfessionals} profissionais
              </p>
              <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                {performanceReport.ranking.category === 'revenue' ? 'Por Receita' :
                 performanceReport.ranking.category === 'appointments' ? 'Por Atendimentos' : 'Por Avaliação'}
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Comparação com Período Anterior</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Atendimentos</p>
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <p className="text-lg font-bold text-slate-900">{performanceReport.comparison.previousPeriod.totalAppointments}</p>
                  <p className="text-xs text-slate-500">Anterior</p>
                </div>
                <div className="text-2xl text-slate-400">→</div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{performanceReport.metrics.totalAppointments}</p>
                  <p className="text-xs text-slate-500">Atual</p>
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-sm font-medium ${
                  performanceReport.comparison.growth.appointments > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {performanceReport.comparison.growth.appointments > 0 ? '+' : ''}{performanceReport.comparison.growth.appointments}%
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Receita</p>
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(performanceReport.comparison.previousPeriod.totalRevenue)}</p>
                  <p className="text-xs text-slate-500">Anterior</p>
                </div>
                <div className="text-2xl text-slate-400">→</div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(performanceReport.metrics.totalRevenue)}</p>
                  <p className="text-xs text-slate-500">Atual</p>
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-sm font-medium ${
                  performanceReport.comparison.growth.revenue > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {performanceReport.comparison.growth.revenue > 0 ? '+' : ''}{performanceReport.comparison.growth.revenue}%
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Avaliação</p>
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <p className="text-lg font-bold text-slate-900">{performanceReport.comparison.previousPeriod.averageRating.toFixed(1)}</p>
                  <p className="text-xs text-slate-500">Anterior</p>
                </div>
                <div className="text-2xl text-slate-400">→</div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{performanceReport.metrics.averageRating.toFixed(1)}</p>
                  <p className="text-xs text-slate-500">Atual</p>
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-sm font-medium ${
                  performanceReport.comparison.growth.rating > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {performanceReport.comparison.growth.rating > 0 ? '+' : ''}{performanceReport.comparison.growth.rating}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRankingReport = () => {
    const sortedProfessionals = [...state.professionals].sort((a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Ranking de Profissionais</h3>
        <div className="space-y-4">
          {sortedProfessionals.map((prof, index) => (
            <div key={prof.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-slate-400' :
                  index === 2 ? 'bg-orange-600' : 'bg-slate-300'
                }`}>
                  {index + 1}
                </div>
                {prof.photo ? (
                  <img src={prof.photo} alt={prof.fullName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900">{prof.fullName}</p>
                  <p className="text-sm text-slate-600">{prof.specialties.join(', ')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{formatCurrency(prof.metrics.totalRevenue)}</p>
                <p className="text-sm text-slate-600">{prof.metrics.totalAppointments} atendimentos</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{prof.metrics.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Relatórios e Métricas</h1>
        {(commissionReport || performanceReport) && (
          <button
            onClick={exportReport}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {!professional && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Profissional
              </label>
              <select
                value={selectedProfessional}
                onChange={(e) => setSelectedProfessional(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Selecione um profissional</option>
                {state.professionals.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="commission">Comissões</option>
              <option value="performance">Performance</option>
              <option value="ranking">Ranking</option>
            </select>
          </div>

          {reportType !== 'ranking' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  value={period.start}
                  onChange={(e) => setPeriod(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={period.end}
                  onChange={(e) => setPeriod(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={generateReport}
            disabled={loading || (!selectedProfessional && !professional) || reportType === 'ranking'}
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Filter className="w-4 h-4 mr-2" />
            {loading ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </div>
      </div>

      {/* Report Content */}
      {reportType === 'commission' && renderCommissionReport()}
      {reportType === 'performance' && renderPerformanceReport()}
      {reportType === 'ranking' && renderRankingReport()}
    </div>
  );
}