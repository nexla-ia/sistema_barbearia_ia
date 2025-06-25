import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  Professional, 
  ProfessionalSearchFilters, 
  ScheduleEvent, 
  CommissionReport, 
  PerformanceReport,
  ProfessionalAvailability 
} from '../types/professional';

interface ProfessionalState {
  professionals: Professional[];
  selectedProfessional: Professional | null;
  scheduleEvents: ScheduleEvent[];
  commissionReports: CommissionReport[];
  performanceReports: PerformanceReport[];
  searchFilters: ProfessionalSearchFilters;
  loading: boolean;
  error: string | null;
}

type ProfessionalAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROFESSIONALS'; payload: Professional[] }
  | { type: 'ADD_PROFESSIONAL'; payload: Professional }
  | { type: 'UPDATE_PROFESSIONAL'; payload: Professional }
  | { type: 'DELETE_PROFESSIONAL'; payload: string }
  | { type: 'SET_SELECTED_PROFESSIONAL'; payload: Professional | null }
  | { type: 'SET_SCHEDULE_EVENTS'; payload: ScheduleEvent[] }
  | { type: 'ADD_SCHEDULE_EVENT'; payload: ScheduleEvent }
  | { type: 'UPDATE_SCHEDULE_EVENT'; payload: ScheduleEvent }
  | { type: 'DELETE_SCHEDULE_EVENT'; payload: string }
  | { type: 'SET_COMMISSION_REPORTS'; payload: CommissionReport[] }
  | { type: 'SET_PERFORMANCE_REPORTS'; payload: PerformanceReport[] }
  | { type: 'SET_SEARCH_FILTERS'; payload: ProfessionalSearchFilters };

const initialState: ProfessionalState = {
  professionals: [],
  selectedProfessional: null,
  scheduleEvents: [],
  commissionReports: [],
  performanceReports: [],
  searchFilters: {},
  loading: false,
  error: null,
};

function professionalReducer(state: ProfessionalState, action: ProfessionalAction): ProfessionalState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROFESSIONALS':
      return { ...state, professionals: action.payload };
    case 'ADD_PROFESSIONAL':
      return { ...state, professionals: [...state.professionals, action.payload] };
    case 'UPDATE_PROFESSIONAL':
      return {
        ...state,
        professionals: state.professionals.map(prof =>
          prof.id === action.payload.id ? action.payload : prof
        ),
        selectedProfessional: state.selectedProfessional?.id === action.payload.id ? action.payload : state.selectedProfessional,
      };
    case 'DELETE_PROFESSIONAL':
      return {
        ...state,
        professionals: state.professionals.filter(prof => prof.id !== action.payload),
        selectedProfessional: state.selectedProfessional?.id === action.payload ? null : state.selectedProfessional,
      };
    case 'SET_SELECTED_PROFESSIONAL':
      return { ...state, selectedProfessional: action.payload };
    case 'SET_SCHEDULE_EVENTS':
      return { ...state, scheduleEvents: action.payload };
    case 'ADD_SCHEDULE_EVENT':
      return { ...state, scheduleEvents: [...state.scheduleEvents, action.payload] };
    case 'UPDATE_SCHEDULE_EVENT':
      return {
        ...state,
        scheduleEvents: state.scheduleEvents.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_SCHEDULE_EVENT':
      return {
        ...state,
        scheduleEvents: state.scheduleEvents.filter(event => event.id !== action.payload),
      };
    case 'SET_COMMISSION_REPORTS':
      return { ...state, commissionReports: action.payload };
    case 'SET_PERFORMANCE_REPORTS':
      return { ...state, performanceReports: action.payload };
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchFilters: action.payload };
    default:
      return state;
  }
}

const ProfessionalContext = createContext<{
  state: ProfessionalState;
  dispatch: React.Dispatch<ProfessionalAction>;
  searchProfessionals: (filters: ProfessionalSearchFilters) => Professional[];
  getProfessionalAvailability: (professionalId: string, date: Date) => ProfessionalAvailability;
  generateCommissionReport: (professionalId: string, startDate: Date, endDate: Date) => Promise<CommissionReport>;
  generatePerformanceReport: (professionalId: string, startDate: Date, endDate: Date) => Promise<PerformanceReport>;
  updateSchedule: (professionalId: string, events: ScheduleEvent[]) => Promise<void>;
  requestVacation: (professionalId: string, startDate: Date, endDate: Date, reason: string) => Promise<void>;
  reportAbsence: (professionalId: string, date: Date, type: string, reason: string) => Promise<void>;
} | null>(null);

export function ProfessionalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(professionalReducer, initialState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock data - in production, this would come from your API
      const mockProfessionals: Professional[] = [
        {
          id: 'p1',
          fullName: 'João Silva Santos',
          cpf: '123.456.789-00',
          rg: '12.345.678-9',
          birthDate: new Date('1985-03-15'),
          address: {
            street: 'Rua dos Barbeiros',
            number: '123',
            complement: 'Sala 1',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
          },
          phone: '11987654321',
          email: 'joao.silva@barbearia.com',
          whatsapp: '11987654321',
          photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
          specialties: ['Corte Tradicional', 'Barba', 'Bigode', 'Sobrancelha'],
          services: [
            {
              serviceId: 's1',
              serviceName: 'Corte de Cabelo',
              commissionRate: 60,
              isActive: true,
              minimumPrice: 25,
              maximumPrice: 50,
            },
            {
              serviceId: 's2',
              serviceName: 'Barba Completa',
              commissionRate: 65,
              isActive: true,
              minimumPrice: 20,
              maximumPrice: 35,
            },
          ],
          workingHours: {
            regularHours: {
              monday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
              tuesday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
              wednesday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
              thursday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
              friday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
              saturday: { isWorking: true, startTime: '08:00', endTime: '16:00' },
              sunday: { isWorking: false, startTime: '', endTime: '' },
            },
            fixedDaysOff: [0], // Domingo
            vacations: [],
            absences: [],
            specialSchedules: [],
          },
          admissionDate: new Date('2023-01-15'),
          contractType: 'employee',
          status: 'active',
          documents: [
            {
              id: 'd1',
              type: 'certificate',
              name: 'Certificado de Barbeiro',
              description: 'Certificado profissional de barbeiro',
              url: '/documents/certificate-joao.pdf',
              expiresAt: new Date('2025-12-31'),
              uploadedAt: new Date('2023-01-15'),
              uploadedBy: 'admin',
            },
          ],
          metrics: {
            totalAppointments: 450,
            completedAppointments: 425,
            cancelledAppointments: 15,
            noShowAppointments: 10,
            totalRevenue: 18750,
            totalCommissions: 11250,
            averageTicket: 42,
            averageRating: 4.8,
            totalReviews: 380,
            recommendationRate: 95,
            punctualityRate: 98,
            rebookingRate: 75,
            periodStart: new Date('2024-01-01'),
            periodEnd: new Date('2024-12-31'),
            lastUpdated: new Date(),
          },
          settings: {
            notifications: {
              email: true,
              sms: true,
              whatsapp: true,
              push: true,
            },
            schedulePreferences: {
              allowOnlineBooking: true,
              requireConfirmation: false,
              maxAdvanceBookingDays: 30,
              minAdvanceBookingHours: 2,
              allowSameDayBooking: true,
            },
            systemAccess: {
              canViewOwnSchedule: true,
              canEditOwnSchedule: true,
              canViewOwnMetrics: true,
              canViewClientHistory: true,
              canManageOwnServices: false,
            },
          },
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date(),
          createdBy: 'admin',
        },
        {
          id: 'p2',
          fullName: 'Pedro Santos Oliveira',
          cpf: '987.654.321-00',
          rg: '98.765.432-1',
          birthDate: new Date('1990-07-22'),
          address: {
            street: 'Avenida Principal',
            number: '456',
            neighborhood: 'Vila Nova',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '04567-890',
          },
          phone: '11976543210',
          email: 'pedro.santos@barbearia.com',
          whatsapp: '11976543210',
          photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
          specialties: ['Corte Moderno', 'Fade', 'Desenho', 'Coloração'],
          services: [
            {
              serviceId: 's1',
              serviceName: 'Corte de Cabelo',
              commissionRate: 55,
              isActive: true,
              minimumPrice: 30,
              maximumPrice: 60,
            },
            {
              serviceId: 's3',
              serviceName: 'Corte + Barba',
              commissionRate: 50,
              isActive: true,
              minimumPrice: 45,
              maximumPrice: 80,
            },
          ],
          workingHours: {
            regularHours: {
              monday: { isWorking: true, startTime: '09:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' },
              tuesday: { isWorking: true, startTime: '09:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' },
              wednesday: { isWorking: true, startTime: '09:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' },
              thursday: { isWorking: true, startTime: '09:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' },
              friday: { isWorking: true, startTime: '09:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' },
              saturday: { isWorking: true, startTime: '08:00', endTime: '16:00' },
              sunday: { isWorking: false, startTime: '', endTime: '' },
            },
            fixedDaysOff: [0], // Domingo
            vacations: [],
            absences: [],
            specialSchedules: [],
          },
          admissionDate: new Date('2023-06-01'),
          contractType: 'freelancer',
          status: 'active',
          documents: [],
          metrics: {
            totalAppointments: 320,
            completedAppointments: 305,
            cancelledAppointments: 10,
            noShowAppointments: 5,
            totalRevenue: 16800,
            totalCommissions: 8400,
            averageTicket: 52,
            averageRating: 4.6,
            totalReviews: 280,
            recommendationRate: 92,
            punctualityRate: 96,
            rebookingRate: 68,
            periodStart: new Date('2024-01-01'),
            periodEnd: new Date('2024-12-31'),
            lastUpdated: new Date(),
          },
          settings: {
            notifications: {
              email: true,
              sms: false,
              whatsapp: true,
              push: true,
            },
            schedulePreferences: {
              allowOnlineBooking: true,
              requireConfirmation: true,
              maxAdvanceBookingDays: 21,
              minAdvanceBookingHours: 4,
              allowSameDayBooking: false,
            },
            systemAccess: {
              canViewOwnSchedule: true,
              canEditOwnSchedule: false,
              canViewOwnMetrics: true,
              canViewClientHistory: false,
              canManageOwnServices: false,
            },
          },
          createdAt: new Date('2023-06-01'),
          updatedAt: new Date(),
          createdBy: 'admin',
        },
      ];

      const mockScheduleEvents: ScheduleEvent[] = [
        {
          id: 'e1',
          professionalId: 'p1',
          type: 'appointment',
          title: 'Carlos Silva - Corte + Barba',
          startDate: new Date(),
          endDate: new Date(),
          startTime: '09:00',
          endTime: '10:00',
          clientId: 'c1',
          clientName: 'Carlos Silva',
          serviceId: 's3',
          serviceName: 'Corte + Barba',
          status: 'confirmed',
          color: '#10B981',
        },
      ];

      dispatch({ type: 'SET_PROFESSIONALS', payload: mockProfessionals });
      dispatch({ type: 'SET_SCHEDULE_EVENTS', payload: mockScheduleEvents });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load professional data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchProfessionals = (filters: ProfessionalSearchFilters): Professional[] => {
    return state.professionals.filter(professional => {
      if (filters.name && !professional.fullName.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.specialty && !professional.specialties.some(s => s.toLowerCase().includes(filters.specialty!.toLowerCase()))) {
        return false;
      }
      if (filters.status && !filters.status.includes(professional.status)) {
        return false;
      }
      if (filters.contractType && !filters.contractType.includes(professional.contractType)) {
        return false;
      }
      if (filters.admissionDateFrom && professional.admissionDate < filters.admissionDateFrom) {
        return false;
      }
      if (filters.admissionDateTo && professional.admissionDate > filters.admissionDateTo) {
        return false;
      }
      if (filters.averageRatingMin && professional.metrics.averageRating < filters.averageRatingMin) {
        return false;
      }
      if (filters.totalRevenueMin && professional.metrics.totalRevenue < filters.totalRevenueMin) {
        return false;
      }
      if (filters.totalRevenueMax && professional.metrics.totalRevenue > filters.totalRevenueMax) {
        return false;
      }
      if (filters.hasDocumentExpiring) {
        const hasExpiring = professional.documents.some(doc => 
          doc.expiresAt && doc.expiresAt <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        );
        if (!hasExpiring) return false;
      }
      return true;
    });
  };

  const getProfessionalAvailability = (professionalId: string, date: Date): ProfessionalAvailability => {
    const professional = state.professionals.find(p => p.id === professionalId);
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
    
    if (!professional) {
      return {
        professionalId,
        date: dateString,
        isAvailable: false,
        breaks: [],
        appointments: [],
        blockedSlots: [],
      };
    }

    const workingDay = professional.workingHours.regularHours[dayOfWeek];
    const dayEvents = state.scheduleEvents.filter(event => 
      event.professionalId === professionalId && 
      event.startDate.toISOString().split('T')[0] === dateString
    );

    return {
      professionalId,
      date: dateString,
      isAvailable: workingDay?.isWorking || false,
      workingHours: workingDay?.isWorking ? {
        start: workingDay.startTime,
        end: workingDay.endTime,
      } : undefined,
      breaks: workingDay?.breakStart && workingDay?.breakEnd ? [{
        start: workingDay.breakStart,
        end: workingDay.breakEnd,
        reason: 'Intervalo para almoço',
      }] : [],
      appointments: dayEvents
        .filter(event => event.type === 'appointment')
        .map(event => ({
          id: event.id,
          startTime: event.startTime,
          endTime: event.endTime,
          clientName: event.clientName || '',
          serviceName: event.serviceName || '',
          status: event.status,
        })),
      blockedSlots: dayEvents
        .filter(event => event.type !== 'appointment')
        .map(event => ({
          startTime: event.startTime,
          endTime: event.endTime,
          reason: event.title,
        })),
    };
  };

  const generateCommissionReport = async (professionalId: string, startDate: Date, endDate: Date): Promise<CommissionReport> => {
    const professional = state.professionals.find(p => p.id === professionalId);
    if (!professional) {
      throw new Error('Professional not found');
    }

    // Mock commission calculation
    const mockReport: CommissionReport = {
      professionalId,
      professionalName: professional.fullName,
      period: { start: startDate, end: endDate },
      services: professional.services.map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        appointmentCount: Math.floor(Math.random() * 50) + 10,
        totalRevenue: Math.floor(Math.random() * 5000) + 1000,
        commissionRate: service.commissionRate,
        commissionAmount: 0,
      })),
      totalRevenue: 0,
      totalCommission: 0,
      netCommission: 0,
      paymentStatus: 'pending',
    };

    // Calculate totals
    mockReport.totalRevenue = mockReport.services.reduce((sum, service) => sum + service.totalRevenue, 0);
    mockReport.services.forEach(service => {
      service.commissionAmount = (service.totalRevenue * service.commissionRate) / 100;
    });
    mockReport.totalCommission = mockReport.services.reduce((sum, service) => sum + service.commissionAmount, 0);
    mockReport.netCommission = mockReport.totalCommission;

    return mockReport;
  };

  const generatePerformanceReport = async (professionalId: string, startDate: Date, endDate: Date): Promise<PerformanceReport> => {
    const professional = state.professionals.find(p => p.id === professionalId);
    if (!professional) {
      throw new Error('Professional not found');
    }

    // Mock performance report
    const mockReport: PerformanceReport = {
      professionalId,
      professionalName: professional.fullName,
      period: { start: startDate, end: endDate },
      metrics: {
        totalAppointments: professional.metrics.totalAppointments,
        completedAppointments: professional.metrics.completedAppointments,
        completionRate: (professional.metrics.completedAppointments / professional.metrics.totalAppointments) * 100,
        averageRating: professional.metrics.averageRating,
        totalRevenue: professional.metrics.totalRevenue,
        averageTicket: professional.metrics.averageTicket,
        punctualityRate: professional.metrics.punctualityRate,
        rebookingRate: professional.metrics.rebookingRate,
        noShowRate: (professional.metrics.noShowAppointments / professional.metrics.totalAppointments) * 100,
        cancellationRate: (professional.metrics.cancelledAppointments / professional.metrics.totalAppointments) * 100,
      },
      comparison: {
        previousPeriod: {
          totalAppointments: professional.metrics.totalAppointments - 50,
          totalRevenue: professional.metrics.totalRevenue - 2000,
          averageRating: professional.metrics.averageRating - 0.1,
        },
        growth: {
          appointments: 12.5,
          revenue: 15.8,
          rating: 2.1,
        },
      },
      ranking: {
        position: 1,
        totalProfessionals: state.professionals.length,
        category: 'revenue',
      },
    };

    return mockReport;
  };

  const updateSchedule = async (professionalId: string, events: ScheduleEvent[]): Promise<void> => {
    // Remove existing events for this professional
    const otherEvents = state.scheduleEvents.filter(event => event.professionalId !== professionalId);
    const newEvents = [...otherEvents, ...events];
    dispatch({ type: 'SET_SCHEDULE_EVENTS', payload: newEvents });
  };

  const requestVacation = async (professionalId: string, startDate: Date, endDate: Date, reason: string): Promise<void> => {
    const professional = state.professionals.find(p => p.id === professionalId);
    if (!professional) return;

    const vacation = {
      id: `v_${Date.now()}`,
      startDate,
      endDate,
      type: 'vacation' as const,
      status: 'pending' as const,
      reason,
    };

    const updatedProfessional = {
      ...professional,
      workingHours: {
        ...professional.workingHours,
        vacations: [...professional.workingHours.vacations, vacation],
      },
      updatedAt: new Date(),
    };

    dispatch({ type: 'UPDATE_PROFESSIONAL', payload: updatedProfessional });
  };

  const reportAbsence = async (professionalId: string, date: Date, type: string, reason: string): Promise<void> => {
    const professional = state.professionals.find(p => p.id === professionalId);
    if (!professional) return;

    const absence = {
      id: `a_${Date.now()}`,
      date,
      type: type as any,
      isJustified: true,
      reason,
      reportedAt: new Date(),
      reportedBy: professionalId,
    };

    const updatedProfessional = {
      ...professional,
      workingHours: {
        ...professional.workingHours,
        absences: [...professional.workingHours.absences, absence],
      },
      updatedAt: new Date(),
    };

    dispatch({ type: 'UPDATE_PROFESSIONAL', payload: updatedProfessional });
  };

  return (
    <ProfessionalContext.Provider value={{
      state,
      dispatch,
      searchProfessionals,
      getProfessionalAvailability,
      generateCommissionReport,
      generatePerformanceReport,
      updateSchedule,
      requestVacation,
      reportAbsence,
    }}>
      {children}
    </ProfessionalContext.Provider>
  );
}

export function useProfessional() {
  const context = useContext(ProfessionalContext);
  if (!context) {
    throw new Error('useProfessional must be used within a ProfessionalProvider');
  }
  return context;
}