import React, { useState } from 'react';
import { Clock, Calendar, Users, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface OccupancyMetricsProps {
  dateRange: { start: string; end: string };
  selectedProfessional: string;
}

export function OccupancyMetrics({ dateRange, selectedProfessional }: OccupancyMetricsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'occupancy' | 'idle' | 'cancellation'>('occupancy');

  // Mock data for occupancy metrics
  const occupancyData = {
    overall: {
      rate: 78.5,
      trend: 2.3,
      totalSlots: 1250,
      bookedSlots: 981,
      idleTime: 42, // hours
      idleTimeCost: 4200,
      cancellationRate: 8.2,
      noShowRate: 3.5,
      utilization: {
        morning: 72.3,
        afternoon: 85.1,
        evening: 92.8,
      },
    },
    byDay: [
      { day: 'Segunda', occupancy: 65.2, idle: 6.8, cancellation: 9.5 },
      { day: 'Terça', occupancy: 78.5, idle: 4.2, cancellation: 7.2 },
      { day: 'Quarta', occupancy: 72.8, idle: 5.4, cancellation: 8.1 },
      { day: 'Quinta', occupancy: 81.3, idle: 3.7, cancellation: 6.5 },
      { day: 'Sexta', occupancy: 89.7, idle: 2.1, cancellation: 5.8 },
      { day: 'Sábado', occupancy: 95.2, idle: 1.0, cancellation: 4.2 },
      { day: 'Domingo', occupancy: 45.8, idle: 10.8, cancellation: 12.5 },
    ],
    byProfessional: [
      { name: 'João Silva', occupancy: 85.2, idle: 3.0, cancellation: 6.8 },
      { name: 'Pedro Santos', occupancy: 82.5, idle: 3.5, cancellation: 7.2 },
      { name: 'Carlos Lima', occupancy: 75.8, idle: 4.8, cancellation: 8.5 },
      { name: 'André Costa', occupancy: 68.3, idle: 6.3, cancellation: 10.2 },
      { name: 'Marcos Oliveira', occupancy: 72.1, idle: 5.6, cancellation: 9.1 },
    ],
    cancellationReasons: [
      { reason: 'Cliente desmarcou', percentage: 65.2 },
      { reason: 'Profissional indisponível', percentage: 18.5 },
      { reason: 'Reagendamento', percentage: 12.3 },
      { reason: 'Outros', percentage: 4.0 },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getMetricColor = (value: number, metric: 'occupancy' | 'idle' | 'cancellation') => {
    if (metric === 'occupancy') {
      if (value >= 85) return 'text-green-600';
      if (value >= 70) return 'text-amber-600';
      return 'text-red-600';
    } else if (metric === 'idle' || metric === 'cancellation') {
      if (value <= 5) return 'text-green-600';
      if (value <= 10) return 'text-amber-600';
      return 'text-red-600';
    }
    return 'text-slate-900';
  };

  const getMetricBgColor = (value: number, metric: 'occupancy' | 'idle' | 'cancellation') => {
    if (metric === 'occupancy') {
      if (value >= 85) return 'bg-green-100';
      if (value >= 70) return 'bg-amber-100';
      return 'bg-red-100';
    } else if (metric === 'idle' || metric === 'cancellation') {
      if (value <= 5) return 'bg-green-100';
      if (value <= 10) return 'bg-amber-100';
      return 'bg-red-100';
    }
    return 'bg-slate-100';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Taxa de Ocupação</p>
              <p className="text-3xl font-bold text-slate-900">{occupancyData.overall.rate}%</p>
              <div className="flex items-center mt-2">
                {occupancyData.overall.trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  occupancyData.overall.trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {occupancyData.overall.trend > 0 ? '+' : ''}{occupancyData.overall.trend}%
                </span>
                <span className="text-slate-500 text-sm ml-1">vs mês anterior</span>
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
              <p className="text-sm font-medium text-slate-600 mb-1">Tempo Ocioso</p>
              <p className="text-3xl font-bold text-slate-900">{occupancyData.overall.idleTime}h</p>
              <p className="text-sm text-red-600 mt-1">
                Custo estimado: {formatCurrency(occupancyData.overall.idleTimeCost)}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Taxa de Cancelamento</p>
              <p className="text-3xl font-bold text-slate-900">{occupancyData.overall.cancellationRate}%</p>
              <p className="text-sm text-slate-600 mt-1">
                No-shows: {occupancyData.overall.noShowRate}%
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl">
              <X className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Análise por Métrica</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedMetric('occupancy')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedMetric === 'occupancy'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-medium text-center text-slate-900">Taxa de Ocupação</p>
            <p className="text-xs text-center text-slate-600 mt-1">Percentual de horários ocupados</p>
          </button>
          
          <button
            onClick={() => setSelectedMetric('idle')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedMetric === 'idle'
                ? 'border-red-500 bg-red-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mx-auto mb-2">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <p className="font-medium text-center text-slate-900">Tempo Ocioso</p>
            <p className="text-xs text-center text-slate-600 mt-1">Horas sem agendamentos</p>
          </button>
          
          <button
            onClick={() => setSelectedMetric('cancellation')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedMetric === 'cancellation'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mx-auto mb-2">
              <X className="w-5 h-5 text-amber-600" />
            </div>
            <p className="font-medium text-center text-slate-900">Taxa de Cancelamento</p>
            <p className="text-xs text-center text-slate-600 mt-1">Percentual de agendamentos cancelados</p>
          </button>
        </div>
      </div>

      {/* Analysis by Day */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Análise por Dia da Semana</h3>
        <div className="grid grid-cols-7 gap-4">
          {occupancyData.byDay.map((day) => (
            <div key={day.day} className="text-center">
              <p className="font-medium text-slate-900 mb-2">{day.day}</p>
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                getMetricBgColor(
                  selectedMetric === 'occupancy' ? day.occupancy :
                  selectedMetric === 'idle' ? day.idle : day.cancellation,
                  selectedMetric
                )
              }`}>
                <span className={`text-lg font-bold ${
                  getMetricColor(
                    selectedMetric === 'occupancy' ? day.occupancy :
                    selectedMetric === 'idle' ? day.idle : day.cancellation,
                    selectedMetric
                  )
                }`}>
                  {selectedMetric === 'occupancy' ? day.occupancy :
                   selectedMetric === 'idle' ? day.idle : day.cancellation}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis by Professional */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Análise por Profissional</h3>
        <div className="space-y-4">
          {occupancyData.byProfessional.map((professional) => (
            <div key={professional.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-600 font-medium">
                    {professional.name.charAt(0)}
                  </span>
                </div>
                <span className="font-medium text-slate-900">{professional.name}</span>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <p className="text-xs text-slate-600">Ocupação</p>
                  <p className={`font-semibold ${getMetricColor(professional.occupancy, 'occupancy')}`}>
                    {professional.occupancy}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Tempo Ocioso</p>
                  <p className={`font-semibold ${getMetricColor(professional.idle, 'idle')}`}>
                    {professional.idle}h
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Cancelamentos</p>
                  <p className={`font-semibold ${getMetricColor(professional.cancellation, 'cancellation')}`}>
                    {professional.cancellation}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribuição por Período</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mx-auto mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Manhã (8h-12h)</p>
            <p className="text-2xl font-bold text-slate-900">{occupancyData.overall.utilization.morning}%</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  occupancyData.overall.utilization.morning >= 85 ? 'bg-green-500' :
                  occupancyData.overall.utilization.morning >= 70 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${occupancyData.overall.utilization.morning}%` }}
              />
            </div>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Tarde (12h-18h)</p>
            <p className="text-2xl font-bold text-slate-900">{occupancyData.overall.utilization.afternoon}%</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  occupancyData.overall.utilization.afternoon >= 85 ? 'bg-green-500' :
                  occupancyData.overall.utilization.afternoon >= 70 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${occupancyData.overall.utilization.afternoon}%` }}
              />
            </div>
          </div>
          
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Noite (18h-22h)</p>
            <p className="text-2xl font-bold text-slate-900">{occupancyData.overall.utilization.evening}%</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  occupancyData.overall.utilization.evening >= 85 ? 'bg-green-500' :
                  occupancyData.overall.utilization.evening >= 70 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${occupancyData.overall.utilization.evening}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Analysis */}
      {selectedMetric === 'cancellation' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Análise de Cancelamentos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cancellation Reasons */}
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Motivos de Cancelamento</h4>
              <div className="space-y-3">
                {occupancyData.cancellationReasons.map((reason) => (
                  <div key={reason.reason} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{reason.reason}</span>
                      <span className="text-sm font-medium text-slate-900">{reason.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${reason.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Recomendações</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                  <p className="text-sm text-green-800">
                    Implemente um sistema de confirmação automática 24h antes do agendamento para reduzir no-shows.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <p className="text-sm text-blue-800">
                    Considere uma política de cancelamento com pelo menos 4h de antecedência para permitir reagendamentos.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                  <p className="text-sm text-amber-800">
                    Ofereça incentivos para clientes que mantêm seus agendamentos, como pontos extras no programa de fidelidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Sugestões de Otimização</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-900 mb-1">Ajuste de Escala de Profissionais</h4>
              <p className="text-sm text-green-700">
                Aumente o número de profissionais disponíveis nos horários de pico (Sexta 18h-20h e Sábado 10h-14h) 
                e reduza nos períodos de baixa demanda (Segunda e Quarta 14h-16h).
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Promoções Estratégicas</h4>
              <p className="text-sm text-blue-700">
                Crie promoções específicas para os dias e horários com menor ocupação, como descontos de 15% 
                para agendamentos nas Segundas e Quartas à tarde.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-amber-50 rounded-lg">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Redução de Tempo Ocioso</h4>
              <p className="text-sm text-amber-700">
                Implemente um sistema de agendamento mais eficiente que minimize os intervalos entre atendimentos, 
                reduzindo o tempo ocioso em até 35%.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-purple-900 mb-1">Política de Cancelamento</h4>
              <p className="text-sm text-purple-700">
                Revise a política de cancelamento para reduzir a taxa atual de 8.2%. Considere implementar uma 
                taxa simbólica para cancelamentos com menos de 4 horas de antecedência.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}