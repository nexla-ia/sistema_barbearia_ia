import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, Star, Download, Filter } from 'lucide-react';
import { ServiceReport, PackageReport } from '../../types/service';
import { useService } from '../../contexts/ServiceContext';

export function ServiceReports() {
  const { generateServiceReport, generatePackageReport } = useService();
  const [reportType, setReportType] = useState<'services' | 'packages'>('services');
  const [period, setPeriod] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [serviceReport, setServiceReport] = useState<ServiceReport | null>(null);
  const [packageReport, setPackageReport] = useState<PackageReport | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);

      if (reportType === 'services') {
        const report = await generateServiceReport(startDate, endDate);
        setServiceReport(report);
      } else {
        const report = await generatePackageReport(startDate, endDate);
        setPackageReport(report);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (reportType === 'services' && serviceReport) {
      const csvContent = [
        ['Serviço', 'Agendamentos', 'Receita', 'Avaliação Média', 'Crescimento (%)'].join(','),
        ...serviceReport.topServices.map(service => [
          service.serviceName,
          service.bookings.toString(),
          service.revenue.toString(),
          service.averageRating.toString(),
          service.growthRate.toString(),
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-servicos-${period.start}-${period.end}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderServiceReport = () => {
    if (!serviceReport) return null;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Receita Total</p>
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(serviceReport.revenueAnalysis.totalRevenue)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total de Agendamentos</p>
                <p className="text-3xl font-bold text-slate-900">{serviceReport.revenueAnalysis.totalBookings}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Ticket Médio</p>
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(serviceReport.revenueAnalysis.averageTicket)}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-slate-900">{serviceReport.revenueAnalysis.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Serviços Mais Vendidos</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Posição</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Serviço</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Agendamentos</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Receita</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Avaliação</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Crescimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {serviceReport.topServices.map((service, index) => (
                  <tr key={service.serviceId} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-slate-400' :
                        index === 2 ? 'bg-orange-600' : 'bg-slate-300'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{service.serviceName}</td>
                    <td className="py-3 px-4 text-slate-600">{service.bookings}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(service.revenue)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{service.averageRating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center space-x-1 ${
                        service.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {service.growthRate > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">{service.growthRate > 0 ? '+' : ''}{service.growthRate.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance por Categoria</h3>
            <div className="space-y-4">
              {serviceReport.categoryPerformance.map((category) => (
                <div key={category.category} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900 capitalize">{category.category}</h4>
                    <span className="text-sm font-medium text-amber-600">{category.marketShare}% do mercado</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Agendamentos</p>
                      <p className="font-semibold text-slate-900">{category.totalBookings}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Receita</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(category.totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Preço Médio</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(category.averagePrice)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Tendências Sazonais</h3>
            <div className="space-y-3">
              {serviceReport.trends.seasonalTrends.map((trend) => (
                <div key={trend.month} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-900">{trend.month}</span>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(trend.revenue)}</p>
                    <p className="text-sm text-slate-600">{trend.bookings} agendamentos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Análise de Tendências</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">Maior Crescimento</h4>
              </div>
              <p className="text-green-800 font-semibold">{serviceReport.trends.mostGrowingService}</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h4 className="font-medium text-red-900">Maior Declínio</h4>
              </div>
              <p className="text-red-800 font-semibold">{serviceReport.trends.mostDecliningService}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPackageReport = () => {
    if (!packageReport) return null;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Desconto Médio</p>
                <p className="text-3xl font-bold text-slate-900">{packageReport.discountAnalysis.averageDiscount.toFixed(1)}%</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <TrendingDown className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Economia Oferecida</p>
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(packageReport.discountAnalysis.totalSavingsOffered)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Taxa de Uso</p>
                <p className="text-3xl font-bold text-slate-900">{packageReport.usagePatterns.averageUsageRate.toFixed(1)}%</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Satisfação</p>
                <p className="text-3xl font-bold text-slate-900">{packageReport.discountAnalysis.customerSatisfaction.toFixed(1)}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Packages */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pacotes Mais Vendidos</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Posição</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Pacote</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Vendas</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Receita</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Conversão</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Avaliação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {packageReport.topPackages.map((pkg, index) => (
                  <tr key={pkg.packageId} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-slate-400' :
                        index === 2 ? 'bg-orange-600' : 'bg-slate-300'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{pkg.packageName}</td>
                    <td className="py-3 px-4 text-slate-600">{pkg.sales}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(pkg.revenue)}</td>
                    <td className="py-3 px-4 text-slate-600">{pkg.conversionRate.toFixed(1)}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{pkg.averageRating.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Patterns */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Padrões de Uso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Pacote Mais Usado</h4>
                <p className="text-green-800 font-semibold">{packageReport.usagePatterns.mostUsedPackage}</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Pacote Menos Usado</h4>
                <p className="text-red-800 font-semibold">{packageReport.usagePatterns.leastUsedPackage}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2">Taxa de Expiração</h4>
                <p className="text-amber-800 font-semibold">{packageReport.usagePatterns.expirationRate.toFixed(1)}%</p>
                <p className="text-amber-700 text-sm mt-1">Pacotes que expiraram sem uso</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Impacto na Receita</h4>
                <p className="text-blue-800 font-semibold">{packageReport.discountAnalysis.revenueImpact.toFixed(1)}%</p>
                <p className="text-blue-700 text-sm mt-1">Aumento na receita com pacotes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Relatórios de Serviços</h1>
        {(serviceReport || packageReport) && (
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="services">Serviços</option>
              <option value="packages">Pacotes</option>
            </select>
          </div>

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

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Filter className="w-4 h-4 mr-2" />
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {reportType === 'services' && renderServiceReport()}
      {reportType === 'packages' && renderPackageReport()}

      {!serviceReport && !packageReport && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Selecione o período e clique em "Gerar Relatório" para visualizar os dados</p>
        </div>
      )}
    </div>
  );
}