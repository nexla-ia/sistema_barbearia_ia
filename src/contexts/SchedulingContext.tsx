import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppointmentBooking, Barber, Service, Client, BarberAvailability } from '../types/scheduling';
import { addDays, format, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';

interface SchedulingState {
  appointments: AppointmentBooking[];
  barbers: Barber[];
  services: Service[];
  clients: Client[];
  selectedDate: Date;
  viewMode: 'day' | 'week' | 'month';
  loading: boolean;
  error: string | null;
}

type SchedulingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_APPOINTMENTS'; payload: AppointmentBooking[] }
  | { type: 'ADD_APPOINTMENT'; payload: AppointmentBooking }
  | { type: 'UPDATE_APPOINTMENT'; payload: AppointmentBooking }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'SET_BARBERS'; payload: Barber[] }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'SET_VIEW_MODE'; payload: 'day' | 'week' | 'month' };

const initialState: SchedulingState = {
  appointments: [],
  barbers: [],
  services: [],
  clients: [],
  selectedDate: new Date(),
  viewMode: 'day',
  loading: false,
  error: null,
};

function schedulingReducer(state: SchedulingState, action: SchedulingAction): SchedulingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(apt =>
          apt.id === action.payload.id ? action.payload : apt
        ),
      };
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(apt => apt.id !== action.payload),
      };
    case 'SET_BARBERS':
      return { ...state, barbers: action.payload };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    default:
      return state;
  }
}

const SchedulingContext = createContext<{
  state: SchedulingState;
  dispatch: React.Dispatch<SchedulingAction>;
  getAvailableSlots: (barberId: string, date: Date) => string[];
  getBarberAvailability: (barberId: string, date: Date) => BarberAvailability;
  bookAppointment: (appointment: Omit<AppointmentBooking, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  rescheduleAppointment: (appointmentId: string, newDate: string, newStartTime: string) => Promise<void>;
} | null>(null);

export function SchedulingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(schedulingReducer, initialState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock data - in production, this would come from your API
      const mockBarbers: Barber[] = [
        {
          id: 'b1',
          name: 'João Silva',
          email: 'joao@barbearia.com',
          phone: '11988887777',
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
          specialties: ['Corte tradicional', 'Barba', 'Bigode'],
          rating: 4.8,
          workingHours: [
            { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isWorking: true },
            { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isWorking: true },
            { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isWorking: true },
            { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isWorking: true },
            { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isWorking: true },
            { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isWorking: true },
            { dayOfWeek: 0, startTime: '09:00', endTime: '15:00', isWorking: false },
          ],
          isActive: true,
          commissionRate: 0.6,
        },
        {
          id: 'b2',
          name: 'Pedro Santos',
          email: 'pedro@barbearia.com',
          phone: '11977776666',
          avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
          specialties: ['Corte moderno', 'Fade', 'Sobrancelha'],
          rating: 4.6,
          workingHours: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '19:00', isWorking: true },
            { dayOfWeek: 2, startTime: '09:00', endTime: '19:00', isWorking: true },
            { dayOfWeek: 3, startTime: '09:00', endTime: '19:00', isWorking: true },
            { dayOfWeek: 4, startTime: '09:00', endTime: '19:00', isWorking: true },
            { dayOfWeek: 5, startTime: '09:00', endTime: '19:00', isWorking: true },
            { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isWorking: true },
            { dayOfWeek: 0, startTime: '09:00', endTime: '15:00', isWorking: false },
          ],
          isActive: true,
          commissionRate: 0.5,
        },
      ];

      const mockServices: Service[] = [
        {
          id: 's1',
          name: 'Corte de Cabelo',
          description: 'Corte tradicional ou moderno personalizado',
          duration: 30,
          price: 35,
          category: 'Cabelo',
          isActive: true,
          image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=300',
        },
        {
          id: 's2',
          name: 'Barba Completa',
          description: 'Aparar, modelar e finalizar barba',
          duration: 25,
          price: 25,
          category: 'Barba',
          isActive: true,
          image: 'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=300',
        },
        {
          id: 's3',
          name: 'Corte + Barba',
          description: 'Pacote completo com corte e barba',
          duration: 50,
          price: 55,
          category: 'Combo',
          isActive: true,
          image: 'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=300',
        },
        {
          id: 's4',
          name: 'Sobrancelha',
          description: 'Design e modelagem de sobrancelha',
          duration: 15,
          price: 15,
          category: 'Estética',
          isActive: true,
          image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=300',
        },
        {
          id: 's5',
          name: 'Lavagem + Hidratação',
          description: 'Lavagem completa com produtos premium',
          duration: 20,
          price: 20,
          category: 'Tratamento',
          isActive: true,
          image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=300',
        },
      ];

      const mockClients: Client[] = [
        {
          id: 'c1',
          name: 'Carlos Oliveira',
          email: 'carlos@email.com',
          phone: '11955554444',
          preferences: {
            preferredBarber: 'b1',
            preferredServices: ['s1', 's2'],
            notes: 'Prefere corte baixo nas laterais',
          },
          loyaltyPoints: 150,
          totalSpent: 280,
          lastVisit: new Date('2024-01-10'),
          createdAt: new Date('2023-06-15'),
        },
      ];

      const mockAppointments: AppointmentBooking[] = [
        {
          id: 'a1',
          clientId: 'c1',
          clientName: 'Carlos Oliveira',
          clientPhone: '11955554444',
          clientEmail: 'carlos@email.com',
          barberId: 'b1',
          barberName: 'João Silva',
          serviceIds: ['s1', 's2'],
          services: mockServices.filter(s => ['s1', 's2'].includes(s.id)),
          date: format(new Date(), 'yyyy-MM-dd'),
          startTime: '10:00',
          endTime: '10:55',
          totalDuration: 55,
          totalPrice: 60,
          status: 'confirmed',
          reminderSent: false,
          confirmationSent: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      dispatch({ type: 'SET_BARBERS', payload: mockBarbers });
      dispatch({ type: 'SET_SERVICES', payload: mockServices });
      dispatch({ type: 'SET_CLIENTS', payload: mockClients });
      dispatch({ type: 'SET_APPOINTMENTS', payload: mockAppointments });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getAvailableSlots = (barberId: string, date: Date): string[] => {
    const barber = state.barbers.find(b => b.id === barberId);
    if (!barber) return [];

    const dayOfWeek = date.getDay();
    const workingHours = barber.workingHours.find(wh => wh.dayOfWeek === dayOfWeek);
    
    if (!workingHours || !workingHours.isWorking) return [];

    const slots: string[] = [];
    const startHour = parseInt(workingHours.startTime.split(':')[0]);
    const startMinute = parseInt(workingHours.startTime.split(':')[1]);
    const endHour = parseInt(workingHours.endTime.split(':')[0]);
    const endMinute = parseInt(workingHours.endTime.split(':')[1]);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    // Generate 30-minute slots
    for (let time = startTime; time < endTime; time += 30) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Check if slot is available (not booked)
      const dateString = format(date, 'yyyy-MM-dd');
      const isBooked = state.appointments.some(apt => 
        apt.barberId === barberId && 
        apt.date === dateString && 
        apt.startTime <= timeString && 
        apt.endTime > timeString &&
        apt.status !== 'cancelled'
      );

      if (!isBooked) {
        slots.push(timeString);
      }
    }

    return slots;
  };

  const getBarberAvailability = (barberId: string, date: Date): BarberAvailability => {
    const barber = state.barbers.find(b => b.id === barberId);
    const dateString = format(date, 'yyyy-MM-dd');
    
    if (!barber) {
      return {
        barberId,
        date: dateString,
        workingHours: { startTime: '09:00', endTime: '18:00' },
        blockedSlots: [],
        appointments: [],
      };
    }

    const dayOfWeek = date.getDay();
    const workingHours = barber.workingHours.find(wh => wh.dayOfWeek === dayOfWeek);
    const appointments = state.appointments.filter(apt => 
      apt.barberId === barberId && apt.date === dateString
    );

    return {
      barberId,
      date: dateString,
      workingHours: workingHours ? {
        startTime: workingHours.startTime,
        endTime: workingHours.endTime,
      } : { startTime: '09:00', endTime: '18:00' },
      blockedSlots: [],
      appointments,
    };
  };

  const bookAppointment = async (appointmentData: Omit<AppointmentBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      const newAppointment: AppointmentBooking = {
        ...appointmentData,
        id: `apt_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
      
      // In production, send confirmation notifications here
      console.log('Appointment booked:', newAppointment);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to book appointment' });
      throw error;
    }
  };

  const cancelAppointment = async (appointmentId: string): Promise<void> => {
    try {
      const appointment = state.appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        const updatedAppointment = {
          ...appointment,
          status: 'cancelled' as const,
          updatedAt: new Date(),
        };
        dispatch({ type: 'UPDATE_APPOINTMENT', payload: updatedAppointment });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to cancel appointment' });
      throw error;
    }
  };

  const rescheduleAppointment = async (appointmentId: string, newDate: string, newStartTime: string): Promise<void> => {
    try {
      const appointment = state.appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        const startTime = newStartTime;
        const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
        const endMinutes = startMinutes + appointment.totalDuration;
        const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

        const updatedAppointment = {
          ...appointment,
          date: newDate,
          startTime,
          endTime,
          updatedAt: new Date(),
        };
        dispatch({ type: 'UPDATE_APPOINTMENT', payload: updatedAppointment });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reschedule appointment' });
      throw error;
    }
  };

  return (
    <SchedulingContext.Provider value={{
      state,
      dispatch,
      getAvailableSlots,
      getBarberAvailability,
      bookAppointment,
      cancelAppointment,
      rescheduleAppointment,
    }}>
      {children}
    </SchedulingContext.Provider>
  );
}

export function useScheduling() {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
}