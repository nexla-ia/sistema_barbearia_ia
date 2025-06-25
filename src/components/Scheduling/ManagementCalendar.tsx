import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, User, Phone, Mail, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useScheduling } from '../../contexts/SchedulingContext';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { AppointmentBooking } from '../../types/scheduling';

type ViewMode = 'day' | 'week' | 'month';

export function ManagementCalendar() {
  const { state, dispatch, cancelAppointment, rescheduleAppointment } = useScheduling();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentBooking | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusColor = (status: AppointmentBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status: AppointmentBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      case 'no_show':
        return 'Não Compareceu';
      default:
        return status;
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const days = viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30;
      return addDays(prev, direction === 'next' ? days : -days);
    });
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return state.appointments.filter(apt => apt.date === dateString);
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const handleAppointmentClick = (appointment: AppointmentBooking) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentBooking['status']) => {
    const appointment = state.appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      const updatedAppointment = {
        ...appointment,
        status: newStatus,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: updatedAppointment });
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      await cancelAppointment(appointmentId);
      setShowAppointmentModal(false);
    }
  };

  const renderDayView = () => {
    const appointments = getAppointmentsForDate(selectedDate);
    const timeSlots = [];
    
    // Generate time slots from 8:00 to 20:00
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push(time);
      }
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {format(selectedDate, 'EEEE, dd \'de\' MMMM \'de\' yyyy')}
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
                Hoje
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

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Slots */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Horários</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {timeSlots.map((time) => {
                  const appointment = appointments.find(apt => apt.startTime === time);
                  return (
                    <div
                      key={time}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                        ${appointment 
                          ? 'bg-amber-50 border-amber-200 cursor-pointer hover:bg-amber-100' 
                          : 'bg-slate-50 border-slate-200'
                        }
                      `}
                      onClick={() => appointment && handleAppointmentClick(appointment)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-slate-900">{time}</span>
                        {appointment && (
                          <div>
                            <p className="font-medium text-slate-900">{appointment.clientName}</p>
                            <p className="text-sm text-slate-600">
                              {appointment.services.map(s => s.name).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                      {appointment && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Appointments Summary */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Resumo do Dia</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{appointments.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Confirmados</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {appointments.filter(apt => apt.status === 'confirmed').length}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">Receita Estimada</h4>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(appointments.reduce((sum, apt) => sum + apt.totalPrice, 0))}
                  </p>
                </div>

                {appointments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Próximos Agendamentos</h4>
                    <div className="space-y-2">
                      {appointments
                        .filter(apt => apt.status !== 'cancelled' && apt.status !== 'completed')
                        .slice(0, 3)
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            onClick={() => handleAppointmentClick(appointment)}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-slate-900">{appointment.startTime}</p>
                              <p className="text-sm text-slate-600">{appointment.clientName}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                              {getStatusLabel(appointment.status)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
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

        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const appointments = getAppointmentsForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div key={day.toISOString()} className="space-y-2">
                  <div className={`text-center p-2 rounded-lg ${isToday ? 'bg-amber-100 text-amber-900' : 'text-slate-600'}`}>
                    <div className="text-sm font-medium">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-lg font-bold">
                      {format(day, 'd')}
                    </div>
                  </div>
                  
                  <div className="space-y-1 min-h-[200px]">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={() => handleAppointmentClick(appointment)}
                        className="p-2 bg-amber-50 border border-amber-200 rounded text-xs cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        <div className="font-medium text-slate-900">{appointment.startTime}</div>
                        <div className="text-slate-600 truncate">{appointment.clientName}</div>
                        <div className="text-slate-500 truncate">
                          {appointment.services[0]?.name}
                          {appointment.services.length > 1 && ` +${appointment.services.length - 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Agenda</h1>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['day', 'week'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'day' ? 'Dia' : 'Semana'}
              </button>
            ))}
          </div>
          
          <button className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'week' && renderWeekView()}

      {/* Appointment Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Detalhes do Agendamento</h3>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Client Info */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Cliente</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-900">{selectedAppointment.clientName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">{selectedAppointment.clientPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">{selectedAppointment.clientEmail}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Agendamento</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">
                      {format(parseISO(selectedAppointment.date), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">
                      {selectedAppointment.startTime} - {selectedAppointment.endTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">{selectedAppointment.barberName}</span>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Serviços</h4>
                <div className="space-y-2">
                  {selectedAppointment.services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center">
                      <span className="text-slate-600">{service.name}</span>
                      <span className="font-medium">{formatCurrency(service.price)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-bold text-amber-600">
                      {formatCurrency(selectedAppointment.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Status</h4>
                <select
                  value={selectedAppointment.status}
                  onChange={(e) => handleStatusChange(selectedAppointment.id, e.target.value as AppointmentBooking['status'])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluído</option>
                  <option value="no_show">Não Compareceu</option>
                </select>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Observações</h4>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => handleCancelAppointment(selectedAppointment.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}