import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User, Edit, Trash2, Coffee, Plane, AlertTriangle } from 'lucide-react';
import { Professional, ScheduleEvent, VacationPeriod } from '../../types/professional';
import { useProfessional } from '../../contexts/ProfessionalContext';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

interface ProfessionalScheduleProps {
  professional: Professional;
}

export function ProfessionalSchedule({ professional }: ProfessionalScheduleProps) {
  const { state, dispatch, getProfessionalAvailability, requestVacation, reportAbsence } = useProfessional();
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  const [vacationForm, setVacationForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [absenceForm, setAbsenceForm] = useState({
    date: '',
    type: 'personal',
    reason: '',
  });

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const days = viewMode === 'week' ? 7 : 30;
      return addDays(prev, direction === 'next' ? days : -days);
    });
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return state.scheduleEvents.filter(event => 
      event.professionalId === professional.id && 
      format(event.startDate, 'yyyy-MM-dd') === dateString
    );
  };

  const getEventColor = (event: ScheduleEvent) => {
    switch (event.type) {
      case 'appointment':
        return event.status === 'confirmed' ? 'bg-green-100 border-green-300 text-green-800' :
               event.status === 'cancelled' ? 'bg-red-100 border-red-300 text-red-800' :
               'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'break':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'vacation':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'absence':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  const handleVacationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestVacation(
        professional.id,
        new Date(vacationForm.startDate),
        new Date(vacationForm.endDate),
        vacationForm.reason
      );
      setShowVacationModal(false);
      setVacationForm({ startDate: '', endDate: '', reason: '' });
    } catch (error) {
      console.error('Error requesting vacation:', error);
    }
  };

  const handleAbsenceReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reportAbsence(
        professional.id,
        new Date(absenceForm.date),
        absenceForm.type,
        absenceForm.reason
      );
      setShowAbsenceModal(false);
      setAbsenceForm({ date: '', type: 'personal', reason: '' });
    } catch (error) {
      console.error('Error reporting absence:', error);
    }
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const timeSlots = [];
    
    // Generate time slots from 8:00 to 20:00
    for (let hour = 8; hour <= 20; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Semana de {format(weekDays[0], 'dd/MM')} a {format(weekDays[6], 'dd/MM/yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Esta Semana
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header with days */}
            <div className="grid grid-cols-8 border-b border-slate-200">
              <div className="p-4 bg-slate-50 border-r border-slate-200">
                <span className="text-sm font-medium text-slate-600">Horário</span>
              </div>
              {weekDays.map((day) => {
                const isToday = isSameDay(day, new Date());
                const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day.getDay()];
                const workingDay = professional.workingHours.regularHours[dayOfWeek];
                
                return (
                  <div key={day.toISOString()} className="p-4 bg-slate-50 border-r border-slate-200 text-center">
                    <div className={`text-sm font-medium ${isToday ? 'text-amber-600' : 'text-slate-900'}`}>
                      {format(day, 'EEE')}
                    </div>
                    <div className={`text-lg font-bold ${isToday ? 'text-amber-600' : 'text-slate-900'}`}>
                      {format(day, 'd')}
                    </div>
                    {!workingDay?.isWorking && (
                      <div className="text-xs text-red-600 mt-1">Folga</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time slots */}
            <div className="max-h-96 overflow-y-auto">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b border-slate-100">
                  <div className="p-3 bg-slate-50 border-r border-slate-200 text-center">
                    <span className="text-sm font-medium text-slate-600">{time}</span>
                  </div>
                  {weekDays.map((day) => {
                    const events = getEventsForDate(day).filter(event => 
                      event.startTime <= time && event.endTime > time
                    );
                    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day.getDay()];
                    const workingDay = professional.workingHours.regularHours[dayOfWeek];
                    
                    return (
                      <div key={`${day.toISOString()}-${time}`} className="p-1 border-r border-slate-200 min-h-[60px] relative">
                        {workingDay?.isWorking && (
                          <>
                            {events.map((event) => (
                              <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className={`absolute inset-1 rounded p-1 border cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event)}`}
                              >
                                <div className="text-xs font-medium truncate">{event.title}</div>
                                {event.clientName && (
                                  <div className="text-xs truncate">{event.clientName}</div>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
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
        <h1 className="text-2xl font-bold text-slate-900">
          Agenda - {professional.fullName}
        </h1>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['week'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'week' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowVacationModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plane className="w-4 h-4 mr-2" />
              Solicitar Férias
            </button>
            <button
              onClick={() => setShowAbsenceModal(true)}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reportar Falta
            </button>
          </div>
        </div>
      </div>

      {/* Working Hours Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Horários de Trabalho</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {Object.entries(professional.workingHours.regularHours).map(([day, hours]) => {
            const dayNames = {
              monday: 'Segunda',
              tuesday: 'Terça',
              wednesday: 'Quarta',
              thursday: 'Quinta',
              friday: 'Sexta',
              saturday: 'Sábado',
              sunday: 'Domingo',
            };
            
            return (
              <div key={day} className="text-center">
                <div className="font-medium text-slate-900 mb-2">
                  {dayNames[day as keyof typeof dayNames]}
                </div>
                {hours.isWorking ? (
                  <div className="space-y-1">
                    <div className="text-sm text-slate-600">
                      {hours.startTime} - {hours.endTime}
                    </div>
                    {hours.breakStart && hours.breakEnd && (
                      <div className="text-xs text-slate-500">
                        Intervalo: {hours.breakStart} - {hours.breakEnd}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-red-600">Folga</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'week' && renderWeekView()}

      {/* Vacation Requests */}
      {professional.workingHours.vacations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Solicitações de Férias</h3>
          <div className="space-y-3">
            {professional.workingHours.vacations.map((vacation) => (
              <div key={vacation.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">
                    {format(vacation.startDate, 'dd/MM/yyyy')} - {format(vacation.endDate, 'dd/MM/yyyy')}
                  </p>
                  <p className="text-sm text-slate-600">{vacation.reason}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vacation.status === 'approved' ? 'bg-green-100 text-green-800' :
                  vacation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {vacation.status === 'approved' ? 'Aprovado' :
                   vacation.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vacation Request Modal */}
      {showVacationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Solicitar Férias</h3>
            <form onSubmit={handleVacationRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={vacationForm.startDate}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data de Fim
                </label>
                <input
                  type="date"
                  value={vacationForm.endDate}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Motivo
                </label>
                <textarea
                  value={vacationForm.reason}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descreva o motivo das férias"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVacationModal(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Solicitar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Absence Report Modal */}
      {showAbsenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Reportar Falta</h3>
            <form onSubmit={handleAbsenceReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data da Falta
                </label>
                <input
                  type="date"
                  value={absenceForm.date}
                  onChange={(e) => setAbsenceForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Falta
                </label>
                <select
                  value={absenceForm.type}
                  onChange={(e) => setAbsenceForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="sick">Doença</option>
                  <option value="personal">Pessoal</option>
                  <option value="emergency">Emergência</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Motivo
                </label>
                <textarea
                  value={absenceForm.reason}
                  onChange={(e) => setAbsenceForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descreva o motivo da falta"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAbsenceModal(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Reportar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}