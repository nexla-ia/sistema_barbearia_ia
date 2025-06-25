import React, { useState } from 'react';
import { Calendar, Clock, Filter, Users, ArrowLeft, ArrowRight } from 'lucide-react';

interface HeatmapAnalysisProps {
  dateRange: { start: string; end: string };
}

export function HeatmapAnalysis({ dateRange }: HeatmapAnalysisProps) {
  const [selectedView, setSelectedView] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState<number>(1); // 0 = Sunday, 1 = Monday, etc.
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all');

  // Mock data for professionals
  const professionals = [
    { id: 'all', name: 'Todos os Profissionais' },
    { id: 'p1', name: 'João Silva' },
    { id: 'p2', name: 'Pedro Santos' },
    { id: 'p3', name: 'Carlos Lima' },
    { id: 'p4', name: 'André Costa' },
    { id: 'p5', name: 'Marcos Oliveira' },
  ];

  // Mock data for heatmap
  const generateHeatmapData = () => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const timeSlots = [];
    
    // Generate time slots from 8:00 to 20:00 with 30-minute intervals
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }

    const heatmapData = days.map((day, dayIndex) => {
      return {
        day,
        dayIndex,
        slots: timeSlots.map(time => {
          // Generate random occupancy data
          // Higher occupancy during lunch hours and after work hours
          const hour = parseInt(time.split(':')[0]);
          const baseOccupancy = Math.random() * 0.4 + 0.3; // 30-70% base occupancy
          
          let multiplier = 1;
          if (hour >= 12 && hour <= 13) multiplier = 1.3; // Lunch hours
          if (hour >= 17 && hour <= 19) multiplier = 1.4; // After work hours
          if (dayIndex === 0 || dayIndex === 6) multiplier *= 0.8; // Weekends are less busy in mornings
          
          // Saturday is busier
          if (dayIndex === 6) multiplier *= 1.2;
          
          // Sunday is less busy
          if (dayIndex === 0) multiplier *= 0.6;
          
          const occupancy = Math.min(baseOccupancy * multiplier, 1);
          
          return {
            time,
            occupancy,
            appointments: Math.floor(occupancy * 5), // Max 5 appointments per slot
          };
        }),
      };
    });

    return heatmapData;
  };

  const heatmapData = generateHeatmapData();

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 0.8) return 'bg-red-500';
    if (occupancy >= 0.6) return 'bg-orange-500';
    if (occupancy >= 0.4) return 'bg-yellow-500';
    if (occupancy >= 0.2) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getOccupancyLabel = (occupancy: number) => {
    if (occupancy >= 0.8) return 'Muito Alto';
    if (occupancy >= 0.6) return 'Alto';
    if (occupancy >= 0.4) return 'Médio';
    if (occupancy >= 0.2) return 'Baixo';
    return 'Muito Baixo';
  };

  const getDayName = (index: number) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[index];
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedDay(prev => (prev === 0 ? 6 : prev - 1));
    } else {
      setSelectedDay(prev => (prev === 6 ? 0 : prev + 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('week')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedView === 'week'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setSelectedView('day')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedView === 'day'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dia
              </button>
            </div>

            {selectedView === 'day' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateDay('prev')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-slate-900">{getDayName(selectedDay)}</span>
                <button
                  onClick={() => navigateDay('next')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-500" />
              <select
                value={selectedProfessional}
                onChange={(e) => setSelectedProfessional(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              >
                {professionals.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Legenda do Mapa de Calor</h3>
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-slate-600">Muito Alto (80-100%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-slate-600">Alto (60-80%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-slate-600">Médio (40-60%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-slate-600">Baixo (20-40%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-slate-600">Muito Baixo (0-20%)</span>
          </div>
        </div>
      </div>

      {/* Weekly Heatmap */}
      {selectedView === 'week' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Mapa de Calor Semanal</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Horário</th>
                  {heatmapData.map(day => (
                    <th key={day.day} className="px-4 py-2 text-center font-medium text-slate-600">{day.day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData[0].slots.map((slot, slotIndex) => (
                  <tr key={slot.time} className="border-t border-slate-200">
                    <td className="px-4 py-2 text-sm font-medium text-slate-900">{slot.time}</td>
                    {heatmapData.map(day => {
                      const currentSlot = day.slots[slotIndex];
                      return (
                        <td key={`${day.day}-${slot.time}`} className="px-4 py-2">
                          <div className="flex flex-col items-center">
                            <div 
                              className={`w-full h-8 ${getOccupancyColor(currentSlot.occupancy)} rounded transition-opacity hover:opacity-80`}
                              title={`${getOccupancyLabel(currentSlot.occupancy)} - ${Math.round(currentSlot.occupancy * 100)}% de ocupação`}
                            ></div>
                            <span className="text-xs text-slate-600 mt-1">
                              {currentSlot.appointments} agend.
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Daily Heatmap */}
      {selectedView === 'day' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Mapa de Calor - {getDayName(selectedDay)}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heatmap Visualization */}
            <div>
              <div className="space-y-2">
                {heatmapData[selectedDay].slots.map(slot => (
                  <div key={slot.time} className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-slate-900 w-12">{slot.time}</span>
                    <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                      <div 
                        className={`h-full ${getOccupancyColor(slot.occupancy)} transition-all duration-300`}
                        style={{ width: `${slot.occupancy * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 w-20">
                      {Math.round(slot.occupancy * 100)}% ({slot.appointments})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Day Analysis */}
            <div className="space-y-6">
              {/* Peak Hours */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Horários de Pico</h4>
                <div className="space-y-2">
                  {heatmapData[selectedDay].slots
                    .filter(slot => slot.occupancy >= 0.7)
                    .sort((a, b) => b.occupancy - a.occupancy)
                    .slice(0, 3)
                    .map(slot => (
                      <div key={slot.time} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-slate-900">{slot.time}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-red-600">{Math.round(slot.occupancy * 100)}%</span>
                          <span className="text-sm text-slate-600 ml-2">({slot.appointments} agendamentos)</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Low Occupancy Hours */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Horários de Baixa Ocupação</h4>
                <div className="space-y-2">
                  {heatmapData[selectedDay].slots
                    .filter(slot => slot.occupancy <= 0.3)
                    .sort((a, b) => a.occupancy - b.occupancy)
                    .slice(0, 3)
                    .map(slot => (
                      <div key={slot.time} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-slate-900">{slot.time}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-blue-600">{Math.round(slot.occupancy * 100)}%</span>
                          <span className="text-sm text-slate-600 ml-2">({slot.appointments} agendamentos)</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Day Summary */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Resumo do Dia</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Ocupação Média</p>
                    <p className="text-xl font-bold text-slate-900">
                      {Math.round(
                        heatmapData[selectedDay].slots.reduce((sum, slot) => sum + slot.occupancy, 0) / 
                        heatmapData[selectedDay].slots.length * 100
                      )}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total de Agendamentos</p>
                    <p className="text-xl font-bold text-slate-900">
                      {heatmapData[selectedDay].slots.reduce((sum, slot) => sum + slot.appointments, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Horário Mais Ocupado</p>
                    <p className="text-xl font-bold text-slate-900">
                      {heatmapData[selectedDay].slots.reduce(
                        (max, slot) => slot.occupancy > max.occupancy ? slot : max, 
                        { time: '', occupancy: 0 }
                      ).time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Horário Menos Ocupado</p>
                    <p className="text-xl font-bold text-slate-900">
                      {heatmapData[selectedDay].slots.reduce(
                        (min, slot) => slot.occupancy < min.occupancy ? slot : min, 
                        { time: '', occupancy: 1 }
                      ).time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recomendações Baseadas em Dados</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <h4 className="font-medium text-green-900 mb-1">Oportunidade de Promoção</h4>
            <p className="text-sm text-green-700">
              Considere oferecer descontos ou promoções especiais para os horários de baixa ocupação: 
              Segunda-feira das 14h às 16h e Quinta-feira das 9h às 11h.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <h4 className="font-medium text-blue-900 mb-1">Otimização de Agenda</h4>
            <p className="text-sm text-blue-700">
              Distribua os profissionais de forma mais eficiente, concentrando mais profissionais nos horários de pico: 
              Terça e Quinta das 18h às 20h e Sábado das 10h às 14h.
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
            <h4 className="font-medium text-amber-900 mb-1">Serviços Especiais</h4>
            <p className="text-sm text-amber-700">
              Ofereça serviços que demandam mais tempo nos horários de menor movimento, como tratamentos capilares 
              e pacotes completos nas Segundas e Quartas pela manhã.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}