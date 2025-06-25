import React, { useState } from 'react';
import { BarChart3, PieChart, LineChart, Calendar, Filter, Download, Settings } from 'lucide-react';

interface InteractiveDashboardProps {
  dateRange: { start: string; end: string };
}

export function InteractiveDashboard({ dateRange }: InteractiveDashboardProps) {
  const [chartType, setChartType] = useState<'revenue' | 'services' | 'professionals'>('revenue');
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Mock data for charts
  const revenueData = [
    { period: 'Jan', value: 38500 },
    { period: 'Fev', value: 42300 },
    { period: 'Mar', value: 45680 },
    { period: 'Abr', value: 41200 },
    { period: 'Mai', value: 47800 },
    { period: 'Jun', value: 52100 },
  ];

  const servicesData = [
    { name: 'Corte + Barba', value: 285 },
    { name: 'Corte Tradicional', value: 420 },
    { name: 'Barba Completa', value: 180 },
    { name: 'Sobrancelha', value: 95 },
    { name: 'Corte Moderno', value: 150 },
  ];

  const professionalsData = [
    { name: 'João Silva', value: 18750 },
    { name: 'Pedro Santos', value: 16800 },
    { name: 'Carlos Lima', value: 12500 },
    { name: 'André Costa', value: 9800 },
    { name: 'Marcos Oliveira', value: 8500 },
  ];

  const renderBarChart = () => {
    const data = chartType === 'revenue' ? revenueData :
                 chartType === 'services' ? servicesData : professionalsData;
    
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="h-80 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div
              className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-80 ${
                chartType === 'revenue' ? 'bg-green-500' :
                chartType === 'services' ? 'bg-blue-500' : 'bg-purple-500'
              }`}
              style={{ height: `${(item.value / maxValue) * 250}px` }}
              title={`${item.name || item.period}: ${
                chartType === 'revenue' ? formatCurrency(item.value) : item.value
              }`}
            />
            <span className="text-xs text-slate-600 font-medium">{item.name || item.period}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = () => {
    const data = chartType === 'revenue' ? revenueData :
                 chartType === 'services' ? servicesData : professionalsData;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // This is a placeholder for a pie chart
    // In a real implementation, you would use a charting library
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full border-8 border-slate-200 relative">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            return (
              <div key={index} className="absolute inset-0">
                <div 
                  className={`absolute top-1/2 left-1/2 w-1 h-1 bg-white`}
                  style={{
                    transform: `rotate(${index * 72}deg) translateY(-32px)`,
                    width: '64px',
                    height: '64px',
                    marginLeft: '-32px',
                    marginTop: '-32px',
                    background: `conic-gradient(transparent ${index * 72}deg, ${
                      chartType === 'revenue' ? '#10B981' :
                      chartType === 'services' ? '#3B82F6' : '#8B5CF6'
                    } ${index * 72}deg ${index * 72 + percentage * 3.6}deg, transparent ${index * 72 + percentage * 3.6}deg)`,
                    borderRadius: '50%',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const data = chartType === 'revenue' ? revenueData :
                 chartType === 'services' ? servicesData : professionalsData;
    
    const maxValue = Math.max(...data.map(item => item.value));
    
    // This is a placeholder for a line chart
    // In a real implementation, you would use a charting library
    return (
      <div className="h-80 relative">
        <div className="absolute inset-0 flex items-end">
          {data.map((item, index) => {
            const height = (item.value / maxValue) * 250;
            const prevHeight = index > 0 ? (data[index - 1].value / maxValue) * 250 : height;
            
            return (
              <div key={index} className="flex-1 h-full flex flex-col justify-end items-center">
                {index > 0 && (
                  <div 
                    className={`absolute h-0.5 ${
                      chartType === 'revenue' ? 'bg-green-500' :
                      chartType === 'services' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                    style={{
                      width: `${100 / data.length}%`,
                      bottom: `${prevHeight}px`,
                      left: `${(index - 0.5) * (100 / data.length)}%`,
                      transform: `rotate(${Math.atan2(height - prevHeight, 100 / data.length)}rad)`,
                      transformOrigin: '0 50%',
                    }}
                  />
                )}
                <div
                  className={`w-3 h-3 rounded-full ${
                    chartType === 'revenue' ? 'bg-green-500' :
                    chartType === 'services' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}
                  style={{ marginBottom: `${height - 1.5}px` }}
                  title={`${item.name || item.period}: ${
                    chartType === 'revenue' ? formatCurrency(item.value) : item.value
                  }`}
                />
                <span className="text-xs text-slate-600 font-medium absolute bottom-0">{item.name || item.period}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h3 className="text-lg font-semibold text-slate-900">Dashboard Interativo</h3>
          <div className="flex flex-wrap items-center gap-4">
            {/* Chart Type Selector */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setChartType('revenue')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartType === 'revenue'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Faturamento
              </button>
              <button
                onClick={() => setChartType('services')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartType === 'services'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Serviços
              </button>
              <button
                onClick={() => setChartType('professionals')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartType === 'professionals'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Profissionais
              </button>
            </div>

            {/* Chart Style Selector */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTimeFrame('daily')}
                className={`p-2 rounded-lg transition-colors ${
                  timeFrame === 'daily' ? 'bg-slate-200' : 'hover:bg-slate-100'
                }`}
                title="Visualização Diária"
              >
                <BarChart3 className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={() => setTimeFrame('weekly')}
                className={`p-2 rounded-lg transition-colors ${
                  timeFrame === 'weekly' ? 'bg-slate-200' : 'hover:bg-slate-100'
                }`}
                title="Visualização Semanal"
              >
                <PieChart className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={() => setTimeFrame('monthly')}
                className={`p-2 rounded-lg transition-colors ${
                  timeFrame === 'monthly' ? 'bg-slate-200' : 'hover:bg-slate-100'
                }`}
                title="Visualização Mensal"
              >
                <LineChart className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-sm font-medium text-slate-700 mb-4 text-center">
            {chartType === 'revenue' ? 'Análise de Faturamento' : 
             chartType === 'services' ? 'Análise de Serviços' : 'Análise de Profissionais'} - 
            {timeFrame === 'daily' ? ' Visão Diária' : 
             timeFrame === 'weekly' ? ' Visão Semanal' : ' Visão Mensal'}
          </h4>
          {timeFrame === 'daily' && renderBarChart()}
          {timeFrame === 'weekly' && renderPieChart()}
          {timeFrame === 'monthly' && renderLineChart()}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm bg-white p-3 rounded-lg border border-slate-200">
          {chartType === 'revenue' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">Faturamento</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">Período: {timeFrame === 'daily' ? 'Diário' : timeFrame === 'weekly' ? 'Semanal' : 'Mensal'}</span>
              </div>
            </>
          )}
          
          {chartType === 'services' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600">Volume de Serviços</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">Top 5 Serviços</span>
              </div>
            </>
          )}
          
          {chartType === 'professionals' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-600">Faturamento por Profissional</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">Top 5 Profissionais</span>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-200">
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtrar</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Exportar</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Personalizar</span>
          </button>
        </div>
      </div>
    </div>
  );
}