import React, { useState } from 'react';
import { Calendar, Clock, User, Star, ArrowRight, Check } from 'lucide-react';
import { useScheduling } from '../../contexts/SchedulingContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, addDays, startOfWeek } from 'date-fns';
import { Service, Barber } from '../../types/scheduling';

interface BookingStep {
  step: number;
  title: string;
  completed: boolean;
}

export function ClientBooking() {
  const { state, getAvailableSlots, bookAppointment } = useScheduling();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientInfo, setClientInfo] = useState({
    name: user?.name || 'Cliente Exemplo',
    email: user?.email || 'cliente@exemplo.com',
    phone: '11999999999',
    notes: '',
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const steps: BookingStep[] = [
    { step: 1, title: 'Serviços', completed: selectedServices.length > 0 },
    { step: 2, title: 'Profissional', completed: selectedBarber !== null },
    { step: 3, title: 'Data e Hora', completed: selectedDate && selectedTime !== '' },
    { step: 4, title: 'Confirmação', completed: true },
  ];

  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

  const handleServiceToggle = (service: Service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setSelectedTime(''); // Reset time when barber changes
  };

  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  const availableSlots = selectedBarber ? getAvailableSlots(selectedBarber.id, selectedDate) : [];

  const handleBooking = async () => {
    if (!selectedBarber || selectedServices.length === 0 || !selectedTime) return;

    setIsBooking(true);
    try {
      const startTime = selectedTime;
      const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
      const endMinutes = startMinutes + totalDuration;
      const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

      await bookAppointment({
        clientId: 'temp_client',
        clientName: clientInfo.name,
        clientPhone: clientInfo.phone,
        clientEmail: clientInfo.email,
        barberId: selectedBarber.id,
        barberName: selectedBarber.name,
        serviceIds: selectedServices.map(s => s.id),
        services: selectedServices,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime,
        endTime,
        totalDuration,
        totalPrice,
        status: 'pending',
        notes: clientInfo.notes,
        reminderSent: false,
        confirmationSent: false,
      });

      setBookingComplete(true);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Agendamento Confirmado!</h2>
          <p className="text-slate-600 mb-6">
            Seu agendamento foi realizado com sucesso. Você receberá uma confirmação por email e WhatsApp.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-slate-900 mb-2">Detalhes do Agendamento:</h3>
            <p className="text-sm text-slate-600 mb-1">
              <strong>Data:</strong> {format(selectedDate, 'dd/MM/yyyy')}
            </p>
            <p className="text-sm text-slate-600 mb-1">
              <strong>Horário:</strong> {selectedTime}
            </p>
            <p className="text-sm text-slate-600 mb-1">
              <strong>Profissional:</strong> {selectedBarber?.name}
            </p>
            <p className="text-sm text-slate-600 mb-1">
              <strong>Serviços:</strong> {selectedServices.map(s => s.name).join(', ')}
            </p>
            <p className="text-sm text-slate-600">
              <strong>Total:</strong> {formatCurrency(totalPrice)}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Fazer Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Agendar Horário</h1>
          <p className="text-slate-600">Escolha seus serviços e horário preferido</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStep === step.step 
                  ? 'bg-amber-500 text-white' 
                  : step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }
              `}>
                {step.completed ? <Check className="w-5 h-5" /> : step.step}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === step.step ? 'text-amber-600' : 'text-slate-600'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-400 mx-4" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* Step 1: Services */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Escolha seus serviços</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.services.filter(s => s.isActive).map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceToggle(service)}
                        className={`
                          border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                          ${selectedServices.find(s => s.id === service.id)
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-slate-200 hover:border-slate-300'
                          }
                        `}
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{service.name}</h3>
                            <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {service.duration}min
                              </span>
                              <span className="font-semibold text-amber-600">
                                {formatCurrency(service.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Barber Selection */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Escolha seu profissional</h2>
                  <div className="space-y-4">
                    {state.barbers.filter(b => b.isActive).map((barber) => (
                      <div
                        key={barber.id}
                        onClick={() => handleBarberSelect(barber)}
                        className={`
                          border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                          ${selectedBarber?.id === barber.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-slate-200 hover:border-slate-300'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={barber.avatar}
                            alt={barber.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{barber.name}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-slate-600">{barber.rating}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {barber.specialties.map((specialty) => (
                                <span
                                  key={specialty}
                                  className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Data e Hora */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Escolha data e horário</h2>
                  
                  {/* Date Selection */}
                  <div className="mb-6">
                    <h3 className="font-medium text-slate-900 mb-3">Selecione a data</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {getNextSevenDays().map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedTime(''); // Reset time when date changes
                          }}
                          className={`
                            p-3 rounded-lg text-center transition-all duration-200
                            ${format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }
                          `}
                        >
                          <div className="text-xs font-medium">
                            {format(date, 'EEE')}
                          </div>
                          <div className="text-lg font-bold">
                            {format(date, 'd')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Horários disponíveis</h3>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {availableSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`
                              p-3 rounded-lg text-sm font-medium transition-all duration-200
                              ${selectedTime === time
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }
                            `}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-center py-8">
                        Nenhum horário disponível para esta data
                      </p>
                    )}
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Alguma preferência ou observação especial?"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Confirmar agendamento</h2>
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-3">Resumo do agendamento</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Data:</span>
                          <span className="font-medium">{format(selectedDate, 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Horário:</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Profissional:</span>
                          <span className="font-medium">{selectedBarber?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Serviços:</span>
                          <span className="font-medium">{selectedServices.map(s => s.name).join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Duração:</span>
                          <span className="font-medium">{totalDuration} minutos</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2">
                          <span className="font-semibold text-slate-900">Total:</span>
                          <span className="font-bold text-amber-600">{formatCurrency(totalPrice)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={isBooking}
                      className="w-full bg-amber-500 text-white py-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBooking ? 'Confirmando...' : 'Confirmar Agendamento'}
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                  disabled={!steps[currentStep - 1].completed || currentStep === 4}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h3 className="font-semibold text-slate-900 mb-4">Resumo</h3>
              
              {selectedServices.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Serviços</h4>
                  <div className="space-y-2">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex justify-between text-sm">
                        <span className="text-slate-600">{service.name}</span>
                        <span className="font-medium">{formatCurrency(service.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedBarber && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Profissional</h4>
                  <div className="flex items-center space-x-2">
                    <img
                      src={selectedBarber.avatar}
                      alt={selectedBarber.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-slate-900">{selectedBarber.name}</span>
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Data e Hora</h4>
                  <div className="text-sm text-slate-900">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>{format(selectedDate, 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedServices.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Duração total:</span>
                    <span className="text-sm font-medium">{totalDuration} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Total:</span>
                    <span className="font-bold text-amber-600 text-lg">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}